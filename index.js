let ILJson;

if (localStorage.length === 0)
    localStorage.commandArgs = []

fetch('./itemList.json')
    .then(response => response.text())
    .then(fileContents => {
        ILJson = JSON.parse(fileContents)
        addEntries(ILJson)
    })

function addEntries(itemList) {
    const ddlDiv = document.getElementById('ddl')
    for (var item in itemList) {
        if (item === 'no-custom') {
            itemList[item].forEach(block => {
                createEntry(block)
            })
            continue
        }
        createEntry(item)
    };

    function createEntry(item) {
        const btn = document.createElement('button')
        btn.innerText = item
        ddlDiv.appendChild(btn)
        btn.addEventListener('click', function () {
            document.querySelectorAll('#ddl > button').forEach(button => {
                button.style.display = 'none'
            })
            designPage(btn.innerText)
        })
    }
}

document.getElementById('generate').addEventListener('click', generateCommand)
const sInput = document.getElementById('searchInput')
sInput.addEventListener('click', filterFunction)
sInput.addEventListener('keyup', filterFunction)
sInput.addEventListener('paste', filterFunction)

// Modified from https://www.w3schools.com/howto/howto_js_filter_dropdown.asp
function filterFunction() {
    const input = document.getElementById("searchInput");
    const filter = input.value.toUpperCase();
    const div = document.getElementById("ddl");
    const btn = div.getElementsByTagName("button");
    for (let i = 0; i < btn.length; i++) {
        txtValue = btn[i].textContent || btn[i].innerText;
        txtValue = txtValue.replace("minecraft:", '')
        if (txtValue.toUpperCase().indexOf(filter) > -1) {
            btn[i].style.display = "block";
        } else {
            btn[i].style.display = "none";
        }
    }
}

function designPage(item) {
    const main = document.getElementById('editor')
    document.querySelector('.edit').innerHTML = ''
    main.removeChild(document.getElementById('components'))

    const mainEdits = document.createElement('div')
    mainEdits.id = 'components'
    
    const mainTitle = document.createElement('h1')
    mainTitle.innerText = item
    mainTitle.id = 'currItem'
    
    mainEdits.appendChild(mainTitle)
    main.appendChild(mainEdits)

    const name = mainTitle.innerText.replace('minecraft:', '')
    addComponentsBuilders(name)
    

    // TODO: custom

}

function addComponentsBuilders(name) {
    const editWin = document.querySelector('.edit')

    // Step 1: Universal
    universal.forEach(func => {
        editWin.appendChild(window['build_' + func]())
    });

    // Step 2: Custom
    if (ILJson.hasOwnProperty(name)) {
        ILJson[name].custom.forEach(func => {
            editWin.appendChild(window['build_' + func]())
        });
    }
}

// Helper func to do what all components need
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
    activeLabel.for = useCheck.id
    span.appendChild(activeLabel)

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

function generateCommand() {
    const componentsDiv = document.querySelector('.edit')
    const commandBox = document.getElementById('command')
    const item = document.getElementById('currItem').innerText
    let command = '/give @s ' + item // TODO: recipient
    let components = ''

    let compArr;
    let data;
    const rawComponents = componentsDiv.getElementsByTagName('details')
    for (let i = 0; i < rawComponents.length; i++) {
        compArr = spanToArr(rawComponents[i])
        if (compArr[0] === "true" || compArr.length === 1) { // If use this checkbox is on
            if (compArr.length !== 1)
                compArr = compArr.splice(1)
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