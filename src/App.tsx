import { useState } from 'react';

const TicTacToe = () => {
  const [board, setBoard] = useState(Array(9).fill(null));
  const [xIsNext, setXIsNext] = useState(true);
  const [gameOver, setGameOver] = useState(false);
  const [winner, setWinner] = useState(null);
  const [draw, setDraw] = useState(false);
  const [singlePlayer, setSinglePlayer] = useState(false);

  const handleClick = (i) => {
    if (gameOver) return;
    const newBoard = [...board];
    if (newBoard[i] === null) {
      newBoard[i] = xIsNext ? 'X' : 'O';
      setBoard(newBoard);
      setXIsNext(!xIsNext);
      checkWinner(newBoard);
      checkDraw(newBoard);
      if (singlePlayer && !gameOver) {
        setTimeout(() => {
          const computerMove = getComputerMove(newBoard);
          if (computerMove !== null) {
            newBoard[computerMove] = 'O';
            setBoard(newBoard);
            setXIsNext(true);
            checkWinner(newBoard);
            checkDraw(newBoard);
          }
        }, 500);
      }
    }
  };

  const getComputerMove = (board) => {
    const availableMoves = board.map((square, i) => square === null ? i : null).filter(move => move !== null);
    if (availableMoves.length === 0) return null;

    const winningMoves = getWinningMoves(board, 'O');
    if (winningMoves.length > 0) {
      return winningMoves[0];
    }

    const blockingMoves = getWinningMoves(board, 'X');
    if (blockingMoves.length > 0) {
      return blockingMoves[0];
    }

    const centerMove = availableMoves.includes(4) ? 4 : null;
    if (centerMove !== null) {
      return centerMove;
    }

    const cornerMoves = availableMoves.filter(move => [0, 2, 6, 8].includes(move));
    if (cornerMoves.length > 0) {
      return cornerMoves[0];
    }

    const randomMove = Math.floor(Math.random() * availableMoves.length);
    return availableMoves[randomMove];
  };

  const getWinningMoves = (board, player) => {
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];

    const winningMoves = [];

    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (board[a] === player && board[b] === player && board[c] === null) {
        winningMoves.push(c);
      }
      if (board[a] === player && board[b] === null && board[c] === player) {
        winningMoves.push(b);
      }
      if (board[a] === null && board[b] === player && board[c] === player) {
        winningMoves.push(a);
      }
    }

    return winningMoves;
  };

  const checkWinner = (board) => {
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];

    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (board[a] && board[a] === board[b] && board[a] === board[c]) {
        setWinner(board[a]);
        setGameOver(true);
        return;
      }
    }
  };

  const checkDraw = (board) => {
    if (!board.includes(null) && !winner) {
      setDraw(true);
      setGameOver(true);
    }
  };

  const handleReset = () => {
    setBoard(Array(9).fill(null));
    setXIsNext(true);
    setGameOver(false);
    setWinner(null);
    setDraw(false);
  };

  const handleModeChange = () => {
    setSinglePlayer(!singlePlayer);
    handleReset();
  };

  return (
    <div className="max-w-md mx-auto p-4 pt-6 md:p-6 lg:p-12 xl:p-24">
      <h1 className="text-3xl text-gray-900 leading-tight">Tic Tac Toe</h1>
      <button
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-4"
        onClick={handleModeChange}
      >
        {singlePlayer ? 'Switch to 2 players' : 'Switch to 1 player'}
      </button>
      <div className="flex flex-col justify-center mt-6">
        {[0, 1, 2].map((row) => (
          <div key={row} className="flex justify-center">
            {[0, 1, 2].map((col) => (
              <div
                key={row * 3 + col}
                className={`w-16 h-16 border-2 border-gray-400 flex items-center justify-center cursor-pointer ${
                  board[row * 3 + col] === 'X'
                    ? 'bg-blue-500 text-white'
                    : board[row * 3 + col] === 'O'
                    ? 'bg-red-500 text-white'
                    : 'bg-gray-200 border-2 border-dashed rounded-xl'
                }`}
                onClick={() => handleClick(row * 3 + col)}
              >
                {board[row * 3 + col]}
              </div>
            ))}
          </div>
        ))}
      </div>
      <p className="text-lg text-gray-600 mt-6">
        {winner
          ? `Player ${winner} wins!`
          : draw
          ? "It's a draw!"
          : `Next player: ${xIsNext ? 'X' : 'O'}`}
      </p>
      {gameOver && (
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          onClick={handleReset}
        >
          Play again
        </button>
      )}
    </div>
  );
};

export default TicTacToe;