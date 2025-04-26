/**
 * Manages building each individual component
 * And generating its part of the command
 */

const universal = ['blocks_attacks', 'break_sound', 'consumable', 'custom_name', 'damage', 'death_protection', 'enchantment_glint_override', 'equippable', 'food', 'glider', 'intangible_projectile', 'item_model', 'item_name', 'jukebox_playable', 'lore', 'max_damage', 'max_stack_size', 'provides_banner_patterns', 'rarity', 'repairable', 'repair_cost', 'unbreakable', 'use_cooldown', 'use_remainder', 'weapon'];

function build_base_color() {
    let details = addComponent('base_color', ['base_color', 'text'])

    return details
}

function base_color(arr) {
    return `base_color="${arr[0]}"`
}

function build_blocks_attacks() {
    let details = addComponent('blocks_attacks', ['block_delay_seconds', 'number', 'disable_cooldown_scale', 'number',
        'damage_reductions', 'header', 'type', 'text', 'base', 'number', 'factor', 'number', 'horizontal_blocking_angle', 'number',
        'item_damage', 'header', 'threshold', 'number', 'base', 'number', 'factor', 'number',
        'block_sound', 'text', 'disabled_sound', 'text', 'bypassed_by', 'text'])

    // TODO: Type +/- and for headers
    //       Float 0.1 steps, mins and maxes
    return details
}

function blocks_attacks(arr) {
    let blocks_attacks = "blocks_attacks={"

    if (arr[0] != 0 && arr[0] !== '')
        blocks_attacks += `block_delay_seconds:${arr[0]},`

    if (arr[1] != 1 && arr[1] !== '')
        blocks_attacks += `disable_cooldown_scale:${arr[0]},`

    let damage_reductions = 'damage_reductions:{'

    if (arr[2] !== '')
        console.log('TODO')

    if (arr[3] !== '')
        damage_reductions += `base:${arr[3]},`

    if (arr[4] !== '')
        damage_reductions += `factor:${arr[4]},`

    if (arr[5] !== '')
        damage_reductions += `horizontal_blocking_angle:${arr[5]},`

    if (damage_reductions !== 'damage_reductions:{')
        blocks_attacks += damage_reductions.replace(/,$/, "},")

    let item_damage = 'item_damage:{'

    if (arr[6] !== '')
        item_damage += `threshold:${arr[6]},`

    if (arr[7] !== '')
        item_damage += `base:${arr[7]},`

    if (arr[8] !== '')
        item_damage += `factor:${arr[8]},`

    if (item_damage !== 'item_damage:{')
        blocks_attacks += item_damage.replace(/,$/, "},")
    
    if (arr[9] !== '')
        blocks_attacks += `block_sound:${arr[9]},`

    if (arr[10] !== '')
        blocks_attacks += `disabled_sound:${arr[10]},`

    if (arr[11] !== '')
        console.log('TODO')

    return blocks_attacks.replace(/,$/, '}')
}

function build_break_sound() {
    let span = addComponent('break_sound', ['break_sound', 'text'])

    return span
}

function break_sound(arr) {
    return `break_sound="${arr[0]}"`
}

function build_consumable() {
    let span = addComponent('consumable', ['consume_seconds', 'number', 'animation', 'none', 'sound', 'text', 'has_consume_particles', 'checkbox', 'on_consume_effects', 'none'])

    span.children[5].step = 0.1

    let animation = buildSelect(['none', 'eat', 'drink', 'block', 'bow', 'spear', 'crossbow', 'spyglass', 'toot_horn', 'brush'])
    span.children[11].appendChild(animation)

    span.append(buildConsumeEffects())

    return span
}

function consumable(arr) {
    arr = arr.concat(arr[4])
    arr.splice(3, 1)
    let component = 'consumable={'

    if (arr[0] !== 1.6)
        component += `consume_seconds:${arr[0]},`

    if (arr[1] !== 'eat')
        component += `animation:"${arr[1]}",`

    if (arr[2] !== 'entity.generic.eat' && arr[2] !== '')
        component += `sound:"${arr[2]}",`

    if (arr[3] !== 'true')
        component += 'has_consume_particles:false,'

    let consumeFX = 'on_consume_effects:['

    if (arr[4].apply_effects) {
        // TODO
    }

    if (arr[4].remove_effects) {
        let remove_effects = generateList('{type:"remove_effects",remove:[', arr[arr.length - 3], true, true)
        if (remove_effects !== '')
            remove_effects += "},"
        consumeFX += remove_effects
    }

    if (arr[4].clear_all_effects)
        consumeFX += '{type:"minecraft:clear_all_effects"},'

    if (arr[4].teleport_randomly) {
        consumeFX += `{type:"minecraft:teleport_randomly",`
        if (arr[arr.length - 2] !== 16)
            consumeFX += `diameter:${arr[arr.length - 2]}},`
    }

    if (arr[4].play_sound)
        consumeFX += `{type:"minecraft:play_sound",sound:"${arr[arr.length - 1]}"},`

    if (consumeFX !== 'on_consume_effects:[')
        return component + consumeFX.replace(/,$/, ']}')
    return component.replace(/,$/, '}')
}

function build_custom_name() {
    let span = addComponent('custom_name', ['text', 'text', 'color', 'text', 'italic', 'checkbox'])

    return span
}

function custom_name(arr) {
    let component = "custom_name=";
    component += '{text:"' + arr[0] + '"'
    
    if (arr[1] !== "")
        component += ',color:"' + arr[1] + '"'
    
    if (arr[2] !== 'true')
        component += ',italic:false'
    component += '}'

    return component
}

function build_damage() {
    let span = addComponent('damage', ['damage', 'number'])

    return span
}

function damage(arr) {
    return `damage=${arr[0]}`
}

function build_death_protection() {
    let details = addComponent('death_protection', [])

    // TODO: consume_effects

    return details
}

function death_protection(arr) {
    return 'death_protection={}'
}

function build_dyed_color() {
    let details = addComponent('dyed_color', ['dyed_color', 'color'])

    return details
}

function dyed_color(arr) {
    return `dyed_color=${arr[0]}`
}

function build_enchantment_glint_override() {
    let details = addComponent('enchantment_glint_override', ['enchantment_glint_override', 'checkbox'])

    return details
}

function enchantment_glint_override(arr) {
    return `enchantment_glint_override=${arr[0]}`
}

function build_equippable() {
    let details = addComponent('equippable', ['slot', 'none', 'equip_sound', 'text', 'asset_id', 'text', 'allowed_entities', 'none',
        'dispensable', 'checkbox', 'swappable', 'checkbox', 'damage_on_hurt', 'checkbox', 'equip_on_interact', 'checkbox', 'camera_overlay', 'text'])

    details.children[8].appendChild(buildSelect(['head', 'chest', 'legs', 'feet', 'body', 'mainhand', 'offhand', 'saddle']))

    let allowed_entities_br = details.children[17]

    let allowed_entities = document.createElement('span')
    allowed_entities.id = 'allowed_entities'
    allowed_entities.appendChild(document.createElement('input'))

    let pBtn = document.createElement('button')
    pBtn.innerText = '+'
    pBtn.addEventListener('click', function () {
        let input = document.createElement('input')
        allowed_entities.appendChild(input)
    })

    let mBtn = document.createElement('button')
    mBtn.innerText = '-'
    mBtn.addEventListener('click', function () {
        if (document.querySelectorAll('#allowed_entities > input:last-child').length !== 1)
            document.querySelector('#allowed_entities > input:last-child').remove()
    })

    details.insertBefore(allowed_entities, allowed_entities_br)
    details.insertBefore(pBtn, allowed_entities_br)
    details.insertBefore(mBtn, allowed_entities_br)

    return details
}

function equippable(arr) {
    let equippable = `equippable={slot:${arr[0]},`

    if (arr[1] !== 'item.armor.equip_generic' && arr[1] !== '')
        equippable += `equip_sound:"${arr[1]}",`

    if (arr[2] !== '')
        equippable += `asset_id:"${arr[2]}",`

    equippable += generateList('allowed_entities:[', arr[3], true, true)

    if (arr[4] !== 'true' && arr[4] !== '')
        equippable += `dispensable:false,`

    if (arr[5] !== 'true' && arr[4] !== '')
        equippable += `swappable:false,`

    if (arr[6] !== 'true' && arr[4] !== '')
        equippable += `damage_on_hurt:false,`

    if (arr[7] !== 'true' && arr[4] !== '')
        equippable += `equip_on_interact:false,`
    
    if (arr[8] !== '')
        equippable += `camera_overlay:"${arr[8]}",`

    return equippable.replace(/,$/, '}')
}

function build_food() {
    let span = addComponent('food', ['nutrition', 'number', 'saturation', 'number', 'can_always_eat', 'checkbox'])

    span.children[8].step = 0.1

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
    return 'glider={}'
}

function build_intangible_projectile() {
    let details = addComponent('intangible_projectile', [])

    return details
}

function intangible_projectile() {
    return 'intangible_projectile={}'
}

function build_item_model() {
    let span = addComponent('item_model', ['item_model', 'text'])

    return span
}

function item_model(arr) {
    return `item_model="${arr[0]}"`
}

function build_item_name() {
    let span = addComponent('item_name', ['text', 'text', 'color', 'text', 'italic', 'checkbox'])

    return span
}

function item_name(arr) {
    let component = "item_name=";
    component += '{text:"' + arr[0] + '"'
    
    if (arr[1] !== "")
        component += ',color:"' + arr[1] + '"'
    
    if (arr[2] !== 'false')
        component += ',italic:true'
    component += '}'

    return component
}

function build_jukebox_playable() {
    let span = addComponent('jukebox_playable', ['jukebox_playable', 'text'])

    return span
}

function jukebox_playable(arr) {
    return `jukebox_playable="${arr[0]}"`
}

function build_lodestone_tracker() {
    let details = addComponent('lodestone_tracker', ['target', 'header', "pos x", "number", "pos y", "number", "pos z", "number", "dimension", "none", "tracked", "checkbox"])

    details.children[19].appendChild(buildSelect(['overworld', 'nether', 'the_end']))

    return details
}

function lodestone_tracker(arr) {
    let lodestone_tracker = `lodestone_tracker={target:{pos:[I;${arr[0]},${arr[1]},${arr[2]}],dimension:"${arr[3]}"}`

    if (arr[4] === "false")
        lodestone_tracker += ",tracked:false"

    return lodestone_tracker + '}'
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
                component += '{text:"' + arr[i] + '"'
                break
            }
            case 1: { // Italic
                if (arr[i] === 'false')
                    component += ',italic:false'
                break
            }
            case 2: { // Colour
                if (arr[i] !== 'dark_purple' && arr[i] !== '')
                    component += ',color:' + arr[i]
                component += '},'
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

    span.children[6].min = 1
    span.children[6].max = 99

    return span
}

function max_stack_size(arr) {
    return `max_stack_size=${arr[0]}`
}

function build_note_block_sound() {
    let details = addComponent('note_block_sound', ['note_block_sound', 'text'])

    return details
}

function note_block_sound(arr) {
    return `note_block_sound=${arr[0]}`
}

function build_ominous_bottle_amplifier() {
    let span = addComponent('ominous_bottle_amplifier', ['ominous_bottle_amplifier', 'number'])

    span.children[5].min = 0
    span.children[5].max = 4

    return span
}

function ominous_bottle_amplifier(arr) {
    return `ominous_bottle_amplifier=${arr[0]}`
}

function build_potion_contents() {
    let details = addComponent('potion_contents', ['potion', 'text', 'custom_color', 'color', 'custom_name', 'text'])

    // TODO: custom_effects

    return details
}

function potion_contents(arr) {
    let potion_contents = 'potion_contents={'

    if (arr[0] !== '')
        potion_contents += `potion:${arr[0]},`

    // TODO: No override option
    potion_contents += `custom_color:${arr[1]},`

    if (arr[2] !== '')
        potion_contents += `custom_name:${arr[0]},`

    return potion_contents.replace(/,$/, '}')
}

function build_potion_duration_scale() {
    let details = addComponent('potion_duration_scale', ['potion_duration_scale', 'number'])

    details.children[9].step = 0.1

    return details
}

function potion_duration_scale(arr) {
    return `potion_duration_scale=${arr[0]}`
}

function build_pot_decorations() {
    let details = addComponent('pot_decorations', ['sherd 1', 'text', 'sherd 2', 'text', 'sherd 3', 'text', 'sherd 4', 'text'])

    return details
}

function pot_decorations(arr) {
    let s1 = '"' + (arr[0] !== '' ? arr[0] : 'brick') +'"'
    let s2 = '"' + (arr[1] !== '' ? arr[1] : 'brick') +'"'
    let s3 = '"' + (arr[2] !== '' ? arr[2] : 'brick') +'"'
    let s4 = '"' + (arr[3] !== '' ? arr[3] : 'brick') +'"'
    let pot_decorations = `pot_decorations=[${s1},${s2},${s3},${s4}]`.replace(/("(minecraft:)?brick",?)+(?=]$)/, '')
    return (pot_decorations !== 'pot_decorations=[]' ? pot_decorations : '')
}

function build_profile() {
    let details = addComponent('profile', ['name', 'text'])

    // TODO: UUID
    return details
}

function profile(arr) {
    return `profile=${arr[0]}`
}

function build_provides_banner_patterns() {
    let details = addComponent('provides_banner_patterns', ['provides_banner_patterns', 'text'])

    return details
}

function provides_banner_patterns(arr) {
    return `provides_banner_patterns="${arr[0]}"`
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
    let span = addComponent('recipes', [])

    let wrapper = document.createElement('span')

    wrapper.appendChild(document.createElement('br'))
    const inputName = document.createElement('span')
    inputName.innerText = 'recipes: '
    wrapper.appendChild(inputName)
    
    const input = document.createElement('input')
    input.type = 'text'
    wrapper.appendChild(input)

    let pBtn = document.createElement('button')
    pBtn.innerText = '+'
    pBtn.addEventListener('click', function () {
        let input = document.createElement('input')
        wrapper.appendChild(input)
    })

    let mBtn = document.createElement('button')
    mBtn.innerText = '-'
    mBtn.addEventListener('click', function () {
        if (document.querySelectorAll('#recipes > span > input').length !== 1)
            document.querySelector('#recipes > span > input:last-child').remove()
    })
    
    span.appendChild(wrapper)
    span.appendChild(pBtn)
    span.appendChild(mBtn)

    return span
}

function recipes(arr) {
    let recipes = generateList('recipes=[', arr[0], true, false)

    return recipes
}

function build_repairable() {
    let details = addComponent('repairable', [])

    let wrapper = document.createElement('span')

    wrapper.appendChild(document.createElement('br'))
    const inputName = document.createElement('span')
    inputName.innerText = 'items: '
    wrapper.appendChild(inputName)
    
    const input = document.createElement('input')
    input.type = 'text'
    wrapper.appendChild(input)

    let pBtn = document.createElement('button')
    pBtn.innerText = '+'
    pBtn.addEventListener('click', function () {
        let input = document.createElement('input')
        wrapper.appendChild(input)
    })

    let mBtn = document.createElement('button')
    mBtn.innerText = '-'
    mBtn.addEventListener('click', function () {
        if (document.querySelectorAll('#repairable > span > input').length !== 1)
            document.querySelector('#repairable > span > input:last-child').remove()
    })
    
    details.appendChild(wrapper)
    details.appendChild(pBtn)
    details.appendChild(mBtn)

    return details
}

function repairable(arr) {
    let repairable = generateList('repairable={items:[', arr[0], true, true)

    return repairable.replace(/,$/, '}')
}

function build_repair_cost() {
    let details = addComponent('repair_cost', ['repair_cost', 'number'])

    return details
}

function repair_cost(arr) {
    return `repair_cost=${arr[0]}`
}

function build_unbreakable() {
    let span = addComponent('unbreakable', [])

    return span
}

function unbreakable(arr) {
    return 'unbreakable={}'
}

function build_use_cooldown() {
    let details = addComponent('use_cooldown', ['seconds', 'number'])

    details.children[8].step = 0.1

    // TODO: cooldown_group

    return details
}

function use_cooldown(arr) {
    return `use_cooldown={seconds:${arr[0]}}`
}

function build_use_remainder() {
    let details = addComponent('use_remainder', [])

    details.innerHTML += buildItemComponents()

    return details
}

function use_remainder(arr) {
    let use_remainder = `use_remainder={id:"${arr[0]}"`

    if (arr[1] !== '') {
        // Convert components in command form to argument form
        components = arr[1].replace(/.*?\[(.*)\].*/, '$1') // Extract components
        components = components.replaceAll(/((\{|\[|,)\w+)=/g, '$1:') // Convert to arg form // TODO: Will replace strings if formatted to match regex
        use_remainder += `,components:{${components}}`
    }

    if (arr[2] !== '1' && arr[2] !== '')
        use_remainder += ',count:' + arr[2]

    return use_remainder + '}'
}

function build_weapon() {
    let details = addComponent('weapon', ['item_damage_per_attack', 'number', 'disable_blocking_for_seconds', 'number'])

    details.children[12].step = 0.1

    return details
}

function weapon(arr) {
    let weapon = 'weapon={'

    if (arr[0] != 1 && arr[0] !== '')
        weapon += `item_damage_per_attack:${arr[0]},`

    if (arr[1] != 0 && arr[1] !== '')
        weapon += `disable_blocking_for_seconds:${arr[1]},`

    return weapon.replace(/,$/, '') + '}'
}