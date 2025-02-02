const universal = ['custom_name', 'damage', 'food', 'glider', 'item_model', 'jukebox_playable', 'lore', 'max_damage', 'max_stack_size', 'rarity', 'unbreakable'];

function build_consumable(components) {
    let span = addComponent('consumable', 'number')

    span.children[2].step = 0.1

    span.appendChild(buildSelect(['none', 'eat', 'drink', 'block', 'bow', 'spear', 'crossbow', 'spyglass', 'toot_horn', 'brush']))

    let sound = document.createElement('input')
    sound.type = 'text'
    span.appendChild(sound)

    let has_consume_particles = document.createElement('input')
    has_consume_particles.type = 'checkbox'
    span.appendChild(has_consume_particles)

    let on_consume_effects = buildSelect(['apply_effects', 'remove_effects', 'clear_all_effects', 'teleport_randomly', 'play_sound'], true)
    span.appendChild(on_consume_effects)

    let apply_effects = document.createElement('span')
    apply_effects.style.display = 'none'
    span.appendChild(apply_effects)

    let remove_effects = document.createElement('span')
    remove_effects.style.display = 'none'
    let wrapper = document.createElement('span')
    remove_effects.appendChild(wrapper)

    let firstEffect = document.createElement('input')
    firstEffect.type = 'text'
    wrapper.appendChild(firstEffect)

    let pBtn = document.createElement('button')
    pBtn.innerText = '+'
    pBtn.addEventListener('click', function () {
        let input = document.createElement('input')
        input.text = 'text'
        wrapper.appendChild(input)
    })

    let mBtn = document.createElement('button')
    mBtn.innerText = '-'
    mBtn.addEventListener('click', function () {
        document.querySelector('#consumable > span:nth-child(9) > span > input:last-child').remove()
    })

    remove_effects.appendChild(wrapper)
    remove_effects.appendChild(pBtn)
    remove_effects.appendChild(mBtn)
    span.appendChild(remove_effects)

    let clear_all_effects = document.createElement('span')
    clear_all_effects.style.display = 'none'
    span.appendChild(clear_all_effects)

    let teleport_randomly = document.createElement('span')
    teleport_randomly.style.display = 'none'
    let diameter = document.createElement('input')
    diameter.type = 'number'
    diameter.step = '0.1'
    teleport_randomly.appendChild(diameter)
    span.appendChild(teleport_randomly)

    let play_sound = document.createElement('span')
    play_sound.style.display = 'none'
    let sound2 = document.createElement('input')
    sound2.type = 'text'
    play_sound.appendChild(sound2)
    span.appendChild(play_sound)


    on_consume_effects.addEventListener('change', function () {
        for (let i = 0; i < on_consume_effects.length; i++) {
            document.querySelector('#consumable > span:nth-child(' + (i + 8) + ')').style.display = (on_consume_effects[i].selected) ? 'inline' : 'none'
        }
    })

    components.appendChild(span)
}

function consumable(arr) {
    let component = 'consumable={'

    if (arr[0] !== 1.6)
        component += `consume_seconds:${arr[0]},`

    if (arr[1] !== 'eat')
        component += `animation:"${arr[1]}",`

    if (arr[2] !== 'entity.generic.eat')
        component += `sound:"${arr[2]}",`

    if (arr[3] !== 'true')
        component += 'has_consume_particles:false,'

    let consumeFX = 'on_consume_effects:['

    if (arr[4].apply_effects) {
        // TODO
    }

    if (arr[4].remove_effects) {
        // TODO
    }

    if (arr[4].clear_all_effects)
        consumeFX += '{type:"minecraft:clear_all_effects"},'

    if (arr[4].teleport_randomly)
        consumeFX += `{type:"minecraft:teleport_randomly",diameter:${arr[arr.length - 2]}},`

    if (arr[4].play_sound)
        consumeFX += `{type:"minecraft:play_sound",sound:"${arr[arr.length - 1]}"},`

    if (consumeFX !== 'on_consume_effects:[')
        return component + consumeFX.replace(/,$/, ']}]')
    return component.replace(/,$/, '}]')
}

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

function build_food(components) {
    let span = addComponent('food', 'number')

    let saturation = document.createElement('input')
    saturation.type = 'number'
    saturation.step = '0.1'
    span.appendChild(saturation)

    let can_always_eat = document.createElement('input')
    can_always_eat.type = 'checkbox'
    span.appendChild(can_always_eat)

    components.appendChild(span)
}

function food(arr) {
    let component = `food={nutrition:${arr[0]},saturation:${arr[1]}`

    if (arr[2] !== 'false')
        component += ',can_always_eat:true'
    return component + '}'
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