import React from "react";
import { useState } from "react";
import { useAppContext } from "../../AppContext";
import axios from "axios";
import "./DeleteBoardModal.css";
function DeleteBoardModal({ open, onClose }) {
  const { theme, boardClicked ,boardsState, setBoardsState, setBoardClicked } = useAppContext();
  const handleCloseDeleteModal = () => {
    onClose();
  };
  const handleDeleteBoard = async () => {
    await axios.delete(`http://localhost:5000/boards/${boardClicked._id}`);
      setBoardsState((prevBoards) => {
        const newBoards = {...prevBoards}
        const deletedIndex = newBoards.boards.findIndex(b => b._id === boardClicked._id);
        newBoards.boards.splice(deletedIndex, 1);
        return newBoards;
      });
      setBoardClicked(boardsState.boards[0]);
    onClose();
  };
  if (!open) return null;
  return (
    <div onClick={() => onClose()} className="overlay">
      <div
        onClick={(e) => {
          e.stopPropagation();
        }}
        className={`delete-board-modal ${theme}`}
      >
        <h2>Delete this Board?</h2>
        <p className="db-warning">
          Are you sure you want to delete the {`‘${boardClicked.name}’`} board?
          This action will remove all columns and tasks and cannot be reversed.
        </p>
        <div className="db-btns-box">
          <button className={`btn-destructive ${theme}`} onClick={handleDeleteBoard}>
            <p>Delete</p>
          </button>
          <button
            className={`btn-secondry ${theme}`}
            onClick={handleCloseDeleteModal}
          >
            <p>Cancal</p>
          </button>
        </div>
      </div>
    </div>
  );
}

export default DeleteBoardModal;
