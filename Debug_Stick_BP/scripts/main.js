import { world } from "@minecraft/server";
import { modeMap, title } from "./mine";

world.beforeEvents.worldInitialize.subscribe(({ itemComponentRegistry }) => {
    itemComponentRegistry.registerCustomComponent("add:debug_stick", {
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

                const mode = modeMap.get(source.id) || 0;

                if (blockId.includes("minecraft:")) {
                    if (blockId.includes("_stairs")) {
                        switch (mode) {
                            case 0:
                                if (blockStatesObject.includes('"upside_down_bit"=true')) {
                                    const blockmode = blockStatesObject.replace("true", "false")
                                    source.runCommand(`setblock ${x} ${y} ${z} ${blockId} ${bit}`)
                                    source.runCommand(`${title} {"rawtext":[{"translate":"pack.change.stairs.bottom"}]}`)
                                }
                                if (blockStatesObject.includes('"upside_down_bit"=false')) {
                                    const blockmode = blockStatesObject.replace("false", "true")
                                    source.runCommand(`setblock ${x} ${y} ${z} ${blockId} ${blockmode}`)
                                    source.runCommand(`${title} {"rawtext":[{"translate":"pack.change.stairs.top"}]}`)
                                }
                                break;
                            case 1:
                                if (blockStatesObject.includes('"weirdo_direction"=0')) {
                                    const blockmode = blockStatesObject.replace('"weirdo_direction"=0', '"weirdo_direction"=1')
                                    source.runCommand(`setblock ${x} ${y} ${z} ${blockId} ${blockmode}`)
                                    source.runCommand(`${title} {"rawtext":[{"translate":"pack.change.stairs.west"}]}`)
                                }
                                if (blockStatesObject.includes('"weirdo_direction"=1')) {
                                    const blockmode = blockStatesObject.replace('"weirdo_direction"=1', '"weirdo_direction"=2')
                                    source.runCommand(`setblock ${x} ${y} ${z} ${blockId} ${blockmode}`)
                                    source.runCommand(`${title} {"rawtext":[{"translate":"pack.change.stairs.south"}]}`)
                                }
                                if (blockStatesObject.includes('"weirdo_direction"=2')) {
                                    const blockmode = blockStatesObject.replace('"weirdo_direction"=2', '"weirdo_direction"=3')
                                    source.runCommand(`setblock ${x} ${y} ${z} ${blockId} ${blockmode}`)
                                    source.runCommand(`${title} {"rawtext":[{"translate":"pack.change.stairs.north"}]}`)
                                }
                                if (blockStatesObject.includes('"weirdo_direction"=3')) {
                                    const blockmode = blockStatesObject.replace('"weirdo_direction"=3', '"weirdo_direction"=0')
                                    source.runCommand(`setblock ${x} ${y} ${z} ${blockId} ${blockmode}`)
                                    source.runCommand(`${title} {"rawtext":[{"translate":"pack.change.stairs.east"}]}`)
                                }
                                break;
                        }
                    }
                    else if (blockId.includes("_slab")) {
                        if (blockId.includes("double_slab")) {
                            const blockname = blockId.replace("_double_slab", "_slab")
                            const blockmode = blockStatesObject.replace('"top"', '"bottom"')
                            source.runCommand(`setblock ${x} ${y} ${z} ${blockname} ${blockmode}`)
                            source.runCommand(`${title} {"rawtext":[{"translate":"pack.change.slab.bottom"}]}`)
                        }
                        else if (blockStatesObject.includes('"minecraft:vertical_half"="bottom"')) {
                            const blockname = blockId.replace("_double_slab", "_slab")
                            const blockmode = blockStatesObject.replace('"bottom"', '"top"')
                            source.runCommand(`setblock ${x} ${y} ${z} ${blockname} ${blockmode}`)
                            source.runCommand(`${title} {"rawtext":[{"translate":"pack.change.slab.top"}]}`)
                        }
                        else if (blockStatesObject.includes('"minecraft:vertical_half"="top"')) {
                            const blockmode = blockId.replace("_slab", "_double_slab")
                            source.runCommand(`setblock ${x} ${y} ${z} ${blockmode}`)
                            source.runCommand(`${title} {"rawtext":[{"translate":"pack.change.slab.double"}]}`)
                        }
                    }
                    else if (blockId.includes("trapdoor")) {
                        switch (mode) {
                            case 0:
                                if (blockStatesObject.includes('"direction"=0')) {
                                    const blockmode = blockStatesObject.replace('"direction"=0', '"direction"=1')
                                    source.runCommand(`setblock ${x} ${y} ${z} ${blockmode}`)
                                    source.runCommand(`${title} {"rawtext":[{"translate":"pack.change.trapdoor.west"}]}`)
                                }
                                else if (blockStatesObject.includes('"direction"=1')) {
                                    const blockmode = blockStatesObject.replace('"direction"=1', '"direction"=2')
                                    source.runCommand(`setblock ${x} ${y} ${z} ${blockmode}`)
                                    source.runCommand(`${title} {"rawtext":[{"translate":"pack.change.trapdoor.south"}]}`)
                                }
                                else if (blockStatesObject.includes('"direction"=2')) {
                                    const blockmode = blockStatesObject.replace('"direction"=2', '"direction"=3')
                                    source.runCommand(`setblock ${x} ${y} ${z} ${blockmode}`)
                                    source.runCommand(`${title} {"rawtext":[{"translate":"pack.change.trapdoor.north"}]}`)
                                }
                                else if (blockStatesObject.includes('"direction"=3')) {
                                    const blockmode = blockStatesObject.replace('"direction"=3', '"direction"=0')
                                    source.runCommand(`setblock ${x} ${y} ${z} ${blockmode}`)
                                    source.runCommand(`${title} {"rawtext":[{"translate":"pack.change.trapdoor.east"}]}`)
                                }
                                break;
                            case 1:
                                if (blockStatesObject.includes('"open_bit"=false')) {
                                    const blockmode = blockStatesObject.replace('"open_bit"=false', '"open_bit"=true')
                                    source.runCommand(`setblock ${x} ${y} ${z} ${blockmode}`)
                                    source.runCommand(`${title} {"rawtext":[{"translate":"pack.change.trapdoor.open_false"}]}`)
                                }
                                else if (blockStatesObject.includes('"open_bit"=true')) {
                                    const blockmode = blockStatesObject.replace('"open_bit"=true', '"open_bit"=false')
                                    source.runCommand(`setblock ${x} ${y} ${z} ${blockmode}`)
                                    source.runCommand(`${title} {"rawtext":[{"translate":"pack.change.trapdoor.open_true"}]}`)
                                }
                                break;
                            case 2:
                                if (blockStatesObject.includes('"upside_down_bit"=false')) {
                                    const blockmode = blockStatesObject.replace('"upside_down_bit"=false', '"upside_down_bit"=true')
                                    source.runCommand(`setblock ${x} ${y} ${z} ${blockmode}`)
                                    source.runCommand(`${title} {"rawtext":[{"translate":"pack.change.trapdoor.up"}]}`)
                                }
                                else if (blockStatesObject.includes('"upside_down_bit"=true')) {
                                    const blockmode = blockStatesObject.replace('"upside_down_bit"=true', '"upside_down_bit"=false')
                                    source.runCommand(`setblock ${x} ${y} ${z} ${blockmode}`)
                                    source.runCommand(`${title} {"rawtext":[{"translate":"pack.change.trapdoor.down"}]}`)
                                }
                                break;
                        }
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
    });
});


world.beforeEvents.worldInitialize.subscribe(({ itemComponentRegistry }) => {
    itemComponentRegistry.registerCustomComponent("add:experiment", {
        onUseOn({ source, block }) {
            const blockId = block.typeId;
            const blockStates = block.permutation.getAllStates()
            const blockStatesObject = `[${Object.entries(blockStates)
                .map(([key, value]) => {
                    return `"${key}"=${(typeof value === 'boolean' || typeof value === 'number') ? value : `"${value}"`}`;
                })
                .join(",")}]`;

            const mode = modeMap.get(source.id) || 0;

            source.sendMessage(`${blockId}\n${blockStatesObject}`)
        }
    });
});
