const checkWinner = (board) => {

    const lines = [
        [0, 1, 2], //Top Row
        [3, 4, 5], //Middlw Row
        [6, 7, 8], //Bottom Row

        [0, 3, 6], //Left Column
        [1, 4, 7], //Middle Column
        [2, 5, 8], //Right column

        [0, 4, 8], //Top left - Bottom right
        [2, 4, 6]  //Top right - bottom left
    ];
    

    // checking the winner ?

    for(let line of lines){
        const [a,b,c] = line;

        if(board[a]!=null && board[a] === board[b] && board[a] === board[c] ){
            return {winner: board[a] , line};

        }
    }

    // Check if the game is draw

    if(board.every(cell => cell != null)){
        return {winner:"Draw", line:[]}
    }

}


export default checkWinner;