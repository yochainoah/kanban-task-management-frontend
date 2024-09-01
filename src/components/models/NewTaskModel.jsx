import React, { useState } from "react";
import "./NewTaskModel.css";
import { useAppContext } from "../../AppContext";
// import dotenv from "dotenv";
// dotenv.config();
const NewTaskModel = ({ open, onClose }) => {
  const { theme, boardClicked, setBoardClicked, boardsState } = useAppContext();
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);
  const [warning, setWarning] = useState({
    warningStatus: false,
    warningId: "",
  });
  const [taskAdded, setTaskAdded] = useState({
    title: "",
    description: "",
    subtasks: [],
    // Since the context loads asynchronously, board.statuses is undefined when this component first loads
    // We can't get [0] on undefined, so we add the ?. to make javascript ignore it if it's undefined
    status: boardClicked.statuses?.[0],
  });
  const [subtasks, setSubtasks] = useState([
    { id: 1, title: "" },
    { id: 2, title: "" },
  ]);

  const handleCloseAddTask = () => {
    setShowStatusDropdown(false); // Close the dropdown
    setWarning((prevState) => {
      const newState = {...prevState}
      newState.warningStatus = true;
      newState.warningId = "";
      return newState;
    })
    onClose(); // Call the onClose function to close the modal
  };
  const handleTaskTitle = (titleAdded) => {
    setTaskAdded({ ...taskAdded, title: titleAdded });
  };
  const handleTaskDescription = (descriptionAdded) => {
    console.log("descriptionAdded:", descriptionAdded);
    setTaskAdded({ ...taskAdded, description: descriptionAdded });
  };
  const handelStatusDropdown = () => {
    setShowStatusDropdown(!showStatusDropdown);
  };
  const handleRemoveSubtask = (id) => {
    const taskToBeDeleted = subtasks.find((el) => el.id === id);
    if (!taskToBeDeleted.title && subtasks.length <= 2) {
      setWarning((prevState) => {
        const newState = { ...prevState };
        newState.warningId = taskToBeDeleted.id;
        newState.warningStatus = true;
        return newState;
      });
    } else {
      setSubtasks((prevSubtasks) =>
        prevSubtasks.filter((subtask) => subtask.id !== id)
      );
      setTaskAdded({ ...taskAdded, subtasks: subtasks });
    }
  };

  const handleAddSubtask = () => {
    setSubtasks((prevSubtasks) => [
      ...prevSubtasks,
      { id: Date.now(), title: "" },
    ]);
    setTaskAdded({ ...taskAdded, subtasks: subtasks });
  };
  const handleSubtaskChange = (id, value) => {
    setSubtasks((prevSubtasks) =>
      prevSubtasks.map((subtask) =>
        subtask.id === id ? { ...subtask, title: value } : subtask
      )
    );
    setTaskAdded({ ...taskAdded, subtasks: subtasks });
  };
  const handleTaskStatus = (newStatus) => {
    setTaskAdded({ ...taskAdded, status: newStatus });
    setShowStatusDropdown(!showStatusDropdown);
  };

  //  JSON.stringify    js obj -> json
  //  JSON.parse        json -> js obj

  const handleTaskSubmit = async () => {
    console.log("task-added:", taskAdded);
    taskAdded.boardId = boardClicked._id;
    const res = await fetch(`${import.meta.env.VITE_API_ROOT}/addTask`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(taskAdded),
    });
    console.log("response:", res);
    if (!res.ok) {
      const errorMessage = await res.text();
      // displayError("Something went wrong")
      return;
    }
    const newTask = await res.json();
    setBoardClicked((currentBoard) => {
      const newBoard = { ...currentBoard };
      const column = newBoard.columns.find((c) => c.name === newTask.status);
      column.tasks.push(newTask);
      return newBoard;
    });
    onClose();
  };

  if (!open) return null;
  return (
    <div onClick={handleCloseAddTask} className="overlay">
      <div
        onClick={(e) => {
          e.stopPropagation();
        }}
        className={`add-task-model ${theme}`}
      >
        <h2>Add New Task</h2>
        <div className="add-t-title">
          <label htmlFor="task-title" id="label">
            <p className="bold">Title</p>
          </label>
          <input
            type="text"
            id="task-title"
            onInput={(e) => handleTaskTitle(e.target.value)}
          />
        </div>
        <div className="add-t-desc">
          <label htmlFor="task-description" id="label">
            <p className="bold">Description</p>
          </label>
          <textarea
            id="task-description"
            onInput={(e) => handleTaskDescription(e.target.value)}
          />
        </div>
        <div className={`input-st-container`}>
          <p className="bold">Subtasks</p>
          <div className="subtasks-container">
            {subtasks.map((subtask) => {
              let warningIndicator =
                warning.warningStatus && warning.warningId === subtask.id;
              return (
                <div
                  key={subtask.id}
                  className={
                    warning.warningStatus && warning.warningId === subtask.id
                      ? `subtask-input ${theme} red`
                      : `subtask-input ${theme}`
                  }
                >
                  <input
                    type="text"
                    className={`st-input-box`}
                    value={subtask.title}
                    placeholder={warning.warningStatus && warning.warningId === subtask.id ? "Can't be empty" : ""}
                    onInput={(e) =>
                      handleSubtaskChange(subtask.id, e.target.value)
                    }
                  />
                  <button onClick={() => handleRemoveSubtask(subtask.id)}>
                    {warningIndicator && (
                      <img
                        src="/assets/icon-cross-red.svg"
                        alt="delete cross"
                      />
                    )}
                    {!warningIndicator && (
                      <img src="/assets/icon-cross.svg" alt="delete cross" />
                    )}
                  </button>
                </div>
              );
            })}
            <button
              onClick={handleAddSubtask}
              className={`btn-secondry ${theme}`}
            >
              + Add New Subtask
            </button>
          </div>
        </div>
        {/* dd-status */}
        <div className="input-status-container">
          <p className="bold">Status</p>
          <div className="status-dd">
            <button
              onClick={handelStatusDropdown}
              className={
                showStatusDropdown
                  ? `dd-btn ${theme} purple`
                  : `dd-btn ${theme}`
              }
            >
              {taskAdded.status}
              <img
                src="/assets/icon-chevron-down.svg"
                alt="chevron down icon"
              />
            </button>
            <div
              className={`dd-menu ${theme}`}
              style={{ display: showStatusDropdown ? `block` : `none` }}
            >
              {boardClicked.statuses.map((status) => {
                return (
                  <button key={status} onClick={() => handleTaskStatus(status)}>
                    {status}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
        <button className="btn-primary-s" onClick={handleTaskSubmit}>
          Create Task
        </button>
      </div>
    </div>
  );
};

export default NewTaskModel;
