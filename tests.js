let numberOfTests = 1000;

let stepsUntilDeath = []
let ageOfDeath = []

function calculateCellDeaths() {
    console.log('started')
    for (let i = 0 ; i < numberOfTests; i++) {
        let cellAge = 0;
        let cellSteps = 0;
        const deathAge = 100;
        while (cellAge < deathAge) {
            let cellAgeIncrease = Math.random() * (100/24*2);
            cellAge += cellAgeIncrease;
            cellSteps ++;
            if (cellAge > deathAge) {
                ageOfDeath.push(cellAge)
                stepsUntilDeath.push(cellSteps)
                break;
            }
        }
    } 
    const averageAgeOfDeath = getData(ageOfDeath)
    const averageStepsUntilDeath = getData(stepsUntilDeath)
    console.log(averageAgeOfDeath, averageStepsUntilDeath);
}

function getData(data) {
    const averageData = data.reduce((sum, age) => sum + age, 0) / data.length;
    return averageData;
}