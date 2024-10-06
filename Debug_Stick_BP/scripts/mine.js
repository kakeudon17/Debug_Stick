import { world } from "@minecraft/server";

const title = "title @s actionbar";
let modeMap = new Map();
export { modeMap }

world.afterEvents.playerBreakBlock.subscribe(ev => {
    const itemStack = ev.itemStackAfterBreak;

    if (itemStack && itemStack.typeId === "add:debug_stick") {
        const player = ev.player;
        const blockPermutation = ev.brokenBlockPermutation;
        const blockId = blockPermutation.type.id;
        const blockStates = blockPermutation.getAllStates();
        const { x, y, z } = ev.block.location;

        const blockStatesObject = Object.entries(blockStates)
            .map(([key, value]) => {
                return `"${key}"=${(typeof value === 'boolean' || typeof value === 'number') ? value : `"${value}"`}`;
            })
            .join(', ');

        player.runCommand(`setblock ${x} ${y} ${z} ${blockId} [${blockStatesObject}]`);

        let mode = modeMap.get(player.id) || 0;

        if (blockId.includes("minecraft:") && blockId.includes("_stairs")) {
            mode = mode >= 1 ? 0 : mode + 1;
            switch (mode) {
                case 0:
                    if (blockStatesObject.includes('"upside_down_bit"=true')) {
                        player.runCommand(`${title} 「half」を選択しました（true）`);
                    }
                    if (blockStatesObject.includes('"upside_down_bit"=false')) {
                        player.runCommand(`${title} 「half」を選択しました（false）`);
                    }
                    break;
                case 1:
                    if (blockStatesObject.includes('"weirdo_direction"=0')) {
                        player.runCommand(`${title} 「facing」を選択しました（east）`);
                    }
                    if (blockStatesObject.includes('"weirdo_direction"=1')) {
                        player.runCommand(`${title} 「facing」を選択しました（west）`);
                    }
                    if (blockStatesObject.includes('"weirdo_direction"=2')) {
                        player.runCommand(`${title} 「facing」を選択しました（south）`);
                    }
                    if (blockStatesObject.includes('"weirdo_direction"=3')) {
                        player.runCommand(`${title} 「facing」を選択しました（north）`);
                    }
                    break;
            }
        }
        else if (blockId.includes("minecraft:") && blockId.includes("_slab")) {
            mode = 0;
            switch (mode) {
                case 0:
                    if (blockId.includes("double_slab")) {
                        player.runCommand(`${title} 「type」を選択しました（double）`);
                    }
                    else if (blockStatesObject.includes('"minecraft:vertical_half"="bottom"')) {
                        player.runCommand(`${title} 「type」を選択しました（bottom）`);
                    }
                    else if (blockStatesObject.includes('"minecraft:vertical_half"="top"')) {
                        player.runCommand(`${title} 「type」を選択しました（top）`);
                    }
                    break;
            }
        }
        else {
            player.runCommand(`${title} ${blockId}はプロパティを持っていません`);
        }
        modeMap.set(player.id, mode);
    }
});
