import * as server from "@minecraft/server";
import { ModalFormData } from "@minecraft/server-ui";

export let modeMap = new Map();
export let platform_unused_status = 3;
export let add_unused_states = false;
export let tag_mode = false;

const DP = {
    platform_status: "debug_stick:platform_unused_status",
    unused_states: "debug_stick:add_unused_states",
    tag_mode: "debug_stick:tag_mode"
}

server.world.afterEvents.worldLoad.subscribe(() => {
    server.world.getDynamicProperty(DP.platform_status) !== undefined
        ? platform_unused_status = server.world.getDynamicProperty(DP.platform_status)
        : server.world.setDynamicProperty(DP.platform_status, platform_unused_status);
    server.world.getDynamicProperty(DP.unused_states) !== undefined
        ? add_unused_states = server.world.getDynamicProperty(DP.unused_states)
        : server.world.setDynamicProperty(DP.unused_states, add_unused_states);
    server.world.getDynamicProperty(DP.tag_mode) !== undefined
        ? tag_mode = server.world.getDynamicProperty(DP.tag_mode)
        : server.world.setDynamicProperty(DP.tag_mode, tag_mode);
});

server.system.beforeEvents.startup.subscribe(ev => {
    ev.customCommandRegistry.registerCommand({
        name: "settings:debug_stick",
        description: "Debug Stick Settings",
        permissionLevel: server.CommandPermissionLevel.GameDirectors,
        mandatoryParameters: [],
        optionalParameters: [],
    }, (origin) => {
        const player = origin.sourceEntity;
        if (player?.typeId !== "minecraft:player") {
            return {
                status: server.CustomCommandStatus.Failure,
                message: "commands.generic.malformed.type",
            };
        }
        server.system.run(() => {
            const form = new ModalFormData();
            form.title("settings.mcx:debug_stick.title");
            form.dropdown("settings.mcx:debug_stick.platform", ["settings.mcx:debug_stick.platform.pc", "settings.mcx:debug_stick.platform.mobile",
                "settings.mcx:debug_stick.platform.all"], { defaultValueIndex: platform_unused_status });
            form.toggle("settings.mcx:debug_stick.toggle.states", { defaultValue: add_unused_states });
            form.toggle("settings.mcx:debug_stick.toggle.tag_mode", { defaultValue: tag_mode });

            form.show(player).then(response => {
                if (response.canceled) return;
                platform_unused_status = response.formValues[0];
                add_unused_states = response.formValues[1];
                tag_mode = response.formValues[2];
                if (add_unused_states) {
                    modeMap.clear();
                }
                server.world.setDynamicProperty(DP.platform_status, platform_unused_status);
                server.world.setDynamicProperty(DP.unused_states, add_unused_states);
                server.world.setDynamicProperty(DP.tag_mode, tag_mode);
                player.runCommand(`titleraw @s actionbar {"rawtext":[{"translate":"settings.mcx:debug_stick.updated"}]}`);
            });
        });
    });
});