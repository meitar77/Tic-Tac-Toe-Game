console.log("main.js loaded.");
var stepCount = 0;
var gameModeSingle = true;
const playerShape = 0;
const computerShape = (playerShape + 1) % 2;
var nextShape = playerShape;
var computerStarts = false;
var clickAvailable = true;
var gameOver = false;
var board = [-1,-1,-1,-1,-1,-1,-1,-1,-1];
var step = [-1,-1,-1,-1,-1,-1,-1,-1,-1];
var xScore = 0;
var cScore = 0;

function selectGameMode(userSelection) {
    if (userSelection == 0) {
        console.log("selectMode(): Single mode.");
        gameModeSingle = true;
        computerStarts = true;
        resetGame();
        resetScore();
    }
    else if (userSelection == 1) {
        console.log("selectMode(): double mode.");
        gameModeSingle = false;
        resetGame();
        resetScore();
    }
    else {
        console.log("error from selectGameMode");
    }
}

function resetGame() {
    console.log("resetGame()");
    stepCount = 0;
    clickAvailable = true;
    for (iii = 0; iii < 9; iii++) {
        board[iii] = -1;
        step[iii] = -1;
    }
    computerStarts = !computerStarts;
    for (iii = 0; iii < 9; iii++) {
        document.getElementsByClassName("gameSquare")[iii].classList.remove("xSquare");
        document.getElementsByClassName("gameSquare")[iii].classList.remove("cSquare");
    }
    if (computerStarts) {
        nextShape = computerShape;
        if (gameModeSingle) {
            sleep();
            gameLogic(computerLogic(-1));
        }
    }
    else {
        nextShape = playerShape;
    }
}

function resetScore() {
    console.log("resetScore()");
    xScore = 0;
    cScore = 0;
    drawScore();
}

function drawScore() {
    document.getElementById("scoreDisplay").innerHTML = xScore + " / " + cScore;
}

function getClick(square) {
    console.log("getClick()");
    if (gameModeSingle) {
        if (clickAvailable && board[square] == -1) {
            gameLogic(square);
            sleep();
            if (gameOver) {
                gameOver = false;
                resetGame();
                return;
            }
            else {
                gameLogic(computerLogic(square));
                if (gameOver) {
                    gameOver = false;
                    resetGame();
                    return;
                }
            }
        }
        else {
            console.log("click not available");
        }
    }
    else {
        if (clickAvailable && board[square] == -1) {
            gameLogic(square);
            if (gameOver) {
                gameOver = false;
                resetGame();
                return;
            }
        }
        else {
            console.log("click not available");
        }
    }
    console.log("getClick ended.");
}

function sleep() {
    console.log("sleep()");
    clickAvailable = false;
    // wait
    clickAvailable = true;
}
function gameLogic(square) {
    console.log("gameLogic()");
    draw(square);
    step[stepCount] = square;
    board[square] = nextShape;
    console.log("board[ " + square + " ]: " + nextShape);
    stepCount++;
    if (stepCount > 2) {
        let checkWin = checkBoard(0, ((nextShape + 1) % 2) *3, nextShape * 3, -1);
        if (checkWin.line != -1) {
            win(checkWin.line);
        }
    }
    
    nextShape = (nextShape +1) % 2;
    if (stepCount == 9) {
        sleep();
        gameOver = true;
    }
}

function draw(square) {
    console.log("draw(" + square + ")");
    let classToAdd = (nextShape == 0) ? "xSquare" : "cSquare";
    document.getElementsByClassName("gameSquare")[square].classList.add(classToAdd);
}

function win(line) {
    console.log("win()");
    if (nextShape == 0) {
        xScore++;
    }
    else {
        cScore++;
    }
    drawScore();
    gameOver = true;
}
function computerLogic(square) {
    console.log("computerLogic()");
    if (stepCount == 0) {
        return(step0());
    }
    else if (stepCount == 1) {
        return(step1());
    }
    else if (stepCount == 2) {
        return(step2());
    }
    else if (stepCount > 2) {
        console.log("checking winning options.");
        let checkResult = checkBoard(1, playerShape * 2, computerShape * 2, -1);
        if (checkResult.target != null) { 
            console.log("target: " + checkResult.target);
            return(checkResult.target);
        }
        console.log("checking defending options.");
        checkResult = checkBoard(1, computerShape * 2, playerShape * 2, -1);
        if (checkResult.target != null) { 
            console.log("target: " + checkResult.target);
            return(checkResult.target);
        }
        let precalculatedTarget = checkMoves();
        if (precalculatedTarget != null) {
            return precalculatedTarget;
        }
        if (stepCount < 7) {
            console.log("doubleChecking winning options.");
            let doubleCheckResult = doubleCheckBoard(2, playerShape, computerShape);
            if (doubleCheckResult.line2 > -1) {
                let target = intersection(doubleCheckResult);
                if (board[target] == -1)
                return target;
            }
            console.log("doubleChecking defending options.");
            doubleCheckResult = doubleCheckBoard(2, computerShape, playerShape);
            if (doubleCheckResult.line2 > -1) {
                let target = intersection(doubleCheckResult);
                if (board[target] == -1) {
                    return target;
                }
                
            }
        }
        else return(firstAvailableSquare());
    }
    else {
        console.log("error from computerLogic(): stepCount out of range.");
    }
}
function checkMoves() {
    console.log("checkMoves()");
    if (board[0] == playerShape ||
        board[1] == -1 ||
        board[2] == -1 ||
        board[3] == -1 ||
        board[4] == computerShape ||
        board[5] == -1 ||
        board[6] == -1 ||
        board[7] == -1 ||
        board[8] == playerShape) {
            return 1;
        }
    if (board[0] == -1 ||
        board[1] == -1 ||
        board[2] == playerShape ||
        board[3] == -1 ||
        board[4] == computerShape ||
        board[5] == -1 ||
        board[6] == playerShape ||
        board[7] == -1 ||
        board[8] == -1) {
            return 7;
        }
}
function rand(numberOfOptions) {
    return Math.floor(Math.random() * numberOfOptions);
}

function intersection(lines) {
    if (lines.line1 == -1 || lines.line2 == -1) {
        return -1;
    }
    let lineA = min(lines.line1, lines.line2);
    let lineB = max(lines.line1, lines.line2);
    if (lineA < 3) {
        if (lineB < 6) {
            console.log("intersection1(): " + lines.line1 + " , " + lines.line2 + " : " + (lineA + (lineB - 3) * 3));
            return lineA + (lineB - 3) * 3;
        }
        else if (lineB == 6) {
            console.log("intersection2(): " + lines.line1 + " , " + lines.line2 + " : " + (lineA * 4));
            return lineA * 4;
        }
        else if (lineB == 7) {
            console.log("intersection3(): " + lines.line1 + " , " + lines.line2 + " : " + (lineA + 3 * (2 - lineA)));
            return lineA + 3 * (2 - lineA);
        }
        else {
            console.log("error from intersection()1");
        }
    }
    else if (lineA < 6) {
        if (lineB == 6) {
            console.log("intersection4(): " + lines.line1 + " , " + lines.line2 + " : " + (lineA - 3) * 4);
            return (lineA - 3) * 4;
        }
        else if (lineB == 7) {
            console.log("intersection5(): " + lines.line1 + " , " + lines.line2 + " : " + (lineA * 2 - 4));
            return lineA * 2 - 4;
        }
        else {
            console.log("error from intersection()2");
        }
    }
    else if (lineA == 6 || lineB == 7) {
        console.log("intersection6(): " + lines.line1 + " , " + lines.line2 + " : 4");
        return 4;
    }
    else {
        console.log("error from intersection()3");
    }
}
function step0() {
    console.log("step0() called.");
    switch (rand(4)) {
        case 0:
            return(0);
            break;
        case 1:
            return(2);
            break;
        case 2:
            return(6);
            break;
        case 3:
            return(8);
            break;
        default:
            console.log("error for computerLogic() #1 switch");
    }
}
function step1() {
    console.log("step1() called.");
    switch (step[0]) {
        case 0:
        case 2:
        case 6:
        case 8:
            return(4); 
            break;
        case 4:
            let randNum = rand(4) * 2;
            if (randNum > 3) {randNum += 2;}
            console.log("randNum: " + randNum);
            return(randNum);
            break;
        case 1:
            return(rand(2) * 2);
            break;
        case 3:
            return(rand(2) * 6);
            break;
        case 5:
            return(rand(2) * 6 + 2);
            break;
        case 7:
            return(rand(2) * 2 + 6);
            break;
    }
}
function step2() {
    console.log("step2() called.");
    switch (step[0]) {
        case 0:
            switch (step[1]) {
                case 0:
                    console.log("error from step2(): first two steps are identical.");
                    break;
                case 1:
                    return(6);
                    break;
                case 2:
                    return(rand(2) * 2 + 6);
                    break;
                case 3:
                    return(2);
                    break;
                case 4:
                    return(8);
                    break;
                case 5:
                    return(2);
                    break;
                case 6:
                    return(8);
                    break;
                case 7:
                    return(2);
                    break;
                case 8:
                    return(6);
                break;
                default:
                    console.log("error from step2(): 0 case switch out of range.");
            }
            break;
        case 2:
            switch (step[1]) {
                case 0:
                    return(6);
                    break;
                case 1:
                    return(8);
                    break;
                case 2:
                    console.log("error from step2(): first two steps are identical.");
                    break;
                case 3:
                    return(0);
                    break;
                case 4:
                    return(6);
                    break;
                case 5:
                    return(0);
                    break;
                case 6:
                    return(8);
                    break;
                case 7:
                    return(0);
                    break;
                case 8:
                    return(6);
                break;
                default:
                    console.log("error from step2(): 2 case switch out of range.");
            }
            break;
        case 6:
            switch (step[1]) {
                case 0:
                    return(2);
                    break;
                case 1:
                    return(0);
                    break;
                case 2:
                    return(8);
                    break;
                case 3:
                    return(8);
                    break;
                case 4:
                    return(2);
                    break;
                case 5:
                    return(0);
                    break;
                case 6:
                    console.log("error from step2(): first two steps are identical.");
                    break;
                case 7:
                    return(0);
                    break;
                case 8:
                    return(2);
                break;
                default:
                    console.log("error from step2(): 6 case switch out of range.");
            }
            break;
        case 8:
            switch (step[1]) {
                case 0:
                    return(6);
                    break;
                case 1:
                    return(6);
                    break;
                case 2:
                    return(0);
                    break;
                case 3:
                    return(2);
                    break;
                case 4:
                    return(0);
                    break;
                case 5:
                    return(6);
                    break;
                case 6:
                    return(2);
                    break;
                case 7:
                    return(2);
                    break;
                case 8:
                    console.log("error from step2(): first two steps are identical.");
                    break;
                default:
                    console.log("error from step2(): 8 case switch out of range.");
            }
            break;
        default:
            console.log("error form step2(): main switch out of range.");
    }
}
function checkBoard(numOfEmpty, numOfX, numOfCircle, startPlace) {
    console.log("checkBoard( " + numOfEmpty + " , " + numOfX + " , " + numOfCircle + " , " + startPlace + " )");
    let emptySquareCount = 0;
    let xSquareCount = 0;
    let circleSquareCount = 0;
    let checkResult = { line: startPlace, target: null };
    // checks columns.
    if (checkResult.line == -1) {
        for (jjj = 0; jjj < 3; jjj++) {
            for (iii = jjj; iii < 9; iii += 3) {
                if (board[iii] == -1) {
                    emptySquareCount++;
                    checkResult.target = iii;
                }
                else if (board[iii] == 0) {
                    xSquareCount++;
                }
                else if (board[iii] == 1) {
                    circleSquareCount++;
                }
            }
            checkResult.line++;
            if (emptySquareCount == numOfEmpty && xSquareCount == numOfX && circleSquareCount == numOfCircle) {
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
        for (jjj = 0; jjj < 7; jjj += 3) {
            for (iii = jjj; iii < jjj + 3; iii++) {
                if (board[iii] == -1) {
                    emptySquareCount++;
                    checkResult.target = iii;
                }
                else if (board[iii] == 0) {
                    xSquareCount++;
                }
                else if (board[iii] == 1) {
                    circleSquareCount++;
                }
            }
            checkResult.line++;
            if (emptySquareCount == numOfEmpty && xSquareCount == numOfX && circleSquareCount == numOfCircle) {
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
        for (iii = 0; iii < 9; iii += 4) {
            if (board[iii] == -1) {
                emptySquareCount++;
                checkResult.target = iii;
            }
            else if (board[iii] == 0) {
                xSquareCount++;
            }
            else if (board[iii] == 1) {
                circleSquareCount++;
            }
        }
        checkResult.line++;
        if (emptySquareCount == numOfEmpty && xSquareCount == numOfX && circleSquareCount == numOfCircle) {
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
        for (iii = 2; iii < 7; iii += 2) {
            if (board[iii] == -1) {
                emptySquareCount++;
                checkResult.target = iii;
            }
            else if (board[iii] == 0) {
                xSquareCount++;
            }
            else if (board[iii] == 1) {
                circleSquareCount++;
            }
        }
        checkResult.line++;
        if (emptySquareCount == numOfEmpty && xSquareCount == numOfX && circleSquareCount == numOfCircle) {
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
    
}
// purpuse of this function - to 
function doubleCheckBoard(numOfEmpty, numOfX, numOfCircle) {
    console.log("doubleCheckBoard( " + numOfEmpty + " , " + numOfX + " , " + numOfCircle + " )");
    let result1 = checkBoard(numOfEmpty, numOfX, numOfCircle, -1);
    if (result1.line == -1) {
        console.log("doubleCheckBoard1(): -1 , -1");
        return {line1: -1, line2: -1};
    }
    let result2 = checkBoard(numOfEmpty, numOfX, numOfCircle, result1.line);
    if (result2.line == -1) {
        console.log("doubleCheckBoard2(): " + result1.line + " -1");
        return {line1: result1.line, line2: -1};
    }
    console.log("doubleCheckBoard3(): " + result1.line + " , " + result2.line);
    return {line1: result1.line, line2: result2.line};
}
function firstAvailableSquare() {
    console.log("firstAvailableSquare() called.");
    let target;
    for (iii = 0; iii < 9; iii++) {
        if (board[iii] == -1) {
            target = iii;
            break;
        }
    }
    return target;
}

function min(a,b) {
    if (a > b) {
        return b;
    }
    else {
        return a;
    }
}
function max(a,b) {
    if (a > b) {
        return a;
    }
    else {
        return b;
    }
}