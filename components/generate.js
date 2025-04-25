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

function buildItemComponents() {
    let itemComponents = addComponent('temp', ['id', 'text', 'components', 'text', 'count', 'number'])

    let help = document.createElement('img')
    help.src = '../res/help.svg'
    help.alt = '?'
    help.title = 'Paste in a full command'
    help.classList.add('help')
    itemComponents.children[8].appendChild(help)

    for (let i = 0; i < 4; i++) {
        itemComponents.removeChild(itemComponents.firstChild)
    }

    return itemComponents.innerHTML 
}

function buildConsumeEffects() {
    let span = document.createElement('span')

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

    let pBtn = document.createElement('button')
    pBtn.innerText = '+'
    pBtn.addEventListener('click', function () {
        let input = document.createElement('input')
        wrapper.appendChild(input)
    })

    let mBtn = document.createElement('button')
    mBtn.innerText = '-'
    mBtn.addEventListener('click', function () {
        if (document.querySelectorAll('#consumable > span:nth-child(9) > span > input:last-child').length !== 1)
            document.querySelector('#consumable > span:nth-child(9) > span > input:last-child').remove()
    })

    remove_effects.appendChild(wrapper)
    remove_effects.appendChild(pBtn)
    remove_effects.appendChild(mBtn)
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
            document.querySelector('#consumable > span:nth-of-type(6) > span:nth-of-type(' + (i + 1) + ')').style.display = (on_consume_effects[i].selected ? 'inline' : 'none')
        }
    })

    return span
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
    const rawComponents = componentsDiv.getElementsByTagName('details')
    for (let i = 0; i < rawComponents.length; i++) {
        compArr = spanToArr(rawComponents[i])
        if (compArr[0] === 'true') { // If use this checkbox is on
            if (compArr[1] === 'true') { // If remove check is active
                components += `!${rawComponents[i].id},`
                continue
            }
            if (compArr.length !== 2)
                compArr = compArr.splice(2)
            try {
                data = window[rawComponents[i].id](compArr)
                if (data !== '')
                    components += data + ','
            } catch {
                if (window.hasOwnProperty(rawComponents[i].id))
                    window[rawComponents[i].id](compArr) // Log error normally
                else if (rawComponents[i].id === "") {} // Sub-span (skip)
                else
                    console.error('Components interpreter "' + rawComponents[i].id + '" does not exist')
            }
        }
    }

    if (components !== '')
        components = '[' + components + ']'
    commandBox.value = command + components.replace(/,+\]$/, ']')
    if (commandBox.value.length > 256) // TODO: Make this event listener
        document.querySelector('.Warning256').style.display = 'inline'
    else
        document.querySelector('.Warning256').style.display = 'none'
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
        default: console.warn('Unhandled param type: ' + type); return 'pop'
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