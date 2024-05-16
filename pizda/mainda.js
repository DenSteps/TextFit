const columnsNum = 3;

window.onload = function () {
    initializePage();
}

function initializePage() {
    let savedTexts = localStorage.getItem('savedTexts');
    if (savedTexts == null) {
        savedTexts = JSON.stringify(SAVED_HARDCODE_HARDMETAL_TEXTS)
        localStorage.setItem('savedTexts', savedTexts);
    }

    const savedTextParsed = JSON.parse(savedTexts) || {};
    const savedTextsDiv = document.getElementById('savedTexts');
    for (const key in savedTextParsed) {
        if (savedTextsDiv != null && savedTextParsed.hasOwnProperty(key)) {
            const savedText = savedTextParsed[key];
            savedTextsDiv.innerHTML += `<button onclick="displaySavedText('${key}')">${key}</button>`;
        }
    }

    document.getElementById('inputText')?.addEventListener('input', ((event) => {
        const text = event.target?.value;
        if (text !== '' && window.DELETE_BUTTON_MODE) {
            toggleBtnMode(false);
        }
    }));

    adjustFontSize();
}

function toggleBtnMode(deleteMode) {
    window.DELETE_BUTTON_MODE = deleteMode;
    const button = document.getElementById('splitBtn');
    button.style.backgroundColor = deleteMode ? 'red' : 'green';
    button.innerText = deleteMode ? 'УДОЛИТЬ' : 'СПАСИИСАХРАНИ';
}

let wasMainBtnClick = false;
function mainBtnClick() {
    const inputText = document.getElementById('inputText').value;
    if (inputText === '') {
        toggleBtnMode(!window.DELETE_BUTTON_MODE);
    } else {
        wasMainBtnClick = true;
        splitText();
    }
}

function randomBtnClick() {
    wasRandomBtnClick = true;
    const buttons = document.querySelectorAll('#savedTexts button');
    
    if (buttons.length === 0) return;

    let randomIndex = lastRandomBtnIndex;
    while (randomIndex == lastRandomBtnIndex) {
        randomIndex = Math.floor(Math.random() * buttons.length);
    }
    lastRandomBtnIndex = randomIndex

    const randomButton = buttons[randomIndex];

    const clickEvent = new MouseEvent('click', {
        bubbles: true,
        noNeedToSave: true,
        cancelable: true,
        view: window
    });
    randomButton.dispatchEvent(clickEvent);
}
