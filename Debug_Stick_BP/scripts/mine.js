import { world } from "@minecraft/server";

const title = "titleraw @s actionbar";
let modeMap = new Map();
export { modeMap, title }

world.afterEvents.playerBreakBlock.subscribe(ev => {
    const itemStack = ev.itemStackAfterBreak;

    if (itemStack && itemStack.typeId === "mc:debug_stick") {
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
                            player.runCommand(`${title} {"rawtext":[{"translate":"pack.pick.type.bottom"}]}`);
                        }
                        else if (blockStatesObject.includes('"upside_down_bit"=false')) {
                            player.runCommand(`${title} {"rawtext":[{"translate":"pack.pick.type.top"}]}`);
                        }
                        break;
                    case 1:
                        if (blockStatesObject.includes('"weirdo_direction"=0')) {
                            player.runCommand(`${title} {"rawtext":[{"translate":"pack.pick.facing.east"}]}`);
                        }
                        else if (blockStatesObject.includes('"weirdo_direction"=1')) {
                            player.runCommand(`${title} {"rawtext":[{"translate":"pack.pick.facing.west"}]}`);
                        }
                        else if (blockStatesObject.includes('"weirdo_direction"=2')) {
                            player.runCommand(`${title} {"rawtext":[{"translate":"pack.pick.facing.south"}]}`);
                        }
                        else if (blockStatesObject.includes('"weirdo_direction"=3')) {
                            player.runCommand(`${title} {"rawtext":[{"translate":"pack.pick.facing.north"}]}`);
                        }
                        break;
                }
            }
            else if (blockId.includes("_slab")) {
                mode = 0;
                switch (mode) {
                    case 0:
                        if (blockId.includes("double_slab")) {
                            player.runCommand(`${title} {"rawtext":[{"translate":"pack.pick.type.double"}]}`);
                        }
                        else if (blockStatesObject.includes('"minecraft:vertical_half"="bottom"')) {
                            player.runCommand(`${title} {"rawtext":[{"translate":"pack.pick.type.bottom"}]}`);
                        }
                        else if (blockStatesObject.includes('"minecraft:vertical_half"="top"')) {
                            player.runCommand(`${title} {"rawtext":[{"translate":"pack.pick.type.top"}]}`);
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
                            player.runCommand(`${title} {"rawtext":[{"translate":"pack.pick.facing.east"}]}`);
                        }
                        else if (blockStatesObject.includes('"direction"=1')) {
                            player.runCommand(`${title} {"rawtext":[{"translate":"pack.pick.facing.west"}]}`);
                        }
                        else if (blockStatesObject.includes('"direction"=2')) {
                            player.runCommand(`${title} {"rawtext":[{"translate":"pack.pick.facing.south"}]}`);
                        }
                        else if (blockStatesObject.includes('"direction"=3')) {
                            player.runCommand(`${title} {"rawtext":[{"translate":"pack.pick.facing.north"}]}`);
                        }
                        break;
                    case 1:
                        if (blockStatesObject.includes('"open_bit"=false')) {
                            player.runCommand(`${title} {"rawtext":[{"translate":"pack.pick.open.false"}]}`);
                        }
                        else if (blockStatesObject.includes('"open_bit"=true')) {
                            player.runCommand(`${title} {"rawtext":[{"translate":"pack.pick.open.true"}]}`);
                        }
                        break;
                    case 2:
                        if (blockStatesObject.includes('"upside_down_bit"=false')) {
                            player.runCommand(`${title} {"rawtext":[{"translate":"pack.pick.type.bottom"}]}`);
                        }
                        else if (blockStatesObject.includes('"upside_down_bit"=true')) {
                            player.runCommand(`${title} {"rawtext":[{"translate":"pack.pick.type.top"}]}`);
                        }
                        break;
                }
            }
            else if (blockId.includes("fence_gate")) {
                mode = mode >= 1 ? 0 : mode + 1;
                switch (mode) {
                    case 0:
                        if (blockStatesObject.includes('"direction"=0')) {
                            player.runCommand(`${title} {"rawtext":[{"translate":"pack.pick.facing.east"}]}`);
                        }
                        else if (blockStatesObject.includes('"direction"=1')) {
                            player.runCommand(`${title} {"rawtext":[{"translate":"pack.pick.facing.west"}]}`);
                        }
                        else if (blockStatesObject.includes('"direction"=2')) {
                            player.runCommand(`${title} {"rawtext":[{"translate":"pack.pick.facing.south"}]}`);
                        }
                        else if (blockStatesObject.includes('"direction"=3')) {
                            player.runCommand(`${title} {"rawtext":[{"translate":"pack.pick.facing.north"}]}`);
                        }
                        break;
                    case 1:
                        if (blockStatesObject.includes('"open_bit"=false')) {
                            player.runCommand(`${title} {"rawtext":[{"translate":"pack.pick.open.false"}]}`);
                        }
                        else if (blockStatesObject.includes('"open_bit"=true')) {
                            player.runCommand(`${title} {"rawtext":[{"translate":"pack.pick.open.true"}]}`);
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
