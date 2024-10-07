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
                                    const bit = blockStatesObject.replace("true", "false")
                                    source.runCommand(`setblock ${x} ${y} ${z} ${blockId} ${bit}`)
                                    source.runCommand(`${title} {"rawtext":[{"translate":"pack.change.stairs.bottom"}]}`)
                                }
                                if (blockStatesObject.includes('"upside_down_bit"=false')) {
                                    const bit = blockStatesObject.replace("false", "true")
                                    source.runCommand(`setblock ${x} ${y} ${z} ${blockId} ${bit}`)
                                    source.runCommand(`${title} {"rawtext":[{"translate":"pack.change.stairs.top"}]}`)
                                }
                                break;
                            case 1:
                                if (blockStatesObject.includes('"weirdo_direction"=0')) {
                                    const direction = blockStatesObject.replace('"weirdo_direction"=0', '"weirdo_direction"=1')
                                    source.runCommand(`setblock ${x} ${y} ${z} ${blockId} ${direction}`)
                                    source.runCommand(`${title} {"rawtext":[{"translate":"pack.change.stairs.west"}]}`)
                                }
                                if (blockStatesObject.includes('"weirdo_direction"=1')) {
                                    const direction = blockStatesObject.replace('"weirdo_direction"=1', '"weirdo_direction"=2')
                                    source.runCommand(`setblock ${x} ${y} ${z} ${blockId} ${direction}`)
                                    source.runCommand(`${title} {"rawtext":[{"translate":"pack.change.stairs.south"}]}`)
                                }
                                if (blockStatesObject.includes('"weirdo_direction"=2')) {
                                    const direction = blockStatesObject.replace('"weirdo_direction"=2', '"weirdo_direction"=3')
                                    source.runCommand(`setblock ${x} ${y} ${z} ${blockId} ${direction}`)
                                    source.runCommand(`${title} {"rawtext":[{"translate":"pack.change.stairs.north"}]}`)
                                }
                                if (blockStatesObject.includes('"weirdo_direction"=3')) {
                                    const direction = blockStatesObject.replace('"weirdo_direction"=3', '"weirdo_direction"=0')
                                    source.runCommand(`setblock ${x} ${y} ${z} ${blockId} ${direction}`)
                                    source.runCommand(`${title} {"rawtext":[{"translate":"pack.change.stairs.east"}]}`)
                                }
                                break;
                        }
                    }
                    else if (blockId.includes("_slab")) {
                        if (blockId.includes("double_slab")) {
                            const top_double_slab = blockId.replace("_double_slab", "_slab")
                            const top_slab = blockStatesObject.replace('"top"', '"bottom"')
                            source.runCommand(`setblock ${x} ${y} ${z} ${top_double_slab} ${top_slab}`)
                            source.runCommand(`${title} {"rawtext":[{"translate":"pack.change.slab.bottom"}]}`)
                        }
                        else if (blockStatesObject.includes('"minecraft:vertical_half"="bottom"')) {
                            const bottom_double_slab = blockId.replace("_double_slab", "_slab")
                            const bottom_slab = blockStatesObject.replace('"bottom"', '"top"')
                            source.runCommand(`setblock ${x} ${y} ${z} ${bottom_double_slab} ${bottom_slab}`)
                            source.runCommand(`${title} {"rawtext":[{"translate":"pack.change.slab.top"}]}`)
                        }
                        else if (blockStatesObject.includes('"minecraft:vertical_half"="top"')) {
                            const double_slab = blockId.replace("_slab", "_double_slab")
                            source.runCommand(`setblock ${x} ${y} ${z} ${double_slab}`)
                            source.runCommand(`${title} {"rawtext":[{"translate":"pack.change.slab.double"}]}`)
                        }
                    }
                    else if (blockId.includes("trapdoor")) {
                        switch (mode) {
                            case 0:
                                if (blockStatesObject.includes('"direction"=0')) {
                                    const direction = blockStatesObject.replace('"direction"=0', '"direction"=1')
                                    source.runCommand(`setblock ${x} ${y} ${z} ${direction}`)
                                    source.runCommand(`${title} {"rawtext":[{"translate":"pack.change.trapdoor.west"}]}`)
                                }
                                else if (blockStatesObject.includes('"direction"=1')) {
                                    const direction = blockStatesObject.replace('"direction"=1', '"direction"=2')
                                    source.runCommand(`setblock ${x} ${y} ${z} ${direction}`)
                                    source.runCommand(`${title} {"rawtext":[{"translate":"pack.change.trapdoor.south"}]}`)
                                }
                                else if (blockStatesObject.includes('"direction"=2')) {
                                    const direction = blockStatesObject.replace('"direction"=2', '"direction"=3')
                                    source.runCommand(`setblock ${x} ${y} ${z} ${direction}`)
                                    source.runCommand(`${title} {"rawtext":[{"translate":"pack.change.trapdoor.north"}]}`)
                                }
                                else if (blockStatesObject.includes('"direction"=3')) {
                                    const direction = blockStatesObject.replace('"direction"=3', '"direction"=0')
                                    source.runCommand(`setblock ${x} ${y} ${z} ${direction}`)
                                    source.runCommand(`${title} {"rawtext":[{"translate":"pack.change.trapdoor.east"}]}`)
                                }
                                break;
                            case 1:
                                if (blockStatesObject.includes('"open_bit"=false')) {
                                    const direction = blockStatesObject.replace('"open_bit"=false', '"open_bit"=true')
                                    source.runCommand(`setblock ${x} ${y} ${z} ${direction}`)
                                    source.runCommand(`${title} {"rawtext":[{"translate":"pack.change.trapdoor.open_false"}]}`)
                                }
                                else if (blockStatesObject.includes('"open_bit"=true')) {
                                    const direction = blockStatesObject.replace('"open_bit"=true', '"open_bit"=false')
                                    source.runCommand(`setblock ${x} ${y} ${z} ${direction}`)
                                    source.runCommand(`${title} {"rawtext":[{"translate":"pack.change.trapdoor.open_true"}]}`)
                                }
                                break;
                            case 2:
                                if (blockStatesObject.includes('"upside_down_bit"=false')) {
                                    const bit = blockStatesObject.replace('"upside_down_bit"=false', '"upside_down_bit"=true')
                                    source.runCommand(`setblock ${x} ${y} ${z} ${bit}`)
                                    source.runCommand(`${title} {"rawtext":[{"translate":"pack.change.trapdoor.up"}]}`)
                                }
                                else if (blockStatesObject.includes('"upside_down_bit"=true')) {
                                    const bit = blockStatesObject.replace('"upside_down_bit"=true', '"upside_down_bit"=false')
                                    source.runCommand(`setblock ${x} ${y} ${z} ${bit}`)
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
