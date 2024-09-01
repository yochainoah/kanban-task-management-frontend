import React from "react";
import { useState } from "react";
import { useAppContext } from "../../AppContext";
import axios from "axios";
import "./TaskModel.css";
import EditTaskModal from "./EditTaskModal";
import DeleteTaskModal from "./DeleteTaskModal";
// import dotenv from "dotenv";
// dotenv.config()g();

const TaskModel = ({ open, onClose, task }) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [showBtns, setShowBtns] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const { theme, boardClicked, fetchBoard, setFetchBoard, setShowModal } =
    useAppContext();
  function handelDropdown() {
    setShowDropdown(!showDropdown);
  }
  const handleCloseModal = () => {
    setShowDropdown(false); // Close the dropdown
    onClose(); // Call the onClose function to close the modal
  };
  const closeEditModal = () => {
    setEditModalOpen(false);
  };
  const closeDeleteModal = () => {
    setDeleteModalOpen(false);
  };
  async function changeStatus(newStatus) {
    console.log("task id:", task._id);

    const data = {
      title: task.title,
      status: newStatus,
      subtasks: task.subtasks,
      description: task.description,
      boardId: boardClicked._id,
    };
    await axios.put(`${import.meta.env.VITE_API_ROOT}/tasks/${task._id}`, data);

    setFetchBoard(!fetchBoard);
    console.log("boardState:", board);
    // setTaskClicked({status:newStatus,...taskClicked})
    setShowDropdown(false); // Close the dropdown
    setShowModal(false);
  }
  async function toggleSubtaskCompletion(subtaskIndex) {
    const updatedSubtasks = [...task.subtasks];
    updatedSubtasks[subtaskIndex].isCompleted =
      !updatedSubtasks[subtaskIndex].isCompleted;
    const updatedTask = {
      ...task,
      subtasks: updatedSubtasks,
      boardId: boardClicked._id,
    };
    console.log(updatedTask);
    try {
      await axios.put(
        `${import.meta.env.VITE_API_ROOT}/tasks/${task._id}`,
        updatedTask
      );
      setFetchBoard(!fetchBoard);
      // setTaskClicked(updatedTask)
      setShowDropdown(false); // Close the dropdown
      setShowModal(false);
    } catch (error) {
      console.error("Failed to update subtask completion:", error);
    }
  }

  function handleEditTask() {
    // setSelectedTask(task)
    // open edit task modal
    setEditModalOpen(true);
    setShowModal(false);
  }
  function handleDeleteModalOpen() {
    setDeleteModalOpen(true);
  }
  // if (!open) return null;
  if (editModalOpen)
    return <EditTaskModal open={editModalOpen} onClose={closeEditModal} />;
  if (deleteModalOpen)
    return (
      <DeleteTaskModal
        open={deleteModalOpen}
        onClose={closeDeleteModal}
        taskDeleted={task}
      />
    );
  if (!open) return null;

  return (
    <div onClick={handleCloseModal} className="overlay">
      <div
        onClick={(e) => {
          e.stopPropagation();
        }}
        className={`task-model-container ${theme}`}
      >
        <div className={`task-header ${theme}`}>
          <h2>{task.title}</h2>
          <button onClick={() => setShowBtns(!showBtns)}>
            <img src="/assets/icon-vertical-ellipsis.svg" alt="ellipsis" />
          </button>
          <div
            style={{ display: showBtns ? `block` : `none` }}
            className={`task-header-menu ${theme}`}
          >
            <button className="edit-t-btn" onClick={handleEditTask}>
              Edit task
            </button>
            <button className="delete-t-btn" onClick={handleDeleteModalOpen}>
              Delete task
            </button>
          </div>
        </div>
        {task.description && (
          <p className="task-description">{task.description}</p>
        )}
        {task.subtasks.length > 0 && (
          <div className="subtasks-container">
            <p>
              Subtasks ({task.subtasks.filter((st) => st.isCompleted).length} of{" "}
              {task.subtasks.length})
            </p>
            <div className="subtasks-list">
              {task.subtasks.map((subtask, index) => {
                return (
                  <div key={index} className={`subtask-box ${theme}`}>
                    <label
                      htmlFor={`subtask-${index}`}
                      className={
                        subtask.isCompleted
                          ? `subtask-label checked`
                          : `subtask-label`
                      }
                    >
                      <input
                        id={`subtask-${index}`}
                        type="checkbox"
                        checked={subtask.isCompleted}
                        onChange={() => toggleSubtaskCompletion(index)}
                      />
                      <span className="checkmark"></span>
                      {subtask.title}
                    </label>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        <div className={`status-container ${theme}`}>
          <p>Current Status</p>
          <div className="status-dd">
            <button
              onClick={handelDropdown}
              className={
                showDropdown ? `dd-btn ${theme} purple` : `dd-btn ${theme}`
              }
            >
              {task.status}{" "}
              <img
                src="/assets/icon-chevron-down.svg"
                alt="chevron down icon"
              />
            </button>
            <div
              className={`dd-menu ${theme}`}
              style={{ display: showDropdown ? `block` : `none` }}
            >
              {boardClicked.statuses.map((status) => {
                return (
                  <button key={status} onClick={() => changeStatus(status)}>
                    {status}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskModel;
