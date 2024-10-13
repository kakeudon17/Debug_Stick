import { world } from "@minecraft/server";

const title = "titleraw @s actionbar";
let modeMap = new Map();
export { modeMap, title }

world.afterEvents.playerBreakBlock.subscribe(ev => {
    const itemStack = ev.itemStackAfterBreak;

    if (itemStack && itemStack.typeId === "add:debug_stick") {
        const player = ev.player;
        const blockPermutation = ev.brokenBlockPermutation;
        const blockId = blockPermutation.type.id;
        const { x, y, z } = ev.block.location;
        const blockStates = blockPermutation.getAllStates();
        const blockStatesObject = Object.entries(blockStates)
            .map(([key, value]) => {
                return `"${key}"=${(typeof value === 'boolean' || typeof value === 'number') ? value : `"${value}"`}`;
            })
            .join(', ');

        player.runCommand(`setblock ${x} ${y} ${z} ${blockId} [${blockStatesObject}]`)

        let mode = modeMap.get(player.id) || 0;

        if (blockId.includes("minecraft:")) {
            if (blockId.includes("_stairs")) {
                mode = mode >= 1 ? 0 : mode + 1;
                switch (mode) {
                    case 0:
                        if (blockStatesObject.includes('"upside_down_bit"=true')) {
                            player.runCommand(`${title} {"rawtext":[{"translate":"pack.pick.stairs.bottom"}]}`);
                        }
                        else if (blockStatesObject.includes('"upside_down_bit"=false')) {
                            player.runCommand(`${title} {"rawtext":[{"translate":"pack.pick.stairs.top"}]}`);
                        }
                        break;
                    case 1:
                        if (blockStatesObject.includes('"weirdo_direction"=0')) {
                            player.runCommand(`${title} {"rawtext":[{"translate":"pack.pick.stairs.east"}]}`);
                        }
                        else if (blockStatesObject.includes('"weirdo_direction"=1')) {
                            player.runCommand(`${title} {"rawtext":[{"translate":"pack.pick.stairs.west"}]}`);
                        }
                        else if (blockStatesObject.includes('"weirdo_direction"=2')) {
                            player.runCommand(`${title} {"rawtext":[{"translate":"pack.pick.stairs.south"}]}`);
                        }
                        else if (blockStatesObject.includes('"weirdo_direction"=3')) {
                            player.runCommand(`${title} {"rawtext":[{"translate":"pack.pick.stairs.north"}]}`);
                        }
                        break;
                }
            }
            else if (blockId.includes("_slab")) {
                mode = 0;
                switch (mode) {
                    case 0:
                        if (blockId.includes("double_slab")) {
                            player.runCommand(`${title} {"rawtext":[{"translate":"pack.pick.slab.double"}]}`);
                        }
                        else if (blockStatesObject.includes('"minecraft:vertical_half"="bottom"')) {
                            player.runCommand(`${title} {"rawtext":[{"translate":"pack.pick.slab.bottom"}]}`);
                        }
                        else if (blockStatesObject.includes('"minecraft:vertical_half"="top"')) {
                            player.runCommand(`${title} {"rawtext":[{"translate":"pack.pick.slab.top"}]}`);
                        }
                        break;
                }
            }
            else if (blockId.includes("trapdoor")) {
                if (mode >= 2) {
                    mode = 0
                }
                else {
                    mode++
                }
                switch (mode) {
                    case 0:
                        if (blockStatesObject.includes('"direction"=0')) {
                            player.runCommand(`${title} {"rawtext":[{"translate":"pack.pick.trapdoor.east"}]}`);
                        }
                        else if (blockStatesObject.includes('"direction"=1')) {
                            player.runCommand(`${title} {"rawtext":[{"translate":"pack.pick.trapdoor.west"}]}`);
                        }
                        else if (blockStatesObject.includes('"direction"=2')) {
                            player.runCommand(`${title} {"rawtext":[{"translate":"pack.pick.trapdoor.south"}]}`);
                        }
                        else if (blockStatesObject.includes('"direction"=3')) {
                            player.runCommand(`${title} {"rawtext":[{"translate":"pack.pick.trapdoor.north"}]}`);
                        }
                        break;
                    case 1:
                        if (blockStatesObject.includes('"open_bit"=false')) {
                            player.runCommand(`${title} {"rawtext":[{"translate":"pack.pick.trapdoor.open_false"}]}`);
                        }
                        else if (blockStatesObject.includes('"open_bit"=true')) {
                            player.runCommand(`${title} {"rawtext":[{"translate":"pack.pick.trapdoor.open_true"}]}`);
                        }
                        break;
                    case 2:
                        if (blockStatesObject.includes('"upside_down_bit"=false')) {
                            player.runCommand(`${title} {"rawtext":[{"translate":"pack.pick.trapdoor.down"}]}`);
                        }
                        else if (blockStatesObject.includes('"upside_down_bit"=true')) {
                            player.runCommand(`${title} {"rawtext":[{"translate":"pack.pick.trapdoor.up"}]}`);
                        }
                        break;
                }
            }
            else if (blockId.includes("fence_gate")) {
                mode = mode >= 1 ? 0 : mode + 1;
                switch (mode) {
                    case 0:
                        if (blockStatesObject.includes('"direction"=0')) {
                            player.runCommand(`${title} {"rawtext":[{"translate":"pack.pick.fence_gate.east"}]}`);
                        }
                        else if (blockStatesObject.includes('"direction"=1')) {
                            player.runCommand(`${title} {"rawtext":[{"translate":"pack.pick.fence_gate.west"}]}`);
                        }
                        else if (blockStatesObject.includes('"direction"=2')) {
                            player.runCommand(`${title} {"rawtext":[{"translate":"pack.pick.fence_gate.south"}]}`);
                        }
                        else if (blockStatesObject.includes('"direction"=3')) {
                            player.runCommand(`${title} {"rawtext":[{"translate":"pack.pick.fence_gate.north"}]}`);
                        }
                        break;
                    case 1:
                        if (blockStatesObject.includes('"open_bit"=false')) {
                            player.runCommand(`${title} {"rawtext":[{"translate":"pack.pick.fence_gate.open_false"}]}`);
                        }
                        else if (blockStatesObject.includes('"open_bit"=true')) {
                            player.runCommand(`${title} {"rawtext":[{"translate":"pack.pick.fence_gate.open_true"}]}`);
                        }
                }
            }
            else {
                player.runCommand(`${title} {"rawtext":[{"text":"${blockId}"},{"translate":"pack.no.properties"}]}`);
            }
        }
        else {
            player.runCommand(`${title} {"rawtext":[{"text":"${blockId}"},{"translate":"pack.no.properties"}]}`);
        }
        modeMap.set(player.id, mode);
    }
});
