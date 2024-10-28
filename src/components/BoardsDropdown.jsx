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
                  boardClicked.name === board.name
                    ? `dd-board-btn selected`
                    : `dd-board-btn ${theme}`
                }
              >
                <svg width="16" height="16" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M0 2.889A2.889 2.889 0 0 1 2.889 0H13.11A2.889 2.889 0 0 1 16 2.889V13.11A2.888 2.888 0 0 1 13.111 16H2.89A2.889 2.889 0 0 1 0 13.111V2.89Zm1.333 5.555v4.667c0 .859.697 1.556 1.556 1.556h6.889V8.444H1.333Zm8.445-1.333V1.333h-6.89A1.556 1.556 0 0 0 1.334 2.89V7.11h8.445Zm4.889-1.333H11.11v4.444h3.556V5.778Zm0 5.778H11.11v3.11h2a1.556 1.556 0 0 0 1.556-1.555v-1.555Zm0-7.112V2.89a1.555 1.555 0 0 0-1.556-1.556h-2v3.111h3.556Z"
                    fill="#828FA3"
                  />
                </svg>
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
