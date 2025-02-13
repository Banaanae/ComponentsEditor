const universal = ['custom_name', 'damage', 'glider', 'item_model', 'jukebox_playable', 'lore', 'max_damage', 'max_stack_size', 'rarity', 'unbreakable'];

function build_custom_name(components) {
    let span = addComponent('custom_name', 'text')
    
    const nameColour = document.createElement('input')
    nameColour.type = 'text'
    span.appendChild(nameColour)

    const nameItalics = document.createElement('input')
    nameItalics.type = 'checkbox'
    span.appendChild(nameItalics)

    components.appendChild(span)
}

function custom_name(arr) {
    let component = "custom_name=";
    component += '\'{text:"' + arr[0] + '"'
    
    if (arr[1] !== "")
        component += ',color:"' + arr[1] + '"'
    
    if (arr[2] !== 'true')
        component += ',italic:false'
    component += '}\''

    return component
}

function build_damage(components) {
    let span = addComponent('damage', 'number')

    components.appendChild(span)
}

function damage(arr) {
    return `damage=${arr[0]}`
}

function build_glider(components) {
    let span = addComponent('glider', '') // TODO: Remove ": "

    components.appendChild(span)
}

function glider(arr) {
    if (arr[0] === 'true')
        return 'glider={}'
    return ''
}

function build_item_model(components) {
    let span = addComponent('item_model', 'text')

    components.appendChild(span)
}

function item_model(arr) {
    return `item_model="${arr[0]}"`
}

function build_jukebox_playable(components) {
    let span = addComponent('jukebox_playable', 'text')

    components.appendChild(span)
}

function jukebox_playable(arr) {
    return `jukebox_playable="${arr[0]}"`
}

function build_lore(components) {
    let span = addComponent('lore', 'text')

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
    let span = addComponent('map_color', 'color')

    components.appendChild(span)
}

function map_color(arr) {
    return `map_color=${arr[0]}`
}

function build_map_id(components) {
    let span = addComponent('map_id', 'number')

    components.appendChild(span)
}

function map_id(arr) {
    return `map_id=${arr[0]}`
}

function build_max_damage(components) {
    let span = addComponent('max_damage', 'number')

    components.appendChild(span)
}

function max_damage(arr) {
    return `max_damage=${arr[0]}`
}

function build_max_stack_size(components) {
    let span = addComponent('max_stack_size', 'number')

    components.appendChild(span)
}

function max_stack_size(arr) {
    return `max_stack_size=${arr[0]}`
}

function build_ominous_bottle_amplifier(components) {
    let span = addComponent('ominous_bottle_amplifier', 'number')

    span.children[2].min = 0
    span.children[2].max = 4

    components.appendChild(span)
}

function ominous_bottle_amplifier(arr) {
    return `ominous_bottle_amplifier=${arr[0]}`
}

function build_rarity(components) {
    let span = document.createElement('span')
    span.id = 'rarity'

    const useCheck = document.createElement('input')
    useCheck.type = 'checkbox'
    span.appendChild(useCheck)

    const h3 = document.createElement('h3')
    const a = document.createElement('a')
    a.href = 'https://minecraft.wiki/w/Data_component_format#rarity'
    a.innerText = 'rarity'
    h3.appendChild(a)
    h3.innerHTML += ': '
    span.appendChild(h3)

    span.appendChild(buildSelect(['Common', 'Uncommon', 'Rare', 'Epic']))

    components.appendChild(span)
}

function rarity(arr) {
    return `rarity=${arr[0].toLowerCase()}`
}

function build_recipes(components) {
    let span = addComponent('recipes', 'text')
    span.id = ''

    let wrapper = document.createElement('span')
    wrapper.appendChild(span)
    wrapper.id = 'recipes'

    let pBtn = document.createElement('button')
    pBtn.innerText = '+'
    pBtn.addEventListener('click', function () {
        let input = document.createElement('input')
        input.text = 'text'
        span.appendChild(input)
    })

    let mBtn = document.createElement('button')
    mBtn.innerText = '-'
    mBtn.addEventListener('click', function () {
        document.querySelector('#recipes > span > input:last-child').remove()
    })

    wrapper.appendChild(span)
    wrapper.appendChild(pBtn)
    wrapper.appendChild(mBtn)

    components.appendChild(wrapper)
}

function recipes(arr) {
    if (arr.length === 0)
        return ""

    let component = 'recipes=['
    arr.forEach(recipe => {
        component += '"' + recipe + '",'
    });

    return component.replace(/,$/, ']')
}

function build_unbreakable(components) {
    let span = addComponent('unbreakable', '') // TODO: Remove ": "

    components.appendChild(span)
}

function unbreakable(arr) {
    if (arr[0] === 'true')
        return 'unbreakable={}'
    return ''
}