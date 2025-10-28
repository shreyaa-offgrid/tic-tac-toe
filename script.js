const theGameboard = (function Gameboard() {
    const gameboard = [];
    for (let i = 0; i < 3; i++) {
        gameboard[i] = [];
        for (let j = 0; j < 3; j++) {
            gameboard[i].push("");
        }
    }

    const clearBoard = () => {
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                gameboard[i][j] = "";
            }
        }
    }

    const isEmptySquare = (i, j) => gameboard[i][j] === '';

    const putMarker = function (marker, i, j) {
        if (isEmptySquare(i, j)) {
            gameboard[i][j] = marker;
            return true;
        } else {
            console.log("This square is already taken!");
            return false;
        }
    }

    const renderBoard = function () {
        const squares = displayController.squares;
        let c = 0;
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                squares[c++].textContent = gameboard[i][j];
            }
        }
    }


    const getBoard = () => gameboard;
    return {
        getBoard,
        putMarker,
        renderBoard,
        clearBoard,
    }
})();


const Player = (name, marker) => {
    const getName = () => name;
    const getMarker = () => marker;
    return { getName, getMarker };
}

const gameController = (function (theGameboard) {
    let player1 = Player("player1", "O");
    let player2 = Player("player2", "X");
    let currentPlayer = player1;
    function createPlayers(p1name, p2name) {
        if (p1name) {
            player1 = Player(p1name, "O");
        }
        if (p2name) {
            player2 = Player(p2name, "X");
        }
        currentPlayer = player1;
    }
    function play(i, j) {
        let validPlay = theGameboard.putMarker(currentPlayer.getMarker(), i, j);
        theGameboard.renderBoard();
        let win = gameController.hasWon(currentPlayer.getMarker());
        let draw = gameController.isDraw();
        if (win) {
            console.log(`${currentPlayer.getName()} has won!`);
            setTimeout(() => displayController.newGame(currentPlayer.getName()), 500);

        }
        if (draw) {
            console.log("A draw has occured!");
            setTimeout(() => displayController.newGame("Draw"), 500);
        }
        if (validPlay && !win && !draw) {
            togglePlayer();
            turnIndicator();
        }
    }
    function togglePlayer() {
        currentPlayer = (currentPlayer === player1) ? player2 : player1;
    }

    function rowWin(marker, board) {
        return board.some(row => row.every(cell => cell === marker));
    }

    function colWin(marker, board) {
        return [0, 1, 2].some(col =>
            board.every(row => row[col] === marker)
        );
    }

    function diagWin(marker, board) {
        const mainDiag = board.every((row, i) => row[i] === marker);
        const antiDiag = board.every((row, i) => row[2 - i] === marker);
        return mainDiag || antiDiag;
    }

    const hasWon = function (marker) {
        const gameboard = theGameboard.getBoard();
        return rowWin(marker, gameboard) ||
            colWin(marker, gameboard) ||
            diagWin(marker, gameboard);
    };

    const isDraw = function () {
        const gameboard = theGameboard.getBoard();
        let empty = 0;
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                if (gameboard[i][j] == '') {
                    empty++;
                }
            }
        }
        if (empty === 0) {
            return true;
        }
        return false;
    }
    function turnIndicator(){
        if(currentPlayer===player1){
            displayController.p1.classList.add("turn");
            displayController.p2.classList.remove("turn");
        }else if(currentPlayer===player2){
            displayController.p2.classList.add("turn");
            displayController.p1.classList.remove("turn");
        }
    };
    return {
        createPlayers,
        play,
        hasWon,
        isDraw,
        turnIndicator,
    }
})(theGameboard);

const displayController = (function () {
    const squares = document.querySelectorAll(".square");
    const restart = document.querySelector("button.restart");
    const dialog = document.querySelector("dialog.restart");
    const startDialog = document.querySelector("dialog.start");
    const start = document.querySelector("button.start");
    const p1 = document.querySelector(".player1");
    const p2 = document.querySelector(".player2");
    startDialog.showModal();

    const listeners = (function () {
        for (let i = 0; i < squares.length; i++) {
            squares[i].addEventListener("click", playMove);
        }
        restart.addEventListener("click", restartGame);
        start.addEventListener("click", updateNames);
    })();

    function updateNames(e) {
        e.preventDefault();
        startDialog.close();
        gameController.turnIndicator();
        const p1name = document.getElementById("p1-name").value;
        const p2name = document.getElementById("p2-name").value;
        const p1Display = document.querySelector(".player1").childNodes[3];
        const p2Display = document.querySelector(".player2").childNodes[3];
        if(p1name){
            p1Display.textContent = `name: ${p1name}`;
        }
        if(p2name){
            p2Display.textContent = `name: ${p2name}`;
        }
        gameController.createPlayers(p1name, p2name);
    }
    function playMove(e) {
        const square = e.target;
        const data = square.dataset;
        let i = parseInt(data.row);
        let j = parseInt(data.col);
        gameController.play(i, j);
    }
    function resetTurn() {
        currentPlayer = player1;
    }
    function restartGame() {
        theGameboard.clearBoard();
        theGameboard.renderBoard();
        gameController.createPlayers();
        gameController.turnIndicator();
        dialog.close();
    }
    function newGame(winner) {
        let msg = `${winner} has won!`.toUpperCase();
        if (winner === "Draw") {
            msg = "A draw has occured!"
        }
        const message = document.querySelector(".message");
        message.textContent = msg;
        dialog.showModal();
    }
    return {
        squares,
        p1,
        p2,
        newGame,
    }
})();