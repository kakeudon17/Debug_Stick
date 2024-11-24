import { world } from "@minecraft/server";
import { excludedStates, blockSpecificExclusions } from "./excluded_states.js";
import { states_result } from "./block_states.js";

const TITLE = "titleraw @s actionbar";
let modeMap = new Map();

function getBlockStatesString(blockAllStates) {
    return Object.entries(blockAllStates)
        .map(([key, value]) => formatBlockState(key, value))
        .join(', ');
}
function formatBlockState(key, value) {
    const formattedValue = typeof value === 'boolean' || typeof value === 'number'
        ? value
        : `"${value}"`;
    return `"${key}"=${formattedValue}`;
}

world.afterEvents.playerBreakBlock.subscribe(ev => {
    const itemStack = ev.itemStackAfterBreak;

    if (itemStack && itemStack.typeId === "mc:debug_stick") {
        const player = ev.player;
        const blockPermutation = ev.brokenBlockPermutation;
        const blockId = blockPermutation.type.id;
        const { x, y, z } = ev.block.location;
        const blockAllStates = blockPermutation.getAllStates();
        const blockStates = getBlockStatesString(blockAllStates);

        player.runCommand(`setblock ${x} ${y} ${z} ${blockId} [${blockStates}]`);

        const specificExclusions = blockSpecificExclusions[blockId] || [];
        const filteredStates = Object.entries(blockAllStates)
            .filter(([key]) => !excludedStates.includes(key) && !specificExclusions.includes(key));

        if (filteredStates.length === 0) {
            player.runCommand(`${TITLE} {"rawtext":[{"text":"${blockId}"},{"translate":"pack.no.properties"}]}`);
        }
        else {
            let blockModes = modeMap.get(player.id) || new Map();
            let mode = blockModes.get(blockId) || 0;
            const states = filteredStates.map(([key]) => key);
            const maxMode = states.length - 1;
            if (ev.player.isSneaking) {
                mode = (mode - 1) < 0 ? maxMode : mode - 1;
            } else {
                mode = (mode + 1) > maxMode ? 0 : mode + 1;
            }
            blockModes.set(blockId, mode);
            modeMap.set(player.id, blockModes);
            const currentState = states[mode];
            const currentValue = blockAllStates[currentState];
            player.runCommand(`${TITLE} {"rawtext":[{"text":"｢ ${currentState} ｣ を選択しました ( ${currentValue} )"}]}`);
        }
    }
});

world.beforeEvents.worldInitialize.subscribe(({ itemComponentRegistry }) => {
    itemComponentRegistry.registerCustomComponent("mc:debug_stick", {
        onUseOn({ block, source }) {
            const blockId = block.type.id;
            const { x, y, z } = block.location;
            const blockAllStates = block.permutation.getAllStates();

            let blockModes = modeMap.get(source.id) || new Map();
            const filteredStates = Object.entries(blockAllStates)
                .filter(([key]) => !excludedStates.includes(key));

            const specificExclusions = blockSpecificExclusions[blockId] || [];
            const validStates = filteredStates.filter(([key]) => !specificExclusions.includes(key));

            if (validStates.length > 0 && !blockModes.has(blockId)) {
                blockModes.set(blockId, 0);
                modeMap.set(source.id, blockModes);
            }
            if (blockModes.has(blockId)) {
                const mode = blockModes.get(blockId);
                const states = validStates.map(([key]) => key);
                const currentState = states[mode];

                let stateValues;
                if (states_result[blockId]?.[currentState]) {
                    stateValues = states_result[blockId][currentState];
                } else {
                    stateValues = states_result.normal[currentState];
                }

                if (stateValues) {
                    let currentValue = blockAllStates[currentState];
                    let valueIndex = stateValues.indexOf(currentValue);
                    let nextValue;

                    if (source.isSneaking) {
                        nextValue = stateValues[(valueIndex - 1 + stateValues.length) % stateValues.length];
                    } else {
                        nextValue = stateValues[(valueIndex + 1) % stateValues.length];
                    }

                    let newStates = { ...blockAllStates, [currentState]: nextValue };
                    const newStatesString = getBlockStatesString(newStates);
                    source.runCommand(`setblock ${x} ${y} ${z} ${blockId} [${newStatesString}]`);
                    source.runCommand(`${TITLE} {"rawtext":[{"text":"｢ ${currentState} ｣ を ${nextValue} に変更しました"}]}`);
                }
            } else {
                source.runCommand(`${TITLE} {"rawtext":[{"text":"${blockId}"},{"translate":"pack.no.properties"}]}`);
            }
        }
    });
});