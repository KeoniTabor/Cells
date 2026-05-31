let cells = []

let gridSize = 100;

let mutationSpeed = 1;

document.getElementById('startButton').addEventListener('click', start);

function start() {
    buildGrid();
    createFirstCell();
    setInterval(() => {
    step()
    }, 1);

    //update dom
    document.getElementById('startButton').classList.add('hidden');
    const progressButton = document.createElement('button');
    progressButton.textContent = 'progress';
    progressButton.onclick = () => step()
    document.body.prepend(progressButton);

    //build array
}

//builds the spaces on the dom
function buildGrid() {
    const grid = document.getElementById('grid');
    for (let row = 0; row < gridSize; row++) {
        for (let col = 0; col < gridSize; col++) {
            const space = document.createElement('div');
            grid.appendChild(space);
            space.classList.add('space');
            space.dataset.row = row;
            space.dataset.col = col;
            space.addEventListener('click', () => {
            });
            }
        }
    }


function createFirstCell() {
    const cell = {
        'x': Math.floor(Math.random() * gridSize),
        'y': Math.floor(Math.random() * gridSize),
        'age': 0,
        'fertility': 0,
        'r': 127,
        'g': 127,
        'b': 127
    }
    cells.push(cell);
    placeCell(cell);
}

function placeCell(cell) {
    const space = document.querySelector(`.space[data-row='${cell.y}'][data-col='${cell.x}']`)
    space.style.backgroundColor = `rgb(${cell.r}, ${cell.g}, ${cell.b})`;
}


function step() {
    let deadCells = []
    let bornCellCoordinates = []
    cells.forEach(cell => {
        //reproduce
        //count neighbors
        let numberOfNeighbors = 0
        let possibleDirections = []
        if (cells.some(c => c.x === cell.x + 1 && c.y === cell.y) || cell.x + 1 >= gridSize) {
            numberOfNeighbors += 1;
        }
        else {
            possibleDirections.push({
                'x': cell.x + 1,
                'y': cell.y
            });
        }
        if (cells.some(c => c.x === cell.x - 1 && c.y === cell.y) || cell.x - 1 < 0) {
            numberOfNeighbors += 1;
        }
        else {
            possibleDirections.push({
                'x': cell.x - 1,
                'y': cell.y
            });
        }
        if (cells.some(c => c.x === cell.x && c.y === cell.y + 1) || cell.y + 1 >= gridSize) {
            numberOfNeighbors += 1;
        }
        else {
            possibleDirections.push({
                'x': cell.x,
                'y': cell.y + 1
            });
        }
        if (cells.some(c => c.x === cell.x && c.y === cell.y - 1) || cell.y - 1 < 0) {
            numberOfNeighbors += 1;
        }
        else {
            possibleDirections.push({
                'x': cell.x,
                'y': cell.y -1
            });
        }

        //probability of reproduction in life
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
            chosenSpace = possibleDirections[Math.floor(Math.random() * possibleDirections.length)]
            bornCellCoordinates.push({
                'x': chosenSpace.x,
                'y': chosenSpace.y,
                'parent': cell
            })
        }

        //age cell
        //(random * 2 gets a number from 0-2 so the average is 1 but it can be + or - 1)
        //multiply that by (max age / average steps), this is mean amount they will age
        const ageIncrease = (Math.random() * 2 ) * (100/24);
        cell.age += ageIncrease;
        
        //kill cell if needed
        if (cell.age >= 100) {
            deadCells.push(cell);
        }

    })
    deadCells.forEach(deadCell => killCell(deadCell));
    bornCellCoordinates.forEach(bornCell => birthCell(bornCell.parent, bornCell.x, bornCell.y));

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


