let columnsNum = 3;

// При загрузке страницы проверяем, есть ли тексты в локальном хранилище и отображаем их
window.onload = function () {
    let savedTexts = null // localStorage.getItem('savedTexts');
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
            console.log(`%c${savedText}`, 'color:gray;');
        }
    }

    document.getElementById('inputText')?.addEventListener('input', ((event) => {
        const text = event.target?.value;
        if (text !== '' && window.DELETE_BUTTON_MODE) {
            toogleBtnMode(false);
        }
        // console.log(text);
    }
    ));

    adjustFontSize();
}

function toogleBtnMode(deleteMode) {
    window.DELETE_BUTTON_MODE = deleteMode;
    const button = document.getElementById('splitBtn');
    button.style.backgroundColor = deleteMode ? 'red' : 'green';
    button.innerText = deleteMode ? 'УДОЛИТЬ' : 'СПАСИИСАХРАНИ';
}

let wasMainBtnClick = false;
function mainBtnClick() {
    const inputText = document.getElementById('inputText').value;
    if (inputText === '') {
        toogleBtnMode(!window.DELETE_BUTTON_MODE);
    } else {
        wasMainBtnClick = true;
        splitText();
    }
}

let lastRandomBtnIndex = null;
// let wasRandomBtnClick = false;

function randomBtnClick() {
    wasRandomBtnClick = true;
    // Получаем все кнопки
    const buttons = document.querySelectorAll('#savedTexts button');
    
    // Если кнопок нет, выходим из функции
    if (buttons.length === 0) return;

    let randomIndex = lastRandomBtnIndex;
    // Генерируем случайный индекс кнопки
    while (randomIndex == lastRandomBtnIndex) {
        randomIndex = Math.floor(Math.random() * buttons.length);
    }
    lastRandomBtnIndex = randomIndex

    // Выбираем случайную кнопку по индексу
    const randomButton = buttons[randomIndex];

    // Создаем и запускаем событие клика на случайной кнопке
    const clickEvent = new MouseEvent('click', {
        bubbles: true,
        noNeedToSave: true,
        cancelable: true,
        view: window
    });
    randomButton.dispatchEvent(clickEvent);
}



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
                // Обрезаем каждое слово до 100 символов
                // const truncatedWord = word.slice(0, 100);
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
    // Используем первую строку текста в качестве ключа
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

    // Скрываем поле ввода и кнопки
    document.getElementById('inputText').style.display = 'none';
    document.getElementById('splitBtn').style.display = 'none';
    document.getElementById('randomBtn').style.display = 'none';
    document.getElementById('savedTexts').style.display = 'none';

    document.querySelector('.columns').addEventListener('wheel', function(event) {
        // Получаем направление прокрутки
        const delta = Math.sign(event.deltaY);
        
        // Увеличиваем или уменьшаем размер шрифта в зависимости от направления
        adjustFontSizeByMouseWheel(delta);
        // adjustColumnsNumByMouseWheel(delta);
        
        // Отменяем действие по умолчанию, чтобы страница не прокручивалась
        event.preventDefault();
    });

    // Показываем кнопки сохраненных текстов
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
        toogleBtnMode(false)
        return;
    }
    document.getElementById('inputText').value = inputText;
    splitText();
}

function adjustFontSizeByMouseWheel(delta) {
    // Получаем текущий размер шрифта
    let fontSize = parseFloat(document.querySelector('.columns').style.fontSize) || 16;

    // Определяем размер шага изменения размера шрифта
    const step = 2;

    // Изменяем размер шрифта в зависимости от направления прокрутки
    if (delta > 0) {
        // Прокрутка вниз: уменьшаем размер шрифта
        fontSize -= step;
    } else {
        // Прокрутка вверх: увеличиваем размер шрифта
        fontSize += step;
    }

    // Устанавливаем новый размер шрифта
    document.querySelector('.columns').style.fontSize = fontSize + 'px';
}

function adjustColumnsNumByMouseWheel(delta) {
    const step = 1;
    if (delta > 0) {
        // Прокрутка вниз: уменьшаем кол-во колонок
        if (columnsNum >= 2)
            columnsNum -= step;
    } else {
        // Прокрутка вверх: увеличиваем кол-во колонок
        if (columnsNum <= 6)
            columnsNum += step;
    }
    displaySavedText(lastKeyOfDisplaySavedText);
}

function adjustFontSize() {
    const columns = document.querySelector('.columns');
    const container = document.querySelector('.container');
    const windowHeight = window.outerHeight;
    const marginY = 50;
    const height = windowHeight - marginY;
    const songText = columns.innerText;
    const rowNum = songText.split('\n').length;

    if (columns.innerHTML.indexOf('<audio') >= 0) {
        proccessAudio();
    }

    const textSize = height / (rowNum / columnsNum * 2) //* 1.4  //* (columnsNum * 0.5);

    // textSize += rowNum / 50

    // Determine the smallest dimension of the window
    // const minDimension = Math.min(windowWidth, windowHeight);

    // Calculate the ratio of the smallest dimension to the container's corresponding dimension
    // const ratio = minDimension / (minDimension === windowWidth ? containerWidth : containerHeight);

    // Adjust font size based on the ratio
    const minFontSize = 1; // Minimum font size
    const maxFontSize = 124; // Maximum font size
    let fontSize = textSize; //ratio * (parseFloat(columns.style.fontSize) || 10);

    // Ensure font size is within the specified range
    fontSize = Math.min(maxFontSize, Math.max(minFontSize, fontSize));

    columns.style.fontSize = fontSize.toFixed(2) + 'px';
}

// Call adjustFontSize whenever the window is resized
window.addEventListener('resize', adjustFontSize);

// Call adjustFontSize once the DOM is fully loaded
document.addEventListener('DOMContentLoaded', adjustFontSize);
