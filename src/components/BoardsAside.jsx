import React from "react";
import { Link } from "react-router-dom";
import { useAppContext } from "../AppContext";
import "./BoardsAside.css";
function BoardsAside({ openAddBoard }) {
  const { theme, toggleTheme, boardsState, setBoardsState } = useAppContext();
  function handleSelectBoard(btnvalue) {
    setBoardsState((prevState) => {
      return { ...prevState, boardSelected: btnvalue };
    });
    // setOptionsShown((prevState) => !prevState);
  }
  return (
    <aside className={`board-options-aside ${theme}`}>
      <div className="aside-top">
        <div className="logo-container">
          {theme === 'light' && <img
            className="logo-aside"
            src="/assets/logo-dark.svg"
            alt="light logo"
          />}
          {theme === 'dark' && <img
            className="logo-aside"
            src="/assets/logo-light.svg"
            alt="light logo"
          />}
        </div>
        <h4>ALL BOARDS {`(${boardsState.boards.length})`}</h4>
        {boardsState.boards.map((board, index) => {
          return (
            <Link
              to={`/boards/details/${board._id}`}
              key={`${board.name} ${index}`}
            >
              <button
                onClick={() => handleSelectBoard(board.name)}
                value={board.name}
                className={
                  boardsState.boardSelected === board.name
                    ? `selected`
                    : `${theme}`
                }
              >
                {boardsState.boardSelected === board.name ? (
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
        <button className={`add-board-btn ${theme}`} onClick={openAddBoard}>
          <img src="/assets/icon-board-purple.svg" alt="board icon purple" />
          <h3>+ Create New Board</h3>
        </button>
      </div>

      <div className="aside-bottom">
        <div className={`toggleContainer ${theme}`}>
          <img src="/assets/icon-light-theme.svg" alt="sun icon" />
          <input type="checkbox" onChange={toggleTheme} />
          <img src="/assets/icon-dark-theme.svg" alt="moon icon" />
        </div>
      </div>
    </aside>
  );
}

export default BoardsAside;
