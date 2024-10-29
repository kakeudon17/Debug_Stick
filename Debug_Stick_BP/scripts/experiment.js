import { world } from "@minecraft/server";

world.beforeEvents.worldInitialize.subscribe(({ itemComponentRegistry }) => {
    itemComponentRegistry.registerCustomComponent("mc:experiment", {
        onUseOn({ source, block }) {
            const blockId = block.typeId;
            const blockStates = block.permutation.getAllStates()
            const blockStatesObject = `[${Object.entries(blockStates)
                .map(([key, value]) => {
                    return `"${key}"=${(typeof value === 'boolean' || typeof value === 'number') ? value : `"${value}"`}`;
                })
                .join(",")}]`;

            source.sendMessage(`${blockId}\n${blockStatesObject}`)
        }
    });
});