import * as server from "@minecraft/server";
import { ActionFormData, MessageFormData, ModalFormData } from "@minecraft/server-ui";

export let modeMap = new Map();
export let platform_unused_status = 2;
export let add_unused_states = false;
export let tag_mode = false;
export let addon = [];

const DP = {
    platform_status: "debug_stick:platform_unused_status",
    unused_states: "debug_stick:add_unused_states",
    tag_mode: "debug_stick:tag_mode",
    addon: "debug_stick:addon"
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
    server.world.getDynamicProperty(DP.addon) !== undefined
        ? addon = JSON.parse(server.world.getDynamicProperty(DP.addon))
        : server.world.setDynamicProperty(DP.addon, JSON.stringify(addon));
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
            const top_form = new ActionFormData();
            top_form.title("settings.mcx:debug_stick.title");
            top_form.button("settings.mcx:debug_stick.select.settings");
            top_form.button("settings.mcx:debug_stick.select.config");

            top_form.show(player).then(response => {
                if (response.canceled) return;
                switch (response.selection) {
                    case 0: {
                        const settings_form = new ModalFormData();
                        settings_form.title("settings.mcx:debug_stick.title");
                        settings_form.dropdown("settings.mcx:debug_stick.platform", ["settings.mcx:debug_stick.platform.pc", "settings.mcx:debug_stick.platform.mobile",
                            "settings.mcx:debug_stick.platform.all"], { defaultValueIndex: platform_unused_status });
                        settings_form.toggle("settings.mcx:debug_stick.toggle.states", { defaultValue: add_unused_states });
                        settings_form.toggle("settings.mcx:debug_stick.toggle.tag_mode", { defaultValue: tag_mode });

                        settings_form.show(player).then(response => {
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
                        });
                        break;
                    }
                    case 1: {
                        const config_form = new ActionFormData();
                        config_form.title("config.mcx:debug_stick.title");
                        config_form.body("config.mcx:debug_stick.body");
                        config_form.button("config.mcx:debug_stick.add");
                        const addonKeys = Object.keys(addon);
                        for (let i = 0; i < addonKeys.length; i++) {
                            config_form.button(addon[i]);
                        }

                        config_form.show(player).then(response => {
                            if (response.canceled) return;
                            switch (response.selection) {
                                case 0: {
                                    const config_add_form = new ModalFormData();
                                    config_add_form.title("config.mcx:debug_stick.add.title");
                                    config_add_form.textField("config.mcx:debug_stick.add.input", "");

                                    config_add_form.show(player).then(response => {
                                        if (response.canceled) return;
                                        const input = response.formValues[0].trim();
                                        if (input != "") {
                                            addon = server.world.getDynamicProperty(DP.addon)
                                                ? JSON.parse(server.world.getDynamicProperty(DP.addon))
                                                : addon;
                                            if (!Array.isArray(addon)) addon = [];
                                            addon.push(input);
                                            server.world.setDynamicProperty(DP.addon, JSON.stringify(addon));
                                        }
                                    });
                                    break;
                                }
                                case response.selection: {
                                    const delete_form = new MessageFormData();
                                    const addon_num = response.selection - 1
                                    delete_form.title("config.mcx:debug_stick.delete.title");
                                    delete_form.body({ rawtext: [{ translate: "config.mcx:debug_stick.delete.body", with: [addon[addon_num]] }] });
                                    delete_form.button1("config.mcx:debug_stick.delete.confirm");
                                    delete_form.button2("config.mcx:debug_stick.delete.cancel");
                                    delete_form.show(player).then(response => {
                                        if (response.canceled) return;
                                        if (!response.selection[undefined]) {
                                            addon = server.world.getDynamicProperty(DP.addon)
                                                ? JSON.parse(server.world.getDynamicProperty(DP.addon))
                                                : addon;
                                            addon = server.world.getDynamicProperty(DP.addon)
                                                ? JSON.parse(server.world.getDynamicProperty(DP.addon))
                                                : addon;
                                            if (!Array.isArray(addon)) addon = [];
                                            addon = server.world.getDynamicProperty(DP.addon)
                                                ? JSON.parse(server.world.getDynamicProperty(DP.addon))
                                                : addon;
                                            if (!Array.isArray(addon)) addon = [];

                                            if (addon_num >= 0 && addon_num < addon.length) {
                                                addon.splice(addon_num, 1);
                                                server.world.setDynamicProperty(DP.addon, JSON.stringify(addon));
                                            }

                                        }
                                    });
                                    break;
                                }
                            }
                        });
                        break;
                    }
                }
            });
        });
    });
});