const fs = require('fs-extra');
const Store = require('electron-store');
let store = new Store();
const nl = "\r\n";

const electronRemote = require('electron').remote;
const dialog = electronRemote.dialog;
let dragOver = false;

function allowDrop(ev) {
    ev.preventDefault();
    if (!dragOver)
    {
        dragOver = true;
        vm.$forceUpdate();
    }
}
  
function drop(ev) {
    if (ev.dataTransfer.files)
    {
        for (var i = 0; i < ev.dataTransfer.files.length; i++)
        {
            let file = ev.dataTransfer.files[i];
            let fileType = file.type.split("/").pop();
            if (fileType === 'json')
            {
                processJSON(file);
            } else {
                let obj = { msgType : 'notjson' };
                obj.msg = `${file.name} is not a JSON file.`;
                log.push(obj);
            }
        }
    }
}

function processTime(time)
{
    let arrTime = time.split('.');
    let frames = arrTime.pop().toString();
    while (frames.length < 3) frames = `${frames}0`;

    let arrClock = arrTime[0].split(":");
    while (arrClock.length < 3) arrClock.unshift("0");

    let hours = arrClock[0].toString();
    let minutes = arrClock[1].toString();
    let seconds = arrClock[2].toString();

    while (hours.length < 2) hours = `0${hours}`;
    while (minutes.length < 2) minutes = `0${minutes}`;
    while (seconds.length < 2) seconds = `0${seconds}`;

    return `${hours}:${minutes}:${seconds}.${frames}`;
}

function processJSON(file)
{
    fs.readJSON(file.path, (err, res) => {
        console.log(res);
        let obj = { msgType : 'json' };
        if (!res.hasOwnProperty('words'))
        {
            obj.msgType = 'badjson';
            obj.msg = `${file.name} is an invalid JSON file`;
        } else {
            let src = file.name.split('.');
            src.pop();
            src.push('vtt');
            let saveFilePath = store.get('saveFolder') + "\\" + src.join('.');

            let data = 'WEBVTT';

            let words, start, end, id;

            words = [];
            id = 0;

            res.words.forEach((word) => {
                if (words.length === 0)
                {
                    start = word.time;
                    id++;
                }

                if (word.name === '.')
                {
                    end = word.time;
                    data = `${data}${nl}${nl}${id}${nl}${processTime(start)} --> ${processTime(end)}${nl}${words.join(" ")}${word.name}`;
                    words = [];
                } else {
                    words.push(word.name);
                }
            });

            obj.msg = `${file.name} SAVED!`;
            fs.writeFile(saveFilePath, data);
        }
        log.push(obj);
    })
}

let log = [];
