import * as setver from '@minecraft/server';

// OPがTagでしか判別できない。
function checkPermissions(player) {
    return player.hasTag("op") && player.getGameMode() === "Creative";
}

setver.world.beforeEvents.playerBreakBlock.subscribe(ev => {
    const player = ev.player;
    const block = ev.block;

    if (ev.itemStack.typeId === "mc:debug_stick") {
        ev.cancel = true;
        if (checkPermissions(player)) {
            player.sendMessage(`${block.typeId} ${player.getGameMode()}`);
        }
    }
});

setver.system.beforeEvents.startup.subscribe(ev => {
    ev.itemComponentRegistry.registerCustomComponent("mc:debug_stick", {
        onUseOn: ({ source, block }) => {
            source.sendMessage(`${block.typeId}`);
        },
    });
});