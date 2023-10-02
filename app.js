document.addEventListener('DOMContentLoaded', () => {
    const Gameboard = (() => {
        const board = []
        for(let i = 0; i < 3; i++){
            board[i] = []
            for(let j = 0; j < 3; j++){
                board[i].push(Square())
            }
        }
        const markSquare = (row, column, player) => {
            if (board[row][column] === '0') {
                return false
            }
            board[row][column].addMark(player)
            return true
        }
        const getBoard = () => board

        const resetBoard = () => {
            for(let i = 0; i < 3; i++){
                for(let j = 0; j < 3; j++){
                    board[i][j].addMark('0')
                }
            }
        }
        return {markSquare, getBoard, resetBoard}
    })()
    
    function Square(){
        let value = '0'
        let addMark = (player) => {
            value = player
        }
        let getValue = () => value
        return {addMark, getValue}
    }
    
    const GameController = (() => {
        let players = [
            {
                name: 1,
                token: 'O'
            },
            {
                name: 2,
                token: 'X'
            }
        ]
        let activePlayer = players[0]
    
    
        const playerTurn = () => {
            activePlayer = activePlayer === players[0] ? players[1] : players[0]
        }
    
        const getActivePlayer = () => activePlayer
    
        const checkWin = () => {
            let checkboard = Gameboard.getBoard();
            for (let i = 0; i < 3; i++) {
                if (
                    checkboard[i][0].getValue() !== '0' &&
                    checkboard[i][0].getValue() === checkboard[i][1].getValue() &&
                    checkboard[i][0].getValue() === checkboard[i][2].getValue()
                ) {
                    return 1;
                }
            }

            for (let i = 0; i < 3; i++) {
                if (
                    checkboard[0][i].getValue() !== '0' &&
                    checkboard[0][i].getValue() === checkboard[1][i].getValue() &&
                    checkboard[0][i].getValue() === checkboard[2][i].getValue()
                ) {
                    return 1;
                }
            }

            if (
                checkboard[0][0].getValue() !== '0' &&
                checkboard[0][0].getValue() === checkboard[1][1].getValue() &&
                checkboard[0][0].getValue() === checkboard[2][2].getValue()
            ) {
                return 1;
            }

            if (
                checkboard[0][2].getValue() !== '0' &&
                checkboard[0][2].getValue() === checkboard[1][1].getValue() &&
                checkboard[0][2].getValue() === checkboard[2][0].getValue()
            ) {
                return 1;
            }

            let over = [];
            for (let i = 0; i < 3; i++) {
                for (let j = 0; j < 3; j++) {
                    if (checkboard[i][j].getValue() === '0') {
                        over.push('0');
                    }
                }
            }

            if (over.length === 0) {
                return 2;
            }

            return false;
        };
    
        const playRound = (row, col, player) => {
            let isOver = checkWin()
            if(isOver === 1){
                return activePlayer
            }
            else if(isOver === 2){
                return 'Draw'
            }
            if(Gameboard.getBoard()[row][col].getValue() !== '0') return
            Gameboard.markSquare(row, col, player.token)
            playerTurn()
        }
    
        return {
            playRound,
            getActivePlayer,
            checkWin
        }
    })()
    
    const ScreenController = (() => {
        const squares = document.querySelectorAll('.square')
        const player = document.querySelector('#player')
        const reset = document.querySelector('.reset-button')
        
        const clickHandler = (i) => {
            let activePlayer = GameController.getActivePlayer();
            if(squares[i].innerHTML !== '') return
            else if(winHandler(activePlayer) === 1) return console.log('over')
            squares[i].classList.add(GameController.getActivePlayer().token)
            squares[i].innerHTML = GameController.getActivePlayer().token
            GameController.playRound(Math.floor(i / 3), Math.floor(i % 3), GameController.getActivePlayer())
            activePlayer = GameController.getActivePlayer();
            let board = []

            for (let i = 0; i < 3; i++) {
                board[i] = [];
                for (let j = 0; j < 3; j++) {
                board[i].push(Gameboard.getBoard()[i][j].getValue());
                }
            }

            console.log(board)
            winHandler(activePlayer)
        }
        for(let i = 0; i < 9; i++){
            squares[i].addEventListener('click', () => clickHandler(i))
        }

        const winHandler = (activePlayer) => {
            let gameOver = GameController.checkWin()
            let winner = activePlayer.name === 1 ? 2 : 1
            if (gameOver === 2){
                player.innerHTML = 'DRAW BRO'
                return 1
            }else if(gameOver){
                player.innerHTML = `Player ${winner} wins the game`
                return 1
            }
            player.innerHTML = `Player ${activePlayer.name}'s turn`
        }

        const resetButton = () => {
            for(let i = 0; i < 9; i++){
                squares[i].innerHTML = ''
            }
            Gameboard.resetBoard()
            player.innerHTML = "Player 1's turn"
        }
        reset.addEventListener('click', resetButton)
    })() 
})
