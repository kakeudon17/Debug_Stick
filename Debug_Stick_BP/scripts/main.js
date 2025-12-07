import * as server from "@minecraft/server";
import { modeMap, platform_unused_status, add_unused_states, tag_mode } from "./settings.js";
import { excluded_states, states_result_blocks } from "./optimization_states.js";
import { states_result_default } from "./block_states.js";

const DEBUG_STICK_ID = "mcx:debug_stick";

// ユーティリティ関数
function formatBlockState(key, value) {
    const formattedValue = typeof value === 'boolean' || typeof value === 'number'
        ? value
        : `"${value}"`;
    return `"${key}"=${formattedValue}`;
}

function getBlockStatesString(blockAllStates) {
    return Object.entries(blockAllStates)
        .map(([key, value]) => formatBlockState(key, value))
        .join(', ');
}

// 権限チェック
function checkPermissions(player) {
    if (player.getGameMode() !== "Creative") return false;

    return tag_mode
        ? player.hasTag("debug_stick") || player.commandPermissionLevel.valueOf() >= 1
        : player.commandPermissionLevel.valueOf() >= 1;
}

// ステートフィルタリング
function getFilteredStates(blockId, blockAllStates) {
    const allEntries = Object.entries(blockAllStates || {});

    // デフォルトの除外ステート
    let defaultExcludedStates = [];
    let defaultBlockExclusions = [];

    if (add_unused_states === false) {
        defaultExcludedStates = excluded_states.default.states || [];
        defaultBlockExclusions = excluded_states.default.blocks[blockId] || [];
    }

    // プラットフォームの設定を取得
    const platformKey = platform_unused_status === 0 ? "PC" : platform_unused_status === 1 ? "Mobile" : null;

    // プラットフォーム固有の除外ステート
    const platformExcludedStates = platformKey ? (excluded_states[platformKey]?.states || []) : [];
    const platformBlockExclusions = platformKey ? (excluded_states[platformKey]?.blocks?.[blockId] || []) : [];

    // すべての除外リストを結合
    const allExcludedStates = [...defaultExcludedStates, ...platformExcludedStates];
    const allBlockExclusions = [...defaultBlockExclusions, ...platformBlockExclusions];

    return allEntries.filter(([key]) =>
        !allExcludedStates.includes(key) && !allBlockExclusions.includes(key)
    );
}

// ステート値取得
function getStateValues(blockId, currentState) {
    return states_result_blocks[blockId]?.[currentState] || states_result_default[currentState];
}

// コンテナ内アイテム保存
function saveContainerItems(container) {
    const items = [];
    if (container) {
        for (let i = 0; i < container.size; i++) {
            const item = container.getItem(i);
            if (item) {
                items.push({ slot: i, item });
            }
        }
    }
    return items;
}

// コンテナ内アイテム復元
function restoreContainerItems(player, block, items) {
    if (!items.length) return;

    server.system.runTimeout(() => {
        const newBlock = server.world.getDimension(player.dimension.id).getBlock(block.location);
        if (newBlock) {
            const newContainer = newBlock.getComponent("inventory")?.container;
            if (newContainer) {
                items.forEach(({ slot, item }) => {
                    newContainer.setItem(slot, item);
                });
            }
        }
    }, 1);
}

// ブロック更新
function handleBlockStateChange(player, block, blockAllStates, currentState, stateValues) {
    const { x, y, z } = block.location;
    const currentValue = blockAllStates[currentState];
    const nextValue = stateValues[(stateValues.indexOf(currentValue) + 1) % stateValues.length];
    const newStates = { ...blockAllStates, [currentState]: nextValue };
    const newStatesString = getBlockStatesString(newStates);

    server.system.run(() => {
        player.runCommand(`setblock ${x} ${y} ${z} ${block.type.id} [${newStatesString}]`);
        player.runCommand(`setblock ${x} ${y} ${z} ${block.type.id} [${getBlockStatesString(blockAllStates)}]`);
    });
}

// モード管理
function getPlayerBlockMode(playerId, blockId) {
    const blockModes = modeMap.get(playerId) || new Map();
    return blockModes.get(blockId) || 0;
}

// モード設定
function setPlayerBlockMode(playerId, blockId, mode) {
    const blockModes = modeMap.get(playerId) || new Map();
    blockModes.set(blockId, mode);
    modeMap.set(playerId, blockModes);
}

// モードサイクル
function cycleMode(currentMode, maxMode, isSneaking) {
    if (isSneaking) {
        return (currentMode - 1) < 0 ? maxMode : currentMode - 1;
    }
    return (currentMode + 1) > maxMode ? 0 : currentMode + 1;
}

// メッセージ送信
function sendMessage(player, translationKey, params = []) {
    const withParams = params.length > 0 ? `,"with":[${params.map(p => `"${p}"`).join(',')}]` : '';
    server.system.run(() => {
        player.runCommand(`titleraw @s actionbar {"rawtext":[{"translate":"${translationKey}"${withParams}}]}`);
    });
}

// ブロック破壊イベント
server.world.beforeEvents.playerBreakBlock.subscribe(ev => {
    if (ev.itemStack?.type?.id !== DEBUG_STICK_ID) return;

    ev.cancel = true;
    const { player, block } = ev;
    const blockId = block.type.id;
    const blockAllStates = block.permutation.getAllStates();
    const filteredStates = getFilteredStates(blockId, blockAllStates);

    if (!checkPermissions(player)) return;

    // コンテナアイテムの保存
    const container = block.getComponent("inventory")?.container;
    const items = saveContainerItems(container);

    // ステート変更処理
    const states = filteredStates.map(([key]) => key);
    const currentState = states[0];
    const stateValues = getStateValues(blockId, currentState);

    if (!stateValues) {
        sendMessage(player, "message.mcx:debug_stick.no.properties", [blockId]);
        return;
    }

    // ブロック更新
    handleBlockStateChange(player, block, blockAllStates, currentState, stateValues);

    restoreContainerItems(player, block, items);

    if (filteredStates.length === 0) return;

    // モードサイクル
    const mode = getPlayerBlockMode(player.id, blockId);
    const maxMode = states.length - 1;
    const newMode = cycleMode(mode, maxMode, player.isSneaking);

    setPlayerBlockMode(player.id, blockId, newMode);

    const newState = states[newMode];
    const newValue = blockAllStates[newState];
    sendMessage(player, "message.mcx:debug_stick.state.mode", [newState, newValue]);
});

// カスタムコンポーネント登録
server.system.beforeEvents.startup.subscribe(ev => {
    ev.itemComponentRegistry.registerCustomComponent(DEBUG_STICK_ID, {
        onUseOn: ({ source, block }) => {
            if (!checkPermissions(source)) return;

            const blockId = block.type.id;
            const blockAllStates = block.permutation.getAllStates();
            const { x, y, z } = block.location;

            const filteredStates = getFilteredStates(blockId, blockAllStates);

            // モード初期化
            const blockModes = modeMap.get(source.id) || new Map();
            const states = filteredStates.map(([key]) => key);

            if (!blockModes.has(blockId)) {
                setPlayerBlockMode(source.id, blockId, 0);
            }

            const mode = getPlayerBlockMode(source.id, blockId);
            const safeMode = Math.max(0, Math.min(mode, states.length - 1));
            const currentState = states[safeMode];
            const stateValues = getStateValues(blockId, currentState);

            if (!stateValues) {
                sendMessage(source, "message.mcx:debug_stick.no.properties", [blockId]);
                return;
            }

            // コンテナ内アイテムを保存する
            const container = block.getComponent("inventory")?.container;
            const items = saveContainerItems(container);

            // ステート値の変更
            const currentValue = blockAllStates[currentState];
            const valueIndex = stateValues.indexOf(currentValue);
            const nextValue = source.isSneaking
                ? stateValues[(valueIndex - 1 + stateValues.length) % stateValues.length]
                : stateValues[(valueIndex + 1) % stateValues.length];

            // // ブロック更新
            const newStates = { ...blockAllStates, [currentState]: nextValue };
            const newStatesString = getBlockStatesString(newStates);
            source.runCommand(`setblock ${x} ${y} ${z} ${blockId} [${newStatesString}]`);

            // コンテナ復元
            restoreContainerItems(source, block, items);

            sendMessage(source, "message.mcx:debug_stick.state.change", [currentState, nextValue]);
        }
    });
});