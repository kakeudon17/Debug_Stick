// 除外する
export const excludedStates = ["top_slot_bit", "stone_slab_type", "stone_slab_type_2", "stone_slab_type_3", "stone_slab_type_4", "wall_block_type", "wood_type", "old_log_type", "new_log_type", "chisel_type", "color"]
// ブロックごとに除外する
export const blockSpecificExclusions = {
    "minecraft:campfire": ["direction"],
    "minecraft:soul_campfire": ["direction"],
    "minecraft:pumpkin": ["direction"],
    "minecraft:carved_pumpkin": ["direction"],
    "minecraft:lit_pumpkin": ["direction"],
    "minecraft:lectern": ["direction"],
    "minecraft:unpowered_repeater": ["direction"],
    "minecraft:powered_repeater": ["direction"],
    "minecraft:unpowered_comparator": ["direction"],
    "minecraft:powered_comparator": ["direction"],
    "minecraft:furnace": ["facing_direction"],
    "minecraft:blast_furnace": ["facing_direction"],
    "minecraft:smoker": ["facing_direction"],
    "minecraft:chest": ["facing_direction"],
    "minecraft:trapped_chest": ["facing_direction"],
    "minecraft:ender_chest": ["facing_direction"],

}