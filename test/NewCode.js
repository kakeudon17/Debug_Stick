if (blockId.includes("stairs")) {
    //階段ブロック
    source.runCommand(`execute if block ${x} ${y} ${z} ${blockId} ["weirdo_direction"=0,"upside_down_bit"=false] run setblock ${x} ${y} ${z} ${blockId} ["weirdo_direction"=0,"upside_down_bit"=false]`)
    source.runCommand(`execute if block ${x} ${y} ${z} ${blockId} ["weirdo_direction"=0,"upside_down_bit"=true] run setblock ${x} ${y} ${z} ${blockId} ["weirdo_direction"=0,"upside_down_bit"=true]`)
    source.runCommand(`execute if block ${x} ${y} ${z} ${blockId} ["weirdo_direction"=1,"upside_down_bit"=false] run setblock ${x} ${y} ${z} ${blockId} ["weirdo_direction"=0,"upside_down_bit"=false]`)
    source.runCommand(`execute if block ${x} ${y} ${z} ${blockId} ["weirdo_direction"=1,"upside_down_bit"=true] run setblock ${x} ${y} ${z} ${blockId} ["weirdo_direction"=0,"upside_down_bit"=true]`)
    source.runCommand(`execute if block ${x} ${y} ${z} ${blockId} ["weirdo_direction"=2,"upside_down_bit"=false] run setblock ${x} ${y} ${z} ${blockId} ["weirdo_direction"=0,"upside_down_bit"=false]`)
    source.runCommand(`execute if block ${x} ${y} ${z} ${blockId} ["weirdo_direction"=2,"upside_down_bit"=true] run setblock ${x} ${y} ${z} ${blockId} ["weirdo_direction"=0,"upside_down_bit"=true]`)
    source.runCommand(`execute if block ${x} ${y} ${z} ${blockId} ["weirdo_direction"=3,"upside_down_bit"=false] run setblock ${x} ${y} ${z} ${blockId} ["weirdo_direction"=0,"upside_down_bit"=false]`)
    source.runCommand(`execute if block ${x} ${y} ${z} ${blockId} ["weirdo_direction"=3,"upside_down_bit"=true] run setblock ${x} ${y} ${z} ${blockId} ["weirdo_direction"=0,"upside_down_bit"=true]`)
    source.runCommand(`playsound random.levelup @s ~ ~ ~ 0.5`)
}
else if (blockId.includes("slab")) {
    //ハーフブロック
    source.runCommand(`execute if block ${x} ${y} ${z} ${blockId} ["minecraft:vertical_half"="top"] run setblock ${x} ${y} ${z} ${blockId} ["minecraft:vertical_half"="top"]`)
    source.runCommand(`execute if block ${x} ${y} ${z} ${blockId} ["minecraft:vertical_half"="bottom"] run setblock ${x} ${y} ${z} ${blockId} ["minecraft:vertical_half"="top"]`)
    source.runCommand(`playsound random.levelup @s ~ ~ ~ 0.5`)
}
else if (blockId.includes("trapdoor")) {
    //トラップドア
    source.runCommand(`execute if block ${x} ${y} ${z} ${blockId} ["direction"=0,"open_bit"=false,"upside_down_bit"=false] run setblock ${x} ${y} ${z} ${blockId} ["direction"=0,"open_bit"=false,"upside_down_bit"=false]`)
    source.runCommand(`execute if block ${x} ${y} ${z} ${blockId} ["direction"=0,"open_bit"=true,"upside_down_bit"=false] run setblock ${x} ${y} ${z} ${blockId} ["direction"=0,"open_bit"=true,"upside_down_bit"=false]`)
    source.runCommand(`execute if block ${x} ${y} ${z} ${blockId} ["direction"=0,"open_bit"=true,"upside_down_bit"=true] run setblock ${x} ${y} ${z} ${blockId} ["direction"=0,"open_bit"=true,"upside_down_bit"=true]`)
    source.runCommand(`execute if block ${x} ${y} ${z} ${blockId} ["direction"=1,"open_bit"=false,"upside_down_bit"=false] run setblock ${x} ${y} ${z} ${blockId} ["direction"=0,"open_bit"=false,"upside_down_bit"=false]`)
    source.runCommand(`execute if block ${x} ${y} ${z} ${blockId} ["direction"=1,"open_bit"=true,"upside_down_bit"=false] run setblock ${x} ${y} ${z} ${blockId} ["direction"=0,"open_bit"=true,"upside_down_bit"=false]`)
    source.runCommand(`execute if block ${x} ${y} ${z} ${blockId} ["direction"=1,"open_bit"=true,"upside_down_bit"=true] run setblock ${x} ${y} ${z} ${blockId} ["direction"=0,"open_bit"=true,"upside_down_bit"=true]`)
    source.runCommand(`execute if block ${x} ${y} ${z} ${blockId} ["direction"=2,"open_bit"=false,"upside_down_bit"=false] run setblock ${x} ${y} ${z} ${blockId} ["direction"=0,"open_bit"=false,"upside_down_bit"=false]`)
    source.runCommand(`execute if block ${x} ${y} ${z} ${blockId} ["direction"=2,"open_bit"=true,"upside_down_bit"=false] run setblock ${x} ${y} ${z} ${blockId} ["direction"=0,"open_bit"=true,"upside_down_bit"=false]`)
    source.runCommand(`execute if block ${x} ${y} ${z} ${blockId} ["direction"=2,"open_bit"=true,"upside_down_bit"=true] run setblock ${x} ${y} ${z} ${blockId} ["direction"=0,"open_bit"=true,"upside_down_bit"=true]`)
    source.runCommand(`execute if block ${x} ${y} ${z} ${blockId} ["direction"=3,"open_bit"=false,"upside_down_bit"=false] run setblock ${x} ${y} ${z} ${blockId} ["direction"=0,"open_bit"=false,"upside_down_bit"=false]`)
    source.runCommand(`execute if block ${x} ${y} ${z} ${blockId} ["direction"=3,"open_bit"=true,"upside_down_bit"=false] run setblock ${x} ${y} ${z} ${blockId} ["direction"=0,"open_bit"=true,"upside_down_bit"=false]`)
    source.runCommand(`execute if block ${x} ${y} ${z} ${blockId} ["direction"=3,"open_bit"=true,"upside_down_bit"=true] run setblock ${x} ${y} ${z} ${blockId} ["direction"=0,"open_bit"=true,"upside_down_bit"=true]`)
    source.runCommand(`playsound random.levelup @s ~ ~ ~ 0.5`)
}
else if (blockId.includes("fence_gate")) {
    //フェンスゲート
    source.runCommand(`execute if block ${x} ${y} ${z} ${blockId} ["direction"=0,"open_bit"=false] run setblock ${x} ${y} ${z} ${blockId} ["direction"=0,"open_bit"=false]`)
    source.runCommand(`execute if block ${x} ${y} ${z} ${blockId} ["direction"=0,"open_bit"=true] run setblock ${x} ${y} ${z} ${blockId} ["direction"=0,"open_bit"=true]`)
    source.runCommand(`execute if block ${x} ${y} ${z} ${blockId} ["direction"=1,"open_bit"=false] run setblock ${x} ${y} ${z} ${blockId} ["direction"=0,"open_bit"=false]`)
    source.runCommand(`execute if block ${x} ${y} ${z} ${blockId} ["direction"=1,"open_bit"=true] run setblock ${x} ${y} ${z} ${blockId} ["direction"=0,"open_bit"=true]`)
    source.runCommand(`execute if block ${x} ${y} ${z} ${blockId} ["direction"=2,"open_bit"=false] run setblock ${x} ${y} ${z} ${blockId} ["direction"=0,"open_bit"=false]`)
    source.runCommand(`execute if block ${x} ${y} ${z} ${blockId} ["direction"=2,"open_bit"=true] run setblock ${x} ${y} ${z} ${blockId} ["direction"=0,"open_bit"=true]`)
    source.runCommand(`execute if block ${x} ${y} ${z} ${blockId} ["direction"=3,"open_bit"=false] run setblock ${x} ${y} ${z} ${blockId} ["direction"=0,"open_bit"=false]`)
    source.runCommand(`execute if block ${x} ${y} ${z} ${blockId} ["direction"=3,"open_bit"=true] run setblock ${x} ${y} ${z} ${blockId} ["direction"=0,"open_bit"=true]`)
    source.runCommand(`playsound random.levelup @s ~ ~ ~ 0.5`)
}
else if (blockId.includes("button")) {
    //ボタン
    source.runCommand(`execute if block ${x} ${y} ${z} ${blockId} ["facing_direction"=0,"button_pressed_bit"=false] run setblock ${x} ${y} ${z} ${blockId} ["facing_direction"=0,"button_pressed_bit"=false]`)
    source.runCommand(`execute if block ${x} ${y} ${z} ${blockId} ["facing_direction"=0,"button_pressed_bit"=true] run setblock ${x} ${y} ${z} ${blockId} ["facing_direction"=0,"button_pressed_bit"=true]`)
    source.runCommand(`execute if block ${x} ${y} ${z} ${blockId} ["facing_direction"=1,"button_pressed_bit"=false] run setblock ${x} ${y} ${z} ${blockId} ["facing_direction"=0,"button_pressed_bit"=false]`)
    source.runCommand(`execute if block ${x} ${y} ${z} ${blockId} ["facing_direction"=1,"button_pressed_bit"=true] run setblock ${x} ${y} ${z} ${blockId} ["facing_direction"=0,"button_pressed_bit"=true]`)
    source.runCommand(`execute if block ${x} ${y} ${z} ${blockId} ["facing_direction"=2,"button_pressed_bit"=false] run setblock ${x} ${y} ${z} ${blockId} ["facing_direction"=0,"button_pressed_bit"=false]`)
    source.runCommand(`execute if block ${x} ${y} ${z} ${blockId} ["facing_direction"=2,"button_pressed_bit"=true] run setblock ${x} ${y} ${z} ${blockId} ["facing_direction"=0,"button_pressed_bit"=true]`)
    source.runCommand(`execute if block ${x} ${y} ${z} ${blockId} ["facing_direction"=3,"button_pressed_bit"=false] run setblock ${x} ${y} ${z} ${blockId} ["facing_direction"=0,"button_pressed_bit"=false]`)
    source.runCommand(`execute if block ${x} ${y} ${z} ${blockId} ["facing_direction"=3,"button_pressed_bit"=true] run setblock ${x} ${y} ${z} ${blockId} ["facing_direction"=0,"button_pressed_bit"=true]`)
    source.runCommand(`execute if block ${x} ${y} ${z} ${blockId} ["facing_direction"=4,"button_pressed_bit"=false] run setblock ${x} ${y} ${z} ${blockId} ["facing_direction"=0,"button_pressed_bit"=false]`)
    source.runCommand(`execute if block ${x} ${y} ${z} ${blockId} ["facing_direction"=4,"button_pressed_bit"=true] run setblock ${x} ${y} ${z} ${blockId} ["facing_direction"=0,"button_pressed_bit"=true]`)
    source.runCommand(`execute if block ${x} ${y} ${z} ${blockId} ["facing_direction"=5,"button_pressed_bit"=false] run setblock ${x} ${y} ${z} ${blockId} ["facing_direction"=0,"button_pressed_bit"=false]`)
    source.runCommand(`execute if block ${x} ${y} ${z} ${blockId} ["facing_direction"=5,"button_pressed_bit"=true] run setblock ${x} ${y} ${z} ${blockId} ["facing_direction"=0,"button_pressed_bit"=true]`)
    source.runCommand(`playsound random.levelup @s ~ ~ ~ 0.5`)
}
else if (blockId.includes("amethyst")) {
    //アメジスト
    source.runCommand(`execute if block ${x} ${y} ${z} ${blockId} ["minecraft:block_face"="up"] run setblock ${x} ${y} ${z} ${blockId} ["minecraft:block_face"="up"]`)
    source.runCommand(`execute if block ${x} ${y} ${z} ${blockId} ["minecraft:block_face"="down"] run setblock ${x} ${y} ${z} ${blockId} ["minecraft:block_face"="up"]`)
    source.runCommand(`execute if block ${x} ${y} ${z} ${blockId} ["minecraft:block_face"="north"] run setblock ${x} ${y} ${z} ${blockId} ["minecraft:block_face"="up"]`)
    source.runCommand(`execute if block ${x} ${y} ${z} ${blockId} ["minecraft:block_face"="south"] run setblock ${x} ${y} ${z} ${blockId} ["minecraft:block_face"="up"]`)
    source.runCommand(`execute if block ${x} ${y} ${z} ${blockId} ["minecraft:block_face"="east"] run setblock ${x} ${y} ${z} ${blockId} ["minecraft:block_face"="up"]`)
    source.runCommand(`execute if block ${x} ${y} ${z} ${blockId} ["minecraft:block_face"="west"] run setblock ${x} ${y} ${z} ${blockId} ["minecraft:block_face"="up"]`)
    source.runCommand(`playsound random.levelup @s ~ ~ ~ 0.5`)
}
else if (blockId.includes("piston") || blockId.includes("end_rod") || blockId.includes("lightning_rod")) {
    //ピストン｜エンドロッド｜避雷針
    source.runCommand(`execute if block ${x} ${y} ${z} ${blockId} ["facing_direction"=0] run setblock ${x} ${y} ${z} ${blockId} ["facing_direction"=0]`)
    source.runCommand(`execute if block ${x} ${y} ${z} ${blockId} ["facing_direction"=1] run setblock ${x} ${y} ${z} ${blockId} ["facing_direction"=0]`)
    source.runCommand(`execute if block ${x} ${y} ${z} ${blockId} ["facing_direction"=2] run setblock ${x} ${y} ${z} ${blockId} ["facing_direction"=0]`)
    source.runCommand(`execute if block ${x} ${y} ${z} ${blockId} ["facing_direction"=3] run setblock ${x} ${y} ${z} ${blockId} ["facing_direction"=0]`)
    source.runCommand(`execute if block ${x} ${y} ${z} ${blockId} ["facing_direction"=4] run setblock ${x} ${y} ${z} ${blockId} ["facing_direction"=0]`)
    source.runCommand(`execute if block ${x} ${y} ${z} ${blockId} ["facing_direction"=5] run setblock ${x} ${y} ${z} ${blockId} ["facing_direction"=0]`)
    source.runCommand(`playsound random.levelup @s ~ ~ ~ 0.5`)
}