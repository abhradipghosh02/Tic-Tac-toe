let boxes = document.querySelectorAll(".box");
let scoreX = 0;
let scoreO = 0;
let turn = "X";
let isGameOver = false;
let singlePlayerMode = false;

function updateScores() {
    document.getElementById("scoreX").innerHTML = scoreX;
    document.getElementById("scoreO").innerHTML = scoreO;
}

// Mode Selection
document.getElementById("single-player").addEventListener("click", () => {
    singlePlayerMode = true;
    startGame();
});
document.getElementById("multi-player").addEventListener("click", () => {
    singlePlayerMode = false;
    startGame();
});

function startGame() {
    document.getElementById("mode-selection").classList.add("hidden");
    resetBoard();
}

function resetBoard() {
    isGameOver = false;
    turn = "X";
    document.querySelector("#results").innerHTML = "";
    document.querySelector("#play-again").style.display = "none";

    boxes.forEach(e => {
        e.innerHTML = "";
        e.style.removeProperty("background-color");
        e.style.color = "#fff";
    });
}

boxes.forEach(e => {
    e.innerHTML = "";
    e.addEventListener("click", () => {
        if (!isGameOver && e.innerHTML === "" && turn === "X") { // Player's turn
            e.innerHTML = "X";
            checkWin();
            checkDraw();
            if (!isGameOver) {
                turn = "O";
                if (singlePlayerMode) {
                    setTimeout(computerMove, 500); // Computer moves after a short delay
                }
            }
        } else if (!isGameOver && e.innerHTML === "" && turn === "O" && !singlePlayerMode) { // Second player's turn in multiplayer
            e.innerHTML = "O";
            checkWin();
            checkDraw();
            turn = "X";
        }
    });
});

function computerMove() {
    let bestScore = -Infinity;
    let bestMove;

    boxes.forEach((box, index) => {
        if (box.innerHTML === "") {
            box.innerHTML = "O";
            let score = minimax(boxes, 0, false);
            box.innerHTML = "";
            if (score > bestScore) {
                bestScore = score;
                bestMove = index;
            }
        }
    });

    if (bestMove !== undefined) {
        boxes[bestMove].innerHTML = "O";
        checkWin();
        checkDraw();
        turn = "X";
    }
}

function minimax(boxes, depth, isMaximizing) {
    if (checkWinner("O")) return 10 - depth;
    if (checkWinner("X")) return depth - 10;
    if (Array.from(boxes).every(box => box.innerHTML !== "")) return 0; // Draw

    if (isMaximizing) {
        let bestScore = -Infinity;
        boxes.forEach(box => {
            if (box.innerHTML === "") {
                box.innerHTML = "O";
                let score = minimax(boxes, depth + 1, false);
                box.innerHTML = "";
                bestScore = Math.max(score, bestScore);
            }
        });
        return bestScore;
    } else {
        let bestScore = Infinity;
        boxes.forEach(box => {
            if (box.innerHTML === "") {
                box.innerHTML = "X";
                let score = minimax(boxes, depth + 1, true);
                box.innerHTML = "";
                bestScore = Math.min(score, bestScore);
            }
        });
        return bestScore;
    }
}

function checkWinner(player) {
    const winConditions = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8],
        [0, 3, 6], [1, 4, 7], [2, 5, 8],
        [0, 4, 8], [2, 4, 6]
    ];
    return winConditions.some(condition => 
        condition.every(index => boxes[index].innerHTML === player)
    );
}

function checkWin() {
    if (checkWinner("X")) {
        isGameOver = true;
        document.querySelector("#results").innerHTML = "Player X wins!";
        document.querySelector("#play-again").style.display = "inline";
        scoreX++;
        updateScores();
    } else if (checkWinner("O")) {
        isGameOver = true;
        document.querySelector("#results").innerHTML = "Computer O wins!";
        document.querySelector("#play-again").style.display = "inline";
        scoreO++;
        updateScores();
    }
}

function checkDraw() {
    if (!isGameOver && Array.from(boxes).every(box => box.innerHTML !== "")) {
        isGameOver = true;
        document.querySelector("#results").innerHTML = "Draw!";
        document.querySelector("#play-again").style.display = "inline";
    }
}

document.querySelector("#play-again").addEventListener("click", resetBoard);

document.querySelector("#reset-score").addEventListener("click", () => {
    scoreX = 0;
    scoreO = 0;
    updateScores();
});