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

    const type = ILJson[mainTitle.innerText.replace('minecraft:', '')].type
    addComponentsByType(type)
    

    // TODO: custom

}

function addComponentsByType(type) {
    const components = document.getElementById('components')

    // Step 1: Universal
    buildLore(components)

    // Step 2: By type

    // Step 3: Custom
}

// Helper func to do what all components need
function addComponent(name, append) {
    span = document.createElement('span')
    span.id = name

    // TODO: Use this checkbox

    const h3 = document.createElement('h3')
    h3.innerText = name
    h3.style.display = 'inline'
    span.appendChild(h3)


    const input = document.createElement('input')
    input.type = 'text'
    input.id = name
    span.appendChild(input)

    return span
}

function generateCommand() {
    const componentsDiv = document.getElementById('components')
    const commandBox = document.getElementById('command')
    const item = document.getElementById('currItem').innerText
    let command = '/give @s ' + item // TODO: recipient
    let components = ''

    const compArr = []
    const rawComponents = componentsDiv.getElementsByTagName('span')
    for (let i = 0; i < rawComponents.length; i++) {
        for (let o = 0; o < rawComponents[i].children.length; o++) {
            compArr.push(getDataFromElement(rawComponents[i].children[o]))
            if (compArr === 'pop')
                compArr.pop()
        }
        components += window[rawComponents[i].id](compArr) + ','
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
            return element.value
        }
        default: console.warn('Unhandled param type: ' + type); return 'pop'
    }
}