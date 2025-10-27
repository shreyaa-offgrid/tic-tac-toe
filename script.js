const theGameboard = (function Gameboard() {
    const gameboard = [];
    for (let i = 0; i < 3; i++) {
        gameboard[i] = [];
        for (let j = 0; j < 3; j++) {
            gameboard[i].push("");
        }
    }

    const clearBoard = ()=>{
        for(let i = 0;i<3;i++){
            for(let j = 0;j<3;j++){
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
            for(let j = 0;j<3;j++){
                squares[c++].textContent = gameboard[i][j];
            }
        }
    }

    const hasWon = function (marker) {
        function rowWin() {
            for (let i = 0; i < 3; i++) {
                let allMatch = true;
                for (let j = 0; j < 3; j++) {
                    if (gameboard[i][j] !== marker) {
                        allMatch = false;
                        break;
                    }
                }
                if (allMatch) return true;
            }
            return false;
        }

        function colWin() {
            for (let j = 0; j < 3; j++) {
                let allMatch = true;
                for (let i = 0; i < 3; i++) {
                    if (gameboard[i][j] !== marker) {
                        allMatch = false;
                        break;
                    }
                }
                if (allMatch) return true;
            }
            return false;
        }

        function diagWin() {

            let allMatch = true;
            for (let i = 0; i < 3; i++) {
                if (gameboard[i][i] !== marker) {
                    allMatch = false;
                    break;
                }
            }
            if (allMatch) return true;


            allMatch = true;
            for (let i = 0; i < 3; i++) {
                if (gameboard[i][2 - i] !== marker) {
                    allMatch = false;
                    break;
                }
            }
            return allMatch;
        }

        return rowWin() || colWin() || diagWin();
    };

    return {
        hasWon,
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
        if (theGameboard.hasWon(currentPlayer.getMarker())) {
            console.log(`${currentPlayer.getName()} has won!`);
        }
        if (validPlay) {
            togglePlayer();
        }
    }
    function togglePlayer() {
        currentPlayer = (currentPlayer === player1) ? player2 : player1;
    }

    return {
        play,
    }
})(theGameboard);

const displayController = (function(){
    const squares = document.querySelectorAll(".square");
    const listeners = (function(){
        for(let i = 0;i<squares.length;i++){
            squares[i].addEventListener("click",playMove);
        }
    })();
    function playMove(e){
        const square = e.target;
        const data = square.dataset;
        let i = parseInt(data.row);
        let j = parseInt(data.col);
        gameController.play(i,j);
    }
    function newGame(){

    }
    return {
        squares,
    }
})();