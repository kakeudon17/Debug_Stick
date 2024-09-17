import { world } from "@minecraft/server";
import { ActionFormData } from "@minecraft/server-ui";

world.beforeEvents.worldInitialize.subscribe(({ itemComponentRegistry }) => {
    itemComponentRegistry.registerCustomComponent("edit:gamemode", {
        onUse: async ({ source }) => {
            if (source) {
                const form = new ActionFormData()
                    .title("ゲームモード切り替え")
                    .body("ゲームモードを選んでください")
                    .button("サバイバルモード")
                    .button("アドベンチャーモード")
                    .button("クリエイティブモード")
                    .button("スペクテイターモード");

                const response = await form.show(source);

                if (response.selection === 0) {
                    source.runCommand("gamemode survival");
                } else if (response.selection === 1) {
                    source.runCommand("gamemode adventure");
                } else if (response.selection === 2) {
                    source.runCommand("gamemode creative");
                } else if (response.selection === 3) {
                    source.runCommand("gamemode spectator");
                }
            }
        }
    });
});
