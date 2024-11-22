import { world } from "@minecraft/server";
import { Block_id_json } from "../block_ids";

const TITLE = "titleraw @s actionbar";
let modeMap = new Map();

// ブロックステート処理を分離
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

// ブロック処理の実装を分離
class BlockHandler {
    static handleBlock(block, source, blockModes) {
        const blockId = block.type.id;
        const location = block.location;
        const blockStates = getBlockStatesString(block.permutation.getAllStates());

        if (!Block_id_json.ID[blockId]) {
            this.showNoPropertiesMessage(source, blockId);
            return;
        }

        this.processBlockMode(blockId, source, location, blockStates, blockModes);
    }

    static processBlockMode(blockId, source, location, blockStates, blockModes) {
        const mode = blockModes.get(blockId) || 0;
        const currentValue = Block_id_json.ID[blockId][mode];

        this.showBlockInfo(source, blockId, currentValue);
        this.applyBlockState(source, location, blockId, blockStates, currentValue);
    }

    static showBlockInfo(source, blockId, currentValue) {
        source.runCommand(`${TITLE} {"rawtext":[{"text":"${blockId}\n${currentValue}"}]}`);
    }

    static showNoPropertiesMessage(source, blockId) {
        source.runCommand(`${TITLE} {"rawtext":[{"text":"${blockId}"},{"translate":"pack.no.properties"}]}`);
    }

    static applyBlockState(source, location, blockId, blockStates, currentValue) {
        const { x, y, z } = location;
        switch (currentValue) {
            case "weirdo_direction":
                source.runCommand(`setblock ${x} ${y} ${z} ${blockId} [${blockStates}]`);
                break;
        }
    }
}

world.afterEvents.playerBreakBlock.subscribe(ev => {
    const itemStack = ev.itemStackAfterBreak;

    if (itemStack && itemStack.typeId === "mc:debug_stick") {
        const player = ev.player;
        const blockPermutation = ev.brokenBlockPermutation;
        const blockId = blockPermutation.type.id;
        const { x, y, z } = ev.block.location;
        const blockAllStates = blockPermutation.getAllStates();
        const blockStates = Object.entries(blockAllStates)
            .map(([key, value]) => {
                return `"${key}"=${(typeof value === 'boolean' || typeof value === 'number') ? value : `"${value}"`}`;
            })
            .join(', ');

        player.runCommand(`setblock ${x} ${y} ${z} ${blockId} [${blockStates}]`);

        if (Block_id_json["ID"][blockId]) {
            let blockModes = modeMap.get(player.id) || new Map();
            let mode = blockModes.get(blockId) || 0;
            const maxMode = Block_id_json["ID"][blockId].length - 1;

            if (ev.player.isSneaking) {
                mode = (mode - 1) < 0 ? maxMode : mode - 1;
            } else {
                mode = (mode + 1) > maxMode ? 0 : mode + 1;
            }
            blockModes.set(blockId, mode);
            modeMap.set(player.id, blockModes);

            const currentValue = Block_id_json["ID"][blockId][mode];
            player.runCommand(`${TITLE} {"rawtext":[{"text":"§a${blockId}\n${currentValue}"}]}`);
        } else {
            player.runCommand(`${TITLE} {"rawtext":[{"text":"§c${blockId}"}]}`);
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

            if (Block_id_json["ID"][blockId] && !blockModes.has(blockId)) {
                blockModes.set(blockId, 0);
                modeMap.set(source.id, blockModes);
            }
            if (blockModes.has(blockId)) {
                const mode = blockModes.get(blockId);
                const currentValue = Block_id_json["ID"][blockId][mode];
                source.runCommand(`${TITLE} {"rawtext":[{"text":"${blockId}\n${currentValue}"}]}`);
                const isSneaking = source.isSneaking;
                switch (currentValue) {
                    // 方向/位置関連
                    case "weirdo_direction":
                        if (blockStates.includes('"weirdo_direction"=0')) {
                            const blockmode = blockStates.replace('"weirdo_direction"=0', isSneaking ? '"weirdo_direction"=3' : '"weirdo_direction"=1');
                            source.runCommand(`setblock ${x} ${y} ${z} ${blockId} [${blockmode}]`);
                        }
                        else if (blockStates.includes('"weirdo_direction"=1')) {
                            const blockmode = blockStates.replace('"weirdo_direction"=1', isSneaking ? '"weirdo_direction"=0' : '"weirdo_direction"=2');
                            source.runCommand(`setblock ${x} ${y} ${z} ${blockId} [${blockmode}]`);
                        }
                        else if (blockStates.includes('"weirdo_direction"=2')) {
                            const blockmode = blockStates.replace('"weirdo_direction"=2', isSneaking ? '"weirdo_direction"=1' : '"weirdo_direction"=3');
                            source.runCommand(`setblock ${x} ${y} ${z} ${blockId} [${blockmode}]`);
                        }
                        else if (blockStates.includes('"weirdo_direction"=3')) {
                            const blockmode = blockStates.replace('"weirdo_direction"=3', isSneaking ? '"weirdo_direction"=2' : '"weirdo_direction"=0');
                            source.runCommand(`setblock ${x} ${y} ${z} ${blockId} [${blockmode}]`);
                        }
                        break;
                    case "direction":
                        if (blockStates.includes('"direction"=0')) {
                            const blockmode = blockStates.replace('"direction"=0', isSneaking ? '"direction"=3' : '"direction"=1');
                            source.runCommand(`setblock ${x} ${y} ${z} ${blockId} [${blockmode}]`);
                        }
                        else if (blockStates.includes('"direction"=1')) {
                            const blockmode = blockStates.replace('"direction"=1', isSneaking ? '"direction"=0' : '"direction"=2');
                            source.runCommand(`setblock ${x} ${y} ${z} ${blockId} [${blockmode}]`);
                        }
                        else if (blockStates.includes('"direction"=2')) {
                            const blockmode = blockStates.replace('"direction"=2', isSneaking ? '"direction"=1' : '"direction"=3');
                            source.runCommand(`setblock ${x} ${y} ${z} ${blockId} [${blockmode}]`);
                        }
                        else if (blockStates.includes('"direction"=3')) {
                            const blockmode = blockStates.replace('"direction"=3', isSneaking ? '"direction"=2' : '"direction"=0');
                            source.runCommand(`setblock ${x} ${y} ${z} ${blockId} [${blockmode}]`);
                        }
                        break;
                    case "facing_direction":
                        if (blockStates.includes('"facing_direction"=0')) {
                            const blockmode = blockStates.replace('"facing_direction"=0', isSneaking ? '"facing_direction"=3' : '"facing_direction"=1');
                            source.runCommand(`setblock ${x} ${y} ${z} ${blockId} [${blockmode}]`);
                        }
                        else if (blockStates.includes('"facing_direction"=1')) {
                            const blockmode = blockStates.replace('"facing_direction"=1', isSneaking ? '"facing_direction"=0' : '"facing_direction"=2');
                            source.runCommand(`setblock ${x} ${y} ${z} ${blockId} [${blockmode}]`);
                        }
                        else if (blockStates.includes('"facing_direction"=2')) {
                            const blockmode = blockStates.replace('"facing_direction"=2', isSneaking ? '"facing_direction"=1' : '"facing_direction"=3');
                            source.runCommand(`setblock ${x} ${y} ${z} ${blockId} [${blockmode}]`);
                        }
                        else if (blockStates.includes('"facing_direction"=3')) {
                            const blockmode = blockStates.replace('"facing_direction"=3', isSneaking ? '"facing_direction"=2' : '"facing_direction"=0');
                            source.runCommand(`setblock ${x} ${y} ${z} ${blockId} [${blockmode}]`);
                        }
                        break;
                    case "minecraft:cardinal_direction":
                        if (blockStates.includes('"minecraft:cardinal_direction"="north"')) {
                            const blockmode = blockStates.replace('"minecraft:cardinal_direction"="north"', isSneaking ? '"minecraft:cardinal_direction"="west"' : '"minecraft:cardinal_direction"="east"');
                            source.runCommand(`setblock ${x} ${y} ${z} ${blockId} [${blockmode}]`);
                        }
                        else if (blockStates.includes('"minecraft:cardinal_direction"="east"')) {
                            const blockmode = blockStates.replace('"minecraft:cardinal_direction"="east"', isSneaking ? '"minecraft:cardinal_direction"="north"' : '"minecraft:cardinal_direction"="south"');
                            source.runCommand(`setblock ${x} ${y} ${z} ${blockId} [${blockmode}]`);
                        }
                        else if (blockStates.includes('"minecraft:cardinal_direction"="south"')) {
                            const blockmode = blockStates.replace('"minecraft:cardinal_direction"="south"', isSneaking ? '"minecraft:cardinal_direction"="east"' : '"minecraft:cardinal_direction"="west"');
                            source.runCommand(`setblock ${x} ${y} ${z} ${blockId} [${blockmode}]`);
                        }
                        else if (blockStates.includes('"minecraft:cardinal_direction"="west"')) {
                            const blockmode = blockStates.replace('"minecraft:cardinal_direction"="west"', isSneaking ? '"minecraft:cardinal_direction"="south"' : '"minecraft:cardinal_direction"="north"');
                            source.runCommand(`setblock ${x} ${y} ${z} ${blockId} [${blockmode}]`);
                        }
                        break;
                    case "orientation":
                        if (blockStates.includes('"orientation"="north_up"')) {
                            const blockmode = blockStates.replace('"orientation"="north_up"', isSneaking ? '"orientation"="south_up"' : '"orientation"="east_up"');
                            source.runCommand(`setblock ${x} ${y} ${z} ${blockId} [${blockmode}]`);
                        }
                        else if (blockStates.includes('"orientation"="east_up"')) {
                            const blockmode = blockStates.replace('"orientation"="east_up"', isSneaking ? '"orientation"="north_up"' : '"orientation"="west_up"');
                            source.runCommand(`setblock ${x} ${y} ${z} ${blockId} [${blockmode}]`);
                        }
                        else if (blockStates.includes('"orientation"="west_up"')) {
                            const blockmode = blockStates.replace('"orientation"="west_up"', isSneaking ? '"orientation"="east_up"' : '"orientation"="up_west"');
                            source.runCommand(`setblock ${x} ${y} ${z} ${blockId} [${blockmode}]`);
                        }
                        else if (blockStates.includes('"orientation"="up_west"')) {
                            const blockmode = blockStates.replace('"orientation"="up_west"', isSneaking ? '"orientation"="west_up"' : '"orientation"="up_south"');
                            source.runCommand(`setblock ${x} ${y} ${z} ${blockId} [${blockmode}]`);
                        }
                        else if (blockStates.includes('"orientation"="up_south"')) {
                            const blockmode = blockStates.replace('"orientation"="up_south"', isSneaking ? '"orientation"="up_west"' : '"orientation"="up_north"');
                            source.runCommand(`setblock ${x} ${y} ${z} ${blockId} [${blockmode}]`);
                        }
                        else if (blockStates.includes('"orientation"="up_north"')) {
                            const blockmode = blockStates.replace('"orientation"="up_north"', isSneaking ? '"orientation"="up_south"' : '"orientation"="up_east"');
                            source.runCommand(`setblock ${x} ${y} ${z} ${blockId} [${blockmode}]`);
                        }
                        else if (blockStates.includes('"orientation"="up_east"')) {
                            const blockmode = blockStates.replace('"orientation"="up_east"', isSneaking ? '"orientation"="up_north"' : '"orientation"="down_west"');
                            source.runCommand(`setblock ${x} ${y} ${z} ${blockId} [${blockmode}]`);
                        }
                        else if (blockStates.includes('"orientation"="down_west"')) {
                            const blockmode = blockStates.replace('"orientation"="down_west"', isSneaking ? '"orientation"="up_east"' : '"orientation"="down_south"');
                            source.runCommand(`setblock ${x} ${y} ${z} ${blockId} [${blockmode}]`);
                        }
                        else if (blockStates.includes('"orientation"="down_south"')) {
                            const blockmode = blockStates.replace('"orientation"="down_south"', isSneaking ? '"orientation"="down_west"' : '"orientation"="down_north"');
                            source.runCommand(`setblock ${x} ${y} ${z} ${blockId} [${blockmode}]`);
                        }
                        else if (blockStates.includes('"orientation"="down_north"')) {
                            const blockmode = blockStates.replace('"orientation"="down_north"', isSneaking ? '"orientation"="down_south"' : '"orientation"="down_east"');
                            source.runCommand(`setblock ${x} ${y} ${z} ${blockId} [${blockmode}]`);
                        }
                        else if (blockStates.includes('"orientation"="down_east"')) {
                            const blockmode = blockStates.replace('"orientation"="down_east"', isSneaking ? '"orientation"="down_north"' : '"orientation"="north_up"');
                            source.runCommand(`setblock ${x} ${y} ${z} ${blockId} [${blockmode}]`);
                        }
                        else if (blockStates.includes('"orientation"="south_up"')) {
                            const blockmode = blockStates.replace('"orientation"="south_up"', isSneaking ? '"orientation"="down_east"' : '"orientation"="north_up"');
                            source.runCommand(`setblock ${x} ${y} ${z} ${blockId} [${blockmode}]`);
                        }
                        break;
                    case "minecraft:vertical_half":
                        if (blockStates.includes('"minecraft:vertical_half"="bottom"')) {
                            const blockmode = blockStates.replace('"minecraft:vertical_half"="bottom"', '"minecraft:vertical_half"="top"');
                            source.runCommand(`setblock ${x} ${y} ${z} ${blockId} [${blockmode}]`);
                        }
                        else if (blockStates.includes('"minecraft:vertical_half"="top"')) {
                            const blockmode = blockStates.replace('"minecraft:vertical_half"="top"', '"minecraft:vertical_half"="bottom"');
                            source.runCommand(`setblock ${x} ${y} ${z} ${blockId} [${blockmode}]`);
                        }
                        break;
                    case "upside_down_bit":
                        if (blockStates.includes('"upside_down_bit"=false')) {
                            const blockmode = blockStates.replace('"upside_down_bit"=false', '"upside_down_bit"=true');
                            source.runCommand(`setblock ${x} ${y} ${z} ${blockId} [${blockmode}]`);
                        }
                        else if (blockStates.includes('"upside_down_bit"=true')) {
                            const blockmode = blockStates.replace('"upside_down_bit"=true', '"upside_down_bit"=false');
                            source.runCommand(`setblock ${x} ${y} ${z} ${blockId} [${blockmode}]`);
                        }
                        break;
                    case "hanging_bit":
                        if (blockStates.includes('"hanging_bit"=false')) {
                            const blockmode = blockStates.replace('"hanging_bit"=false', '"hanging_bit"=true');
                            source.runCommand(`setblock ${x} ${y} ${z} ${blockId} [${blockmode}]`);
                        }
                        else if (blockStates.includes('"hanging_bit"=true')) {
                            const blockmode = blockStates.replace('"hanging_bit"=true', '"hanging_bit"=false');
                            source.runCommand(`setblock ${x} ${y} ${z} ${blockId} [${blockmode}]`);
                        }
                        break;
                    case "minecraft:block_face":
                        if (blockStates.includes('"minecraft:block_face"="north"')) {
                            const blockmode = blockStates.replace('"minecraft:block_face"="north"', isSneaking ? '"minecraft:block_face"="up"' : '"minecraft:block_face"="east"');
                            source.runCommand(`setblock ${x} ${y} ${z} ${blockId} [${blockmode}]`);
                        }
                        else if (blockStates.includes('"minecraft:block_face"="east"')) {
                            const blockmode = blockStates.replace('"minecraft:block_face"="east"', isSneaking ? '"minecraft:block_face"="north"' : '"minecraft:block_face"="south"');
                            source.runCommand(`setblock ${x} ${y} ${z} ${blockId} [${blockmode}]`);
                        }
                        else if (blockStates.includes('"minecraft:block_face"="south"')) {
                            const blockmode = blockStates.replace('"minecraft:block_face"="south"', isSneaking ? '"minecraft:block_face"="east"' : '"minecraft:block_face"="west"');
                            source.runCommand(`setblock ${x} ${y} ${z} ${blockId} [${blockmode}]`);
                        }
                        else if (blockStates.includes('"minecraft:block_face"="west"')) {
                            const blockmode = blockStates.replace('"minecraft:block_face"="west"', isSneaking ? '"minecraft:block_face"="south"' : '"minecraft:block_face"="down"');
                            source.runCommand(`setblock ${x} ${y} ${z} ${blockId} [${blockmode}]`);
                        }
                        else if (blockStates.includes('"minecraft:block_face"="up"')) {
                            const blockmode = blockStates.replace('"minecraft:block_face"="up"', isSneaking ? '"minecraft:block_face"="down"' : '"minecraft:block_face"="north"');
                            source.runCommand(`setblock ${x} ${y} ${z} ${blockId} [${blockmode}]`);
                        }
                        else if (blockStates.includes('"minecraft:block_face"="down"')) {
                            const blockmode = blockStates.replace('"minecraft:block_face"="down"', isSneaking ? '"minecraft:block_face"="west"' : '"minecraft:block_face"="up"');
                            source.runCommand(`setblock ${x} ${y} ${z} ${blockId} [${blockmode}]`);
                        }
                        break;
                    case "pillar_axis":
                        if (blockStates.includes('"pillar_axis"="x"')) {
                            const blockmode = blockStates.replace('"pillar_axis"="x"', '"pillar_axis"="y"');
                            source.runCommand(`setblock ${x} ${y} ${z} ${blockId} [${blockmode}]`);
                        }
                        else if (blockStates.includes('"pillar_axis"="y"')) {
                            const blockmode = blockStates.replace('"pillar_axis"="y"', '"pillar_axis"="z"');
                            source.runCommand(`setblock ${x} ${y} ${z} ${blockId} [${blockmode}]`);
                        }
                        else if (blockStates.includes('"pillar_axis"="z"')) {
                            const blockmode = blockStates.replace('"pillar_axis"="z"', '"pillar_axis"="x"');
                            source.runCommand(`setblock ${x} ${y} ${z} ${blockId} [${blockmode}]`);
                        }
                        break;
                    case "torch_facing_direction":
                        if (blockStates.includes('"torch_facing_direction"="west"')) {
                            const blockmode = blockStates.replace('"torch_facing_direction"="west"', isSneaking ? '"torch_facing_direction"="south"' : '"torch_facing_direction"="east"');
                            source.runCommand(`setblock ${x} ${y} ${z} ${blockId} [${blockmode}]`);
                        }
                        else if (blockStates.includes('"torch_facing_direction"="east"')) {
                            const blockmode = blockStates.replace('"torch_facing_direction"="east"', isSneaking ? '"torch_facing_direction"="west"' : '"torch_facing_direction"="north"');
                            source.runCommand(`setblock ${x} ${y} ${z} ${blockId} [${blockmode}]`);
                        }
                        else if (blockStates.includes('"torch_facing_direction"="north"')) {
                            const blockmode = blockStates.replace('"torch_facing_direction"="north"', isSneaking ? '"torch_facing_direction"="east"' : '"torch_facing_direction"="south"');
                            source.runCommand(`setblock ${x} ${y} ${z} ${blockId} [${blockmode}]`);
                        }
                        else if (blockStates.includes('"torch_facing_direction"="south"')) {
                            const blockmode = blockStates.replace('"torch_facing_direction"="south"', isSneaking ? '"torch_facing_direction"="north"' : '"torch_facing_direction"="top"');
                            source.runCommand(`setblock ${x} ${y} ${z} ${blockId} [${blockmode}]`);
                        }
                        else if (blockStates.includes('"torch_facing_direction"="top"')) {
                            const blockmode = blockStates.replace('"torch_facing_direction"="top"', isSneaking ? '"torch_facing_direction"="south"' : '"torch_facing_direction"="west"');
                            source.runCommand(`setblock ${x} ${y} ${z} ${blockId} [${blockmode}]`);
                        }
                        break;
                    case "ground_sign_direction":
                        if (blockStates.includes('"ground_sign_direction"=0')) {
                            const blockmode = blockStates.replace('"ground_sign_direction"=0', isSneaking ? '"ground_sign_direction"=15' : '"ground_sign_direction"=1');
                            source.runCommand(`setblock ${x} ${y} ${z} ${blockId} [${blockmode}]`);
                        }
                        else if (blockStates.includes('"ground_sign_direction"=1')) {
                            const blockmode = blockStates.replace('"ground_sign_direction"=1', isSneaking ? '"ground_sign_direction"=0' : '"ground_sign_direction"=2');
                            source.runCommand(`setblock ${x} ${y} ${z} ${blockId} [${blockmode}]`);
                        }
                        else if (blockStates.includes('"ground_sign_direction"=2')) {
                            const blockmode = blockStates.replace('"ground_sign_direction"=2', isSneaking ? '"ground_sign_direction"=1' : '"ground_sign_direction"=3');
                            source.runCommand(`setblock ${x} ${y} ${z} ${blockId} [${blockmode}]`);
                        }
                        else if (blockStates.includes('"ground_sign_direction"=3')) {
                            const blockmode = blockStates.replace('"ground_sign_direction"=3', isSneaking ? '"ground_sign_direction"=2' : '"ground_sign_direction"=4');
                            source.runCommand(`setblock ${x} ${y} ${z} ${blockId} [${blockmode}]`);
                        }
                        else if (blockStates.includes('"ground_sign_direction"=4')) {
                            const blockmode = blockStates.replace('"ground_sign_direction"=4', isSneaking ? '"ground_sign_direction"=3' : '"ground_sign_direction"=5');
                            source.runCommand(`setblock ${x} ${y} ${z} ${blockId} [${blockmode}]`);
                        }
                        else if (blockStates.includes('"ground_sign_direction"=5')) {
                            const blockmode = blockStates.replace('"ground_sign_direction"=5', isSneaking ? '"ground_sign_direction"=4' : '"ground_sign_direction"=6');
                            source.runCommand(`setblock ${x} ${y} ${z} ${blockId} [${blockmode}]`);
                        }
                        else if (blockStates.includes('"ground_sign_direction"=6')) {
                            const blockmode = blockStates.replace('"ground_sign_direction"=6', isSneaking ? '"ground_sign_direction"=5' : '"ground_sign_direction"=7');
                            source.runCommand(`setblock ${x} ${y} ${z} ${blockId} [${blockmode}]`);
                        }
                        else if (blockStates.includes('"ground_sign_direction"=7')) {
                            const blockmode = blockStates.replace('"ground_sign_direction"=7', isSneaking ? '"ground_sign_direction"=6' : '"ground_sign_direction"=8');
                            source.runCommand(`setblock ${x} ${y} ${z} ${blockId} [${blockmode}]`);
                        }
                        else if (blockStates.includes('"ground_sign_direction"=8')) {
                            const blockmode = blockStates.replace('"ground_sign_direction"=8', isSneaking ? '"ground_sign_direction"=7' : '"ground_sign_direction"=9');
                            source.runCommand(`setblock ${x} ${y} ${z} ${blockId} [${blockmode}]`);
                        }
                        else if (blockStates.includes('"ground_sign_direction"=9')) {
                            const blockmode = blockStates.replace('"ground_sign_direction"=9', isSneaking ? '"ground_sign_direction"=8' : '"ground_sign_direction"=10');
                            source.runCommand(`setblock ${x} ${y} ${z} ${blockId} [${blockmode}]`);
                        }
                        else if (blockStates.includes('"ground_sign_direction"=10')) {
                            const blockmode = blockStates.replace('"ground_sign_direction"=10', isSneaking ? '"ground_sign_direction"=9' : '"ground_sign_direction"=11');
                            source.runCommand(`setblock ${x} ${y} ${z} ${blockId} [${blockmode}]`);
                        }
                        else if (blockStates.includes('"ground_sign_direction"=11')) {
                            const blockmode = blockStates.replace('"ground_sign_direction"=11', isSneaking ? '"ground_sign_direction"=10' : '"ground_sign_direction"=12');
                            source.runCommand(`setblock ${x} ${y} ${z} ${blockId} [${blockmode}]`);
                        }
                        else if (blockStates.includes('"ground_sign_direction"=12')) {
                            const blockmode = blockStates.replace('"ground_sign_direction"=12', isSneaking ? '"ground_sign_direction"=11' : '"ground_sign_direction"=13');
                            source.runCommand(`setblock ${x} ${y} ${z} ${blockId} [${blockmode}]`);
                        }
                        else if (blockStates.includes('"ground_sign_direction"=13')) {
                            const blockmode = blockStates.replace('"ground_sign_direction"=13', isSneaking ? '"ground_sign_direction"=12' : '"ground_sign_direction"=14');
                            source.runCommand(`setblock ${x} ${y} ${z} ${blockId} [${blockmode}]`);
                        }
                        else if (blockStates.includes('"ground_sign_direction"=14')) {
                            const blockmode = blockStates.replace('"ground_sign_direction"=14', isSneaking ? '"ground_sign_direction"=13' : '"ground_sign_direction"=15');
                            source.runCommand(`setblock ${x} ${y} ${z} ${blockId} [${blockmode}]`);
                        }
                        else if (blockStates.includes('"ground_sign_direction"=15')) {
                            const blockmode = blockStates.replace('"ground_sign_direction"=15', isSneaking ? '"ground_sign_direction"=14' : '"ground_sign_direction"=0');
                            source.runCommand(`setblock ${x} ${y} ${z} ${blockId} [${blockmode}]`);
                        }
                        break;
                    case "vine_direction_bits":
                        if (blockStates.includes('"vine_direction_bits"=0')) {
                            const blockmode = blockStates.replace('"vine_direction_bits"=0', isSneaking ? '"vine_direction_bits"=15' : '"vine_direction_bits"=1');
                            source.runCommand(`setblock ${x} ${y} ${z} ${blockId} [${blockmode}]`);
                        }
                        else if (blockStates.includes('"vine_direction_bits"=1')) {
                            const blockmode = blockStates.replace('"vine_direction_bits"=1', isSneaking ? '"vine_direction_bits"=0' : '"vine_direction_bits"=2');
                            source.runCommand(`setblock ${x} ${y} ${z} ${blockId} [${blockmode}]`);
                        }
                        else if (blockStates.includes('"vine_direction_bits"=2')) {
                            const blockmode = blockStates.replace('"vine_direction_bits"=2', isSneaking ? '"vine_direction_bits"=1' : '"vine_direction_bits"=3');
                            source.runCommand(`setblock ${x} ${y} ${z} ${blockId} [${blockmode}]`);
                        }
                        else if (blockStates.includes('"vine_direction_bits"=3')) {
                            const blockmode = blockStates.replace('"vine_direction_bits"=3', isSneaking ? '"vine_direction_bits"=2' : '"vine_direction_bits"=4');
                            source.runCommand(`setblock ${x} ${y} ${z} ${blockId} [${blockmode}]`);
                        }
                        else if (blockStates.includes('"vine_direction_bits"=4')) {
                            const blockmode = blockStates.replace('"vine_direction_bits"=4', isSneaking ? '"vine_direction_bits"=3' : '"vine_direction_bits"=5');
                            source.runCommand(`setblock ${x} ${y} ${z} ${blockId} [${blockmode}]`);
                        }
                        else if (blockStates.includes('"vine_direction_bits"=5')) {
                            const blockmode = blockStates.replace('"vine_direction_bits"=5', isSneaking ? '"vine_direction_bits"=4' : '"vine_direction_bits"=6');
                            source.runCommand(`setblock ${x} ${y} ${z} ${blockId} [${blockmode}]`);
                        }
                        else if (blockStates.includes('"vine_direction_bits"=6')) {
                            const blockmode = blockStates.replace('"vine_direction_bits"=6', isSneaking ? '"vine_direction_bits"=5' : '"vine_direction_bits"=7');
                            source.runCommand(`setblock ${x} ${y} ${z} ${blockId} [${blockmode}]`);
                        }
                        else if (blockStates.includes('"vine_direction_bits"=7')) {
                            const blockmode = blockStates.replace('"vine_direction_bits"=7', isSneaking ? '"vine_direction_bits"=6' : '"vine_direction_bits"=8');
                            source.runCommand(`setblock ${x} ${y} ${z} ${blockId} [${blockmode}]`);
                        }
                        else if (blockStates.includes('"vine_direction_bits"=8')) {
                            const blockmode = blockStates.replace('"vine_direction_bits"=8', isSneaking ? '"vine_direction_bits"=7' : '"vine_direction_bits"=9');
                            source.runCommand(`setblock ${x} ${y} ${z} ${blockId} [${blockmode}]`);
                        }
                        else if (blockStates.includes('"vine_direction_bits"=9')) {
                            const blockmode = blockStates.replace('"vine_direction_bits"=9', isSneaking ? '"vine_direction_bits"=8' : '"vine_direction_bits"=10');
                            source.runCommand(`setblock ${x} ${y} ${z} ${blockId} [${blockmode}]`);
                        }
                        else if (blockStates.includes('"vine_direction_bits"=10')) {
                            const blockmode = blockStates.replace('"vine_direction_bits"=10', isSneaking ? '"vine_direction_bits"=9' : '"vine_direction_bits"=11');
                            source.runCommand(`setblock ${x} ${y} ${z} ${blockId} [${blockmode}]`);
                        }
                        else if (blockStates.includes('"vine_direction_bits"=11')) {
                            const blockmode = blockStates.replace('"vine_direction_bits"=11', isSneaking ? '"vine_direction_bits"=10' : '"vine_direction_bits"=12');
                            source.runCommand(`setblock ${x} ${y} ${z} ${blockId} [${blockmode}]`);
                        }
                        else if (blockStates.includes('"vine_direction_bits"=12')) {
                            const blockmode = blockStates.replace('"vine_direction_bits"=12', isSneaking ? '"vine_direction_bits"=11' : '"vine_direction_bits"=13');
                            source.runCommand(`setblock ${x} ${y} ${z} ${blockId} [${blockmode}]`);
                        }
                        else if (blockStates.includes('"vine_direction_bits"=13')) {
                            const blockmode = blockStates.replace('"vine_direction_bits"=13', isSneaking ? '"vine_direction_bits"=12' : '"vine_direction_bits"=14');
                            source.runCommand(`setblock ${x} ${y} ${z} ${blockId} [${blockmode}]`);
                        }
                        else if (blockStates.includes('"vine_direction_bits"=14')) {
                            const blockmode = blockStates.replace('"vine_direction_bits"=14', isSneaking ? '"vine_direction_bits"=13' : '"vine_direction_bits"=15');
                            source.runCommand(`setblock ${x} ${y} ${z} ${blockId} [${blockmode}]`);
                        }
                        else if (blockStates.includes('"vine_direction_bits"=15')) {
                            const blockmode = blockStates.replace('"vine_direction_bits"=15', isSneaking ? '"vine_direction_bits"=14' : '"vine_direction_bits"=0');
                            source.runCommand(`setblock ${x} ${y} ${z} ${blockId} [${blockmode}]`);
                        }
                        break;
                    case "multi_face_direction_bits":
                        if (blockStates.includes('"multi_face_direction_bits"=0')) {
                            const blockmode = blockStates.replace('"multi_face_direction_bits"=0', isSneaking ? '"multi_face_direction_bits"=63' : '"multi_face_direction_bits"=1');
                            source.runCommand(`setblock ${x} ${y} ${z} ${blockId} [${blockmode}]`);
                        }
                        else if (blockStates.includes('"multi_face_direction_bits"=0')) {
                            const blockmode = blockStates.replace('"multi_face_direction_bits"=1', isSneaking ? '"multi_face_direction_bits"=0' : '"multi_face_direction_bits"=2');
                            source.runCommand(`setblock ${x} ${y} ${z} ${blockId} [${blockmode}]`);
                        }
                        else if (blockStates.includes('"multi_face_direction_bits"=2')) {
                            const blockmode = blockStates.replace('"multi_face_direction_bits"=2', isSneaking ? '"multi_face_direction_bits"=1' : '"multi_face_direction_bits"=3');
                            source.runCommand(`setblock ${x} ${y} ${z} ${blockId} [${blockmode}]`);
                        }
                        else if (blockStates.includes('"multi_face_direction_bits"=3')) {
                            const blockmode = blockStates.replace('"multi_face_direction_bits"=3', isSneaking ? '"multi_face_direction_bits"=2' : '"multi_face_direction_bits"=4');
                            source.runCommand(`setblock ${x} ${y} ${z} ${blockId} [${blockmode}]`);
                        }
                        else if (blockStates.includes('"multi_face_direction_bits"=4')) {
                            const blockmode = blockStates.replace('"multi_face_direction_bits"=4', isSneaking ? '"multi_face_direction_bits"=3' : '"multi_face_direction_bits"=5');
                            source.runCommand(`setblock ${x} ${y} ${z} ${blockId} [${blockmode}]`);
                        }
                        else if (blockStates.includes('"multi_face_direction_bits"=5')) {
                            const blockmode = blockStates.replace('"multi_face_direction_bits"=5', isSneaking ? '"multi_face_direction_bits"=4' : '"multi_face_direction_bits"=6');
                            source.runCommand(`setblock ${x} ${y} ${z} ${blockId} [${blockmode}]`);
                        }
                        else if (blockStates.includes('"multi_face_direction_bits"=6')) {
                            const blockmode = blockStates.replace('"multi_face_direction_bits"=6', isSneaking ? '"multi_face_direction_bits"=5' : '"multi_face_direction_bits"=7');
                            source.runCommand(`setblock ${x} ${y} ${z} ${blockId} [${blockmode}]`);
                        }
                        else if (blockStates.includes('"multi_face_direction_bits"=7')) {
                            const blockmode = blockStates.replace('"multi_face_direction_bits"=7', isSneaking ? '"multi_face_direction_bits"=6' : '"multi_face_direction_bits"=8');
                            source.runCommand(`setblock ${x} ${y} ${z} ${blockId} [${blockmode}]`);
                        }
                        else if (blockStates.includes('"multi_face_direction_bits"=8')) {
                            const blockmode = blockStates.replace('"multi_face_direction_bits"=8', isSneaking ? '"multi_face_direction_bits"=7' : '"multi_face_direction_bits"=9');
                            source.runCommand(`setblock ${x} ${y} ${z} ${blockId} [${blockmode}]`);
                        }
                        else if (blockStates.includes('"multi_face_direction_bits"=9')) {
                            const blockmode = blockStates.replace('"multi_face_direction_bits"=9', isSneaking ? '"multi_face_direction_bits"=8' : '"multi_face_direction_bits"=10');
                            source.runCommand(`setblock ${x} ${y} ${z} ${blockId} [${blockmode}]`);
                        }
                        else if (blockStates.includes('"multi_face_direction_bits"=10')) {
                            const blockmode = blockStates.replace('"multi_face_direction_bits"=10', isSneaking ? '"multi_face_direction_bits"=9' : '"multi_face_direction_bits"=11');
                            source.runCommand(`setblock ${x} ${y} ${z} ${blockId} [${blockmode}]`);
                        }
                        else if (blockStates.includes('"multi_face_direction_bits"=11')) {
                            const blockmode = blockStates.replace('"multi_face_direction_bits"=11', isSneaking ? '"multi_face_direction_bits"=10' : '"multi_face_direction_bits"=12');
                            source.runCommand(`setblock ${x} ${y} ${z} ${blockId} [${blockmode}]`);
                        }
                        else if (blockStates.includes('"multi_face_direction_bits"=12')) {
                            const blockmode = blockStates.replace('"multi_face_direction_bits"=12', isSneaking ? '"multi_face_direction_bits"=11' : '"multi_face_direction_bits"=13');
                            source.runCommand(`setblock ${x} ${y} ${z} ${blockId} [${blockmode}]`);
                        }
                        else if (blockStates.includes('"multi_face_direction_bits"=13')) {
                            const blockmode = blockStates.replace('"multi_face_direction_bits"=13', isSneaking ? '"multi_face_direction_bits"=12' : '"multi_face_direction_bits"=14');
                            source.runCommand(`setblock ${x} ${y} ${z} ${blockId} [${blockmode}]`);
                        }
                        else if (blockStates.includes('"multi_face_direction_bits"=14')) {
                            const blockmode = blockStates.replace('"multi_face_direction_bits"=14', isSneaking ? '"multi_face_direction_bits"=13' : '"multi_face_direction_bits"=15');
                            source.runCommand(`setblock ${x} ${y} ${z} ${blockId} [${blockmode}]`);
                        }
                        else if (blockStates.includes('"multi_face_direction_bits"=15')) {
                            const blockmode = blockStates.replace('"multi_face_direction_bits"=15', isSneaking ? '"multi_face_direction_bits"=14' : '"multi_face_direction_bits"=16');
                            source.runCommand(`setblock ${x} ${y} ${z} ${blockId} [${blockmode}]`);
                        }
                        else if (blockStates.includes('"multi_face_direction_bits"=16')) {
                            const blockmode = blockStates.replace('"multi_face_direction_bits"=16', isSneaking ? '"multi_face_direction_bits"=15' : '"multi_face_direction_bits"=17');
                            source.runCommand(`setblock ${x} ${y} ${z} ${blockId} [${blockmode}]`);
                        }
                        else if (blockStates.includes('"multi_face_direction_bits"=17')) {
                            const blockmode = blockStates.replace('"multi_face_direction_bits"=17', isSneaking ? '"multi_face_direction_bits"=16' : '"multi_face_direction_bits"=18');
                            source.runCommand(`setblock ${x} ${y} ${z} ${blockId} [${blockmode}]`);
                        }
                        else if (blockStates.includes('"multi_face_direction_bits"=18')) {
                            const blockmode = blockStates.replace('"multi_face_direction_bits"=18', isSneaking ? '"multi_face_direction_bits"=17' : '"multi_face_direction_bits"=19');
                            source.runCommand(`setblock ${x} ${y} ${z} ${blockId} [${blockmode}]`);
                        }
                        else if (blockStates.includes('"multi_face_direction_bits"=19')) {
                            const blockmode = blockStates.replace('"multi_face_direction_bits"=19', isSneaking ? '"multi_face_direction_bits"=18' : '"multi_face_direction_bits"=20');
                            source.runCommand(`setblock ${x} ${y} ${z} ${blockId} [${blockmode}]`);
                        }
                        else if (blockStates.includes('"multi_face_direction_bits"=20')) {
                            const blockmode = blockStates.replace('"multi_face_direction_bits"=20', isSneaking ? '"multi_face_direction_bits"=19' : '"multi_face_direction_bits"=21');
                            source.runCommand(`setblock ${x} ${y} ${z} ${blockId} [${blockmode}]`);
                        }
                        else if (blockStates.includes('"multi_face_direction_bits"=21')) {
                            const blockmode = blockStates.replace('"multi_face_direction_bits"=21', isSneaking ? '"multi_face_direction_bits"=20' : '"multi_face_direction_bits"=22');
                            source.runCommand(`setblock ${x} ${y} ${z} ${blockId} [${blockmode}]`);
                        }
                        else if (blockStates.includes('"multi_face_direction_bits"=22')) {
                            const blockmode = blockStates.replace('"multi_face_direction_bits"=22', isSneaking ? '"multi_face_direction_bits"=21' : '"multi_face_direction_bits"=23');
                            source.runCommand(`setblock ${x} ${y} ${z} ${blockId} [${blockmode}]`);
                        }
                        else if (blockStates.includes('"multi_face_direction_bits"=23')) {
                            const blockmode = blockStates.replace('"multi_face_direction_bits"=23', isSneaking ? '"multi_face_direction_bits"=22' : '"multi_face_direction_bits"=24');
                            source.runCommand(`setblock ${x} ${y} ${z} ${blockId} [${blockmode}]`);
                        }
                        else if (blockStates.includes('"multi_face_direction_bits"=24')) {
                            const blockmode = blockStates.replace('"multi_face_direction_bits"=24', isSneaking ? '"multi_face_direction_bits"=23' : '"multi_face_direction_bits"=25');
                            source.runCommand(`setblock ${x} ${y} ${z} ${blockId} [${blockmode}]`);
                        }
                        else if (blockStates.includes('"multi_face_direction_bits"=25')) {
                            const blockmode = blockStates.replace('"multi_face_direction_bits"=25', isSneaking ? '"multi_face_direction_bits"=24' : '"multi_face_direction_bits"=26');
                            source.runCommand(`setblock ${x} ${y} ${z} ${blockId} [${blockmode}]`);
                        }
                        else if (blockStates.includes('"multi_face_direction_bits"=26')) {
                            const blockmode = blockStates.replace('"multi_face_direction_bits"=26', isSneaking ? '"multi_face_direction_bits"=25' : '"multi_face_direction_bits"=27');
                            source.runCommand(`setblock ${x} ${y} ${z} ${blockId} [${blockmode}]`);
                        }
                        else if (blockStates.includes('"multi_face_direction_bits"=27')) {
                            const blockmode = blockStates.replace('"multi_face_direction_bits"=27', isSneaking ? '"multi_face_direction_bits"=26' : '"multi_face_direction_bits"=28');
                            source.runCommand(`setblock ${x} ${y} ${z} ${blockId} [${blockmode}]`);
                        }
                        else if (blockStates.includes('"multi_face_direction_bits"=28')) {
                            const blockmode = blockStates.replace('"multi_face_direction_bits"=28', isSneaking ? '"multi_face_direction_bits"=27' : '"multi_face_direction_bits"=29');
                            source.runCommand(`setblock ${x} ${y} ${z} ${blockId} [${blockmode}]`);
                        }
                        else if (blockStates.includes('"multi_face_direction_bits"=29')) {
                            const blockmode = blockStates.replace('"multi_face_direction_bits"=29', isSneaking ? '"multi_face_direction_bits"=28' : '"multi_face_direction_bits"=30');
                            source.runCommand(`setblock ${x} ${y} ${z} ${blockId} [${blockmode}]`);
                        }
                        else if (blockStates.includes('"multi_face_direction_bits"=30')) {
                            const blockmode = blockStates.replace('"multi_face_direction_bits"=30', isSneaking ? '"multi_face_direction_bits"=29' : '"multi_face_direction_bits"=31');
                            source.runCommand(`setblock ${x} ${y} ${z} ${blockId} [${blockmode}]`);
                        }
                        else if (blockStates.includes('"multi_face_direction_bits"=31')) {
                            const blockmode = blockStates.replace('"multi_face_direction_bits"=31', isSneaking ? '"multi_face_direction_bits"=30' : '"multi_face_direction_bits"=32');
                            source.runCommand(`setblock ${x} ${y} ${z} ${blockId} [${blockmode}]`);
                        }
                        else if (blockStates.includes('"multi_face_direction_bits"=32')) {
                            const blockmode = blockStates.replace('"multi_face_direction_bits"=32', isSneaking ? '"multi_face_direction_bits"=31' : '"multi_face_direction_bits"=33');
                            source.runCommand(`setblock ${x} ${y} ${z} ${blockId} [${blockmode}]`);
                        }
                        else if (blockStates.includes('"multi_face_direction_bits"=33')) {
                            const blockmode = blockStates.replace('"multi_face_direction_bits"=33', isSneaking ? '"multi_face_direction_bits"=32' : '"multi_face_direction_bits"=34');
                            source.runCommand(`setblock ${x} ${y} ${z} ${blockId} [${blockmode}]`);
                        }
                        else if (blockStates.includes('"multi_face_direction_bits"=34')) {
                            const blockmode = blockStates.replace('"multi_face_direction_bits"=34', isSneaking ? '"multi_face_direction_bits"=33' : '"multi_face_direction_bits"=35');
                            source.runCommand(`setblock ${x} ${y} ${z} ${blockId} [${blockmode}]`);
                        }
                        else if (blockStates.includes('"multi_face_direction_bits"=35')) {
                            const blockmode = blockStates.replace('"multi_face_direction_bits"=35', isSneaking ? '"multi_face_direction_bits"=34' : '"multi_face_direction_bits"=0');
                            source.runCommand(`setblock ${x} ${y} ${z} ${blockId} [${blockmode}]`);
                        }
                        else if (blockStates.includes('"multi_face_direction_bits"=36')) {
                            const blockmode = blockStates.replace('"multi_face_direction_bits"=36', isSneaking ? '"multi_face_direction_bits"=35' : '"multi_face_direction_bits"=37');
                            source.runCommand(`setblock ${x} ${y} ${z} ${blockId} [${blockmode}]`);
                        }
                        else if (blockStates.includes('"multi_face_direction_bits"=37')) {
                            const blockmode = blockStates.replace('"multi_face_direction_bits"=37', isSneaking ? '"multi_face_direction_bits"=36' : '"multi_face_direction_bits"=38');
                            source.runCommand(`setblock ${x} ${y} ${z} ${blockId} [${blockmode}]`);
                        }
                        else if (blockStates.includes('"multi_face_direction_bits"=38')) {
                            const blockmode = blockStates.replace('"multi_face_direction_bits"=38', isSneaking ? '"multi_face_direction_bits"=37' : '"multi_face_direction_bits"=39');
                            source.runCommand(`setblock ${x} ${y} ${z} ${blockId} [${blockmode}]`);
                        }
                        else if (blockStates.includes('"multi_face_direction_bits"=39')) {
                            const blockmode = blockStates.replace('"multi_face_direction_bits"=39', isSneaking ? '"multi_face_direction_bits"=38' : '"multi_face_direction_bits"=40');
                            source.runCommand(`setblock ${x} ${y} ${z} ${blockId} [${blockmode}]`);
                        }
                        else if (blockStates.includes('"multi_face_direction_bits"=40')) {
                            const blockmode = blockStates.replace('"multi_face_direction_bits"=40', isSneaking ? '"multi_face_direction_bits"=39' : '"multi_face_direction_bits"=41');
                            source.runCommand(`setblock ${x} ${y} ${z} ${blockId} [${blockmode}]`);
                        }
                        else if (blockStates.includes('"multi_face_direction_bits"=41')) {
                            const blockmode = blockStates.replace('"multi_face_direction_bits"=41', isSneaking ? '"multi_face_direction_bits"=40' : '"multi_face_direction_bits"=42');
                            source.runCommand(`setblock ${x} ${y} ${z} ${blockId} [${blockmode}]`);
                        }
                        else if (blockStates.includes('"multi_face_direction_bits"=42')) {
                            const blockmode = blockStates.replace('"multi_face_direction_bits"=42', isSneaking ? '"multi_face_direction_bits"=41' : '"multi_face_direction_bits"=43');
                            source.runCommand(`setblock ${x} ${y} ${z} ${blockId} [${blockmode}]`);
                        }
                        else if (blockStates.includes('"multi_face_direction_bits"=43')) {
                            const blockmode = blockStates.replace('"multi_face_direction_bits"=43', isSneaking ? '"multi_face_direction_bits"=42' : '"multi_face_direction_bits"=44');
                            source.runCommand(`setblock ${x} ${y} ${z} ${blockId} [${blockmode}]`);
                        }
                        else if (blockStates.includes('"multi_face_direction_bits"=44')) {
                            const blockmode = blockStates.replace('"multi_face_direction_bits"=44', isSneaking ? '"multi_face_direction_bits"=43' : '"multi_face_direction_bits"=45');
                            source.runCommand(`setblock ${x} ${y} ${z} ${blockId} [${blockmode}]`);
                        }
                        else if (blockStates.includes('"multi_face_direction_bits"=45')) {
                            const blockmode = blockStates.replace('"multi_face_direction_bits"=45', isSneaking ? '"multi_face_direction_bits"=44' : '"multi_face_direction_bits"=46');
                            source.runCommand(`setblock ${x} ${y} ${z} ${blockId} [${blockmode}]`);
                        }
                        else if (blockStates.includes('"multi_face_direction_bits"=46')) {
                            const blockmode = blockStates.replace('"multi_face_direction_bits"=46', isSneaking ? '"multi_face_direction_bits"=45' : '"multi_face_direction_bits"=47');
                            source.runCommand(`setblock ${x} ${y} ${z} ${blockId} [${blockmode}]`);
                        }
                        else if (blockStates.includes('"multi_face_direction_bits"=47')) {
                            const blockmode = blockStates.replace('"multi_face_direction_bits"=47', isSneaking ? '"multi_face_direction_bits"=46' : '"multi_face_direction_bits"=48');
                            source.runCommand(`setblock ${x} ${y} ${z} ${blockId} [${blockmode}]`);
                        }
                        else if (blockStates.includes('"multi_face_direction_bits"=48')) {
                            const blockmode = blockStates.replace('"multi_face_direction_bits"=48', isSneaking ? '"multi_face_direction_bits"=47' : '"multi_face_direction_bits"=49');
                            source.runCommand(`setblock ${x} ${y} ${z} ${blockId} [${blockmode}]`);
                        }
                        else if (blockStates.includes('"multi_face_direction_bits"=49')) {
                            const blockmode = blockStates.replace('"multi_face_direction_bits"=49', isSneaking ? '"multi_face_direction_bits"=48' : '"multi_face_direction_bits"=50');
                            source.runCommand(`setblock ${x} ${y} ${z} ${blockId} [${blockmode}]`);
                        }
                        else if (blockStates.includes('"multi_face_direction_bits"=50')) {
                            const blockmode = blockStates.replace('"multi_face_direction_bits"=50', isSneaking ? '"multi_face_direction_bits"=49' : '"multi_face_direction_bits"=51');
                            source.runCommand(`setblock ${x} ${y} ${z} ${blockId} [${blockmode}]`);
                        }
                        else if (blockStates.includes('"multi_face_direction_bits"=51')) {
                            const blockmode = blockStates.replace('"multi_face_direction_bits"=51', isSneaking ? '"multi_face_direction_bits"=50' : '"multi_face_direction_bits"=52');
                            source.runCommand(`setblock ${x} ${y} ${z} ${blockId} [${blockmode}]`);
                        }
                        else if (blockStates.includes('"multi_face_direction_bits"=52')) {
                            const blockmode = blockStates.replace('"multi_face_direction_bits"=52', isSneaking ? '"multi_face_direction_bits"=51' : '"multi_face_direction_bits"=53');
                            source.runCommand(`setblock ${x} ${y} ${z} ${blockId} [${blockmode}]`);
                        }
                        else if (blockStates.includes('"multi_face_direction_bits"=53')) {
                            const blockmode = blockStates.replace('"multi_face_direction_bits"=53', isSneaking ? '"multi_face_direction_bits"=52' : '"multi_face_direction_bits"=54');
                            source.runCommand(`setblock ${x} ${y} ${z} ${blockId} [${blockmode}]`);
                        }
                        else if (blockStates.includes('"multi_face_direction_bits"=54')) {
                            const blockmode = blockStates.replace('"multi_face_direction_bits"=54', isSneaking ? '"multi_face_direction_bits"=53' : '"multi_face_direction_bits"=55');
                            source.runCommand(`setblock ${x} ${y} ${z} ${blockId} [${blockmode}]`);
                        }
                        else if (blockStates.includes('"multi_face_direction_bits"=55')) {
                            const blockmode = blockStates.replace('"multi_face_direction_bits"=55', isSneaking ? '"multi_face_direction_bits"=54' : '"multi_face_direction_bits"=56');
                            source.runCommand(`setblock ${x} ${y} ${z} ${blockId} [${blockmode}]`);
                        }
                        else if (blockStates.includes('"multi_face_direction_bits"=56')) {
                            const blockmode = blockStates.replace('"multi_face_direction_bits"=56', isSneaking ? '"multi_face_direction_bits"=55' : '"multi_face_direction_bits"=57');
                            source.runCommand(`setblock ${x} ${y} ${z} ${blockId} [${blockmode}]`);
                        }
                        else if (blockStates.includes('"multi_face_direction_bits"=57')) {
                            const blockmode = blockStates.replace('"multi_face_direction_bits"=57', isSneaking ? '"multi_face_direction_bits"=56' : '"multi_face_direction_bits"=58');
                            source.runCommand(`setblock ${x} ${y} ${z} ${blockId} [${blockmode}]`);
                        }
                        else if (blockStates.includes('"multi_face_direction_bits"=58')) {
                            const blockmode = blockStates.replace('"multi_face_direction_bits"=58', isSneaking ? '"multi_face_direction_bits"=57' : '"multi_face_direction_bits"=59');
                            source.runCommand(`setblock ${x} ${y} ${z} ${blockId} [${blockmode}]`);
                        }
                        else if (blockStates.includes('"multi_face_direction_bits"=59')) {
                            const blockmode = blockStates.replace('"multi_face_direction_bits"=59', isSneaking ? '"multi_face_direction_bits"=58' : '"multi_face_direction_bits"=60');
                            source.runCommand(`setblock ${x} ${y} ${z} ${blockId} [${blockmode}]`);
                        }
                        else if (blockStates.includes('"multi_face_direction_bits"=60')) {
                            const blockmode = blockStates.replace('"multi_face_direction_bits"=60', isSneaking ? '"multi_face_direction_bits"=59' : '"multi_face_direction_bits"=61');
                            source.runCommand(`setblock ${x} ${y} ${z} ${blockId} [${blockmode}]`);
                        }
                        else if (blockStates.includes('"multi_face_direction_bits"=61')) {
                            const blockmode = blockStates.replace('"multi_face_direction_bits"=61', isSneaking ? '"multi_face_direction_bits"=60' : '"multi_face_direction_bits"=62');
                            source.runCommand(`setblock ${x} ${y} ${z} ${blockId} [${blockmode}]`);
                        }
                        else if (blockStates.includes('"multi_face_direction_bits"=62')) {
                            const blockmode = blockStates.replace('"multi_face_direction_bits"=62', isSneaking ? '"multi_face_direction_bits"=61' : '"multi_face_direction_bits"=63');
                            source.runCommand(`setblock ${x} ${y} ${z} ${blockId} [${blockmode}]`);
                        }
                        else if (blockStates.includes('"multi_face_direction_bits"=63')) {
                            const blockmode = blockStates.replace('"multi_face_direction_bits"=63', isSneaking ? '"multi_face_direction_bits"=62' : '"multi_face_direction_bits"=0');
                            source.runCommand(`setblock ${x} ${y} ${z} ${blockId} [${blockmode}]`);
                        }
                        break;
                    // レッドストーン/機構関連
                    case "triggered_bit":
                        if (blockStates.includes('"triggered_bit"=false')) {
                            const blockmode = blockStates.replace('"triggered_bit"=false', '"triggered_bit"=true');
                            source.runCommand(`setblock ${x} ${y} ${z} ${blockId} [${blockmode}]`);
                        }
                        else if (blockStates.includes('"triggered_bit"=true')) {
                            const blockmode = blockStates.replace('"triggered_bit"=true', '"triggered_bit"=false');
                            source.runCommand(`setblock ${x} ${y} ${z} ${blockId} [${blockmode}]`);
                        }
                        break;
                    case "powered_bit":
                        if (blockStates.includes('"powered_bit"=false')) {
                            const blockmode = blockStates.replace('"powered_bit"=false', '"powered_bit"=true');
                            source.runCommand(`setblock ${x} ${y} ${z} ${blockId} [${blockmode}]`);
                        }
                        else if (blockStates.includes('"powered_bit"=true')) {
                            const blockmode = blockStates.replace('"powered_bit"=true', '"powered_bit"=false');
                            source.runCommand(`setblock ${x} ${y} ${z} ${blockId} [${blockmode}]`);
                        }
                        break;
                    case "repeater_delay":
                        if (blockStates.includes('"repeater_delay"=1')) {
                            const blockmode = blockStates.replace('"repeater_delay"=1', isSneaking ? '"repeater_delay"=4' : '"repeater_delay"=2');
                            source.runCommand(`setblock ${x} ${y} ${z} ${blockId} [${blockmode}]`);
                        }
                        else if (blockStates.includes('"repeater_delay"=2')) {
                            const blockmode = blockStates.replace('"repeater_delay"=2', isSneaking ? '"repeater_delay"=1' : '"repeater_delay"=3');
                            source.runCommand(`setblock ${x} ${y} ${z} ${blockId} [${blockmode}]`);
                        }
                        else if (blockStates.includes('"repeater_delay"=3')) {
                            const blockmode = blockStates.replace('"repeater_delay"=3', isSneaking ? '"repeater_delay"=2' : '"repeater_delay"=4');
                            source.runCommand(`setblock ${x} ${y} ${z} ${blockId} [${blockmode}]`);
                        }
                        else if (blockStates.includes('"repeater_delay"=4')) {
                            const blockmode = blockStates.replace('"repeater_delay"=4', isSneaking ? '"repeater_delay"=3' : '"repeater_delay"=1');
                            source.runCommand(`setblock ${x} ${y} ${z} ${blockId} [${blockmode}]`);
                        }
                        break;
                    case "output_subtract_bit":
                        if (blockStates.includes('"output_subtract_bit"=false')) {
                            const blockmode = blockStates.replace('"output_subtract_bit"=false', '"output_subtract_bit"=true');
                            source.runCommand(`setblock ${x} ${y} ${z} ${blockId} [${blockmode}]`);
                        }
                        else if (blockStates.includes('"output_subtract_bit"=true')) {
                            const blockmode = blockStates.replace('"output_subtract_bit"=true', '"output_subtract_bit"=false');
                            source.runCommand(`setblock ${x} ${y} ${z} ${blockId} [${blockmode}]`);
                        }
                        break;
                    case "redstone_signal":
                        if (blockStates.includes('"redstone_signal"=0')) {
                            const blockmode = blockStates.replace('"redstone_signal"=0', isSneaking ? '"redstone_signal"=15' : '"redstone_signal"=1');
                            source.runCommand(`setblock ${x} ${y} ${z} ${blockId} [${blockmode}]`);
                        }
                        else if (blockStates.includes('"redstone_signal"=1')) {
                            const blockmode = blockStates.replace('"redstone_signal"=1', isSneaking ? '"redstone_signal"=0' : '"redstone_signal"=2');
                            source.runCommand(`setblock ${x} ${y} ${z} ${blockId} [${blockmode}]`);
                        }
                        else if (blockStates.includes('"redstone_signal"=2')) {
                            const blockmode = blockStates.replace('"redstone_signal"=2', isSneaking ? '"redstone_signal"=1' : '"redstone_signal"=3');
                            source.runCommand(`setblock ${x} ${y} ${z} ${blockId} [${blockmode}]`);
                        }
                        else if (blockStates.includes('"redstone_signal"=3')) {
                            const blockmode = blockStates.replace('"redstone_signal"=3', isSneaking ? '"redstone_signal"=2' : '"redstone_signal"=4');
                            source.runCommand(`setblock ${x} ${y} ${z} ${blockId} [${blockmode}]`);
                        }
                        else if (blockStates.includes('"redstone_signal"=4')) {
                            const blockmode = blockStates.replace('"redstone_signal"=4', isSneaking ? '"redstone_signal"=3' : '"redstone_signal"=5');
                            source.runCommand(`setblock ${x} ${y} ${z} ${blockId} [${blockmode}]`);
                        }
                        else if (blockStates.includes('"redstone_signal"=5')) {
                            const blockmode = blockStates.replace('"redstone_signal"=5', isSneaking ? '"redstone_signal"=4' : '"redstone_signal"=6');
                            source.runCommand(`setblock ${x} ${y} ${z} ${blockId} [${blockmode}]`);
                        }
                        else if (blockStates.includes('"redstone_signal"=6')) {
                            const blockmode = blockStates.replace('"redstone_signal"=6', isSneaking ? '"redstone_signal"=5' : '"redstone_signal"=7');
                            source.runCommand(`setblock ${x} ${y} ${z} ${blockId} [${blockmode}]`);
                        }
                        else if (blockStates.includes('"redstone_signal"=7')) {
                            const blockmode = blockStates.replace('"redstone_signal"=7', isSneaking ? '"redstone_signal"=6' : '"redstone_signal"=8');
                            source.runCommand(`setblock ${x} ${y} ${z} ${blockId} [${blockmode}]`);
                        }
                        else if (blockStates.includes('"redstone_signal"=8')) {
                            const blockmode = blockStates.replace('"redstone_signal"=8', isSneaking ? '"redstone_signal"=7' : '"redstone_signal"=9');
                            source.runCommand(`setblock ${x} ${y} ${z} ${blockId} [${blockmode}]`);
                        }
                        else if (blockStates.includes('"redstone_signal"=9')) {
                            const blockmode = blockStates.replace('"redstone_signal"=9', isSneaking ? '"redstone_signal"=8' : '"redstone_signal"=10');
                            source.runCommand(`setblock ${x} ${y} ${z} ${blockId} [${blockmode}]`);
                        }
                        else if (blockStates.includes('"redstone_signal"=10')) {
                            const blockmode = blockStates.replace('"redstone_signal"=10', isSneaking ? '"redstone_signal"=9' : '"redstone_signal"=11');
                            source.runCommand(`setblock ${x} ${y} ${z} ${blockId} [${blockmode}]`);
                        }
                        else if (blockStates.includes('"redstone_signal"=11')) {
                            const blockmode = blockStates.replace('"redstone_signal"=11', isSneaking ? '"redstone_signal"=10' : '"redstone_signal"=12');
                            source.runCommand(`setblock ${x} ${y} ${z} ${blockId} [${blockmode}]`);
                        }
                        else if (blockStates.includes('"redstone_signal"=12')) {
                            const blockmode = blockStates.replace('"redstone_signal"=12', isSneaking ? '"redstone_signal"=11' : '"redstone_signal"=13');
                            source.runCommand(`setblock ${x} ${y} ${z} ${blockId} [${blockmode}]`);
                        }
                        else if (blockStates.includes('"redstone_signal"=13')) {
                            const blockmode = blockStates.replace('"redstone_signal"=13', isSneaking ? '"redstone_signal"=12' : '"redstone_signal"=14');
                            source.runCommand(`setblock ${x} ${y} ${z} ${blockId} [${blockmode}]`);
                        }
                        else if (blockStates.includes('"redstone_signal"=14')) {
                            const blockmode = blockStates.replace('"redstone_signal"=14', isSneaking ? '"redstone_signal"=13' : '"redstone_signal"=15');
                            source.runCommand(`setblock ${x} ${y} ${z} ${blockId} [${blockmode}]`);
                        }
                        else if (blockStates.includes('"redstone_signal"=15')) {
                            const blockmode = blockStates.replace('"redstone_signal"=15', isSneaking ? '"redstone_signal"=14' : '"redstone_signal"=0');
                            source.runCommand(`setblock ${x} ${y} ${z} ${blockId} [${blockmode}]`);
                        }
                        break;
                    case "button_pressd_bit":
                        if (blockStates.includes('"button_pressd_bit"=false')) {
                            const blockmode = blockStates.replace('"button_pressd_bit"=false', '"button_pressd_bit"=true');
                            source.runCommand(`setblock ${x} ${y} ${z} ${blockId} [${blockmode}]`);
                        }
                        else if (blockStates.includes('"button_pressd_bit"=true')) {
                            const blockmode = blockStates.replace('"button_pressd_bit"=true', '"button_pressd_bit"=false');
                            source.runCommand(`setblock ${x} ${y} ${z} ${blockId} [${blockmode}]`);
                        }
                        break;
                    case "rail_direction":
                        if (blockStates.includes('"rail_direction"=0')) {
                            const blockmode = blockStates.replace('"rail_direction"=0', isSneaking ? '"rail_direction"=9' : '"rail_direction"=1');
                            source.runCommand(`setblock ${x} ${y} ${z} ${blockId} [${blockmode}]`);
                        }
                        else if (blockStates.includes('"rail_direction"=1')) {
                            const blockmode = blockStates.replace('"rail_direction"=1', isSneaking ? '"rail_direction"=0' : '"rail_direction"=2');
                            source.runCommand(`setblock ${x} ${y} ${z} ${blockId} [${blockmode}]`);
                        }
                        else if (blockStates.includes('"rail_direction"=2')) {
                            const blockmode = blockStates.replace('"rail_direction"=2', isSneaking ? '"rail_direction"=1' : '"rail_direction"=3');
                            source.runCommand(`setblock ${x} ${y} ${z} ${blockId} [${blockmode}]`);
                        }
                        else if (blockStates.includes('"rail_direction"=3')) {
                            const blockmode = blockStates.replace('"rail_direction"=3', isSneaking ? '"rail_direction"=2' : '"rail_direction"=4');
                            source.runCommand(`setblock ${x} ${y} ${z} ${blockId} [${blockmode}]`);
                        }
                        else if (blockStates.includes('"rail_direction"=4')) {
                            const blockmode = blockStates.replace('"rail_direction"=4', isSneaking ? '"rail_direction"=3' : '"rail_direction"=5');
                            source.runCommand(`setblock ${x} ${y} ${z} ${blockId} [${blockmode}]`);
                        }
                        else if (blockStates.includes('"rail_direction"=5')) {
                            const blockmode = blockStates.replace('"rail_direction"=5', isSneaking ? '"rail_direction"=4' : '"rail_direction"=6');
                            source.runCommand(`setblock ${x} ${y} ${z} ${blockId} [${blockmode}]`);
                        }
                        else if (blockStates.includes('"rail_direction"=6')) {
                            const blockmode = blockStates.replace('"rail_direction"=6', isSneaking ? '"rail_direction"=5' : '"rail_direction"=7');
                            source.runCommand(`setblock ${x} ${y} ${z} ${blockId} [${blockmode}]`);
                        }
                        else if (blockStates.includes('"rail_direction"=7')) {
                            const blockmode = blockStates.replace('"rail_direction"=7', isSneaking ? '"rail_direction"=6' : '"rail_direction"=8');
                            source.runCommand(`setblock ${x} ${y} ${z} ${blockId} [${blockmode}]`);
                        }
                        else if (blockStates.includes('"rail_direction"=8')) {
                            const blockmode = blockStates.replace('"rail_direction"=8', isSneaking ? '"rail_direction"=7' : '"rail_direction"=9');
                            source.runCommand(`setblock ${x} ${y} ${z} ${blockId} [${blockmode}]`);
                        }
                        else if (blockStates.includes('"rail_direction"=9')) {
                            const blockmode = blockStates.replace('"rail_direction"=9', isSneaking ? '"rail_direction"=8' : '"rail_direction"=0');
                            source.runCommand(`setblock ${x} ${y} ${z} ${blockId} [${blockmode}]`);
                        }
                        break;
                    case "rail_data_bit":
                        if (blockStates.includes('"rail_data_bit"=false')) {
                            const blockmode = blockStates.replace('"rail_data_bit"=false', '"rail_data_bit"=true');
                            source.runCommand(`setblock ${x} ${y} ${z} ${blockId} [${blockmode}]`);
                        }
                        else if (blockStates.includes('"rail_data_bit"=true')) {
                            const blockmode = blockStates.replace('"rail_data_bit"=true', '"rail_data_bit"=false');
                            source.runCommand(`setblock ${x} ${y} ${z} ${blockId} [${blockmode}]`);
                        }
                        break;
                    case "lever_direction":
                        if (blockStates.includes('"lever_direction"="down_east_west"')) {
                            const blockmode = blockStates.replace('"lever_direction"="down_east_west"', isSneaking ? '"lever_direction"="up_east_west"' : '"lever_direction"="east"');
                            source.runCommand(`setblock ${x} ${y} ${z} ${blockId} [${blockmode}]`);
                        }
                        else if (blockStates.includes('"lever_direction"="east"')) {
                            const blockmode = blockStates.replace('"lever_direction"="east"', isSneaking ? '"lever_direction"="down_east_west"' : '"lever_direction"="west"');
                            source.runCommand(`setblock ${x} ${y} ${z} ${blockId} [${blockmode}]`);
                        }
                        else if (blockStates.includes('"lever_direction"="west"')) {
                            const blockmode = blockStates.replace('"lever_direction"="west"', isSneaking ? '"lever_direction"="east"' : '"lever_direction"="south"');
                            source.runCommand(`setblock ${x} ${y} ${z} ${blockId} [${blockmode}]`);
                        }
                        else if (blockStates.includes('"lever_direction"="south"')) {
                            const blockmode = blockStates.replace('"lever_direction"="south"', isSneaking ? '"lever_direction"="west"' : '"lever_direction"="north"');
                            source.runCommand(`setblock ${x} ${y} ${z} ${blockId} [${blockmode}]`);
                        }
                        else if (blockStates.includes('"lever_direction"="north"')) {
                            const blockmode = blockStates.replace('"lever_direction"="north"', isSneaking ? '"lever_direction"="south"' : '"lever_direction"="up_north_south"');
                            source.runCommand(`setblock ${x} ${y} ${z} ${blockId} [${blockmode}]`);
                        }
                        else if (blockStates.includes('"lever_direction"="up_north_south"')) {
                            const blockmode = blockStates.replace('"lever_direction"="up_north_south"', isSneaking ? '"lever_direction"="north"' : '"lever_direction"="up_east_west"');
                            source.runCommand(`setblock ${x} ${y} ${z} ${blockId} [${blockmode}]`);
                        }
                        else if (blockStates.includes('"lever_direction"="up_east_west"')) {
                            const blockmode = blockStates.replace('"lever_direction"="up_east_west"', isSneaking ? '"lever_direction"="up_north_south"' : '"lever_direction"="down_north_south"');
                            source.runCommand(`setblock ${x} ${y} ${z} ${blockId} [${blockmode}]`);
                        }
                        else if (blockStates.includes('"lever_direction"="down_north_south"')) {
                            const blockmode = blockStates.replace('"lever_direction"="down_north_south"', isSneaking ? '"lever_direction"="up_east_west"' : '"lever_direction"="down_east_west"');
                            source.runCommand(`setblock ${x} ${y} ${z} ${blockId} [${blockmode}]`);
                        }
                        break;
                    case "toggle_bit":
                        if (blockStates.includes('"toggle_bit"=false')) {
                            const blockmode = blockStates.replace('"toggle_bit"=false', '"toggle_bit"=true');
                            source.runCommand(`setblock ${x} ${y} ${z} ${blockId} [${blockmode}]`);
                        }
                        else if (blockStates.includes('"toggle_bit"=true')) {
                            const blockmode = blockStates.replace('"toggle_bit"=true', '"toggle_bit"=false');
                            source.runCommand(`setblock ${x} ${y} ${z} ${blockId} [${blockmode}]`);
                        }
                        break;
                    case "allow_underwater_bit":
                        if (blockStates.includes('"allow_underwater_bit"=false')) {
                            const blockmode = blockStates.replace('"allow_underwater_bit"=false', '"allow_underwater_bit"=true');
                            source.runCommand(`setblock ${x} ${y} ${z} ${blockId} [${blockmode}]`);
                        }
                        else if (blockStates.includes('"allow_underwater_bit"=true')) {
                            const blockmode = blockStates.replace('"allow_underwater_bit"=true', '"allow_underwater_bit"=false');
                            source.runCommand(`setblock ${x} ${y} ${z} ${blockId} [${blockmode}]`);
                        }
                        break;
                    case "explode_bit":
                        if (blockStates.includes('"explode_bit"=false')) {
                            const blockmode = blockStates.replace('"explode_bit"=false', '"explode_bit"=true');
                            source.runCommand(`setblock ${x} ${y} ${z} ${blockId} [${blockmode}]`);
                        }
                        else if (blockStates.includes('"explode_bit"=true')) {
                            const blockmode = blockStates.replace('"explode_bit"=true', '"explode_bit"=false');
                            source.runCommand(`setblock ${x} ${y} ${z} ${blockId} [${blockmode}]`);
                        }
                        break;
                    case "open_bit":
                        if (blockStates.includes('"open_bit"=false')) {
                            const blockmode = blockStates.replace('"open_bit"=false', '"open_bit"=true');
                            source.runCommand(`setblock ${x} ${y} ${z} ${blockId} [${blockmode}]`);
                        }
                        else if (blockStates.includes('"open_bit"=true')) {
                            const blockmode = blockStates.replace('"open_bit"=true', '"open_bit"=false');
                            source.runCommand(`setblock ${x} ${y} ${z} ${blockId} [${blockmode}]`);
                        }
                        break;
                    // 壁/接続関連
                    case "in_wall_bit":
                        if (blockStates.includes('"in_wall_bit"=false')) {
                            const blockmode = blockStates.replace('"in_wall_bit"=false', '"in_wall_bit"=true');
                            source.runCommand(`setblock ${x} ${y} ${z} ${blockId} [${blockmode}]`);
                        }
                        else if (blockStates.includes('"in_wall_bit"=true')) {
                            const blockmode = blockStates.replace('"in_wall_bit"=true', '"in_wall_bit"=false');
                            source.runCommand(`setblock ${x} ${y} ${z} ${blockId} [${blockmode}]`);
                        }
                        break;
                    case "wall_connection_type_east":
                        if (blockStates.includes('"wall_connection_type_east"="none"')) {
                            const blockmode = blockStates.replace('"wall_connection_type_east"="none"', isSneaking ? '"wall_connection_type_east"="tall"' : '"wall_connection_type_east"="short"');
                            source.runCommand(`setblock ${x} ${y} ${z} ${blockId} [${blockmode}]`);
                        }
                        else if (blockStates.includes('"wall_connection_type_east"="short"')) {
                            const blockmode = blockStates.replace('"wall_connection_type_east"="short"', isSneaking ? '"wall_connection_type_east"="none"' : '"wall_connection_type_east"="tall"');
                            source.runCommand(`setblock ${x} ${y} ${z} ${blockId} [${blockmode}]`);
                        }
                        else if (blockStates.includes('"wall_connection_type_east"="tall"')) {
                            const blockmode = blockStates.replace('"wall_connection_type_east"="tall"', isSneaking ? '"wall_connection_type_east"="short"' : '"wall_connection_type_east"="none"');
                            source.runCommand(`setblock ${x} ${y} ${z} ${blockId} [${blockmode}]`);
                        }
                        break;
                    case "wall_connection_type_north":
                        if (blockStates.includes('"wall_connection_type_north"="none"')) {
                            const blockmode = blockStates.replace('"wall_connection_type_north"="none"', isSneaking ? '"wall_connection_type_north"="tall"' : '"wall_connection_type_north"="short"');
                            source.runCommand(`setblock ${x} ${y} ${z} ${blockId} [${blockmode}]`);
                        }
                        else if (blockStates.includes('"wall_connection_type_north"="short"')) {
                            const blockmode = blockStates.replace('"wall_connection_type_north"="short"', isSneaking ? '"wall_connection_type_north"="none"' : '"wall_connection_type_north"="tall"');
                            source.runCommand(`setblock ${x} ${y} ${z} ${blockId} [${blockmode}]`);
                        }
                        else if (blockStates.includes('"wall_connection_type_north"="tall"')) {
                            const blockmode = blockStates.replace('"wall_connection_type_north"="tall"', isSneaking ? '"wall_connection_type_north"="short"' : '"wall_connection_type_north"="none"');
                            source.runCommand(`setblock ${x} ${y} ${z} ${blockId} [${blockmode}]`);
                        }
                        break;
                    case "wall_connection_type_south":
                        if (blockStates.includes('"wall_connection_type_south"="none"')) {
                            const blockmode = blockStates.replace('"wall_connection_type_south"="none"', isSneaking ? '"wall_connection_type_south"="tall"' : '"wall_connection_type_south"="short"');
                            source.runCommand(`setblock ${x} ${y} ${z} ${blockId} [${blockmode}]`);
                        }
                        else if (blockStates.includes('"wall_connection_type_south"="short"')) {
                            const blockmode = blockStates.replace('"wall_connection_type_south"="short"', isSneaking ? '"wall_connection_type_south"="none"' : '"wall_connection_type_south"="tall"');
                            source.runCommand(`setblock ${x} ${y} ${z} ${blockId} [${blockmode}]`);
                        }
                        else if (blockStates.includes('"wall_connection_type_south"="tall"')) {
                            const blockmode = blockStates.replace('"wall_connection_type_south"="tall"', isSneaking ? '"wall_connection_type_south"="short"' : '"wall_connection_type_south"="none"');
                            source.runCommand(`setblock ${x} ${y} ${z} ${blockId} [${blockmode}]`);
                        }
                        break;
                    case "wall_connection_type_west":
                        if (blockStates.includes('"wall_connection_type_west"="none"')) {
                            const blockmode = blockStates.replace('"wall_connection_type_west"="none"', isSneaking ? '"wall_connection_type_west"="tall"' : '"wall_connection_type_west"="short"');
                            source.runCommand(`setblock ${x} ${y} ${z} ${blockId} [${blockmode}]`);
                        }
                        else if (blockStates.includes('"wall_connection_type_west"="short"')) {
                            const blockmode = blockStates.replace('"wall_connection_type_west"="short"', isSneaking ? '"wall_connection_type_west"="none"' : '"wall_connection_type_west"="tall"');
                            source.runCommand(`setblock ${x} ${y} ${z} ${blockId} [${blockmode}]`);
                        }
                        else if (blockStates.includes('"wall_connection_type_west"="tall"')) {
                            const blockmode = blockStates.replace('"wall_connection_type_west"="tall"', isSneaking ? '"wall_connection_type_west"="short"' : '"wall_connection_type_west"="none"');
                            source.runCommand(`setblock ${x} ${y} ${z} ${blockId} [${blockmode}]`);
                        }
                        break;
                    case "wall_post_bit":
                        if (blockStates.includes('"wall_post_bit"=false')) {
                            const blockmode = blockStates.replace('"wall_post_bit"=false', '"wall_post_bit"=true');
                            source.runCommand(`setblock ${x} ${y} ${z} ${blockId} [${blockmode}]`);
                        }
                        else if (blockStates.includes('"wall_post_bit"=true')) {
                            const blockmode = blockStates.replace('"wall_post_bit"=true', '"wall_post_bit"=false');
                            source.runCommand(`setblock ${x} ${y} ${z} ${blockId} [${blockmode}]`);
                        }
                        break;
                    case "attachment":
                        if (blockStates.includes('"attachment"="standing"')) {
                            const blockmode = blockStates.replace('"attachment"="standing"', isSneaking ? '"attachment"="multiple"' : '"attachment"="hanging"');
                            source.runCommand(`setblock ${x} ${y} ${z} ${blockId} [${blockmode}]`);
                        }
                        else if (blockStates.includes('"attachment"="hanging"')) {
                            const blockmode = blockStates.replace('"attachment"="hanging"', isSneaking ? '"attachment"="standing"' : '"attachment"="side"');
                            source.runCommand(`setblock ${x} ${y} ${z} ${blockId} [${blockmode}]`);
                        }
                        else if (blockStates.includes('"attachment"="side"')) {
                            const blockmode = blockStates.replace('"attachment"="side"', isSneaking ? '"attachment"="hanging"' : '"attachment"="multiple"');
                            source.runCommand(`setblock ${x} ${y} ${z} ${blockId} [${blockmode}]`);
                        }
                        else if (blockStates.includes('"attachment"="multiple"')) {
                            const blockmode = blockStates.replace('"attachment"="multiple"', isSneaking ? '"attachment"="side"' : '"attachment"="standing"');
                            source.runCommand(`setblock ${x} ${y} ${z} ${blockId} [${blockmode}]`);
                        }
                        break;
                    case "attached_bit":
                        if (blockStates.includes('"attached_bit"=false')) {
                            const blockmode = blockStates.replace('"attached_bit"=false', '"attached_bit"=true');
                            source.runCommand(`setblock ${x} ${y} ${z} ${blockId} [${blockmode}]`);
                        }
                        else if (blockStates.includes('"attached_bit"=true')) {
                            const blockmode = blockStates.replace('"attached_bit"=true', '"attached_bit"=false');
                            source.runCommand(`setblock ${x} ${y} ${z} ${blockId} [${blockmode}]`);
                        }
                        break;
                    case "big_dripleaf_tilt":
                        if (blockStates.includes('"big_dripleaf_tilt"="none"')) {
                            const blockmode = blockStates.replace('"big_dripleaf_tilt"="none"', isSneaking ? '"big_dripleaf_tilt"="full_tilt"' : '"big_dripleaf_tilt"="unstable"');
                            source.runCommand(`setblock ${x} ${y} ${z} ${blockId} [${blockmode}]`);
                        }
                        else if (blockStates.includes('"big_dripleaf_tilt"="unstable"')) {
                            const blockmode = blockStates.replace('"big_dripleaf_tilt"="unstable"', isSneaking ? '"big_dripleaf_tilt"="none"' : '"big_dripleaf_tilt"="partial_tilt"');
                            source.runCommand(`setblock ${x} ${y} ${z} ${blockId} [${blockmode}]`);
                        }
                        else if (blockStates.includes('"big_dripleaf_tilt"="partial_tilt"')) {
                            const blockmode = blockStates.replace('"big_dripleaf_tilt"="partial_tilt"', isSneaking ? '"big_dripleaf_tilt"="unstable"' : '"big_dripleaf_tilt"="full_tilt"');
                            source.runCommand(`setblock ${x} ${y} ${z} ${blockId} [${blockmode}]`);
                        }
                        else if (blockStates.includes('"big_dripleaf_tilt"="full_tilt"')) {
                            const blockmode = blockStates.replace('"big_dripleaf_tilt"="full_tilt"', isSneaking ? '"big_dripleaf_tilt"="partial_tilt"' : '"big_dripleaf_tilt"="none"');
                            source.runCommand(`setblock ${x} ${y} ${z} ${blockId} [${blockmode}]`);
                        }
                        break;
                    case "big_dripleaf_head":
                        if (blockStates.includes('"big_dripleaf_head"=false')) {
                            const blockmode = blockStates.replace('"big_dripleaf_head"=false', '"big_dripleaf_head"=true');
                            source.runCommand(`setblock ${x} ${y} ${z} ${blockId} [${blockmode}]`);
                        }
                        else if (blockStates.includes('"big_dripleaf_head"=true')) {
                            const blockmode = blockStates.replace('"big_dripleaf_head"=true', '"big_dripleaf_head"=false');
                            source.runCommand(`setblock ${x} ${y} ${z} ${blockId} [${blockmode}]`);
                        }
                        break;
                    case "upper_block_bit":
                        if (blockStates.includes('"upper_block_bit"=false')) {
                            const blockmode = blockStates.replace('"upper_block_bit"=false', '"upper_block_bit"=true');
                            source.runCommand(`setblock ${x} ${y} ${z} ${blockId} [${blockmode}]`);
                        }
                        else if (blockStates.includes('"upper_block_bit"=true')) {
                            const blockmode = blockStates.replace('"upper_block_bit"=true', '"upper_block_bit"=false');
                            source.runCommand(`setblock ${x} ${y} ${z} ${blockId} [${blockmode}]`);
                        }
                        break;


                    // 成長/年齢関連

                    // 液体/充填レベル関連

                    // 特殊ブロック状態
                    case "candle_count":
                        if (blockStates.includes('"candle_count"=1')) {
                            const blockmode = blockStates.replace('"candle_count"=1', isSneaking ? '"candle_count"=4' : '"candle_count"=2');
                            source.runCommand(`setblock ${x} ${y} ${z} ${blockId} [${blockmode}]`);
                        }
                        else if (blockStates.includes('"candle_count"=2')) {
                            const blockmode = blockStates.replace('"candle_count"=2', isSneaking ? '"candle_count"=1' : '"candle_count"=3');
                            source.runCommand(`setblock ${x} ${y} ${z} ${blockId} [${blockmode}]`);
                        }
                        else if (blockStates.includes('"candle_count"=3')) {
                            const blockmode = blockStates.replace('"candle_count"=3', isSneaking ? '"candle_count"=2' : '"candle_count"=4');
                            source.runCommand(`setblock ${x} ${y} ${z} ${blockId} [${blockmode}]`);
                        }
                        else if (blockStates.includes('"candle_count"=4')) {
                            const blockmode = blockStates.replace('"candle_count"=4', isSneaking ? '"candle_count"=3' : '"candle_count"=1');
                            source.runCommand(`setblock ${x} ${y} ${z} ${blockId} [${blockmode}]`);
                        }
                        break;
                    case "extinguished_bit":
                        if (blockStates.includes('"extinguished_bit"=false')) {
                            const blockmode = blockStates.replace('"extinguished_bit"=false', '"extinguished_bit"=true');
                            source.runCommand(`setblock ${x} ${y} ${z} ${blockId} [${blockmode}]`);
                        }
                        else if (blockStates.includes('"extinguished_bit"=true')) {
                            const blockmode = blockStates.replace('"extinguished_bit"=true', '"extinguished_bit"=false');
                            source.runCommand(`setblock ${x} ${y} ${z} ${blockId} [${blockmode}]`);
                        }
                        break;
                    case "lit":
                        if (blockStates.includes('"lit"=false')) {
                            const blockmode = blockStates.replace('"lit"=false', '"lit"=true');
                            source.runCommand(`setblock ${x} ${y} ${z} ${blockId} [${blockmode}]`);
                        }
                        else if (blockStates.includes('"lit"=true')) {
                            const blockmode = blockStates.replace('"lit"=true', '"lit"=false');
                            source.runCommand(`setblock ${x} ${y} ${z} ${blockId} [${blockmode}]`);
                        }
                        break;
                    case "dead_bit":
                        if (blockStates.includes('"dead_bit"=false')) {
                            const blockmode = blockStates.replace('"dead_bit"=false', '"dead_bit"=true');
                            source.runCommand(`setblock ${x} ${y} ${z} ${blockId} [${blockmode}]`);
                        }
                        else if (blockStates.includes('"dead_bit"=true')) {
                            const blockmode = blockStates.replace('"dead_bit"=true', '"dead_bit"=false');
                            source.runCommand(`setblock ${x} ${y} ${z} ${blockId} [${blockmode}]`);
                        }
                        break;

                    // スポナー/イベント関連

                    // その他の状態
                    case "stability":
                        if (blockStates.includes('"stability"=0')) {
                            const blockmode = blockStates.replace('"stability"=0', isSneaking ? '"stability"=7' : '"stability"=1');
                            source.runCommand(`setblock ${x} ${y} ${z} ${blockId} [${blockmode}]`);
                        }
                        else if (blockStates.includes('"stability"=1')) {
                            const blockmode = blockStates.replace('"stability"=1', isSneaking ? '"stability"=0' : '"stability"=2');
                            source.runCommand(`setblock ${x} ${y} ${z} ${blockId} [${blockmode}]`);
                        }
                        else if (blockStates.includes('"stability"=2')) {
                            const blockmode = blockStates.replace('"stability"=2', isSneaking ? '"stability"=1' : '"stability"=3');
                            source.runCommand(`setblock ${x} ${y} ${z} ${blockId} [${blockmode}]`);
                        }
                        else if (blockStates.includes('"stability"=3')) {
                            const blockmode = blockStates.replace('"stability"=3', isSneaking ? '"stability"=2' : '"stability"=4');
                            source.runCommand(`setblock ${x} ${y} ${z} ${blockId} [${blockmode}]`);
                        }
                        else if (blockStates.includes('"stability"=4')) {
                            const blockmode = blockStates.replace('"stability"=4', isSneaking ? '"stability"=3' : '"stability"=5');
                            source.runCommand(`setblock ${x} ${y} ${z} ${blockId} [${blockmode}]`);
                        }
                        else if (blockStates.includes('"stability"=5')) {
                            const blockmode = blockStates.replace('"stability"=5', isSneaking ? '"stability"=4' : '"stability"=6');
                            source.runCommand(`setblock ${x} ${y} ${z} ${blockId} [${blockmode}]`);
                        }
                        else if (blockStates.includes('"stability"=6')) {
                            const blockmode = blockStates.replace('"stability"=6', isSneaking ? '"stability"=5' : '"stability"=7');
                            source.runCommand(`setblock ${x} ${y} ${z} ${blockId} [${blockmode}]`);
                        }
                        else if (blockStates.includes('"stability"=7')) {
                            const blockmode = blockStates.replace('"stability"=7', isSneaking ? '"stability"=6' : '"stability"=0');
                            source.runCommand(`setblock ${x} ${y} ${z} ${blockId} [${blockmode}]`);
                        }
                        break;
                    case "stability_check":
                        if (blockStates.includes('"stability_check"=false')) {
                            const blockmode = blockStates.replace('"stability_check"=false', '"stability_check"=true');
                            source.runCommand(`setblock ${x} ${y} ${z} ${blockId} [${blockmode}]`);
                        }
                        else if (blockStates.includes('"stability_check"=true')) {
                            const blockmode = blockStates.replace('"stability_check"=true', '"stability_check"=false');
                            source.runCommand(`setblock ${x} ${y} ${z} ${blockId} [${blockmode}]`);
                        }
                        break;
                    case "crafting":
                        if (blockStates.includes('"crafting"=false')) {
                            const blockmode = blockStates.replace('"crafting"=false', '"crafting"=true');
                            source.runCommand(`setblock ${x} ${y} ${z} ${blockId} [${blockmode}]`);
                        }
                        else if (blockStates.includes('"crafting"=true')) {
                            const blockmode = blockStates.replace('"crafting"=true', '"crafting"=false');
                            source.runCommand(`setblock ${x} ${y} ${z} ${blockId} [${blockmode}]`);
                        }
                        break;
                    // アイテムフレーム関連
                }
            }
            else {
                source.runCommand(`${TITLE} {"rawtext":[{"text":"${blockId}"},{"translate":"pack.no.properties"}]}`)
            }
        }
    })
});