import { world } from "@minecraft/server";
import { modeMap } from "./mine";

const title = "titleraw @s actionbar";

world.beforeEvents.worldInitialize.subscribe(({ itemComponentRegistry }) => {
    itemComponentRegistry.registerCustomComponent("add:debug_stick", {
        onUseOn({ source, block }) {
            if (block) {
                const { x, y, z } = block.location;
                const blockId = block.typeId;
                const blockStates = block.permutation.getAllStates();
                const blockStatesObject = Object.entries(blockStates)
                    .map(([key, value]) => {
                        return `"${key}"=${(typeof value === 'boolean' || typeof value === 'number') ? value : `"${value}"`}`;
                    })
                    .join(', ');

                const mode = modeMap.get(source.id) || 0;

                if (blockId.includes("minecraft:") && blockId.includes("_stairs")) {
                    switch (mode) {
                        case 0:
                            if (blockStatesObject.includes('"upside_down_bit"=true')) {
                                const false_stairs = blockStatesObject.replace("true", "false")
                                source.runCommand(`setblock ${x} ${y} ${z} ${blockId} [${false_stairs}]`)
                                source.runCommand(`${title} {"rawtext":[{"translate":"pack.stairs.bottom"}]}`)
                            }
                            if (blockStatesObject.includes('"upside_down_bit"=false')) {
                                const true_stairs = blockStatesObject.replace("false", "true")
                                source.runCommand(`setblock ${x} ${y} ${z} ${blockId} [${true_stairs}]`)
                                source.runCommand(`${title} {"rawtext":[{"translate":"pack.stairs.top"}]}`)
                            }
                            break;
                        case 1:
                            if (blockStatesObject.includes('"weirdo_direction"=0')) {
                                const false_stairs = blockStatesObject.replace('"weirdo_direction"=0', '"weirdo_direction"=1')
                                source.runCommand(`setblock ${x} ${y} ${z} ${blockId} [${false_stairs}]`)
                                source.runCommand(`${title} {"rawtext":[{"translate":"pack.stairs.west"}]}`)
                            }
                            if (blockStatesObject.includes('"weirdo_direction"=1')) {
                                const false_stairs = blockStatesObject.replace('"weirdo_direction"=1', '"weirdo_direction"=2')
                                source.runCommand(`setblock ${x} ${y} ${z} ${blockId} [${false_stairs}]`)
                                source.runCommand(`${title} {"rawtext":[{"translate":"pack.stairs.south"}]}`)
                            }
                            if (blockStatesObject.includes('"weirdo_direction"=2')) {
                                const false_stairs = blockStatesObject.replace('"weirdo_direction"=2', '"weirdo_direction"=3')
                                source.runCommand(`setblock ${x} ${y} ${z} ${blockId} [${false_stairs}]`)
                                source.runCommand(`${title} {"rawtext":[{"translate":"pack.stairs.north"}]}`)
                            }
                            if (blockStatesObject.includes('"weirdo_direction"=3')) {
                                const false_stairs = blockStatesObject.replace('"weirdo_direction"=3', '"weirdo_direction"=0')
                                source.runCommand(`setblock ${x} ${y} ${z} ${blockId} [${false_stairs}]`)
                                source.runCommand(`${title} {"rawtext":[{"translate":"pack.stairs.east"}]}`)
                            }
                            break;
                    }
                }
                else if (blockId.includes("minecraft:") && blockId.includes("_slab")) {
                    if (blockId.includes("double_slab")) {
                        const top_double_slab = blockId.replace("_double_slab", "_slab")
                        const top_slab = blockStatesObject.replace('"top"', '"bottom"')
                        source.runCommand(`setblock ${x} ${y} ${z} ${top_double_slab} [${top_slab}]`)
                        source.runCommand(`${title} {"rawtext":[{"translate":"pack.slab.bottom"}]}`)
                    }
                    else if (blockStatesObject.includes('"minecraft:vertical_half"="bottom"')) {
                        const bottom_double_slab = blockId.replace("_double_slab", "_slab")
                        const bottom_slab = blockStatesObject.replace('"bottom"', '"top"')
                        source.runCommand(`setblock ${x} ${y} ${z} ${bottom_double_slab} [${bottom_slab}]`)
                        source.runCommand(`${title} {"rawtext":[{"translate":"pack.slab.top"}]}`)
                    }
                    else if (blockStatesObject.includes('"minecraft:vertical_half"="top"')) {
                        const double_slab = blockId.replace("_slab", "_double_slab")
                        source.runCommand(`setblock ${x} ${y} ${z} ${double_slab}`)
                        source.runCommand(`${title} {"rawtext":[{"translate":"pack.slab.double"}]}`)
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
    itemComponentRegistry.registerCustomComponent("add:experiment", {
        onUseOn({ source, block }) {
            const blockId = block.typeId;
            const blockStates = block.permutation.getAllStates()
            const blockStatesObject = Object.entries(blockStates)
                .map(([key, value]) => {
                    return `"${key}"=${(typeof value === 'boolean' || typeof value === 'number') ? value : `"${value}"`}`;
                })

            const mode = modeMap.get(source.id) || 0;

            source.sendMessage(`${blockId}\n${blockStatesObject}`)
        }
    });
});