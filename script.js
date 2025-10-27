const theGameboard = (function Gameboard(){
    const gameboard = [];
    for(let i = 0;i<3;i++){
        gameboard[i] = [];
        for(let j = 0;j<3;j++){
            gameboard[i].push(".");
        }
    }
    const isEmptySquare = (i,j) => gameboard[i][j]==='.';
    
    const putMarker = function(marker,i,j){
        if(isEmptySquare(i,j)){
            gameboard[i][j] = marker;
            return true;
        }else{
            console.log("This square is already taken!");
            return false;
        }
    }
    const renderBoard = function(){
        for(let i = 0;i<3;i++){
            console.log(gameboard[i]);
        }
    }

    const hasWon = function(marker){
        function rowWin(){
            for (let i = 0; i < 3; i++) {
                let allMatch = true;
                for (let j = 0; j < 3; j++) {
                    if (gameboard[i][j] !== marker) {
                        allMatch = false;
                        break;               // stop checking this row early
                    }
                }
                if (allMatch) return true;   // whole row matched
            }
            return false;
        }

        function colWin(){
            for (let j = 0; j < 3; j++) {
                let allMatch = true;
                for (let i = 0; i < 3; i++) {
                    if (gameboard[i][j] !== marker) {
                        allMatch = false;
                        break;               // stop checking this column early
                    }
                }
                if (allMatch) return true;   // whole column matched
            }
            return false;
        }

        function diagWin(){
            // main (top-left → bottom-right)
            let allMatch = true;
            for (let i = 0; i < 3; i++) {
                if (gameboard[i][i] !== marker) {
                    allMatch = false;
                    break;
                }
            }
            if (allMatch) return true;

            // anti-diagonal (top-right → bottom-left)
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
    }
})();


const Player = (name,marker)=>{
    const getName = () => name;
    const getMarker = () => marker;
    return {getName,getMarker};
}

const gameController = (function(theGameboard){
    let player1 = Player("player1","O");
    let player2 = Player("player2","X");
    let currentPlayer = player1;
    console.log(`player 1 is: ${player1.getName()}. 
    Their marker is ${player1.getMarker()}`);
    console.log(`player 2 is: ${player2.getName()}. 
    Their marker is ${player2.getMarker()}`);
    function play(i,j){
        let validPlay = theGameboard.putMarker(currentPlayer.getMarker(),i,j);
        theGameboard.renderBoard();
        if(theGameboard.hasWon(currentPlayer.getMarker())){
            console.log(`${currentPlayer.getName()} has won!`);
        }
        if(validPlay){
            togglePlayer();
        }
    }
    function togglePlayer(){
        currentPlayer = (currentPlayer===player1)?player2:player1;
    }
    
    return{
        play,
    }
})(theGameboard);