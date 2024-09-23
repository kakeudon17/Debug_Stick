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

                switch (response.selection) {
                    case 0:
                        source.runCommand("gamemode survival");
                        break;
                    case 1:
                        source.runCommand("gamemode adventure");
                        break;
                    case 2:
                        source.runCommand("gamemode creative");
                        break;
                    case 3:
                        source.runCommand("gamemode spectator");
                        break;
                    default:
                        break; // 何もしない
                }
            }
        }
    });
});
