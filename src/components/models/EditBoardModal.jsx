import React from "react";
import axios from "axios";
import { useState,useEffect } from "react";
import { useAppContext } from "../../AppContext";
import "./EditBoardModal.css";
function EditBoardModal({ open, onClose }) {
  const { theme, setBoardsState, boardClicked, setBoardClicked } =
    useAppContext();
  // console.log("board edited:", boardClicked);
  const handleCloseEditBoard = () => {
    onClose();
  };
  const [boardEdited, setBoardEdited] = useState(null);
  useEffect(() => {
    if (boardClicked) {
      setBoardEdited({
        name: boardClicked.name,
        columns: boardClicked.columns ? [...boardClicked.columns] : []
      });
    }
  }, [boardClicked]);
  const editBoardData = (key, value) => {
    setBoardEdited({
      ...boardAdded,
      [key]: value,
    });
  };
  function handleColumnChange(columnIndex, columnName) {
    setBoardEdited((prevState) => {
      const newBoard = { ...prevState };
      newBoard.columns[columnIndex].name = columnName;
      return newBoard;
    });
  }
  function handleRemoveColumn(columnIndex) {
    setBoardEdited((prevState) => {
      const newBoard = { ...prevState };
      newBoard.columns.splice(columnIndex, 1);
      return newBoard;
    });
  }
  function handleAddColumn() {
    setBoardEdited((prevState) => {
      const newBoard = { ...prevState };
      newBoard.columns.push({ name: "", tasks: [] });
      return newBoard;
    });
  }
  async function handleEditBoardSubmit(){
    console.log("board edited:",boardEdited)
    const res = await axios.put(`http://localhost:5000/boards/${boardClicked._id}`, boardEdited);
    const newBoard = res.data;
    setBoardClicked(newBoard);
    onClose();
  }
  if (!open) return null;
  return (
    <div onClick={handleCloseEditBoard} className="overlay">
      <div
        onClick={(e) => {
          e.stopPropagation();
        }}
        className={`edit-board-modal ${theme}`}
      >
        <h2>Edit Board</h2>
        <div className="add-b-title">
          <label htmlFor="board-title" id="label">
            <p className="bold">Board Name</p>
          </label>
          <input
            type="text"
            id="task-title"
            value={boardEdited.name}
            onInput={(e) => editBoardData("name", e.target.value)}
          />
        </div>
        <div className="input-st-container">
          <p className="bold">Board Columns</p>
          {boardEdited.columns.map((c, index) => {
            return (
              <div key={c.index} className={`column-input ${theme}`}>
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
          <button className="btn-secondry" onClick={handleAddColumn}>
            + Add New Column
          </button>
        </div>
        <button className="btn-primary-s" onClick={handleEditBoardSubmit}>Save Changes</button>
      </div>
    </div>
  );
}

export default EditBoardModal;
