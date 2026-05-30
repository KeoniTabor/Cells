let cells = []

let gridSize = 200;

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
    //get coords
    const y = Math.floor(Math.random() * gridSize);
    const x = Math.floor(Math.random() * gridSize);

    //build it
    birthCell(x, y);
}

function placeCell(cell) {
    const space = document.querySelector(`.space[data-row='${cell.y}'][data-col='${cell.x}']`)
    space.style.backgroundColor = '#000000';
}


function step() {
    let deadCells = []
    let bornCellCoordinates = []
    cells.forEach(cell => {
        //age cell
        const ageIncrease = Math.random() * (100/24*2);
        cell.age += ageIncrease;
        
        //kill cell if needed
        if (cell.age >= 100) {
            deadCells.push(cell);
        }

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
                'y': chosenSpace.y
            })
        }

    })
    deadCells.forEach(deadCell => killCell(deadCell));
    bornCellCoordinates.forEach(bornCell => birthCell(bornCell.x, bornCell.y));

}

function birthCell(x, y) {
    const cell = {
        'x': x,
        'y': y,
        'age': 0,
        'fertility': 0
    }
    cells.push(cell);
    placeCell(cell)
}

function killCell(cell) {
    const space = document.querySelector(`.space[data-row='${cell.y}'][data-col='${cell.x}']`);
    space.style.backgroundColor = '';

    cells = cells.filter(c => !(c.x === cell.x && c.y === cell.y));
}

