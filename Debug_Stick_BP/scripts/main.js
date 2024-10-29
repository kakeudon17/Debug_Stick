import { world } from "@minecraft/server";
import { Block_id_json } from "./block_ids";

const title = "titleraw @s actionbar";
let modeMap = new Map();

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
            player.runCommand(`${title} {"rawtext":[{"text":"§a${blockId}\n${currentValue}"}]}`);
        } else {
            player.runCommand(`${title} {"rawtext":[{"text":"§c${blockId}"}]}`);
        }
    }
});

world.beforeEvents.worldInitialize.subscribe(({ itemComponentRegistry }) => {
    itemComponentRegistry.registerCustomComponent("mc:debug_stick", {
        onUseOn({ block, source }) {
            const blockId = block.type.id;
            const { x, y, z } = block.location;
            const blockAllStates = block.permutation.getAllStates();
            const blockStates = Object.entries(blockAllStates)
                .map(([key, value]) => {
                    return `"${key}"=${(typeof value === 'boolean' || typeof value === 'number') ? value : `"${value}"`}`;
                })
                .join(', ');
            let blockModes = modeMap.get(source.id) || new Map();

            if (Block_id_json["ID"][blockId] && !blockModes.has(blockId)) {
                blockModes.set(blockId, 0);
                modeMap.set(source.id, blockModes);
            }
            if (blockModes.has(blockId)) {
                const mode = blockModes.get(blockId);
                const currentValue = Block_id_json["ID"][blockId][mode];
                source.runCommand(`${title} {"rawtext":[{"text":"${blockId}\n${currentValue}"}]}`);
                if (currentValue === "weirdo_direction") {
                    if (blockStates.includes('"weirdo_direction"=0')) {
                        const blockmode = blockStates.replace('"weirdo_direction"=0', '"weirdo_direction"=1')
                        source.runCommand(`setblock ${x} ${y} ${z} ${blockId} [${blockmode}]`)
                    }
                    else if (blockStates.includes('"weirdo_direction"=1')) {
                        const blockmode = blockStates.replace('"weirdo_direction"=1', '"weirdo_direction"=2')
                        source.runCommand(`setblock ${x} ${y} ${z} ${blockId} [${blockmode}]`)
                    }
                    else if (blockStates.includes('"weirdo_direction"=2')) {
                        const blockmode = blockStates.replace('"weirdo_direction"=2', '"weirdo_direction"=3')
                        source.runCommand(`setblock ${x} ${y} ${z} ${blockId} [${blockmode}]`)
                    }
                    else if (blockStates.includes('"weirdo_direction"=3')) {
                        const blockmode = blockStates.replace('"weirdo_direction"=3', '"weirdo_direction"=0')
                        source.runCommand(`setblock ${x} ${y} ${z} ${blockId} [${blockmode}]`)
                    }
                }
                else if (currentValue === "upside_down_bit") {
                    if (blockStates.includes('"upside_down_bit"=false')) {
                        const blockmode = blockStates.replace('"upside_down_bit"=false', '"upside_down_bit"=true')
                        source.runCommand(`setblock ${x} ${y} ${z} ${blockId} [${blockmode}]`)
                    }
                    else if (blockStates.includes('"upside_down_bit"=true')) {
                        const blockmode = blockStates.replace('"upside_down_bit"=true', '"upside_down_bit"=false')
                        source.runCommand(`setblock ${x} ${y} ${z} ${blockId} [${blockmode}]`)
                    }
                }
                else if (currentValue === "minecraft:vertical_half") {
                    if (blockId.includes("double")) {
                        if (blockId.includes("double_cut_copper_slab")) {
                            const blockIdmode = blockId.replace("double_", "")
                            const blockmode = blockStates.replace('"minecraft:vertical_half"="bottom"', '"minecraft:vertical_half"="top"')
                            source.runCommand(`setblock ${x} ${y} ${z} ${blockIdmode} [${blockmode}]`)
                        }
                        else {
                            const blockIdmode = blockId.replace("_double_slab", "_slab")
                            const blockmode = blockStates.replace('"minecraft:vertical_half"="bottom"', '"minecraft:vertical_half"="top"')
                            source.runCommand(`setblock ${x} ${y} ${z} ${blockIdmode} [${blockmode}]`)
                        }
                    }
                    else if (blockStates.includes('"minecraft:vertical_half"="top"')) {
                        if (blockId.includes("double_cut_copper_slab")) {
                            const blockIdmode = blockId.replace("double_", "")
                            const blockmode = blockStates.replace('"minecraft:vertical_half"="top"', '"minecraft:vertical_half"="bottom"')
                            source.runCommand(`setblock ${x} ${y} ${z} ${blockIdmode} [${blockmode}]`)
                        }
                        else {
                            const blockIdmode = blockId.replace("_double_slab", "_slab")
                            const blockmode = blockStates.replace('"minecraft:vertical_half"="top"', '"minecraft:vertical_half"="bottom"')
                            source.runCommand(`setblock ${x} ${y} ${z} ${blockIdmode} [${blockmode}]`)
                        }
                    }
                    else if (blockStates.includes('"minecraft:vertical_half"="bottom"')) {
                        if (blockId.includes("cut_copper_slab")) {
                            const blockIdmode = blockId.replace("cut_copper_slab", "double_cut_copper_slab")
                            source.runCommand(`setblock ${x} ${y} ${z} ${blockIdmode}`)
                        }
                        else {
                            const blockIdmode = blockId.replace("_slab", "_double_slab")
                            source.runCommand(`setblock ${x} ${y} ${z} ${blockIdmode}`)
                        }
                    }
                }
            }
            else {
                source.runCommand(`${title} {"rawtext":[{"text":"${blockId}"},{"translate":"pack.no.properties"}]}`)
            }
        }
    })
});
