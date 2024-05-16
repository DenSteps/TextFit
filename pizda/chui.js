
function isChord(word) {
    // Регулярное выражение для определения аккорда
    const chordRegex = /^[A-H](#|b)?(m|maj|min|aug|dim|sus)?(\d|add\d|6\/9|7\-5|7\-9|7\#5|7\#9|7\+5|7\+9|7b5|7b9|7sus2|7sus4|add2|add4|add9|maj7|maj9|maj11|maj13|m6|m7|m9|m11|m13|mb5|sus|sus2|sus4)?(\/[A-H])?$/i;
    return chordRegex.test(word) && !word.includes('a');;
}


function getColorForChord(chord) {
    // Объект соответствия между аккордами и цветами
    const chordColors = {
        "A": "#1f77b4",    // Синий
        "B": "#ff7f0e",    // Оранжевый
        "C": "#2ca02c",    // Зеленый
        "D": "#d62728",    // Красный
        "E": "#9467bd",    // Фиолетовый
        "F": "#8c564b",    // Коричневый
        "G": "#e377c2"     // Розовый
        // Добавьте свои собственные соответствия для других аккордов, если необходимо
    };

    // Если цвет для аккорда определен, вернем его, иначе - вернем черный цвет
    return chordColors[chord[0]] || "gold";
}


function createChordSpan(chord) {
    const span = document.createElement('span');
    span.className = 'chord';
    span.style.color = getColorForChord(chord); // Получаем цвет для аккорда
    span.innerText = chord;
    return span.outerHTML;
}