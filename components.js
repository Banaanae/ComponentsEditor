const universal = ['break_sound', 'consumable', 'custom_name', 'damage', 'food', 'glider', 'item_model', 'jukebox_playable', 'lore', 'max_damage', 'max_stack_size', 'rarity', 'unbreakable'];

function build_break_sound() {
    let span = addComponent('break_sound', ['break_sound', 'text'])

    return span
}

function break_sound(arr) {
    return `break_sound="${arr[0]}"`
}

function build_consumable() {
    let span = addComponent('consumable', ['consume_seconds', 'number'])

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

    return span
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

function build_custom_name() {
    let span = addComponent('custom_name', ['text', 'text', 'color', 'text', 'italic', 'checkbox'])

    return span
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

function build_damage() {
    let span = addComponent('damage', ['damage', 'number'])

    return span
}

function damage(arr) {
    return `damage=${arr[0]}`
}

function build_food() {
    let span = addComponent('food', ['nutrition', 'number', 'saturation', 'number', 'can_always_eat', 'checkbox'])

    span.children[5].step = 0.1

    return span
}

function food(arr) {
    let component = `food={nutrition:${arr[0]},saturation:${arr[1]}`

    if (arr[2] !== 'false')
        component += ',can_always_eat:true'
    return component + '}'
}

function build_glider() {
    let span = addComponent('glider', [])

    return span
}

function glider(arr) {
    if (arr[0] === 'true')
        return 'glider={}'
    return ''
}

function build_item_model() {
    let span = addComponent('item_model', ['item_model', 'text'])

    return span
}

function item_model(arr) {
    return `item_model="${arr[0]}"`
}

function build_jukebox_playable() {
    let span = addComponent('jukebox_playable', ['jukebox_playable', 'text'])

    return span
}

function jukebox_playable(arr) {
    return `jukebox_playable="${arr[0]}"`
}

function build_lore() {
    let span = addComponent('lore', ['text', 'text', 'italic', 'checkbox', 'color', 'text'])

    // TODO: +/- Line
    return span
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

function build_map_color() {
    let span = addComponent('map_color', ['map_color', 'color'])

    return span
}

function map_color(arr) {
    return `map_color=${arr[0]}`
}

function build_map_id() {
    let span = addComponent('map_id', ['map_id', 'number'])

    return span
}

function map_id(arr) {
    return `map_id=${arr[0]}`
}

function build_max_damage() {
    let span = addComponent('max_damage', ['max_damage', 'number'])

    return span
}

function max_damage(arr) {
    return `max_damage=${arr[0]}`
}

function build_max_stack_size() {
    let span = addComponent('max_stack_size', ['max_stack_size', 'number'])

    return span
}

function max_stack_size(arr) {
    return `max_stack_size=${arr[0]}`
}

function build_ominous_bottle_amplifier() {
    let span = addComponent('ominous_bottle_amplifier', ['ominous_bottle_amplifier', 'number'])

    span.children[2].min = 0
    span.children[2].max = 4

    return span
}

function ominous_bottle_amplifier(arr) {
    return `ominous_bottle_amplifier=${arr[0]}`
}

function build_rarity() {
    let span = addComponent('rarity', ['rarity', 'none'])

    span.appendChild(buildSelect(['Common', 'Uncommon', 'Rare', 'Epic']))

    return span
}

function rarity(arr) {
    return `rarity=${arr[0].toLowerCase()}`
}

function build_recipes() {
    let span = addComponent('recipes', ['recipes', 'text'])
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

    return wrapper
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

function build_unbreakable() {
    let span = addComponent('unbreakable', [])

    return span
}

function unbreakable(arr) {
    if (arr[0] === 'true')
        return 'unbreakable={}'
    return ''
}