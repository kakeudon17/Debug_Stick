import { world } from "@minecraft/server";

let playerCounts = new Map();

world.beforeEvents.worldInitialize.subscribe(({ itemComponentRegistry }) => {
    itemComponentRegistry.registerCustomComponent("edit:mode",
        {
            onUse({ source }) {

                let count = playerCounts.get(source.nameTag) || 0;

                count++;
                if (count > 3) {
                    count = 0;
                }

                playerCounts.set(source.nameTag, count);
                switch (count) {
                    case 0:
                        source.sendMessage(`座標&ブロックID`)
                        break;
                    default:
                        source.sendMessage(`存在しない数値 ${count}`)
                        break;
                }
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
                    const blockId = block.type.id;

                    let count = playerCounts.get(source.nameTag) || 0;

                    switch (count) {
                        case 0:
                            source.runCommand(`tellraw @s {"rawtext":[{"text":"§cX§r:${x} §aY§r:${y} §9Z§r:${z}\n${blockId}"}]}`);
                            break;
                        default:
                            source.sendMessage(`コマンドが存在しません`)
                            break;
                    }
                }
            },
        }
    );
});
