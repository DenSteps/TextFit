
//#region Audio

function proccessAudio() {
    var audioPlayer = document.getElementById('audioPlayer');

    // Задаем данные MP3 в Base64
    var base64Data = SAVED_HARDCODE_HARDMETAL_SONGS[lastKeyOfDisplaySavedText];
    if (!base64Data) { return; }


    // Создаем Blob из строки Base64
    var blob = b64toBlob(base64Data, 'audio/mp3');

    // Создаем URL объекта Blob
    var blobUrl = URL.createObjectURL(blob);

    // Устанавливаем URL аудио элемента
    audioPlayer.src = blobUrl;
}

// Функция для преобразования строки Base64 в Blob
function b64toBlob(b64Data, contentType) {
    contentType = contentType || '';
    var sliceSize = 512;
    var byteCharacters = atob(b64Data);
    var byteArrays = [];

    for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
        var slice = byteCharacters.slice(offset, offset + sliceSize);

        var byteNumbers = new Array(slice.length);
        for (var i = 0; i < slice.length; i++) {
            byteNumbers[i] = slice.charCodeAt(i);
        }

        var byteArray = new Uint8Array(byteNumbers);
        byteArrays.push(byteArray);
    }

    var blob = new Blob(byteArrays, { type: contentType });
    return blob;
}

//#endregion