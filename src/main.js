'use strict';
console.log("main.js loaded.");

// imports
import { computerLogic } from "./computerLogic.js";

// global constants and variables declarations:

// public:
export const PLAYER_SHAPE = 0;
export const COMPUTER_SHAPE = (PLAYER_SHAPE + 1) % 2;
export let stepCount = 0;
export let board = [-1, -1, -1, -1, -1, -1, -1, -1, -1];
export let step = [-1, -1, -1, -1, -1, -1, -1, -1, -1];

// private:
const sleepTime = 400;
let computerStarts = false;
let nextShape = PLAYER_SHAPE;
let clickAvailable = true;
let gameModeSingle = true;
let gameOver = false;
let xScore = 0;
let cScore = 0;

// add event listeners
for (let iii = 0; iii < 9; iii++) {
    document.getElementsByClassName('gameSquare')[iii].addEventListener('click', e => { getClick(iii); });
}
document.getElementById('singleP').addEventListener('click', e => { selectGameMode(0); });
document.getElementById('doubleP').addEventListener('click', e => { selectGameMode(1); });
document.getElementById('newGame').addEventListener('click', e => { resetGame(); });
document.getElementById('resetScore').addEventListener('click', e => { resetScore(); });

function selectGameMode(userSelection) {
    if (userSelection === 0) {
        console.log("selectMode(): Single mode.");
        gameModeSingle = true;
        computerStarts = true;
        resetGame();
        resetScore();
    }
    else if (userSelection === 1) {
        console.log("selectMode(): double mode.");
        gameModeSingle = false;
        resetGame();
        resetScore();
    }
    else {
        console.log("error from selectGameMode");
    }
}

function resetScore() {
    console.log("resetScore()");
    xScore = 0;
    cScore = 0;
    drawScore();
}

// draw both players' score on the screen
function drawScore() {
    document.getElementById("scoreDisplay").innerHTML = xScore + " / " + cScore;
}

function resetGame() {
    console.log("resetGame()");
    stepCount = 0;
    clickAvailable = true;
    for (let iii = 0; iii < 9; iii++) {
        board[iii] = -1;
        step[iii] = -1;
    }
    computerStarts = !computerStarts;
    for (let iii = 0; iii < 9; iii++) {
        let elem = document.getElementsByClassName("gameSquare")[iii];
        elem.style.display = 'none';
        setTimeout(() => { elem.classList.remove("xSquare"); }, 200);
        setTimeout(() => { elem.classList.remove("cSquare"); }, 200);
        setTimeout(() => { elem.style.display = 'flex'; }, 230);
    }
    if (computerStarts) {
        nextShape = COMPUTER_SHAPE;
        if (gameModeSingle) {
            clickAvailable = false;
            setTimeout(() => { gameLogic(computerLogic(-1)); }, sleepTime);
            setTimeout(() => { clickAvailable = true; }, sleepTime);
            
        }
    }
    else {
        nextShape = PLAYER_SHAPE;
    }
}

// called by user clickes on game squares
function getClick(square) {
    console.log("getClick()");
    // check if click is permited.
    if (!clickAvailable || board[square] !== -1) {
        console.log("click not available");
    }
    else {
        if (gameModeSingle) {
            getClickSingle(square);
        }
        else if (!gameModeSingle) {
            getClickDouble(square);
        }
    }
    console.log("getClick ended.");
}

// called by getClick if gameModeSingle === true
function getClickSingle(square) {
    gameLogic(square);
    if (gameOver) {
        gameOver = false;
        clickAvailable = false;
        setTimeout(() => { resetGame(); }, sleepTime);
        setTimeout(() => { clickAvailable = true; });
        return;
    }
    else {
        clickAvailable = false;
        setTimeout(() => { gameLogic(computerLogic(square)) }, sleepTime);
        setTimeout(() => {if (gameOver) {
            gameOver = false;
            clickAvailable = false;
            setTimeout(() => { resetGame(); }, sleepTime);
            setTimeout(() => { clickAvailable = true; });    
            return;
        }}, sleepTime);
        setTimeout(() => { clickAvailable = true; }, sleepTime);
    }
}

// called by getClick if gameModeSingle === false
function getClickDouble(square) {
    gameLogic(square);
    if (gameOver) {
        gameOver = false;
        clickAvailable = false;
        setTimeout(() => { resetGame(); }, sleepTime);
        setTimeout(() => { clickAvailable = true; });
        return;
    }
}

function gameLogic(square) {
    console.log("gameLogic()");
    draw(square);
    step[stepCount] = square;
    board[square] = nextShape;
    console.log("board[ " + square + " ]: " + nextShape);
    stepCount++;
    if (stepCount > 2) {
        let checkWin = checkBoard(0, ((nextShape + 1) % 2) * 3, nextShape * 3, -1);
        if (checkWin.line !== -1) {
            win(checkWin.line);
        }
    }
    nextShape = (nextShape + 1) % 2;
    if (stepCount === 9) {
        gameOver = true;
    }
}
// draws correct shape on the screen
function draw(square) {
    console.log("draw(" + square + ")");
    let classToAdd = (nextShape === 0) ? "xSquare" : "cSquare";
    document.getElementsByClassName("gameSquare")[square].classList.add(classToAdd);
}

// increments correct score counter and calls drawScore
function win(line) {
    console.log("win()");
    if (nextShape === 0) {
        xScore++;
    }
    else {
        cScore++;
    }
    drawScore();
    gameOver = true;
}

// check for lines (row, column or diagonal) with specified number of empty, X and C squares
export function checkBoard(numOfEmpty, numOfX, numOfCircle, startPlace=-1) {
    console.log("checkBoard( " + numOfEmpty + " , " + numOfX + " , " + numOfCircle + " , " + startPlace + " )");
    let emptySquareCount = 0;
    let xSquareCount = 0;
    let circleSquareCount = 0;
    let checkResult = { line: startPlace, target: null };
    // checks columns.
    if (checkResult.line === -1) {
        for (let jjj = 0; jjj < 3; jjj++) {
            for (let iii = jjj; iii < 9; iii += 3) {
                if (board[iii] === -1) {
                    emptySquareCount++;
                    checkResult.target = iii;
                }
                else if (board[iii] === 0) {
                    xSquareCount++;
                }
                else if (board[iii] === 1) {
                    circleSquareCount++;
                }
            }
            checkResult.line++;
            if (emptySquareCount === numOfEmpty && xSquareCount === numOfX && circleSquareCount === numOfCircle) {
                return (checkResult);
            }
            else {
                checkResult.target = null;
                emptySquareCount = 0;
                xSquareCount = 0;
                circleSquareCount = 0;
            }
        }
    }

    // checks rows.
    if (checkResult.line <= 2) {
        checkResult.line = 2;
        for (let jjj = 0; jjj < 7; jjj += 3) {
            for (let iii = jjj; iii < jjj + 3; iii++) {
                if (board[iii] === -1) {
                    emptySquareCount++;
                    checkResult.target = iii;
                }
                else if (board[iii] === 0) {
                    xSquareCount++;
                }
                else if (board[iii] === 1) {
                    circleSquareCount++;
                }
            }
            checkResult.line++;
            if (emptySquareCount === numOfEmpty && xSquareCount === numOfX && circleSquareCount === numOfCircle) {
                return (checkResult);
            }
            else {
                checkResult.target = null;
                emptySquareCount = 0;
                xSquareCount = 0;
                circleSquareCount = 0;
            }
        }
    }

    // checks diagonals.
    if (checkResult.line <= 5) {
        checkResult.line = 5;
        for (let iii = 0; iii < 9; iii += 4) {
            if (board[iii] === -1) {
                emptySquareCount++;
                checkResult.target = iii;
            }
            else if (board[iii] === 0) {
                xSquareCount++;
            }
            else if (board[iii] === 1) {
                circleSquareCount++;
            }
        }
        checkResult.line++;
        if (emptySquareCount === numOfEmpty && xSquareCount === numOfX && circleSquareCount === numOfCircle) {
            return (checkResult);
        }
        else {
            checkResult.target = null;
            emptySquareCount = 0;
            xSquareCount = 0;
            circleSquareCount = 0;
        }
    }

    if (checkResult.line <= 6) {
        checkResult.line = 6;
        for (let iii = 2; iii < 7; iii += 2) {
            if (board[iii] === -1) {
                emptySquareCount++;
                checkResult.target = iii;
            }
            else if (board[iii] === 0) {
                xSquareCount++;
            }
            else if (board[iii] === 1) {
                circleSquareCount++;
            }
        }
        checkResult.line++;
        if (emptySquareCount === numOfEmpty && xSquareCount === numOfX && circleSquareCount === numOfCircle) {
            return (checkResult);
        }
        else {
            checkResult.target = null;
            emptySquareCount = 0;
            xSquareCount = 0;
            circleSquareCount = 0;
            checkResult.line = -1;
            return checkResult;
        }
    }
    else {
        checkResult.line = -1;
        checkResult.target = null;
        return checkResult;
    }
}