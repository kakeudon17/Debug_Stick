import { world } from "@minecraft/server";
import { ActionFormData } from "@minecraft/server-ui";

let playerCounts = new Map();

world.beforeEvents.worldInitialize.subscribe(({ itemComponentRegistry }) => {
    itemComponentRegistry.registerCustomComponent("edit:mode",
        {
            onUse({ source }) {

                let form = new ActionFormData()
                    .title("モード選択")
                    .body("操作したいモードを選択してください")
                    .button("座標&ブロックID")
                    .button("test-0")
                    .show(source)
                    .then((response) => {
                        if (response.canceled) return;

                        let count = response.selection;
                        playerCounts.set(source.nameTag, count);

                        switch (count) {
                            case 0:
                                source.sendMessage(`座標&ブロックID`);
                                break;
                            case 1:
                                source.sendMessage(`test-0-top-false`);
                                break;
                            default:
                                source.sendMessage(`存在しない選択肢 "${count}"`);
                                source.runCommand(`playsound note.bass @s ~~~ 0.5`);
                                break;
                        }
                    });
            },
        }
    );
});

world.beforeEvents.worldInitialize.subscribe(({ itemComponentRegistry }) => {
    itemComponentRegistry.registerCustomComponent("edit:experiment",
        {
            onUseOn({ source, block }) {
                if (block) {
                    const blockLocation = block.location;
                    const { x, y, z } = blockLocation;
                    const blockId = block.typeId;

                    let count = playerCounts.get(source.nameTag) || 0;

                    switch (count) {
                        case 0:
                            source.runCommand(`tellraw @s {"rawtext":[{"text":"§cX§r:${x} §aY§r:${y} §9Z§r:${z}\n${blockId}"}]}`)
                            break;
                        case 1:
                            if (blockId.includes("test")) {
                                //text
                            }
                            else {
                                source.runCommand(`titleraw @s actionbar {"rawtext":[{"text":"対象外\n§c${blockId}"}]}`)
                                source.runCommand(`playsound note.bass @s ~~~ 0.5`)
                            }
                            break;
                        default:
                            source.sendMessage(`コマンドが存在しません`)
                            source.runCommand(`playsound note.bass @s ~~~ 0.5`)
                            break;
                    }
                }
            },
        }
});
