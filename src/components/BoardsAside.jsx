import React from "react";
import { Link } from "react-router-dom";
import { useAppContext } from "../AppContext";
import "./BoardsAside.css";
function BoardsAside() {
  const { theme, boardsState, setBoardsState } = useAppContext();
  function handleSelectBoard(btnvalue) {
    setBoardsState((prevState) => {
      return { ...prevState, boardSelected: btnvalue };
    });
    // setOptionsShown((prevState) => !prevState);
  }
  return (
    <aside className={`board-options-aside ${theme}`}>
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
      <button className={`add-board-btn ${theme}`} >
        <img src="/assets/icon-board-purple.svg" alt="board icon purple" />
        <h3>+ Create New Board</h3>
      </button>
    </aside>
  );
}

export default BoardsAside;
