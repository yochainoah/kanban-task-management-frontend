import { useState, useEffect } from "react";
import "./BoardsDropdown.css";
import { useAppContext } from "./../AppContext";
import { Link } from "react-router-dom";
import axios from "axios";

export default function BoardsDropdown({ openAddBoard }) {
  const {
    theme,
    toggleTheme,
    boardsState,
    setBoardsState,
    boardClicked,
    setBoardClicked,
  } = useAppContext();
  const [optionsShown, setOptionsShown] = useState(false);

  function toggleOptions() {
    setOptionsShown((prevState) => !prevState);
  }
  function handleCreateBoard() {
    openAddBoard();
    setOptionsShown((prevState) => !prevState);
  }
  function handleSelectBoard(board) {
    setBoardClicked(board);
    // setOptionsShown((prevState) => !prevState);
  }
  useEffect(() => {
    document.body.className = theme; // set the class on the root div
  }, [theme]);

  return (
    <div className={`board-box `}>
      <button className={`board-btn ${theme}`} onClick={toggleOptions}>
        <h3>{boardClicked.name}</h3>
        {optionsShown ? (
          <img src="/assets/icon-chevron-up.svg" alt="chevron up icon" />
        ) : (
          <img src="/assets/icon-chevron-down.svg" alt="chevron down icon" />
        )}
      </button>
      <div
        className={
          optionsShown
            ? `board-options ${theme} shown`
            : `board-options ${theme} hidden`
        }
      >
        <h4>ALL BOARDS {`(${boardsState.boards.length})`}</h4>
        {boardsState.boards.map((board) => {
          return (
            <Link to={`boards/details/${board._id}`} key={`${board._id}`}>
              <button
                onClick={() => handleSelectBoard(board)}
                value={board.name}
                className={
                  boardClicked.name === board.name ? `selected` : `${theme}`
                }
              >
                {boardClicked.name === board.name ? (
                  <img
                    src="/assets/icon-board-white.svg"
                    alt="board icon white"
                  />
                ) : (
                  <img src="/assets/icon-board.svg" alt="board icon grey" />
                )}
                <h3>{board.name}</h3>
              </button>
            </Link>
          );
        })}
        <button
          className={`add-board-btn ${theme}`}
          onClick={handleCreateBoard}
        >
          <img src="/assets/icon-board-purple.svg" alt="board icon purple" />
          <h3>+ Create New Board</h3>
        </button>
        <div className="toggle-div">
          <div className={`toggleContainer ${theme}`}>
            <img src="/assets/icon-light-theme.svg" alt="sun icon" />
            <input type="checkbox" onChange={toggleTheme} />
            <img src="/assets/icon-dark-theme.svg" alt="moon icon" />
          </div>
        </div>
      </div>
    </div>
  );
}
