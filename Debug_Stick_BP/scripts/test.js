import { world } from "@minecraft/server";
import { Block_id_json } from "./block_ids";

world.afterEvents.playerBreakBlock.subscribe(ev => {
    const itemStack = ev.itemStackAfterBreak;

    if (itemStack && itemStack.typeId === "mc:test") {
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

        if (Block_id_json["ID"][blockId]) {
            player.runCommand(`titleraw @s actionbar {"rawtext":[{"text":"§a${blockId}"}]}`);
        }
        else {
            player.runCommand(`titleraw @s actionbar {"rawtext":[{"text":"§c${blockId}"}]}`);
        }
    }
});
