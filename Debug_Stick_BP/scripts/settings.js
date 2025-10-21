import * as server from "@minecraft/server";
import { ModalFormData } from "@minecraft/server-ui";
import { excludedStates, blockSpecificExclusions } from "./excluded_states.js";

export let add_unused_states = false;
export let modeMap = new Map();

server.system.beforeEvents.startup.subscribe(ev => {
    ev.customCommandRegistry.registerCommand({
        name: "settings:debug_stick",
        description: "debug_stick.settings.title",
        permissionLevel: server.CommandPermissionLevel.Admin,
        mandatoryParameters: [],
        optionalParameters: [],
    }, (origin) => {
        const player = origin.sourceEntity
        server.system.run(() => {
            const form = new ModalFormData();
            form.title("debug_stick.settings.title");
            form.toggle("debug_stick.settings.toggle.states", { defaultValue: add_unused_states });

            form.show(player).then(response => {
                if (response.canceled) return;
                add_unused_states = response.formValues[0];
                if (add_unused_states) {
                    modeMap.clear(excludedStates, blockSpecificExclusions);
                }

                player.runCommand(`titleraw @s actionbar {"rawtext":[{"translate":"debug_stick.settings.toggle.states"},{"translate":"debug_stick.settings.updated","with":["${add_unused_states}"]}]}`);
            });
        });
    });
});