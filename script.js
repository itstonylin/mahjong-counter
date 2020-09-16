// variables
let position = [];
let names = [];
let startingMoney = [];
let history = [];
let repeatWins = [];
let highestMoney = [];
let lowestMoney = [];
let turns = 16;
let rounds = 1;
let pointer = 0;
let game = 1;
// finds whose turn it is
let findCurrentPlayer = () => {
    let pointer = 0;
    repeatWins = [0, 0, 0, 0];
    for (let i = 0; i < history.length; i++) {
        if (position[pointer] !== history[i][0]) {
            pointer = (pointer + 1) % position.length;
            repeatWins = [0, 0, 0, 0];
        } else {
            repeatWins[position[pointer] - 1]++;
        }
    }
    let correspondingGridsToPlayerNum = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [9, 10, 11],
    ];
    // changes the colour of the current players background to darker blue
    // resets everyone's background colour back to sky blue
    Array.from(document.getElementsByClassName("content")).forEach(function (item) {
        item.style.backgroundColor = "skyblue";
    });
    // changes the leader's background colour to darker blue
    for (let i = 0; i < correspondingGridsToPlayerNum[position[pointer] - 1].length; i++) {
        document.getElementsByClassName("content")[correspondingGridsToPlayerNum[position[pointer] - 1][i]].style.backgroundColor = "#3399ff";
    }
    return position[pointer];
};

// shows the red dot to show whos turn it is
let renderRedDot = () => {
    redDotSpot = findCurrentPlayer();
    for (let i = 0; i < position.length; i++) {
        document.getElementById("player" + (i + 1) + "-red").style.visibility = "hidden";
    }
    document.getElementById("player" + redDotSpot + "-red").style.visibility = "visible";
};
// shows net income
let renderNetIncome = () => {
    let balance = renderBalance();
    let netIncome = [];
    for (let i = 0; i < 4; i++) {
        netIncome[i] = balance[i] - startingMoney[i];
        document.getElementById("player" + (i + 1) + "-netIncome").innerHTML = netIncome[i];
    }
};
// shows money lost
let renderMoneyLost = () => {
    let moneyLost = [0, 0, 0, 0];
    for (let i = 0; i < history.length; i++) {
        let winner = history[i][0] - 1;
        for (let x = 0; x < 4; x++) {
            if (x !== winner) {
                moneyLost[x] -= history[i][1];
            }
        }
    }
    for (let i = 0; i < 4; i++) {
        moneyLost[i] = (moneyLost[i] * -1);
        document.getElementById("player" + (i + 1) + "-moneyLost").innerHTML = moneyLost[i];
    }
};
// shows the highest money reached and lowest money reached for every person
let renderHighAndLowMoneyReceived = () => {
    let balance = [];
    let highestBalance = [];
    let lowestBalance = [];
    for (let i = 0; i < 4; i++) {
        balance.push(parseInt(startingMoney[i]));
        highestBalance.push(parseInt(startingMoney[i]));
        lowestBalance.push(parseInt(startingMoney[i]));
    }
    for (let i = 0; i < history.length; i++) {
        for (let x = 0; x < balance.length; x++) {
            if (history[i][0] - 1 === x) {
                balance[x] += 3 * history[i][1];
            } else {
                balance[x] -= history[i][1];
            }
            highestBalance[x] = Math.max(balance[x], highestBalance[x]);
            lowestBalance[x] = Math.min(balance[x], lowestBalance[x]);
        }
    }

    for (let i = 0; i < 4; i++) {
        document.getElementById("player" + (i + 1) + "-highscore").innerHTML = highestBalance[i];
        document.getElementById("player" + (i + 1) + "-lowscore").innerHTML = lowestBalance[i];
    }
};
// shows the highest amount received for each person
let renderMoneyReceived = () => {
    let moneyReceived = [0, 0, 0, 0];
    for (let i = 0; i < history.length; i++) {
        if (history[i][1] > 0) {
            moneyReceived[history[i][0] - 1] += 3 * history[i][1];
        }
    }
    for (let i = 0; i < 4; i++) {
        document.getElementById("player" + (i + 1) + "-moneymade").innerHTML = moneyReceived[i];
    }
};
// shows the highest single win of each person
let renderHighestSingleWin = () => {
    let highestWin = [0, 0, 0, 0];
    for (let i = 0; i < history.length; i++) {
        if (history[i][1] > 0) {
            highestWin[history[i][0] - 1] = Math.max(3 * history[i][1], highestWin[history[i][0] - 1]);
        }
    }
    for (let i = 0; i < 4; i++) {
        document.getElementById("player" + (i + 1) + "-highest-money-received").innerHTML = highestWin[i];
    }
};

// shows the history of winnings
let renderHistory = () => {
    // table variables
    let table = document.getElementById("history");
    // resets the table
    table.innerHTML = "";
    let row = table.insertRow(0);
    let cell1 = row.insertCell(0);
    let cell2 = row.insertCell(1);

    // initial headings
    cell1.innerHTML = "Turn";
    cell2.innerHTML = "History";

    // prints all the winnings
    for (let i = 0; i < history.length; i++) {
        row = table.insertRow(1);
        cell1 = row.insertCell(0);
        cell2 = row.insertCell(1);
        cell1.innerHTML = "Game (局) " + game + " Turn (顺序) " + (i + 1);
        cell2.innerHTML =
            names[history[i][0] - 1] + ' <i class="fas fa-award"></i> ' + history[i][1] * 3 + " (" + history[i][1] + ' <i class="fas fa-users"></i>)';
    }
};
// shows the money won from the previous round
let renderPrizeWon = () => {
    let playerNum = 0;
    let amount = 0;
    if (history.length > 0) {
        playerNum = history[history.length - 1][0];
        amount = history[history.length - 1][1];
    }
    for (let i = 0; i < 4; i++) {
        let repeatedWinLogo = '<i class="fas fa-step-backward"></i>';
        if (playerNum === i + 1) {
            if (amount > 0) {
                document.getElementById("player" + (i + 1) + "-prize").innerHTML = repeatedWinLogo + " +" + 3 * amount;
            } else {
                document.getElementById("player" + (i + 1) + "-prize").innerHTML = repeatedWinLogo + " " + 3 * amount;
            }
        } else {
            if (amount < 0) {
                document.getElementById("player" + (i + 1) + "-prize").innerHTML = repeatedWinLogo + "+" + -1 * amount;
            } else {
                document.getElementById("player" + (i + 1) + "-prize").innerHTML = repeatedWinLogo + " " + -1 * amount;
            }
        }
    }
};

// shows how much money everyone has after a money input
let renderBalance = () => {
    let balance = [];
    for (let i = 0; i < 4; i++) {
        balance.push(parseInt(startingMoney[i]));
    }
    for (let i = 0; i < history.length; i++) {
        for (let x = 0; x < balance.length; x++) {
            if (history[i][0] - 1 === x) {
                balance[x] += 3 * history[i][1];
            } else {
                balance[x] -= history[i][1];
            }
        }
    }

    for (let i = 0; i < 4; i++) {
        let moneyBill = '<i class="fas fa-money-bill"></i>';
        document.getElementById("balance-player" + (i + 1)).innerHTML = moneyBill + " " + balance[i];
    }
    return balance;
};
// shows the round and turns left
let renderGamesAndRoundsAndTurns = () => {
    turns = 16;
    rounds = 1;
    pointer = 0;
    game = 1;
    // turns-left and round-number
    for (let i = 0; i < history.length; i++) {
        if (history[i][0] !== position[pointer]) {
            turns--;
            pointer = (pointer + 1) % 4;
            if (turns % 4 === 0) {
                rounds++;
            }
            if (rounds === 5) {
                game++;
                rounds = 1;
                turns = 16;
            }
        }
    }
    document.getElementById("turns-left").innerHTML = turns;
    document.getElementById("round-number").innerHTML = rounds;
    document.getElementById("game-num").innerHTML = game;
};
// shows total wins
let renderWinCount = () => {
    let wins = [0, 0, 0, 0];
    for (let i = 0; i < history.length; i++) {
        wins[history[i][0] - 1]++;
    }

    for (let i = 0; i < wins.length; i++) {
        let winTrophies = '<i class="fas fa-trophy"></i>';
        document.getElementById("display-wins-player" + (i + 1)).innerHTML = winTrophies + " " + wins[i];
    }
};
// shows the wins on your turn
let renderRepeatedWinCount = () => {
    findCurrentPlayer();
    for (let i = 0; i < repeatWins.length; i++) {
        let repeatedWinCrown = '<i class="fas fa-crown"></i>';
        if (repeatWins[i] !== 0) {
            document.getElementById("player" + (i + 1) + "-king").style.display = "block";
            document.getElementById("player" + (i + 1) + "-king").innerHTML = repeatedWinCrown + " " + repeatWins[i];
        } else {
            document.getElementById("player" + (i + 1) + "-king").style.display = "none";
        }
    }
};
// renders every change in program
let render = () => {
    renderBalance();
    renderPrizeWon();
    renderGamesAndRoundsAndTurns();
    renderRedDot();
    renderWinCount();
    renderRepeatedWinCount();
    renderHighAndLowMoneyReceived();
    renderMoneyReceived();
    renderHighestSingleWin();
    renderHistory();
    renderMoneyLost();
    renderNetIncome();
};

// removes last move and calls render
let undo = () => {
    if (history.length > 0) {
        history.pop();
        render();
    }
};

// adds history and calls render
let addHistory = (playerNum, amount) => {
    history.push([playerNum, amount]);
    render();
};

// Event listeners for they the players add money
for (let i = 0; i < 4; i++) {
    let moneyInput = document.getElementById(`enter-money-player${i + 1}`);
    moneyInput.addEventListener("keyup", function (event) {
        if (event.keyCode === 13) {
            let moneyVal = parseInt(moneyInput.value);
            if (!isNaN(moneyVal)) {
                addHistory(i + 1, moneyVal);
                moneyInput.value = "";
                render();
            }
        }
    });
}

// puts the names of the people playing in the stats and the main part of the program
let initializeNames = () => {
    for (let i = 0; i < 4; i++) {
        // main part
        document.getElementById("name-player" + (i + 1)).innerHTML = names[i];
        // stats
        document.getElementById("stats-player" + (i + 1)).innerHTML = names[i];
    }
};

// puts the money they entered in loading page
let initializeMoney = () => {
    for (let i = 0; i < 4; i++) {
        document.getElementById("balance-player" + (i + 1)).innerHTML = startingMoney[i];
    }
};
let undoButton = document.getElementById("undo-button");
undoButton.addEventListener("click", function (event) {
    event.preventDefault();
    undo();
});
// event listener to delete the form and show the container
// retrieves all of the form data
let form = document.getElementById("form");
form.addEventListener("submit", function (event) {
    // prevents default behaviour
    event.preventDefault();
    // deletes the form and shows the counter
    document.getElementById("form").style.display = "none";
    document.getElementById("main-container").style.display = "block";

    // retrieves form input
    let tempNames = document.getElementsByClassName("name-input");
    let tempPosition = document.getElementsByClassName("position-dropdownlist");
    let tempStartingMoney = document.getElementsByClassName("money-input");

    for (let i = 0; i < 4; i++) {
        position.push(0);
    }
    for (let i = 0; i < 4; i++) {
        position[parseInt(tempPosition[i].value) - 1] = i + 1;
        names[i] = tempNames[i].value;
        startingMoney[i] = tempStartingMoney[i].value;
    }

    // sets up the names
    initializeNames();
    // sets up the money
    initializeMoney();
    // render page
    render();
});
