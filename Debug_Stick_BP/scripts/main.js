import { world } from "@minecraft/server";

const TITLE = "titleraw @s actionbar";
let modeMap = new Map();

function getBlockStatesString(blockAllStates) {
    return Object.entries(blockAllStates)
        .map(([key, value]) => formatBlockState(key, value))
        .join(', ');
}
function formatBlockState(key, value) {
    const formattedValue = typeof value === 'boolean' || typeof value === 'number'
        ? value
        : `"${value}"`;
    return `"${key}"=${formattedValue}`;
}

world.afterEvents.playerBreakBlock.subscribe(ev => {
    const itemStack = ev.itemStackAfterBreak;

    if (itemStack && itemStack.typeId === "mc:debug_stick") {
        const player = ev.player;
        const blockPermutation = ev.brokenBlockPermutation;
        const blockId = blockPermutation.type.id;
        const { x, y, z } = ev.block.location;
        const blockAllStates = blockPermutation.getAllStates();
        const blockStates = getBlockStatesString(blockAllStates);

        player.runCommand(`setblock ${x} ${y} ${z} ${blockId} [${blockStates}]`);

        if (Object.keys(blockAllStates).length === 0) {
            player.runCommand(`${TITLE} {"rawtext":[{"text":"${blockId}"},{"translate":"pack.no.properties"}]}`);
        }
        else {
            let blockModes = modeMap.get(player.id) || new Map();
            let mode = blockModes.get(blockId) || 0;
            const states = Object.keys(blockAllStates);
            const maxMode = states.length - 1;
            if (ev.player.isSneaking) {
                mode = (mode - 1) < 0 ? maxMode : mode - 1;
            } else {
                mode = (mode + 1) > maxMode ? 0 : mode + 1;
            }
            blockModes.set(blockId, mode);
            modeMap.set(player.id, blockModes);
            const currentState = states[mode];
            player.runCommand(`${TITLE} {"rawtext":[{"text":"§a${blockId}\n${currentState}\n${mode}"}]}`);
        }
    }
});

world.beforeEvents.worldInitialize.subscribe(({ itemComponentRegistry }) => {
    itemComponentRegistry.registerCustomComponent("mc:debug_stick", {
        onUseOn({ block, source }) {
            const blockId = block.type.id;
            const { x, y, z } = block.location;
            const blockAllStates = block.permutation.getAllStates();
            const blockStates = getBlockStatesString(blockAllStates);
            let blockModes = modeMap.get(source.id) || new Map();
            if (Object.keys(blockAllStates).length > 0) {
                if (!blockModes.has(blockId)) {
                    blockModes.set(blockId, 0);
                    modeMap.set(source.id, blockModes);
                }
            }
            if (blockModes.has(blockId)) {
                const mode = blockModes.get(blockId);
                const states = Object.keys(blockAllStates);
                const currentState = states[mode];

                const bool = ["upside_down_bit", "open_bit", "triggered_bit", "powered_bit", "output_subtract_bit",
                    "toggle_bit", "in_wall_bit", "hanging_bit", "dead_bit", "extinguished_bit", "attached_bit",
                    "rail_data_bit", "button_pressd_bit", "attached_bit", "allow_underwater_bit", "explode_bit",
                    "item_frame_map_bit", "item_frame_photo_bit", "covered_bit", "end_portal_eye_bit", "age_bit",
                    "persistent_bit", "update_bit", "upper_block_bit"];

                if (bool.includes(currentState)) {
                    if (blockStates.includes(`"${currentState}"=false`)) {
                        const blockmode = blockStates.replace(`"${currentState}"=false`, `"${currentState}"=true`);
                        source.runCommand(`setblock ${x} ${y} ${z} ${blockId} [${blockmode}]`);
                        source.runCommand(`${TITLE} {"rawtext":[{"text":"「${currentState}」をtrueに変更しました"}]}`);
                    }
                    else if (blockStates.includes(`"${currentState}"=true`)) {
                        const blockmode = blockStates.replace(`"${currentState}"=true`, `"${currentState}"=false`);
                        source.runCommand(`setblock ${x} ${y} ${z} ${blockId} [${blockmode}]`);
                        source.runCommand(`${TITLE} {"rawtext":[{"text":"「${currentState}」を falseに変更しました"}]}`);
                    }
                }
            }
            else {
                source.runCommand(`${TITLE} {"rawtext":[{"text":"${blockId}"},{"translate":"pack.no.properties"}]}`);
            }
        }
    });
});