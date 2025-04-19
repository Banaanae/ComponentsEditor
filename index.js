/**
 * Build page layout and other misc. funcs
 */

let ILJson;

if (localStorage.length === 0)
    localStorage.commandArgs = []

fetch('./components/itemList.json')
    .then(response => response.text())
    .then(fileContents => {
        ILJson = JSON.parse(fileContents)
        addEntries(ILJson)
    })

/**
 * Adds entries to the item search window
 * @param {JSON} itemList The list of items
 */
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

    /**
     * Creates the listeners and styling for each item
     * @param {String} item Name of the item
     */
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
/**
 * Filters the list of items with the user's search input
 */
function filterFunction() {
    const input = document.getElementById("searchInput");
    const filter = input.value.toUpperCase();
    const div = document.getElementById("ddl");
    const btn = div.getElementsByTagName("button");
    for (let i = 0; i < btn.length; i++) {
        txtValue = btn[i].textContent || btn[i].innerText;
        if (txtValue.toUpperCase().indexOf(filter) > -1) {
            btn[i].style.display = "block";
        } else {
            btn[i].style.display = "none";
        }
    }
}

/**
 * Sets up wrappers for the components
 * @param {String} item Name of the item to build
 */
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

    addComponentsBuilders(mainTitle.innerText)
}

/**
 * Adds the universal and custom component builders
 * @param {String} name Name of the item to build for
 */
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
