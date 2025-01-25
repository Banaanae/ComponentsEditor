let ILJson;

fetch('./itemList.json')
    .then(response => response.text())
    .then(fileContents => {
        ILJson = JSON.parse(fileContents)
        addEntries(ILJson)
        filterFunction()
    })

function addEntries(itemList) {
    const ddlDiv = document.getElementById('ddl')
    for (var item in itemList) {
        const btn = document.createElement('button')
        btn.innerText = itemList[item].name
        ddlDiv.appendChild(btn)
        btn.addEventListener('click', function () {
            document.querySelectorAll('#ddl > button').forEach(button => {
                button.style.display = 'none'
            })
            designPage(btn.innerText)
        })
    };
}

document.getElementById('generate').addEventListener('click', generateCommand)
document.getElementById('searchInput').addEventListener('click', filterFunction)

// Modified from https://www.w3schools.com/howto/howto_js_filter_dropdown.asp
function filterFunction() {
    const input = document.getElementById("searchInput");
    const filter = input.value.toUpperCase();
    const div = document.getElementById("ddl");
    const btn = div.getElementsByTagName("button");
    for (let i = 0; i < btn.length; i++) {
        txtValue = btn[i].textContent || btn[i].innerText;
        txtValue = txtValue.replace("minecraft:", '')
        if (txtValue.toUpperCase().indexOf(filter) > -1 && filter !== "") {
            btn[i].style.display = "block";
        } else {
            btn[i].style.display = "none";
        }
    }
}

function designPage(item) {
    const main = document.getElementById('editor')
    main.removeChild(document.getElementById('components'))

    const mainEdits = document.createElement('div')
    mainEdits.id = 'components'
    
    const mainTitle = document.createElement('h1')
    mainTitle.innerText = item
    mainTitle.id = 'currItem'
    
    mainEdits.appendChild(mainTitle)
    main.appendChild(mainEdits)

    const name = mainTitle.innerText.replace('minecraft:', '')
    const type = ILJson[name].type
    addComponentsByType(name, type)
    

    // TODO: custom

}

function addComponentsByType(name, type) {
    const components = document.getElementById('components')

    // Step 1: Universal
    build_lore(components)
    build_rarity(components)

    // Step 2: By type

    // Step 3: Custom
    ILJson[name].custom.forEach(func => {
        window['build_' + func](components)
    });
}

// Helper func to do what all components need
function addComponent(name) {
    span = document.createElement('span')
    span.id = name

    // TODO: Use this checkbox

    const h3 = document.createElement('h3')
    h3.innerText = name + ': '
    span.appendChild(h3)


    const input = document.createElement('input')
    input.type = 'text'
    span.appendChild(input)

    return span
}

function buildSelect(options) {
    const select = document.createElement('select')
    let option;
    options.forEach(opt => {
        option = document.createElement('option')
        option.innerText = opt
        select.appendChild(option)
    })
    return select
}

function generateCommand() {
    const componentsDiv = document.getElementById('components')
    const commandBox = document.getElementById('command')
    const item = document.getElementById('currItem').innerText
    let command = '/give @s ' + item // TODO: recipient
    let components = ''

    let compArr;
    const rawComponents = componentsDiv.getElementsByTagName('span')
    for (let i = 0; i < rawComponents.length; i++) {
        compArr = []
        for (let o = 0; o < rawComponents[i].children.length; o++) {
            compArr.push(getDataFromElement(rawComponents[i].children[o]))
            if (compArr == 'pop')
                compArr.pop()
        }
        try {
            components += window[rawComponents[i].id](compArr) + ','
        } catch {
            console.error('Components interpreter "' + rawComponents[i].id + '" does not exist')
        }
    }

    if (components !== '')
        components = '[' + components + ']'
    commandBox.value = command + components.replace(/,\]$/, ']')
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
        case 'select': return element.value
        default: console.warn('Unhandled param type: ' + type); return 'pop'
    }
}
