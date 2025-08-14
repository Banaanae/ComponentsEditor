/**
 * General functions for building and generating components and commands
 */


/**
 * Helper func to add what all components need
 * wiki reference, active checkbox, etc
 * @param {String} name Name of the component
 * @param {Array.<String>} inputsArr Array of input name and its input type
 * @returns A details element with core requirements for an entry
 */
function addComponent(name, inputsArr) {
    let span = document.createElement('details')
    span.id = name

    const summary = document.createElement('summary')
    summary.innerText = name
    span.appendChild(summary)
    
    const p = document.createElement('p')
    p.innerHTML = 'minecraft.wiki reference: '
    const a = document.createElement('a')
    a.href = 'https://minecraft.wiki/w/Data_component_format#' + name
    a.innerText = name
    p.appendChild(a)
    span.appendChild(p)
    
    const useCheck = document.createElement('input')
    useCheck.type = 'checkbox'
    useCheck.id = name + '_ac'
    span.appendChild(useCheck)
    
    const activeLabel = document.createElement('label')
    activeLabel.innerText = 'Active'
    activeLabel.setAttribute('for', useCheck.id)
    span.appendChild(activeLabel)

    span.appendChild(document.createElement('br'))

    const removeCheck = document.createElement('input')
    removeCheck.type = 'checkbox'
    removeCheck.id = name + '_rc'
    span.appendChild(removeCheck)
    
    const removeLabel = document.createElement('label')
    removeLabel.innerText = 'Remove'
    removeLabel.setAttribute('for', removeCheck.id)
    span.appendChild(removeLabel)

    if (inputsArr.length % 2 !== 0)
        console.error('Malformed inputs array passed! Expected even length, got length of: ' + inputsArr.length)

    for (let i = 0; i < inputsArr.length; i += 2) {
        span.appendChild(document.createElement('br'))
        const inputName = document.createElement('span')
        inputName.innerText = inputsArr[i] + ': '
        span.appendChild(inputName)
        
        if (inputsArr[i + 1] === 'header') {
            inputName.classList.add('bold')
        } else if (inputsArr[i + 1] !== 'none') {
            const input = document.createElement('input')
            input.type = inputsArr[i + 1]
            span.appendChild(input)
        }
    }

    return span
}

/**
 * Builds a select menu with specified options
 * @param {Array.<String>} options An array of option to choose from
 * @param {Boolean} multiple Determines if the select should be a multi-select
 * @returns A select element with specified options
 */
function buildSelect(options, multiple = false) {
    const select = document.createElement('select')
    let option;
    options.forEach(opt => {
        option = document.createElement('option')
        option.innerText = opt
        select.appendChild(option)
    })
    if (multiple)
        select.multiple = multiple
    return select
}

/**
 * Generates a JSON array from an array
 * @param {String} argument Argument name, with `=[` or `:[`
 * @param {Array|String} value Value received from inputs array
 * @param {Boolean} isStr Determines is the value should be wrapped in quotes
 * @param {Boolean} canBeStr If one value is passed, determines if [] can be removed
 * @returns A minecraft formatted JSON array
 */
function generateList(argument, value, isStr, canBeStr) {
    let removeSB = false
    let oldArg = argument

    if (Array.isArray(value)) {
        if (canBeStr && value.length === 1)
            removeSB = true

        value.forEach(part => {
            if (part !== '')
                argument += (isStr ? `"${part}",` : `${part},`)
        })

        if (argument === oldArg)
            return ''

        argument = argument.replace(/,$/, '],')

        // TODO: Length optimisation - removeSB if generated length = 1
    } else {
        if (canBeStr)
            removeSB = true

        if (value === '')
            return ''

        argument += (isStr ? `"${value}"]` : `${value}]`)
    }

    if (removeSB)
        argument = argument.replace(/(.*?)\[(.*)]/, '$1$2,')

    return argument
}

/**
 * Builds a component input
 * @param {Boolean} justComponents Whether just component input or item input (name, count, components)
 * @returns Inputs for above
 */
function buildItemComponents(justComponents) {
    let arr = ['id', 'text', 'count', 'number', 'components', 'text']
    if (justComponents)
        arr.splice(0, 4)
    let itemComponents = addComponent('temp', arr)

    let help = document.createElement('img')
    help.src = './res/help.svg'
    help.alt = '?'
    help.title = 'Paste in a full command'
    help.classList.add('help')
    itemComponents.children[(justComponents ? 8 : 14)].appendChild(help)

    for (let i = 0; i < 7; i++) {
        itemComponents.removeChild(itemComponents.firstChild)
    }

    return itemComponents.innerHTML 
}

/**
 * Convert components in command form to argument form
 * @param {string} command A full command in the format given by the generator
 * @returns Components formatted to work in a command
 */
function generateComponents(command) {
    let components = command.replace(/.*?\[(.*)\].*/, '$1') // Extract components
    components = components.replaceAll(/((\{|\[|,)\w+)=/g, '$1:') // Convert to arg form // TODO: Will replace strings if formatted to match regex
    components = `components:{${components}},`
    if (components === 'components:{},')
        return ''
    return components
}

function buildConsumeEffects(spanid) {
    let span = document.createElement('span')
    span.classList.add('consumeEffects')

    let on_consume_effects = buildSelect(['apply_effects', 'remove_effects', 'clear_all_effects', 'teleport_randomly', 'play_sound'], true)
    span.appendChild(on_consume_effects)
    span.appendChild(document.createElement('br'))

    let apply_effects = document.createElement('span')
    apply_effects.style.display = 'none'
    let apply_effects_header = document.createElement('span')
    apply_effects_header.innerText = 'effects: '
    apply_effects.appendChild(apply_effects_header)
    span.appendChild(apply_effects)
    span.appendChild(document.createElement('br'))

    function addNewEffect() {
        let wrapper2 = document.createElement('span')
        let effectWrapper = document.createElement('span')
        effectWrapper.appendChild(document.createElement('br'))
        let id_header = document.createElement('span')
        id_header.innerText = 'id: '
        effectWrapper.appendChild(id_header)
        let id = document.createElement('input')
        effectWrapper.appendChild(id)
        effectWrapper.appendChild(document.createElement('br'))
        let amplifier_header = document.createElement('span')
        amplifier_header.innerText = 'amplifier: '
        effectWrapper.appendChild(amplifier_header)
        let amplifier = document.createElement('input')
        amplifier.type = 'number'
        effectWrapper.appendChild(amplifier)
        effectWrapper.appendChild(document.createElement('br'))
        let duration_header = document.createElement('span')
        duration_header.innerText = 'duration: '
        effectWrapper.appendChild(duration_header)
        let duration = document.createElement('input')
        duration.type = 'number'
        duration.min = -1
        effectWrapper.appendChild(duration)
        effectWrapper.appendChild(document.createElement('br'))
        let ambient_header = document.createElement('span')
        ambient_header.innerText = 'ambient: '
        effectWrapper.appendChild(ambient_header)
        let ambient = document.createElement('input')
        ambient.type = 'checkbox'
        effectWrapper.appendChild(ambient)
        effectWrapper.appendChild(document.createElement('br'))
        let show_particles_header = document.createElement('span')
        show_particles_header.innerText = 'show_particles: '
        effectWrapper.appendChild(show_particles_header)
        let show_particles = document.createElement('input')
        show_particles.type = 'checkbox'
        effectWrapper.appendChild(show_particles)
        effectWrapper.appendChild(document.createElement('br'))
        let show_icon_header = document.createElement('span')
        show_icon_header.innerText = 'show_icon: '
        effectWrapper.appendChild(show_icon_header)
        let show_icon = document.createElement('input')
        show_icon.type = 'checkbox'
        effectWrapper.appendChild(show_icon)
        wrapper2.appendChild(effectWrapper)
        return wrapper2
    }

    let pBtn1 = document.createElement('button')
    pBtn1.innerText = '+'
    pBtn1.addEventListener('click', function () {
        apply_effects.appendChild(addNewEffect())
    })
    apply_effects.appendChild(addNewEffect())
    apply_effects.appendChild(pBtn1)

    let mBtn1 = document.createElement('button')
    mBtn1.innerText = '-'
    mBtn1.addEventListener('click', function () {
        if (document.querySelector(`#${spanid} > span.consumeEffects > span:nth-child(3) > span:last-child`).length !== 0)
            document.querySelector(`#${spanid} > span.consumeEffects > span:nth-child(3) > span:last-child`).remove()
    })
    
    apply_effects.appendChild(mBtn1)

    apply_effects.appendChild(document.createElement('br'))
    let probability_header = document.createElement('span')
    probability_header.innerText = 'probability'
    apply_effects.appendChild(probability_header)
    let probability = document.createElement('input')
    probability.type = 'number'
    probability.step = 0.1
    probability.min = 0
    probability.max = 1
    apply_effects.appendChild(probability)

    let remove_effects = document.createElement('span')
    remove_effects.style.display = 'none'
    let remove_effects_header = document.createElement('span')
    remove_effects_header.innerText = 'remove effects: '
    remove_effects.appendChild(remove_effects_header)
    let wrapper = document.createElement('span')
    remove_effects.appendChild(wrapper)

    let firstEffect = document.createElement('input')
    firstEffect.type = 'text'
    wrapper.appendChild(firstEffect)

    let pBtn2 = document.createElement('button')
    pBtn2.innerText = '+'
    pBtn2.addEventListener('click', function () {
        let input = document.createElement('input')
        wrapper.appendChild(input)
    })

    let mBtn2 = document.createElement('button')
    mBtn2.innerText = '-'
    mBtn2.addEventListener('click', function () {
        if (document.querySelectorAll(`#${spanid} > span.consumeEffects > span:nth-child(5) input`).length !== 1)
            document.querySelector(`#${spanid} > span.consumeEffects > span:nth-child(5) input:last-child`).remove()
    })

    remove_effects.appendChild(wrapper)
    remove_effects.appendChild(pBtn2)
    remove_effects.appendChild(mBtn2)
    span.appendChild(remove_effects)
    span.appendChild(document.createElement('br'))

    let clear_all_effects = document.createElement('span')
    clear_all_effects.style.display = 'none'
    span.appendChild(clear_all_effects)
    span.appendChild(document.createElement('br'))

    let teleport_randomly = document.createElement('span')
    teleport_randomly.style.display = 'none'
    let teleport_randomly_header = document.createElement('span')
    teleport_randomly_header.innerText = 'diameter: '
    teleport_randomly.appendChild(teleport_randomly_header)
    let diameter = document.createElement('input')
    diameter.type = 'number'
    diameter.step = '0.1'
    teleport_randomly.appendChild(diameter)
    span.appendChild(teleport_randomly)
    span.appendChild(document.createElement('br'))

    let play_sound = document.createElement('span')
    play_sound.style.display = 'none'
    let play_sound_header = document.createElement('span')
    play_sound_header.innerText = 'play_sound: '
    play_sound.appendChild(play_sound_header)
    let sound2 = document.createElement('input')
    sound2.type = 'text'
    play_sound.appendChild(sound2)
    span.appendChild(play_sound)


    on_consume_effects.addEventListener('change', function () {
        for (let i = 0; i < 5; i++) {
            document.querySelector(`#${spanid} > span.consumeEffects > span:nth-of-type(${i + 1})`).style.display = (on_consume_effects[i].selected ? 'inline' : 'none')
        }
    })

    return span
}

function generateConsumeEffects(arr) {
    let consumeFX = 'on_consume_effects:['

    if (arr[0].apply_effects) {
        let effects = '{type:"apply_effects",effects:['
        let probability = arr[1].splice(1,1)[0]
        arr[1].forEach((effect) => {
            let element = '{'
            if (effect[0] != '') {
                element += `id:"${effect[0]}",`

                if (effect[1] !== '0')
                    element += `amplifier:${effect[1]},`

                let duration = Number(effect[2])
                if (duration !== 0 && duration > -2)
                    element += `duration:${effect[2]},`

                if (effect[3] !== "false")
                    element += 'ambient:true,'

                if (effect[4] !== "true")
                    element += 'show_particles:false,'

                if (effect[5] !== "true")
                    element += 'show_icon:false,'
                effects += element.replace(/,$/, '},')
            }
        })
        consumeFX += effects.replace(/,$/, '],')
        if (probability !== '' && Number(probability) !== 1)
            consumeFX += `probability:${probability},`
        consumeFX = consumeFX.replace(/,$/, '},')
    }

    if (arr[0].remove_effects) {
        let remove_effects = generateList('{type:"remove_effects",effects:[', arr[arr.length - 3], true, true).replace(/,$/, '')
        if (remove_effects !== '')
            remove_effects += "},"
        consumeFX += remove_effects
    }

    if (arr[0].clear_all_effects)
        consumeFX += '{type:"minecraft:clear_all_effects"},'

    if (arr[0].teleport_randomly) {
        consumeFX += `{type:"minecraft:teleport_randomly",`
        if (arr[arr.length - 2] !== 16)
            consumeFX += `diameter:${arr[arr.length - 2]}},`
    }

    if (arr[0].play_sound)
        consumeFX += `{type:"minecraft:play_sound",sound:"${arr[arr.length - 1]}"},`

    if (consumeFX === 'on_consume_effects:[')
        return ''

    return consumeFX.replace(/,$/, '],')
}

// End builder funcs
// Begin generator funcs

/**
 * Generates a command from active components
 */
function generateCommand() {
    const componentsDiv = document.querySelector('.edit')
    const commandBox = document.getElementById('command')
    const item = document.getElementById('currItem').innerText
    let command = '/give @p ' + item // TODO: recipient
    let components = ''

    let compArr;
    let data;
    let dataArr = []
    const rawComponents = componentsDiv.getElementsByTagName('details')
    for (let i = 0; i < rawComponents.length; i++) {
        compArr = spanToArr(rawComponents[i])
        if (compArr[0] === 'true') { // If use this checkbox is on
            if (compArr[1] === 'true') { // If remove check is active
                dataArr.push(`!${rawComponents[i].id}`)
                continue
            }
            if (compArr.length !== 2)
                compArr = compArr.splice(2)
            try {
                data = window[rawComponents[i].id](compArr)
                if (data !== '')
                    dataArr.push(data)
            } catch {
                if (window.hasOwnProperty(rawComponents[i].id))
                    window[rawComponents[i].id](compArr) // Log error normally
                else if (rawComponents[i].id === "") {} // Sub-span (skip)
                else
                    console.error('Components interpreter "' + rawComponents[i].id + '" does not exist')
            }
        }
    }

    dataArr.forEach(comp => {
        components += comp + ','
    })
    if (components !== '')
        components = '[' + components + ']'

    let unsplitCommand = command + components.replace(/,+\]$/, ']')

    document.querySelector('.CommandMultiple').style.display = 'none'
    document.querySelector('.Warning256').style.display = 'none'

    if (unsplitCommand.length > 256 && !document.getElementById('command_block').checked)
        commandBox.value = splitCommand(command, dataArr)
    else
        commandBox.value = unsplitCommand
    commandBox.style.height = (commandBox.scrollHeight - 4) + 'px'
}

/**
 * Converts a command over 256 characters into multiple commands
 * under 256 characters for usage in chat
 * @param {String} command The /give part of the command
 * @param {Array.<String>} components An array of passed components
 * @returns One /give and multiple /item commands
 */
function splitCommand(command, components) {
    let commands;
    components.sort((a, b) => a.length - b.length) // Sort by length

    let length = command.length
    let safeCommand = '[' // First fit as much as we can in /give
    let i = 0
    while (i < components.length) {
        let tempCommand = safeCommand + components[i] + ','
        if ((length + tempCommand.length) <= 256) {
            safeCommand += components[i] + ','
            i++
        } else break
    }
    components = components.slice(i)
    commands = command + safeCommand.replace(/,$/, ']\n')
    commands.replace(/\[$/, '')

    let newHead = '/item modify entity @p weapon.mainhand {function:set_components,components:{'
    let exceeding = false
    length = newHead.length
    while (components.length !== 0) {
        let i = 0
        if (components[0].length > 178) {
            exceeding = true
            break
        }
        safeCommand = ''
        while (i < components.length) {
            let tempCommand = safeCommand + components[i] + ','
            if ((length + tempCommand.length) <= 256) {
                safeCommand += components[i].replace('=', ':') + ','
                i++
            } else break        
        }
        components = components.slice(i)
        commands += newHead + safeCommand.replace(/,$/, '}}\n')
    }

    if (exceeding)
        document.querySelector('.Warning256').style.display = 'inline'

    document.querySelector('.CommandMultiple').style.display = 'inline'
    return commands
}

/**
 * Retrieves the data associated with an argument
 * @param {HTMLElement} element An element which is a child of a component's details element
 * @returns A string or array with an argument's value
 */
function getDataFromElement(element) {
    const type = element.tagName.toLowerCase()
    switch (type) {
        case 'input': {
            if (element.type === 'checkbox')
                return element.checked.toString()
            else if (element.type === 'color')
                return parseInt(element.value.replace('#', ''), 16)
            return element.value
        }
        case 'select': {
            if (element.type === 'select-multiple') {
                let result = {}
                for (let i = 0; i < element.length; i++) {
                    result[element[i].value] = element[i].selected
                }
                return result
            }
            return element.value
        }
        case 'span': return spanToArr(element)
        default: console.warn('Unhandled param type: ' + type); // If element isn't know log it (solely for when I add features and forget)
        case 'p': // Don't warn for elements that can't be handled
        case 'label':
        case 'br':
        case 'button':
        case 'img':
        case 'summary': return 'pop'
    }
}

/**
 * Converts a span containing data to an array of data
 * @param {HTMLSpanElement} span A span received in getDataFromElement()
 * @returns An array
 */
function spanToArr(span) {
    let spanArr = []
    for (let i = 0; i < span.children.length; i++) {
        let spanData = getDataFromElement(span.children[i])
        if (spanData.length <= 1)
            spanArr = spanArr.concat(spanData)
        else
            spanArr.push(spanData)
        spanArr.push()
        if (spanArr[spanArr.length - 1] === 'pop')
            spanArr.pop()
    }
    return spanArr
}