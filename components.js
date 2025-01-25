function lore(arr) {
    let component = "lore=[";
    for (let i = 0; i < arr.length; i++) {
        switch (i % 3) {
            case 0: { // Text
                component += '\'{text:"' + arr[i] + '"'
                break
            }
            case 1: { // Italic
                if (arr[i] === 'true')
                    break
                component += ',italic:false'
                break
            }
            case 2: { // Colour
                component += ',color:' + arr[i] + '}\','
            }
        }
    }
    return component.replace(/,$/, ']')
}

