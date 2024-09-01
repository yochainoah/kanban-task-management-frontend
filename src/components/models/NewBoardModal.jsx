import React from "react";
import { useState } from "react";
import axios from "axios";
import { useAppContext } from "../../AppContext";
import "./NewBoardModal.css";
// import dotenv from "dotenv";
// dotenv.config();

const initialColumns = [
  {
    name: "",
    tasks: [],
  },
  {
    name: "",
    tasks: [],
  },
];

function NewBoardModal({ open, onClose }) {
  const [boardAdded, setBoardAdded] = useState({
    name: "",
    columns: initialColumns,
  });
  const { setBoardsState, theme } = useAppContext();
  function handleCloseAddBoard() {
    onClose();
  }
  // const handleBoardName = (nameAdded) => {
  //   setBoardAdded({ ...boardAdded, name: nameAdded });
  // };
  const addBoardData = (key, value) => {
    setBoardAdded({
      ...boardAdded,
      [key]: value,
    });
  };
  function handleColumnChange(columnIndex, columnName) {
    setBoardAdded((prevState) => {
      const newBoard = { ...prevState };
      newBoard.columns[columnIndex].name = columnName;
      return newBoard;
    });
  }
  function handleRemoveColumn(columnIndex) {
    setBoardAdded((prevState) => {
      const newBoard = { ...prevState };
      newBoard.columns.splice(columnIndex, 1);
      return newBoard;
    });
  }
  function handleAddColumn() {
    setBoardAdded((prevState) => {
      const newBoard = { ...prevState };
      newBoard.columns.push({ name: "", tasks: [] });
      return newBoard;
    });
  }
  async function handleBoardSubmit() {
    console.log("board added:", boardAdded);
    const res = await axios.post(
      `${import.meta.env.VITE_API_ROOT}/addBoard`,
      boardAdded
    );
    const newBoard = res.data;
    setBoardsState((prevState) => {
      const newBoards = { ...prevState };
      newBoards.boards.push(newBoard);
      return newBoards;
    });
    onClose();
  }
  // addBoardData("name", "doug")
  /*
    {
      ...boardAdded,
      name: "doug"
    }
  */
  if (!open) return null;
  return (
    <div onClick={handleCloseAddBoard} className="overlay">
      <div
        onClick={(e) => {
          e.stopPropagation();
        }}
        className={`add-board-modal ${theme}`}
      >
        <h2>Add New Board</h2>
        <div className="add-b-title">
          <label htmlFor="board-title" id="label">
            <p className="bold">Board Name</p>
          </label>
          <input
            type="text"
            id="task-title"
            onInput={(e) => addBoardData("name", e.target.value)}
          />
        </div>
        <div className="input-column-container">
          <p className="bold">Board Columns</p>
          <div className="column-inputs-div">
            {boardAdded.columns.map((c, index) => {
              return (
                <div
                  key={`${c.name} ${index}`}
                  className={`subtask-input ${theme}`}
                >
                  <input
                    type="text"
                    id="st-input-box"
                    value={c.name}
                    onInput={(e) => handleColumnChange(index, e.target.value)}
                  />
                  <button onClick={() => handleRemoveColumn(index)}>
                    <img src="/assets/icon-cross.svg" alt="delete cross" />
                  </button>
                </div>
              );
            })}
            <button
              className={`btn-secondry ${theme}`}
              onClick={handleAddColumn}
            >
              + Add New Column
            </button>
          </div>
        </div>
        <button className="btn-primary-s" onClick={handleBoardSubmit}>
          Create New Board
        </button>
      </div>
    </div>
  );
}

export default NewBoardModal;
