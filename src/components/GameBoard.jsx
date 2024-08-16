// src/components/GameBoard.js
import React, { useState, useEffect } from "react";
import Tile from "./Tile";
import ScoreBoard from "./ScoreBoard";
import "./styles.css";
import firstElem from "../assets/first-elem.png";
import secondElem from "../assets/second-elem.png";
import thirdElem from "../assets/third-elem.png";
import fourthElem from "../assets/fourth-elem.png";
import fifthElem from "../assets/fifth-elem.png";
import bgMusic from "../assets/bgrSoundGame.mp3";

const GameBoard = () => {
  // const audioRef = React.createRef();
  const [board, setBoard] = useState(generateInitialBoard());
  const [score, setScore] = useState(0);
  const [selectedTile, setSelectedTile] = useState(null);
  const [animationClasses, setAnimationClasses] = useState({});
  const [dropAnimations, setDropAnimations] = useState({});
  const handleTileClick = (rowIndex, colIndex) => {
    if (selectedTile) {
      const [prevRow, prevCol] = selectedTile;
      if (isAdjacent(prevRow, prevCol, rowIndex, colIndex)) {
        swapTiles(prevRow, prevCol, rowIndex, colIndex);
        setSelectedTile(null);
      } else {
        setSelectedTile([rowIndex, colIndex]);
      }
    } else {
      setSelectedTile([rowIndex, colIndex]);
    }
  };
  // useEffect(() => {
  //   if (audioRef.current) {
  //     audioRef.current.volume = 1; // Уменьшить громкость до 50%
  //   }
  // }, []);
  const isAdjacent = (row1, col1, row2, col2) => {
    return (
      (Math.abs(row1 - row2) === 1 && col1 === col2) ||
      (Math.abs(col1 - col2) === 1 && row1 === row2)
    );
  };

  const swapTiles = (row1, col1, row2, col2) => {
    const newBoard = [...board];
    [newBoard[row1][col1], newBoard[row2][col2]] = [
      newBoard[row2][col2],
      newBoard[row1][col1],
    ];

    // Set animation classes
    setAnimationClasses({
      [`${row1}-${col1}`]: getAnimationClass(row1, col1, row2, col2),
      [`${row2}-${col2}`]: getAnimationClass(row2, col2, row1, col1),
    });

    // Check for matches after swapping
    if (checkMatches(newBoard).length === 0) {
      // If no matches, swap back
      [newBoard[row1][col1], newBoard[row2][col2]] = [
        newBoard[row2][col2],
        newBoard[row1][col1],
      ];
    }

    setBoard(newBoard);
  };

  const getAnimationClass = (row1, col1, row2, col2) => {
    if (row1 === row2) {
      return col1 < col2 ? "animate-right" : "animate-left";
    } else {
      return row1 < row2 ? "animate-down" : "animate-up";
    }
  };

  const checkMatches = (board) => {
    let matches = [];
    for (let row = 0; row < board.length; row++) {
      for (let col = 0; col < board[row].length; col++) {
        if (
          col < board[row].length - 2 &&
          board[row][col] === board[row][col + 1] &&
          board[row][col] === board[row][col + 2]
        ) {
          matches.push([row, col], [row, col + 1], [row, col + 2]);
        }
        if (
          row < board.length - 2 &&
          board[row][col] === board[row + 1][col] &&
          board[row][col] === board[row + 2][col]
        ) {
          matches.push([row, col], [row + 1, col], [row + 2, col]);
        }
      }
    }
    return matches;
  };

  const updateBoard = () => {
    let newBoard = [...board];
    let matches = checkMatches(newBoard);
    if (matches.length > 0) {
      matches.forEach(([row, col]) => {
        newBoard[row][col] = null;
      });
      setScore(score + matches.length);
      dropTiles(newBoard);
      setBoard(newBoard); // Update the board immediately after dropping tiles
    }
  };

  const dropTiles = (board) => {
    const newDropAnimations = {};
    for (let col = 0; col < board[0].length; col++) {
      let emptyRow = -1;
      for (let row = board.length - 1; row >= 0; row--) {
        if (board[row][col] === null) {
          emptyRow = row;
          break;
        }
      }
      if (emptyRow !== -1) {
        for (let row = emptyRow; row > 0; row--) {
          board[row][col] = board[row - 1][col];
          newDropAnimations[`${row}-${col}`] = `animate-drop`;
        }
        board[0][col] = getRandomTile();
        newDropAnimations[`0-${col}`] = `animate-drop`;
        // Check for more empty cells and continue dropping
        dropTiles(board);
      }
    }
    setDropAnimations(newDropAnimations);
  };

  const getRandomTile = () => {
    const tiles = [firstElem, secondElem, thirdElem, fourthElem, fifthElem];
    return tiles[Math.floor(Math.random() * tiles.length)];
  };

  useEffect(() => {
    const interval = setInterval(() => {
      updateBoard();
    }, 1000);
    return () => clearInterval(interval);
  }, [board]);

  return (
    <div className="game-board">
      <audio src={bgMusic} autoPlay loop />
      {board.map((row, rowIndex) => (
        <div key={rowIndex} className="row">
          {row.map((tile, colIndex) => (
            <Tile
              key={colIndex}
              value={tile}
              onClick={() => handleTileClick(rowIndex, colIndex)}
              animateClass={animationClasses[`${rowIndex}-${colIndex}`]}
              dropAnimation={dropAnimations[`${rowIndex}-${colIndex}`]}
            />
          ))}
        </div>
      ))}
      <ScoreBoard score={score} />
    </div>
  );
};

const generateInitialBoard = () => {
  const rows = 8;
  const cols = 8;
  const board = [];
  for (let row = 0; row < rows; row++) {
    const newRow = [];
    for (let col = 0; col < cols; col++) {
      newRow.push(getRandomTile());
    }
    board.push(newRow);
  }
  return board;
};

const getRandomTile = () => {
  const tiles = [firstElem, secondElem, thirdElem, fourthElem, fifthElem];
  return tiles[Math.floor(Math.random() * tiles.length)];
};

export default GameBoard;
