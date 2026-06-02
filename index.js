let settings = {
    gridSize: 20,
    mutationSpeed: 1,
    secondsPerStep: 6
}

let cells = []

let stepIntervalId;

//permanent DOM elements
const initialSettingsContainer = document.getElementById('initialSettingsContainer');
const speedInput = document.getElementById('speedInput');
speedInput.disabled = false;
speedInput.readOnly = false;
const gridSizeInput = document.getElementById('gridSizeInput');
gridSizeInput.disabled = false;
gridSizeInput.readOnly = false;
const startButton = document.getElementById('startButton');
const pauseButton = document.getElementById('pauseButton');
const resumeButton = document.getElementById('resumeButton');
const grid = document.getElementById('grid')

startButton.addEventListener('click', () => {
    //save settings
    settings.gridSize = document.getElementById('gridSizeInput').value;
    settings.secondsPerStep = document.getElementById('speedInput').value;
    
    //update UI (buttons)
    initialSettingsContainer.classList.add('hidden');
    pauseButton.classList.remove('hidden');

    //then get things started
    start();
})

document.getElementById('pauseButton').addEventListener('click', () => {
    //update UI buttons
    pauseButton.classList.add('hidden');
    resumeButton.classList.remove('hidden');

    //pause
    clearInterval(stepIntervalId);
});
document.getElementById('resumeButton').addEventListener('click', () => {
    //update UI buttons
    resumeButton.classList.add('hidden');
    pauseButton.classList.remove('hidden');

    //resume
    startStepInterval();
});
document.getElementById('saveButton').addEventListener('click', save);
document.getElementById('uploadFile').addEventListener('change', (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.readAsText(file);
    reader.onload = () => {
        const data = JSON.parse(reader.result)
        load(data)
    }
})


function save() {
    //pep the data
    const data = {
        settings: settings,
        cells: cells
    }
    const json = JSON.stringify(data);
    const blob = new Blob([json], {type: 'application/json'});
    const url = URL.createObjectURL(blob);
   
    //get the date to dame the file
    const date = new Date;
    const month = date.getMonth();
    const day = date.getDate();
    const year = date.getFullYear();
    const hour = date.getHours();
    const minute = date.getMinutes()

    //download it
    const a = document.createElement('a')
    a.href = url;
    a.download = `cells(${month}-${day}-${year}-${hour}${minute}).json`
    a.click();

    //clear
    URL.revokeObjectURL(url);
}

function load(data) {
    //set and update the settings
    settings = data.settings;
    initialSettingsContainer.classList.add('hidden');
    console.log(settings);
    //build the board
    cells = data.cells
    buildGrid();
    cells.forEach(cell => {
        placeCell(cell);
        console.log('cells placed');
    })
    //allow to resume
    resumeButton.classList.remove('hidden');
    startButton.classList.add('hidden');
}

function start() {
    buildGrid();
    createFirstCell();
    startStepInterval();

    //update dom
    document.getElementById('startButton').classList.add('hidden');
    const menu = document.getElementById('menu');
    const progressButton = document.createElement('button');
    progressButton.textContent = 'progress';
    progressButton.onclick = () => step()
    menu.appendChild(progressButton);

    //build array
}

function startStepInterval() {
    stepIntervalId = setInterval(() => {
    step();
    console.log('stepped')
    }, (settings.secondsPerStep * 1000) / cells.length);
}

//builds the spaces on the dom
function buildGrid() {
    for (let row = 0; row < settings.gridSize; row++) {
        for (let col = 0; col < settings.gridSize; col++) {
            const space = document.createElement('div');
            grid.appendChild(space);
            space.classList.add('space');
            space.dataset.row = row;
            space.dataset.col = col;
            space.addEventListener('click', () => {
            });
            }
        }
    grid.style.gridTemplateColumns = `repeat(${settings.gridSize}, 1fr)`
    grid.style.gridTemplateRows = `repeat(${settings.gridSize}, 1fr)`
    const width = window.innerWidth;
    const height = window.innerHeight;

    if (width >= height) {
        grid.style.height = .9 * height;
    }

    else {
        grid.style.width = .9 * width;
    }

}


function createFirstCell() {
    const cell = {
        'x': Math.floor(Math.random() * settings.gridSize),
        'y': Math.floor(Math.random() * settings.gridSize),
        'age': 0,
        'fertility': 0,
        'r': 127,
        'g': 127,
        'b': 127
    }
    console.log(cell);
    cells.push(cell);
    placeCell(cell);
}

function placeCell(cell) {
    const space = document.querySelector(`.space[data-row='${cell.y}'][data-col='${cell.x}']`)
    space.style.backgroundColor = `rgb(${cell.r}, ${cell.g}, ${cell.b})`;
    space.style.borderWidth = '1%';
    space.style.borderStyle = 'solid';
    space.style.borderColor = `rgb(${cell.r - 2}, ${cell.g - 2}, ${cell.b - 2})`;

}



function step() {
    const cell = cells[Math.floor((Math.random() * cells.length))]
    //reproduce?
    //count neighbors
    let numberOfNeighbors = 0
    let possibleSpaces = []
    if (cells.some(c => c.x === cell.x + 1 && c.y === cell.y) || cell.x + 1 >= settings.gridSize) {
        numberOfNeighbors += 1;
    }
    else {
        possibleSpaces.push({
            'x': cell.x + 1,
            'y': cell.y
        });
    }
    if (cells.some(c => c.x === cell.x - 1 && c.y === cell.y) || cell.x - 1 < 0) {
        numberOfNeighbors += 1;
    }
    else {
        possibleSpaces.push({
            'x': cell.x - 1,
            'y': cell.y
        });
    }
    if (cells.some(c => c.x === cell.x && c.y === cell.y + 1) || cell.y + 1 >= settings.gridSize) {
        numberOfNeighbors += 1;
    }
    else {
        possibleSpaces.push({
            'x': cell.x,
            'y': cell.y + 1
        });
    }
    if (cells.some(c => c.x === cell.x && c.y === cell.y - 1) || cell.y - 1 < 0) {
        numberOfNeighbors += 1;
    }
    else {
        possibleSpaces.push({
            'x': cell.x,
            'y': cell.y -1
        });
    }

    //set probability of reproduction in life
    let pReproduce;
    if (numberOfNeighbors === 4) {
        pReproduce = 0;
    }
    else {
        pReproduce = 25 * (2 ** (3 - numberOfNeighbors));
    }
    const fertilityIncrease = Math.random() * pReproduce * 4 / 24;
    cell.fertility += fertilityIncrease

    //reproduce
    let chosenSpace;
    if (cell.fertility >= 100) {
        cell.fertility -= 100;
        chosenSpace = possibleSpaces[Math.floor(Math.random() * possibleSpaces.length)]
        birthCell(cell, chosenSpace.x, chosenSpace.y)
    }

    //die?
    //age cell
    //(random * 2 gets a number from 0-2 so the average is 1 but it can be + or - 1)
    //multiply that by (max age / average steps), this is mean amount they will age
    const ageIncrease = (Math.random() * 2 ) * (100/24);
    cell.age += ageIncrease;
    
    //kill cell if needed
    if (cell.age >= 100) {
        killCell(cell);
    }
}


function birthCell(parent, x, y) {
    const cell = {
        'x': x,
        'y': y,
        'age': 0,
        'fertility': 0,
        'r': evolveColor(parent.r), 
        'g': evolveColor(parent.g),
        'b': evolveColor(parent.b)
    }
    cells.push(cell);
    placeCell(cell)
}

function killCell(cell) {
    const space = document.querySelector(`.space[data-row='${cell.y}'][data-col='${cell.x}']`);
    space.style.backgroundColor = '';
    space.style.border = '';

    cells = cells.filter(c => !(c.x === cell.x && c.y === cell.y));
}

function evolveColor(value) {
    let newValue = value + (Math.floor(Math.random() * 3) - 1);
    if (newValue < 0 ) {
        newValue = 0;
    }
    if (newValue > 255) {
        newValue = 255;
    }
    return newValue;
}


