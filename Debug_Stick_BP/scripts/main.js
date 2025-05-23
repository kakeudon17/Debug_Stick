import { world, system } from "@minecraft/server";
import { excludedStates, blockSpecificExclusions } from "./excluded_states.js";
import { states_result } from "./block_states.js";

const TITLE = "titleraw @s actionbar";
let modeMap = new Map();

function formatBlockState(key, value) {
    const formattedValue = typeof value === 'boolean' || typeof value === 'number'
        ? value
        : `"${value}"`;
    return `"${key}"=${formattedValue}`;
}

function getBlockStatesString(blockAllStates) {
    return Object.entries(blockAllStates)
        .map(([key, value]) => formatBlockState(key, value))
        .join(', ');
}

// ゲームモードチェック
function isCreativeMode(player) {
    return player.matches({ gameMode: "creative" });
}

// 権限チェック
function checkPermissions(player) {
    return player.hasTag("op") && isCreativeMode(player);
}

function handleBlockStateChange(player, block, blockAllStates, currentState, stateValues) {
    const { x, y, z } = block.location;
    const currentValue = blockAllStates[currentState];
    const nextValue = stateValues[(stateValues.indexOf(currentValue) + 1) % stateValues.length];
    const newStates = { ...blockAllStates, [currentState]: nextValue };
    const newStatesString = getBlockStatesString(newStates);
    player.runCommandAsync(`setblock ${x} ${y} ${z} ${block.type.id} [${newStatesString}]`);
    player.runCommandAsync(`setblock ${x} ${y} ${z} ${block.type.id} [${getBlockStatesString(blockAllStates)}]`);
}

function restoreContainerItems(player, block, items) {
    system.runTimeout(() => {
        const newBlock = world.getDimension(player.dimension.id).getBlock(block.location);
        if (newBlock) {
            const newContainer = newBlock.getComponent("inventory")?.container;
            if (newContainer) {
                items.forEach(({ slot, item }) => {
                    newContainer.setItem(slot, item);
                });
            }
        }
    }, 1);
}

world.beforeEvents.playerBreakBlock.subscribe(ev => {
    const itemId = ev.itemStack?.type?.id;
    if (itemId == "mc:debug_stick") {
        ev.cancel = true;
        const player = ev.player;
        const block = ev.block;
        const blockId = block.type.id;
        const blockAllStates = block.permutation.getAllStates();
        const specificExclusions = blockSpecificExclusions[blockId] || [];
        const filteredStates = Object.entries(blockAllStates)
            .filter(([key]) => !excludedStates.includes(key) && !specificExclusions.includes(key));

        // ブロックの内容を保存
        const container = block.getComponent("inventory")?.container;
        const items = [];
        if (container) {
            for (let i = 0; i < container.size; i++) {
                const item = container.getItem(i);
                if (item) {
                    items.push({ slot: i, item: item });
                }
            }
        }

        // ステータスを変更を2回して元に戻す
        const states = filteredStates.map(([key]) => key);
        const currentState = states[0];
        const stateValues = states_result[blockId]?.[currentState] || states_result.normal[currentState];
        if (!stateValues) {
            if (!checkPermissions(player)) return;
            player.runCommandAsync(`${TITLE} {"rawtext":[{"translate":"pack.no.properties","with":["${blockId}"]}]}`);
            return;
        }
        handleBlockStateChange(player, block, blockAllStates, currentState, stateValues);

        if (container) {
            restoreContainerItems(player, block, items);
        }

        // 権限チェック
        if (!checkPermissions(player)) return;
        if (filteredStates.length === 0) return;
        else {
            let blockModes = modeMap.get(player.id) || new Map();
            let mode = blockModes.get(blockId) || 0;
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
            // 権限チェック
            if (!checkPermissions(source)) return;

            const blockId = block.type.id;
            const blockAllStates = block.permutation.getAllStates();
            const { x, y, z } = block.location;

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
                        restoreContainerItems(source, block, items);
                    }
                    source.runCommand(`${TITLE} {"rawtext":[{"translate":"pack.state.change","with":["${currentState}","${nextValue}"]}]}`);
                }
            } else {
                source.runCommand(`${TITLE} {"rawtext":[{"translate":"pack.no.properties","with":["${blockId}"]}]}`);
            }
        }
    })
});