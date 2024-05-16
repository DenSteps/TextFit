function splitTextIntoColumns(lines) {
    const columns = [];
    const wordsPerColumn = Math.ceil(lines.length / columnsNum);
    let columnIndex = 0;
    let columnText = '';

    lines.forEach(line => {
        const words = line.split(' ');
        words.forEach(word => {
            if (isChord(word)) {
                columnText += createChordSpan(word) + ' ';
            } else {
                columnText += word + ' ';
            }
        });
        columnText += '\n';
        if ((columns[columnIndex]?.length || 0) >= wordsPerColumn) {
            columnIndex++;
        }
        columns[columnIndex] = columns[columnIndex] || [];
        columns[columnIndex].push(columnText.trim());
        columnText = '';
    });

    return columns.map(columnLines => columnLines.join('\n'));
}

function displayColumnsInOutput(columns) {
    const outputDiv = document.getElementById('output');
    outputDiv.innerHTML = '';
    const columnsDiv = document.createElement('div');
    columnsDiv.className = 'columns';
    columns.forEach(columnText => {
        const column = document.createElement('div');
        column.innerHTML = columnText;
        columnsDiv.appendChild(column);
    });
    outputDiv.appendChild(columnsDiv);
}

function saveText() {
    const inputText = document.getElementById('inputText').value;
    const firstLine = inputText.split('\n')[0];
    const savedTexts = JSON.parse(localStorage.getItem('savedTexts')) || {};
    savedTexts[firstLine] = inputText;

    localStorage.setItem('savedTexts', JSON.stringify(savedTexts));
}

function splitText() {
    const inputText = document.getElementById('inputText').value;
    const lines = inputText.split('\n');
    const columns = splitTextIntoColumns(lines, columnsNum);

    if (wasMainBtnClick){
        this.saveText();
        wasMainBtnClick = false;
    }

    displayColumnsInOutput(columns);

    document.getElementById('inputText').style.display = 'none';
    document.getElementById('splitBtn').style.display = 'none';
    document.getElementById('randomBtn').style.display = 'none';
    document.getElementById('savedTexts').style.display = 'none';

    document.querySelector('.columns').addEventListener('wheel', function(event) {
        const delta = Math.sign(event.deltaY);
        adjustFontSizeByMouseWheel(delta);
        event.preventDefault();
    });

    const savedTextsDiv = document.getElementById('savedTexts');
    savedTextsDiv.innerHTML = '';
    const savedTexts = JSON.parse(localStorage.getItem('savedTexts')) || {};
    for (const key in savedTexts) {
        if (savedTexts.hasOwnProperty(key)) {
            savedTextsDiv.innerHTML += `<button onclick="displaySavedText('${key}')">${key}</button>`;
        }
    }

    adjustFontSize();
}

let lastKeyOfDisplaySavedText = null;
function displaySavedText(key, ev) {
    const savedTexts = JSON.parse(localStorage.getItem('savedTexts')) || {};
    const inputText = savedTexts[key];
    lastKeyOfDisplaySavedText = key;

    if (window.DELETE_BUTTON_MODE) {
        delete savedTexts[key];
        const btns = document.getElementById('savedTexts');
        btns.innerHTML = btns.innerHTML.replace(`<button onclick="displaySavedText('${key}')">${key}</button>`, '');
        localStorage.setItem('savedTexts', JSON.stringify(savedTexts));
        toggleBtnMode(false)
        return;
    }
    document.getElementById('inputText').value = inputText;
    splitText();
}

function adjustFontSizeByMouseWheel(delta) {
    let fontSize = parseFloat(document.querySelector('.columns').style.fontSize) || 16;
    const step = 2;
    if (delta > 0) {
        fontSize -= step;
    } else {
        fontSize += step;
    }
    document.querySelector('.columns').style.fontSize = fontSize + 'px';
}

function adjustFontSize() {
    const columns = document.querySelector('.columns');
    const windowHeight = window.outerHeight;
    const marginY = 50;
    const height = windowHeight - marginY;
    const songText = columns.innerText;
    const rowNum = songText.split('\n').length;

    if (columns.innerHTML.indexOf('<audio') >= 0) {
        proccessAudio();
    }

    const textSize = height / (rowNum / columnsNum * 2) //* 1.4  //* (columnsNum * 0.5);

    const minFontSize = 1; // Minimum font size
    const maxFontSize = 124; // Maximum font size
    let fontSize = textSize;

    fontSize = Math.min(maxFontSize, Math.max(minFontSize, fontSize));

    columns.style.fontSize = fontSize.toFixed(2) + 'px';
}

window.addEventListener('resize', adjustFontSize);
document.addEventListener('DOMContentLoaded', adjustFontSize);
