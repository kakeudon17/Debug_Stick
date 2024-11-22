# Minecraftブロックのステータス一覧

## 方向/位置関連
- [x] weirdo_direction
- [x] direction
- [x] facing_direction
- [x] minecraft:cardinal_direction
- [x] orientation
- [x] minecraft:vertical_half
- [x] upside_down_bit
- [x] hanging_bit
- [x] minecraft:block_face
- [x] pillar_axis (原木や柱用の軸方向)
- [x] torch_facing_direction (松明の向き)
- [x] ground_sign_direction (看板の向き)
- [x] vine_direction_bits (つたの方向)
- [x] multi_face_direction_bits (苔やヴェインの方向)

## レッドストーン/機構関連
- [x] triggered_bit
- [x] powered_bit
- [x] repeater_delay
- [x] output_subtract_bit
- [x] redstone_signal
- [x] button_pressd_bit
- [x] rail_direction
- [x] rail_data_bit
- [x] lever_direction
- [x] toggle_bit (ホッパーなどの状態)
- [x] allow_underwater_bit (TNTの水中爆発許可)
- [x] explode_bit (TNTの爆発状態)
- [x] open_bit (ドアやトラップドアの開閉状態)

## 壁/接続関連
- [x] in_wall_bit
- [x] wall_connection_type_east
- [x] wall_connection_type_north
- [x] wall_connection_type_south
- [x] wall_connection_type_west
- [x] wall_post_bit
- [x] attachment
- [x] attached_bit
- [x] big_dripleaf_tilt (大きなドリップリーフの傾き)
- [x] big_dripleaf_head (大きなドリップリーフの頭部)
- [x] upper_block_bit (2ブロック分の高さを持つブロックの上部)

## 成長/年齢関連
- [ ] age_bit
- [ ] growth
- [ ] growing_plant_age
- [ ] propagule_stage
- [ ] weeping_vines_age
- [ ] twisting_vines_age
- [ ] bamboo_stalk_thickness
- [ ] bamboo_leaf_size
- [ ] growing_plant_age (洞窟のツタなどの成長段階)

## 液体/充填レベル関連
- [ ] cauldron_liquid
- [ ] composter_full_level
- [ ] honey_level
- [ ] moisturized_amount
- [ ] respawn_anchor_charge
- [ ] full_level (大釜の液体レベル)

## 特殊ブロック状態
- [x] candle_count
- [ ] candles
- [ ] books_stored
- [x] extinguished_bit
- [x] lit
- [x] dead_bit
- [ ] persistent_bit
- [ ] covered_bit
- [ ] dripstone_thickness
- [ ] end_portal_eye_bit
- [ ] hanging (吊るされた状態)
- [ ] brushed_progress (ブラシで掘られた進行度)

## スポナー/イベント関連
- [ ] trial_spawner_state
- [ ] ominous
- [ ] vault_state
- [ ] active
- [ ] can_summon
- [ ] skulk_sensor_phase
- [ ] skulk_sensor_phase (スカルクセンサーのフェーズ)
- [ ] can_summon (スカルクの召喚可能状態)

## その他の状態
- [x] stability
- [x] stability_check
- [ ] update_bit
- [ ] bloom
- [ ] brushed_progress
- [x] crafting
- [ ] height

## アイテムフレーム関連
- [ ] item_frame_map_bit
- [ ] item_frame_photo_bit

## メモ
特定のブロックの最大age値：
- [ ] サボテン: 15
- [ ] コーラスフラワー: 5
- [ ] カカオ豆: 2