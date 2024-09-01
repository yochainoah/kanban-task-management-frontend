import React from "react";
import axios from "axios";
import { useAppContext } from "../../AppContext";
import "./DeleteTaskModal.css";
// import dotenv from "dotenv";
// dotenv.config();

function DeleteTaskModal({ open, onClose, taskDeleted }) {
  const { boardClicked, setBoardClicked, taskClicked, setShowModal, theme } =
    useAppContext();
  const handleCloseDeleteModal = () => {
    onClose();
  };
  // console.log("task deleted:",taskDeleted)
  const handleDeleteTask = () => {
    axios.delete(`${import.meta.env.VITE_API_ROOT}/tasks`, {
      data: {
        boardId: boardClicked._id,
        task: taskDeleted,
      },
    });
    setBoardClicked((currentBoard) => {
      let newBoard = { ...currentBoard };
      // splice the task
      let column = newBoard.columns.find((c) => c.name === taskClicked.status);
      let taskIndex = column.tasks.findIndex((t) => t._id === taskDeleted._id);
      column.tasks.splice(taskIndex, 1);
      return newBoard;
    });
    onClose();
    setShowModal(false);
  };
  if (!open) return null;
  return (
    <div onClick={handleCloseDeleteModal} className="overlay">
      <div
        onClick={(e) => {
          e.stopPropagation();
        }}
        className={`delete-task-modal ${theme}`}
      >
        <h2>Delete this task?</h2>
        <p className="dt-warning">
          Are you sure you want to delete the {`‘${taskDeleted.title}’`} task
          and its subtasks? This action cannot be reversed.
        </p>
        <div className="dt-btns-box">
          <button className="btn-destructive" onClick={handleDeleteTask}>
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

export default DeleteTaskModal;
