switch (mode) {
    case 0:
        if (blockStatesObject.includes('"direction"=0')) {
            const direction = blockStatesObject.replace('"direction"=0', '"direction"=1')
            source.runCommand(`setblock ${x} ${y} ${z} [${direction}]`)
            source.runCommand(`${title} {"rawtext":[{"translate":"pack.change.trapdoor.west"}]}`)
        }
        else if (blockStatesObject.includes('"direction"=1')) {
            const direction = blockStatesObject.replace('"direction"=1', '"direction"=2')
            source.runCommand(`setblock ${x} ${y} ${z} [${direction}]`)
            source.runCommand(`${title} {"rawtext":[{"translate":"pack.change.trapdoor.south"}]}`)
        }
        else if (blockStatesObject.includes('"direction"=2')) {
            const direction = blockStatesObject.replace('"direction"=2', '"direction"=3')
            source.runCommand(`setblock ${x} ${y} ${z} [${direction}]`)
            source.runCommand(`${title} {"rawtext":[{"translate":"pack.change.trapdoor.north"}]}`)
        }
        else if (blockStatesObject.includes('"direction"=3')) {
            const direction = blockStatesObject.replace('"direction"=3', '"direction"=0')
            source.runCommand(`setblock ${x} ${y} ${z} [${direction}]`)
            source.runCommand(`${title} {"rawtext":[{"translate":"pack.change.trapdoor.east"}]}`)
        }
        break;
    case 1:
        if (blockStatesObject.includes('"open_bit"=false')) {
            const direction = blockStatesObject.replace('"open_bit"=false', '"open_bit"=true')
            source.runCommand(`setblock ${x} ${y} ${z} [${direction}]`)
            source.runCommand(`${title} {"rawtext":[{"translate":"pack.change.trapdoor.open_false"}]}`)
        }
        else if (blockStatesObject.includes('"open_bit"=true')) {
            const direction = blockStatesObject.replace('"open_bit"=true', '"open_bit"=false')
            source.runCommand(`setblock ${x} ${y} ${z} [${direction}]`)
            source.runCommand(`${title} {"rawtext":[{"translate":"pack.change.trapdoor.open_true"}]}`)
        }
        break;
    case 2:
        if (blockStatesObject.includes('"upside_down_bit"=false')) {
            const bit = blockStatesObject.replace('"upside_down_bit"=false', '"upside_down_bit"=true')
            source.runCommand(`setblock ${x} ${y} ${z} [${bit}]`)
            source.runCommand(`${title} {"rawtext":[{"translate":"pack.change.trapdoor.up"}]}`)
        }
        else if (blockStatesObject.includes('"upside_down_bit"=true')) {
            const bit = blockStatesObject.replace('"upside_down_bit"=true', '"upside_down_bit"=false')
            source.runCommand(`setblock ${x} ${y} ${z} [${bit}]`)
            source.runCommand(`${title} {"rawtext":[{"translate":"pack.change.trapdoor.down"}]}`)
        }
        break;
}