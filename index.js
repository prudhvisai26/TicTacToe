const Gameboard = (() => {
  let board = ["", "", "", "", "", "", "", "", ""];

  const getBoard = () => board;

  const resetBoard = () => {
    board = ["", "", "", "", "", "", "", "", ""];
  };

  const setMark = (index, mark) => {
    if (board[index] === "") {
      board[index] = mark;
      return true;
    }
    return false;
  };

  return { getBoard, resetBoard, setMark };
})();

const Player = (name, mark) => {
  return { name, mark };
};

const GameController = (() => {
  const player1 = Player("Player 1", "X");
  const player2 = Player("Player 2", "O");
  let currentPlayer = player1;
  let isGameOver = false;

  const switchPlayer = () => {
    currentPlayer = currentPlayer === player1 ? player2 : player1;
  };

  const getCurrentPlayer = () => currentPlayer;

  const checkWinner = () => {
    const board = Gameboard.getBoard();
    const winPatterns = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8], // Rows
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8], // Columns
      [0, 4, 8],
      [2, 4, 6], // Diagonals
    ];

    for (const pattern of winPatterns) {
      const [a, b, c] = pattern;
      if (board[a] && board[a] === board[b] && board[a] === board[c]) {
        return board[a];
      }
    }

    return board.includes("") ? null : "Tie";
  };

  const playRound = (index) => {
    if (isGameOver || !Gameboard.setMark(index, currentPlayer.mark)) {
      return;
    }

    const winner = checkWinner();
    displayController.renderBoard(); // Ensure board is re-rendered after each move

    if (winner) {
      isGameOver = true;
      displayController.setMessage(
        winner === "Tie" ? "It's a tie!" : `${currentPlayer.name} wins!`
      );
    } else {
      switchPlayer();
      displayController.setMessage(`${currentPlayer.name}'s turn`);
    }
  };

  const restartGame = () => {
    Gameboard.resetBoard();
    isGameOver = false;
    currentPlayer = player1;
    displayController.setMessage(`${currentPlayer.name}'s turn`);
    displayController.renderBoard();
  };

  return { playRound, restartGame, getCurrentPlayer };
})();

const displayController = (() => {
  const gameboardElement = document.getElementById("gameboard");
  const restartButton = document.getElementById("restartButton");
  const gameStatus = document.getElementById("gameStatus");

  const renderBoard = () => {
    gameboardElement.innerHTML = "";
    Gameboard.getBoard().forEach((mark, index) => {
      const cell = document.createElement("div");
      cell.textContent = mark;
      cell.addEventListener("click", () => GameController.playRound(index));
      gameboardElement.appendChild(cell);
    });
  };

  const setMessage = (message) => {
    gameStatus.textContent = message;
  };

  restartButton.addEventListener("click", GameController.restartGame);

  return { renderBoard, setMessage };
})();

document.addEventListener("DOMContentLoaded", () => {
  GameController.restartGame();
});
