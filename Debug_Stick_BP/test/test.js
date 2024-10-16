import { world } from "@minecraft/server";
import { block_id_len } from "./block_id_len.json";

let modeMap = new Map();

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

        console.log(Block_id_len(blockId))
    }
});

function Block_id_len(block_id) {
    console.log(block_id_len[block_id])
    return block_id_len[block_id]
}