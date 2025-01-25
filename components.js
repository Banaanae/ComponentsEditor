function build_lore(components) {
    let span = addComponent('lore')

    const loreItalics = document.createElement('input')
    loreItalics.type = 'checkbox'
    span.appendChild(loreItalics)

    const loreColour = document.createElement('input')
    loreColour.type = 'text'
    span.appendChild(loreColour)
    // TODO: +/- Line
    components.appendChild(span)
}

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
                if (arr[i] !== "")
                    component += ',color:' + arr[i]
                component += '}\','
            }
        }
    }
    return component.replace(/,$/, ']')
}

function build_map_color(components) {
    span = document.createElement('span')
    span.id = 'map_color'

    // TODO: Use this checkbox

    const h3 = document.createElement('h3')
    h3.innerText = 'map_color: '
    span.appendChild(h3)

    const map_color = document.createElement('input')
    map_color.type = 'color'
    span.appendChild(map_color)

    components.appendChild(span)
}

function map_color(arr) {
    return `map_color=${arr[0]}`
}

function build_rarity(components) {
    span = document.createElement('span')
    span.id = 'rarity'

    // TODO: Use this checkbox

    const h3 = document.createElement('h3')
    h3.innerText = 'rarity: '
    span.appendChild(h3)

    span.appendChild(buildSelect(['Common', 'Uncommon', 'Rare', 'Epic']))

    components.appendChild(span)
}

function rarity(arr) {
    return `rarity=${arr[0].toLowerCase()}`
}