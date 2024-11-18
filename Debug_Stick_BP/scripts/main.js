import { world } from "@minecraft/server";
import { Block_id_json } from "./block_ids";

const TITLE = "titleraw @s actionbar";
let modeMap = new Map();

// ブロックステート処理を分離
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

// ブロック処理の実装を分離
class BlockHandler {
    static handleBlock(block, source, blockModes) {
        const blockId = block.type.id;
        const location = block.location;
        const blockStates = getBlockStatesString(block.permutation.getAllStates());

        if (!Block_id_json.ID[blockId]) {
            this.showNoPropertiesMessage(source, blockId);
            return;
        }

        this.processBlockMode(blockId, source, location, blockStates, blockModes);
    }

    static processBlockMode(blockId, source, location, blockStates, blockModes) {
        const mode = blockModes.get(blockId) || 0;
        const currentValue = Block_id_json.ID[blockId][mode];

        this.showBlockInfo(source, blockId, currentValue);
        this.applyBlockState(source, location, blockId, blockStates, currentValue);
    }

    static showBlockInfo(source, blockId, currentValue) {
        source.runCommand(`${TITLE} {"rawtext":[{"text":"${blockId}\n${currentValue}"}]}`);
    }

    static showNoPropertiesMessage(source, blockId) {
        source.runCommand(`${TITLE} {"rawtext":[{"text":"${blockId}"},{"translate":"pack.no.properties"}]}`);
    }

    static applyBlockState(source, location, blockId, blockStates, currentValue) {
        const { x, y, z } = location;
        switch (currentValue) {
            case "weirdo_direction":
                source.runCommand(`setblock ${x} ${y} ${z} ${blockId} [${blockStates}]`);
                break;
        }
    }
}

world.afterEvents.playerBreakBlock.subscribe(ev => {
    const itemStack = ev.itemStackAfterBreak;

    if (itemStack && itemStack.typeId === "mc:debug_stick") {
        const player = ev.player;
        const blockPermutation = ev.brokenBlockPermutation;
        const blockId = blockPermutation.type.id;
        const { x, y, z } = ev.block.location;
        const blockAllStates = blockPermutation.getAllStates();
        const blockStates = Object.entries(blockAllStates)
            .map(([key, value]) => {
                return `"${key}"=${(typeof value === 'boolean' || typeof value === 'number') ? value : `"${value}"`}`;
            })
            .join(', ');

        player.runCommand(`setblock ${x} ${y} ${z} ${blockId} [${blockStates}]`);

        if (Block_id_json["ID"][blockId]) {
            let blockModes = modeMap.get(player.id) || new Map();
            let mode = blockModes.get(blockId) || 0;
            const maxMode = Block_id_json["ID"][blockId].length - 1;

            mode = (mode + 1) > maxMode ? 0 : mode + 1;
            blockModes.set(blockId, mode);
            modeMap.set(player.id, blockModes);

            const currentValue = Block_id_json["ID"][blockId][mode];
            player.runCommand(`${TITLE} {"rawtext":[{"text":"§a${blockId}\n${currentValue}"}]}`);
        } else {
            player.runCommand(`${TITLE} {"rawtext":[{"text":"§c${blockId}"}]}`);
        }
    }
});

world.beforeEvents.worldInitialize.subscribe(({ itemComponentRegistry }) => {
    itemComponentRegistry.registerCustomComponent("mc:debug_stick", {
        onUseOn({ block, source }) {
            const blockId = block.type.id;
            const { x, y, z } = block.location;
            const blockAllStates = block.permutation.getAllStates();
            const blockStates = getBlockStatesString(blockAllStates);
            let blockModes = modeMap.get(source.id) || new Map();

            if (Block_id_json["ID"][blockId] && !blockModes.has(blockId)) {
                blockModes.set(blockId, 0);
                modeMap.set(source.id, blockModes);
            }
            if (blockModes.has(blockId)) {
                const mode = blockModes.get(blockId);
                const currentValue = Block_id_json["ID"][blockId][mode];
                source.runCommand(`${TITLE} {"rawtext":[{"text":"${blockId}\n${currentValue}"}]}`);
                switch (currentValue) {
                    case "weirdo_direction":
                        if (blockStates.includes('"weirdo_direction"=0')) {
                            const blockmode = blockStates.replace('"weirdo_direction"=0', '"weirdo_direction"=1');
                            source.runCommand(`setblock ${x} ${y} ${z} ${blockId} [${blockmode}]`);
                        }
                        else if (blockStates.includes('"weirdo_direction"=1')) {
                            const blockmode = blockStates.replace('"weirdo_direction"=1', '"weirdo_direction"=2');
                            source.runCommand(`setblock ${x} ${y} ${z} ${blockId} [${blockmode}]`);
                        }
                        else if (blockStates.includes('"weirdo_direction"=2')) {
                            const blockmode = blockStates.replace('"weirdo_direction"=2', '"weirdo_direction"=3');
                            source.runCommand(`setblock ${x} ${y} ${z} ${blockId} [${blockmode}]`);
                        }
                        else if (blockStates.includes('"weirdo_direction"=3')) {
                            const blockmode = blockStates.replace('"weirdo_direction"=3', '"weirdo_direction"=0');
                            source.runCommand(`setblock ${x} ${y} ${z} ${blockId} [${blockmode}]`);
                        }
                        break;
                    case "upside_down_bit":
                        if (blockStates.includes('"upside_down_bit"=false')) {
                            const blockmode = blockStates.replace('"upside_down_bit"=false', '"upside_down_bit"=true');
                            source.runCommand(`setblock ${x} ${y} ${z} ${blockId} [${blockmode}]`);
                        }
                        else if (blockStates.includes('"upside_down_bit"=true')) {
                            const blockmode = blockStates.replace('"upside_down_bit"=true', '"upside_down_bit"=false');
                            source.runCommand(`setblock ${x} ${y} ${z} ${blockId} [${blockmode}]`);
                        }
                        break;
                }
            }
            else {
                source.runCommand(`${TITLE} {"rawtext":[{"text":"${blockId}"},{"translate":"pack.no.properties"}]}`)
            }
        }
    })
});