// 除外する
export const excludedStates = [
    "top_slot_bit", "stone_slab_type", "stone_slab_type_2", "stone_slab_type_3",
    "stone_slab_type_4", "wall_block_type", "wood_type", "sapling_type",
    "old_log_type", "new_log_type", "chisel_type", "color", "coral_color",
    "dirt_type", "flower_type", "double_plant_type", "monster_egg_stone_type",
    "old_leaf_type", "new_leaf_type", "prismarine_block_type", "sand_type", "sand_stone_type",
    "stone_type", "stone_brick_type", "tall_grass_type"
];

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
    "minecraft:anvil": ["direction"],
    "minecraft:chipped_anvil": ["direction"],
    "minecraft:damaged_anvil": ["direction"],
    "minecraft:calibrated_sculk_sensor": ["direction"],
    "minecraft:end_portal_frame": ["direction"],
    "minecraft:big_dripleaf": ["direction"],
    "minecraft:small_dripleaf_block": ["direction"],
    "minecraft:furnace": ["facing_direction"],
    "minecraft:blast_furnace": ["facing_direction"],
    "minecraft:smoker": ["facing_direction"],
    "minecraft:chest": ["facing_direction"],
    "minecraft:trapped_chest": ["facing_direction"],
    "minecraft:ender_chest": ["facing_direction"],
    "minecraft:stonecutter_block": ["facing_direction"],
    "minecraft:amethyst_cluster": ["facing_direction"],
    "minecraft:large_amethyst_bud": ["facing_direction"],
    "minecraft:medium_amethyst_bud": ["facing_direction"],
    "minecraft:small_amethyst_bud": ["facing_direction"]
};