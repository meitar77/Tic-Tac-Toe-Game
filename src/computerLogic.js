'use strict';
console.log("computerLogic loaded.");

// imports
import { checkBoard } from './main.js';
import { PLAYER_SHAPE } from './main.js';
import { COMPUTER_SHAPE } from './main.js';
import { stepCount } from './main.js';
import { board } from './main.js';
import { step } from './main.js';

// main function
export function computerLogic(square) {
    console.log("computerLogic()");
    if (stepCount === 0) {
        return (step0());
    }
    else if (stepCount === 1) {
        return (step1());
    }
    else if (stepCount === 2) {
        return (step2());
    }
    else if (stepCount > 2) {
        console.log("checking winning options.");
        let checkResult = checkBoard(1, PLAYER_SHAPE * 2, COMPUTER_SHAPE * 2, -1);
        if (checkResult.target !== null) {
            console.log("target: " + checkResult.target);
            return (checkResult.target);
        }
        console.log("checking defending options.");
        checkResult = checkBoard(1, COMPUTER_SHAPE * 2, PLAYER_SHAPE * 2, -1);
        if (checkResult.target !== null) {
            console.log("target: " + checkResult.target);
            return (checkResult.target);
        }
        let precalculatedTarget = checkMoves();
        if (precalculatedTarget !== null) {
            return precalculatedTarget;
        }
        if (stepCount < 7) {
            console.log("doubleChecking winning options.");
            let doubleCheckResult = doubleCheckBoard(2, PLAYER_SHAPE, COMPUTER_SHAPE);
            if (doubleCheckResult.line2 > -1) {
                let target = intersection(doubleCheckResult);
                if (board[target] === -1)
                    return target;
            }
            console.log("doubleChecking defending options.");
            doubleCheckResult = doubleCheckBoard(2, COMPUTER_SHAPE, PLAYER_SHAPE);
            if (doubleCheckResult.line2 > -1) {
                let target = intersection(doubleCheckResult);
                if (board[target] === -1) {
                    return target;
                }
            }
        }
        return (firstAvailableSquare());
    }
    else {
        console.log("error from computerLogic(): stepCount out of range.");
    }
}

// pre-calculated steps
function checkMoves() {
    console.log("checkMoves()");
    if (board[0] === PLAYER_SHAPE &&
        board[1] === -1 &&
        board[2] === -1 &&
        board[3] === -1 &&
        board[4] === COMPUTER_SHAPE &&
        board[5] === -1 &&
        board[6] === -1 &&
        board[7] === -1 &&
        board[8] === PLAYER_SHAPE) {
        return 1;
    }
    if (board[0] === -1 &&
        board[1] === -1 &&
        board[2] === PLAYER_SHAPE &&
        board[3] === -1 &&
        board[4] === COMPUTER_SHAPE &&
        board[5] === -1 &&
        board[6] === PLAYER_SHAPE &&
        board[7] === -1 &&
        board[8] === -1) {
        return 7;
    }
    else {
        return null;
    }
}

function rand(numberOfOptions) {
    return Math.floor(Math.random() * numberOfOptions);
}

// returns the common square (intersections) of two lines (row, column or diagonal).
function intersection(lines) {
    if (lines.line1 === -1 || lines.line2 === -1) {
        return -1;
    }
    let lineA = Math.min(lines.line1, lines.line2);
    let lineB = Math.max(lines.line1, lines.line2);
    if (lineA < 3) {
        if (lineB < 6) {
            console.log("intersection1(): " + lines.line1 + " , " + lines.line2 + " : " + (lineA + (lineB - 3) * 3));
            return lineA + (lineB - 3) * 3;
        }
        else if (lineB === 6) {
            console.log("intersection2(): " + lines.line1 + " , " + lines.line2 + " : " + (lineA * 4));
            return lineA * 4;
        }
        else if (lineB === 7) {
            console.log("intersection3(): " + lines.line1 + " , " + lines.line2 + " : " + (lineA + 3 * (2 - lineA)));
            return lineA + 3 * (2 - lineA);
        }
        else {
            console.log("error from intersection()1");
        }
    }
    else if (lineA < 6) {
        if (lineB === 6) {
            console.log("intersection4(): " + lines.line1 + " , " + lines.line2 + " : " + (lineA - 3) * 4);
            return (lineA - 3) * 4;
        }
        else if (lineB === 7) {
            console.log("intersection5(): " + lines.line1 + " , " + lines.line2 + " : " + (lineA * 2 - 4));
            return lineA * 2 - 4;
        }
        else {
            console.log("error from intersection()2");
        }
    }
    else if (lineA === 6 || lineB === 7) {
        console.log("intersection6(): " + lines.line1 + " , " + lines.line2 + " : 4");
        return 4;
    }
    else {
        console.log("error from intersection()3");
    }
}

// returns #1 step
function step0() {
    console.log("step0() called.");
    switch (rand(4)) {
        case 0:
            return (0);
            break;
        case 1:
            return (2);
            break;
        case 2:
            return (6);
            break;
        case 3:
            return (8);
            break;
        default:
            console.log("error for computerLogic() #1 switch");
    }
}

// returns #2 step
function step1() {
    console.log("step1() called.");
    switch (step[0]) {
        case 0:
        case 2:
        case 6:
        case 8:
            return (4);
            break;
        case 4:
            let randNum = rand(4) * 2;
            if (randNum > 3) { randNum += 2; }
            console.log("randNum: " + randNum);
            return (randNum);
            break;
        case 1:
            return (rand(2) * 2);
            break;
        case 3:
            return (rand(2) * 6);
            break;
        case 5:
            return (rand(2) * 6 + 2);
            break;
        case 7:
            return (rand(2) * 2 + 6);
            break;
    }
}

// returns #3 step
function step2() {
    console.log("step2() called.");
    switch (step[0]) {
        case 0:
            switch (step[1]) {
                case 0:
                    console.log("error from step2(): first two steps are identical.");
                    break;
                case 1:
                    return (6);
                    break;
                case 2:
                    return (rand(2) * 2 + 6);
                    break;
                case 3:
                    return (2);
                    break;
                case 4:
                    return (8);
                    break;
                case 5:
                    return (2);
                    break;
                case 6:
                    return (8);
                    break;
                case 7:
                    return (2);
                    break;
                case 8:
                    return (6);
                    break;
                default:
                    console.log("error from step2(): 0 case switch out of range.");
            }
            break;
        case 2:
            switch (step[1]) {
                case 0:
                    return (6);
                    break;
                case 1:
                    return (8);
                    break;
                case 2:
                    console.log("error from step2(): first two steps are identical.");
                    break;
                case 3:
                    return (0);
                    break;
                case 4:
                    return (6);
                    break;
                case 5:
                    return (0);
                    break;
                case 6:
                    return (8);
                    break;
                case 7:
                    return (0);
                    break;
                case 8:
                    return (6);
                    break;
                default:
                    console.log("error from step2(): 2 case switch out of range.");
            }
            break;
        case 6:
            switch (step[1]) {
                case 0:
                    return (2);
                    break;
                case 1:
                    return (0);
                    break;
                case 2:
                    return (8);
                    break;
                case 3:
                    return (8);
                    break;
                case 4:
                    return (2);
                    break;
                case 5:
                    return (0);
                    break;
                case 6:
                    console.log("error from step2(): first two steps are identical.");
                    break;
                case 7:
                    return (0);
                    break;
                case 8:
                    return (2);
                    break;
                default:
                    console.log("error from step2(): 6 case switch out of range.");
            }
            break;
        case 8:
            switch (step[1]) {
                case 0:
                    return (6);
                    break;
                case 1:
                    return (6);
                    break;
                case 2:
                    return (0);
                    break;
                case 3:
                    return (2);
                    break;
                case 4:
                    return (0);
                    break;
                case 5:
                    return (6);
                    break;
                case 6:
                    return (2);
                    break;
                case 7:
                    return (2);
                    break;
                case 8:
                    console.log("error from step2(): first two steps are identical.");
                    break;
                default:
                    console.log("error from step2(): 8 case switch out of range.");
            }
            break;
        default:
            console.log("error from step2(): main switch out of range.");
    }
}

function doubleCheckBoard(numOfEmpty, numOfX, numOfCircle) {
    console.log("doubleCheckBoard( " + numOfEmpty + " , " + numOfX + " , " + numOfCircle + " )");
    let result1 = checkBoard(numOfEmpty, numOfX, numOfCircle, -1);
    if (result1.line === -1) {
        console.log("doubleCheckBoard1(): -1 , -1");
        return { line1: -1, line2: -1 };
    }
    let result2 = checkBoard(numOfEmpty, numOfX, numOfCircle, result1.line);
    if (result2.line === -1) {
        console.log("doubleCheckBoard2(): " + result1.line + " -1");
        return { line1: result1.line, line2: -1 };
    }
    console.log("doubleCheckBoard3(): " + result1.line + " , " + result2.line);
    return { line1: result1.line, line2: result2.line };
}

// returns first available square
function firstAvailableSquare() {
    console.log("firstAvailableSquare() called.");
    let target;
    for (let iii = 0; iii < 9; iii++) {
        if (board[iii] === -1) {
            target = iii;
            break;
        }
    }
    return target;
}
