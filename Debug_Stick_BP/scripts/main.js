import { world, system } from "@minecraft/server";
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

world.beforeEvents.playerBreakBlock.subscribe(ev => {
    const itemId = ev.itemStack?.type?.id;
    if (itemId == "mc:debug_stick") {
        ev.cancel = true;

        const player = ev.player;
        const blockId = ev.block.type.id;
        const blockAllStates = ev.block.permutation.getAllStates();
        const specificExclusions = blockSpecificExclusions[blockId] || [];
        const filteredStates = Object.entries(blockAllStates)
            .filter(([key]) => !excludedStates.includes(key) && !specificExclusions.includes(key));

        if (filteredStates.length === 0) {
            player.runCommandAsync(`${TITLE} {"rawtext":[{"translate":"pack.no.properties","with":["${blockId}"]}]}`);
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
            player.runCommandAsync(`${TITLE} {"rawtext":[{"translate":"pack.steate.mode","with":["${currentState}","${currentValue}"]}]}`);
        }
    }
});


world.beforeEvents.worldInitialize.subscribe(({ itemComponentRegistry }) => {
    itemComponentRegistry.registerCustomComponent("mc:debug_stick", {
        onUseOn: ({ source, block }) => {
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
                    source.runCommandAsync(`setblock ${x} ${y} ${z} ${blockId} [${newStatesString}]`);
                    const container = block.getComponent("inventory")?.container;
                    if (container) {
                        const items = [];
                        for (let i = 0; i < container.size; i++) {
                            const item = container.getItem(i);
                            if (item) {
                                items.push({ slot: i, item: item });
                            }
                        }
                        system.runTimeout(() => {
                            const block = world.getDimension(source.dimension.id).getBlock({ x, y, z });
                            if (block) {
                                const newContainer = block.getComponent("inventory")?.container;
                                if (newContainer) {
                                    items.forEach(({ slot, item }) => {
                                        newContainer.setItem(slot, item);
                                    });
                                }
                            }
                        }, 1);
                    }
                    source.runCommand(`${TITLE} {"rawtext":[{"translate":"pack.state.change","with":["${currentState}","${nextValue}"]}]}`);
                }
            } else {
                source.runCommand(`${TITLE} {"rawtext":[{"translate":"pack.no.properties","with":["${blockId}"]}]}`);
            }
        }
    })
});