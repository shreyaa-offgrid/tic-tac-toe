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
    console.log(`player 1 is: ${player1.getName()}. 
    Their marker is ${player1.getMarker()}`);
    console.log(`player 2 is: ${player2.getName()}. 
    Their marker is ${player2.getMarker()}`);
    function play(i, j) {
        let validPlay = theGameboard.putMarker(currentPlayer.getMarker(), i, j);
        theGameboard.renderBoard();
        if (gameController.hasWon(currentPlayer.getMarker())) {
            console.log(`${currentPlayer.getName()} has won!`);
            setTimeout(2000, displayController.newGame(currentPlayer.getName()));
        }
        if(gameController.isDraw()){
            console.log("A draw has occured!");
            setTimeout(2000, displayController.newGame("Draw"));
        }
        if (validPlay) {
            togglePlayer();
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
    return {
        play,
        hasWon,
        isDraw,
    }
})(theGameboard);

const displayController = (function () {
    const squares = document.querySelectorAll(".square");
    const restart = document.querySelector(".restart");
    const dialog = document.querySelector("dialog");
    const listeners = (function () {
        for (let i = 0; i < squares.length; i++) {
            squares[i].addEventListener("click", playMove);
        }
        restart.addEventListener("click", restartGame);
    })();
    function playMove(e) {
        const square = e.target;
        const data = square.dataset;
        let i = parseInt(data.row);
        let j = parseInt(data.col);
        gameController.play(i, j);
    }
    function restartGame() {
        theGameboard.clearBoard();
        theGameboard.renderBoard();
        dialog.close();
    }
    function newGame(winner) {
        let msg = `${winner} has won!`.toUpperCase();
        if(winner==="Draw"){
            msg = "A draw has occured!"
        }
        const message = document.querySelector(".message");
        message.textContent = msg;
        dialog.showModal();
    }
    return {
        squares,
        newGame,
    }
})();