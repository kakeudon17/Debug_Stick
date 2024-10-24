import { world } from "@minecraft/server";
import * as mine from "./mine";

world.beforeEvents.worldInitialize.subscribe(({ itemComponentRegistry }) => {
    itemComponentRegistry.registerCustomComponent("mc:debug_stick", {
        onUseOn({ source, block }) {
            if (block) {
                const { x, y, z } = block.location;
                const blockId = block.typeId;
                const blockStates = block.permutation.getAllStates();
                const blockStatesObject = `[${Object.entries(blockStates)
                    .map(([key, value]) => {
                        return `"${key}"=${(typeof value === 'boolean' || typeof value === 'number') ? value : `"${value}"`}`;
                    })
                    .join(",")}]`;

                let mode = mine.modeMap.get(source.id) || 0;

                if (blockId.includes("minecraft:")) {
                    if (blockId.includes("_stairs")) {
                        switch (mode) {
                            case 0:
                                if (blockStatesObject.includes('"upside_down_bit"=true')) {
                                    const blockmode = blockStatesObject.replace("true", "false")
                                    source.runCommand(`setblock ${x} ${y} ${z} ${blockId} ${blockmode}`)
                                    source.runCommand(`${title} {"rawtext":[{"translate":"pack.change.half.bottom"}]}`)
                                }
                                if (blockStatesObject.includes('"upside_down_bit"=false')) {
                                    const blockmode = blockStatesObject.replace("false", "true")
                                    source.runCommand(`setblock ${x} ${y} ${z} ${blockId} ${blockmode}`)
                                    source.runCommand(`${title} {"rawtext":[{"translate":"pack.change.half.top"}]}`)
                                }
                                break;
                            case 1:
                                if (blockStatesObject.includes('"weirdo_direction"=0')) {
                                    const blockmode = blockStatesObject.replace('"weirdo_direction"=0', '"weirdo_direction"=1')
                                    source.runCommand(`setblock ${x} ${y} ${z} ${blockId} ${blockmode}`)
                                    source.runCommand(`${title} {"rawtext":[{"translate":"pack.change.facing.west"}]}`)
                                }
                                if (blockStatesObject.includes('"weirdo_direction"=1')) {
                                    const blockmode = blockStatesObject.replace('"weirdo_direction"=1', '"weirdo_direction"=2')
                                    source.runCommand(`setblock ${x} ${y} ${z} ${blockId} ${blockmode}`)
                                    source.runCommand(`${title} {"rawtext":[{"translate":"pack.change.facing.south"}]}`)
                                }
                                if (blockStatesObject.includes('"weirdo_direction"=2')) {
                                    const blockmode = blockStatesObject.replace('"weirdo_direction"=2', '"weirdo_direction"=3')
                                    source.runCommand(`setblock ${x} ${y} ${z} ${blockId} ${blockmode}`)
                                    source.runCommand(`${title} {"rawtext":[{"translate":"pack.change.facing.north"}]}`)
                                }
                                if (blockStatesObject.includes('"weirdo_direction"=3')) {
                                    const blockmode = blockStatesObject.replace('"weirdo_direction"=3', '"weirdo_direction"=0')
                                    source.runCommand(`setblock ${x} ${y} ${z} ${blockId} ${blockmode}`)
                                    source.runCommand(`${title} {"rawtext":[{"translate":"pack.change.facing.east"}]}`)
                                }
                                break;
                        }
                    }
                    else if (blockId.includes("_slab")) {
                        if (blockId.includes("double_slab")) {
                            const blockname = blockId.replace("_double_slab", "_slab")
                            const blockmode = blockStatesObject.replace('"top"', '"bottom"')
                            source.runCommand(`setblock ${x} ${y} ${z} ${blockname} ${blockmode}`)
                            source.runCommand(`${title} {"rawtext":[{"translate":"pack.change.type.bottom"}]}`)
                        }
                        else if (blockStatesObject.includes('"minecraft:vertical_half"="bottom"')) {
                            const blockname = blockId.replace("_double_slab", "_slab")
                            const blockmode = blockStatesObject.replace('"bottom"', '"top"')
                            source.runCommand(`setblock ${x} ${y} ${z} ${blockname} ${blockmode}`)
                            source.runCommand(`${title} {"rawtext":[{"translate":"pack.change.type.top"}]}`)
                        }
                        else if (blockStatesObject.includes('"minecraft:vertical_half"="top"')) {
                            const blockname = blockId.replace("_slab", "_double_slab")
                            source.runCommand(`setblock ${x} ${y} ${z} ${blockname}`)
                            source.runCommand(`${title} {"rawtext":[{"translate":"pack.change.type.double"}]}`)
                        }
                    }
                    else if (blockId.includes("trapdoor")) {
                        switch (mode) {
                            case 0:
                                if (blockStatesObject.includes('"direction"=0')) {
                                    const blockmode = blockStatesObject.replace('"direction"=0', '"direction"=1')
                                    source.runCommand(`setblock ${x} ${y} ${z} ${blockId} ${blockmode}`)
                                    source.runCommand(`${title} {"rawtext":[{"translate":"pack.change.facing.west"}]}`)
                                }
                                else if (blockStatesObject.includes('"direction"=1')) {
                                    const blockmode = blockStatesObject.replace('"direction"=1', '"direction"=2')
                                    source.runCommand(`setblock ${x} ${y} ${z} ${blockId} ${blockmode}`)
                                    source.runCommand(`${title} {"rawtext":[{"translate":"pack.change.facing.south"}]}`)
                                }
                                else if (blockStatesObject.includes('"direction"=2')) {
                                    const blockmode = blockStatesObject.replace('"direction"=2', '"direction"=3')
                                    source.runCommand(`setblock ${x} ${y} ${z} ${blockId} ${blockmode}`)
                                    source.runCommand(`${title} {"rawtext":[{"translate":"pack.change.facing.north"}]}`)
                                }
                                else if (blockStatesObject.includes('"direction"=3')) {
                                    const blockmode = blockStatesObject.replace('"direction"=3', '"direction"=0')
                                    source.runCommand(`setblock ${x} ${y} ${z} ${blockId} ${blockmode}`)
                                    source.runCommand(`${title} {"rawtext":[{"translate":"pack.change.facing.east"}]}`)
                                }
                                break;
                            case 1:
                                if (blockStatesObject.includes('"open_bit"=false')) {
                                    const blockmode = blockStatesObject.replace('"open_bit"=false', '"open_bit"=true')
                                    source.runCommand(`setblock ${x} ${y} ${z} ${blockId} ${blockmode}`)
                                    source.runCommand(`${title} {"rawtext":[{"translate":"pack.change.open.false"}]}`)
                                }
                                else if (blockStatesObject.includes('"open_bit"=true')) {
                                    const blockmode = blockStatesObject.replace('"open_bit"=true', '"open_bit"=false')
                                    source.runCommand(`setblock ${x} ${y} ${z} ${blockId} ${blockmode}`)
                                    source.runCommand(`${title} {"rawtext":[{"translate":"pack.change.open.true"}]}`)
                                }
                                break;
                            case 2:
                                if (blockStatesObject.includes('"upside_down_bit"=false')) {
                                    const blockmode = blockStatesObject.replace('"upside_down_bit"=false', '"upside_down_bit"=true')
                                    source.runCommand(`setblock ${x} ${y} ${z} ${blockId} ${blockmode}`)
                                    source.runCommand(`${title} {"rawtext":[{"translate":"pack.change.half.top"}]}`)
                                }
                                else if (blockStatesObject.includes('"upside_down_bit"=true')) {
                                    const blockmode = blockStatesObject.replace('"upside_down_bit"=true', '"upside_down_bit"=false')
                                    source.runCommand(`setblock ${x} ${y} ${z} ${blockId} ${blockmode}`)
                                    source.runCommand(`${title} {"rawtext":[{"translate":"pack.change.half.bottom"}]}`)
                                }
                                break;
                        }
                    }
                    else if (blockId.includes("fence_gate")) {
                        switch (mode) {
                            case 0:
                                if (blockStatesObject.includes('"direction"=0')) {
                                    const blockmode = blockStatesObject.replace('"direction"=0', '"direction"=1')
                                    source.runCommand(`setblock ${x} ${y} ${z} ${blockId} ${blockmode}`)
                                    source.runCommand(`${title} {"rawtext":[{"translate":"pack.change.facing.west"}]}`)
                                }
                                else if (blockStatesObject.includes('"direction"=1')) {
                                    const blockmode = blockStatesObject.replace('"direction"=1', '"direction"=2')
                                    source.runCommand(`setblock ${x} ${y} ${z} ${blockId} ${blockmode}`)
                                    source.runCommand(`${title} {"rawtext":[{"translate":"pack.change.facing.south"}]}`)
                                }
                                else if (blockStatesObject.includes('"direction"=2')) {
                                    const blockmode = blockStatesObject.replace('"direction"=2', '"direction"=3')
                                    source.runCommand(`setblock ${x} ${y} ${z} ${blockId} ${blockmode}`)
                                    source.runCommand(`${title} {"rawtext":[{"translate":"pack.change.facing.north"}]}`)
                                }
                                else if (blockStatesObject.includes('"direction"=3')) {
                                    const blockmode = blockStatesObject.replace('"direction"=3', '"direction"=0')
                                    source.runCommand(`setblock ${x} ${y} ${z} ${blockId} ${blockmode}`)
                                    source.runCommand(`${title} {"rawtext":[{"translate":"pack.change.facing.east"}]}`)
                                }
                                break;
                            case 1:
                                if (blockStatesObject.includes('"open_bit"=false')) {
                                    const blockmode = blockStatesObject.replace('"open_bit"=false', '"open_bit"=true')
                                    source.runCommand(`setblock ${x} ${y} ${z} ${blockId} ${blockmode}`)
                                    source.runCommand(`${title} {"rawtext":[{"translate":"pack.change.open.true"}]}`)
                                }
                                else if (blockStatesObject.includes('"open_bit"=true')) {
                                    const blockmode = blockStatesObject.replace('"open_bit"=true', '"open_bit"=false')
                                    source.runCommand(`setblock ${x} ${y} ${z} ${blockId} ${blockmode}`)
                                    source.runCommand(`${title} {"rawtext":[{"translate":"pack.change.open.false"}]}`)
                                }
                                break;
                        }
                    }
                    else {
                        source.runCommand(`${title} {"rawtext":[{"text":"${blockId}"},{"translate":"pack.no.properties"}]}`)
                    }
                }
                else {
                    source.runCommand(`${title} {"rawtext":[{"text":"${blockId}"},{"translate":"pack.no.properties"}]}`)
                }
            }
        }
    });
});


world.beforeEvents.worldInitialize.subscribe(({ itemComponentRegistry }) => {
    itemComponentRegistry.registerCustomComponent("mc:experiment", {
        onUseOn({ source, block }) {
            const blockId = block.typeId;
            const blockStates = block.permutation.getAllStates()
            const blockStatesObject = `[${Object.entries(blockStates)
                .map(([key, value]) => {
                    return `"${key}"=${(typeof value === 'boolean' || typeof value === 'number') ? value : `"${value}"`}`;
                })
                .join(",")}]`;

            let mode = mine.modeMap.get(source.id) || 0;

            source.sendMessage(`${blockId}\n${blockStatesObject}`)
        }
    });
});
