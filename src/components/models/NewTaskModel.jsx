import React, { useEffect, useState } from "react";
import "./NewTaskModel.css";
import { useAppContext } from "../../AppContext";
import { v4 as uuidv4 } from "uuid";
// import dotenv from "dotenv";
// dotenv.config();
const NewTaskModel = ({ open, onClose }) => {
  const { theme, boardClicked, setBoardClicked } = useAppContext();
  const [taskAdded, setTaskAdded] = useState({
    title: "",
    description: "",
    subtasks: [],
    // Since the context loads asynchronously, board.statuses is undefined when this component first loads
    // We can't get [0] on undefined, so we add the ?. to make javascript ignore it if it's undefined
    status: "",
  });
  useEffect(() => {
    if (boardClicked && boardClicked.statuses?.length > 0) {
      // Set the default status to the first board status when boardClicked is ready
      setTaskAdded((prevTask) => ({
        ...prevTask,
        status: boardClicked.statuses[0], // set default status
      }));
    }
  }, [boardClicked]);

  const [showStatusDropdown, setShowStatusDropdown] = useState(false);
  const [warning, setWarning] = useState({
    warningStatus: false,
    warningId: "",
  });
  const [validationErrors, setValidationErrors] = useState({
    titleError: "",
    statusError: "",
    subtasksError: "",
  });

  const [subtasks, setSubtasks] = useState([
    { id: uuidv4(), title: "" },
    { id: uuidv4(), title: "" },
  ]);

  const handleCloseAddTask = () => {
    setShowStatusDropdown(false); // Close the dropdown
    setWarning((prevState) => {
      const newState = { ...prevState };
      newState.warningStatus = true;
      newState.warningId = "";
      return newState;
    });
    setValidationErrors({
      titleError: "",
      statusError: "",
      subtasksError: "",
    });
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
    const subtaskToBeDeleted = subtasks.find((el) => el.id === id);
    if (!subtaskToBeDeleted.title && subtasks.length <= 1) {
      setWarning((prevState) => {
        const newState = { ...prevState };
        newState.warningId = subtaskToBeDeleted.id;
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
      { id: uuidv4(), title: "" },
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
    let errors = {
      titleError: "",
      statusError: "",
      subtasksError: "",
    };

    // Title validation
    if (!taskAdded.title.trim()) {
      errors.titleError = "Title cannot be empty";
    }

    // Status validation
    if (!taskAdded.status) {
      errors.statusError = "Status must be selected";
    }

    // Subtasks validation
    const invalidSubtasks = subtasks.filter((subtask) => !subtask.title.trim());
    if (invalidSubtasks.length > 0) {
      errors.subtasksError = "Subtasks cannot be empty";
    }

    // Check if there are any errors
    if (errors.titleError || errors.statusError || errors.subtasksError) {
      setValidationErrors(errors);
      return;
    }

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
            placeholder="e.g. Take coffee break"
            onInput={(e) => handleTaskTitle(e.target.value)}
          />
          {validationErrors.titleError && (
            <p className="error-message">{validationErrors.titleError}</p>
          )}
        </div>
        <div className="add-t-desc">
          <label htmlFor="task-description" id="label">
            <p className="bold">Description</p>
          </label>
          <textarea
            id="task-description"
            placeholder="e.g. It’s always good to take a break. This 15 minute break will recharge the batteries a little."
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
                    warningIndicator
                      ? `subtask-input ${theme} red`
                      : `subtask-input ${theme}`
                  }
                >
                  <input
                    type="text"
                    className={`st-input-box`}
                    value={subtask.title}
                    placeholder="e.g. Make coffee"
                    onInput={(e) =>
                      handleSubtaskChange(subtask.id, e.target.value)
                    }
                  />
                  {warningIndicator && <span className="warning-text">Can't be empty</span>}
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
          </div>
          {validationErrors.subtasksError && (
            <p className="error-message">{validationErrors.subtasksError}</p>
          )}
          <button
            onClick={handleAddSubtask}
            className={`btn-secondry ${theme}`}
          >
            + Add New Subtask
          </button>
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
              {boardClicked.statuses.map((status, index) => {
                return (
                  <button
                    key={`${status}-${index}`}
                    onClick={() => handleTaskStatus(status)}
                  >
                    {status}
                  </button>
                );
              })}
            </div>
          </div>
          {validationErrors.statusError && (
            <p className="error-message">{validationErrors.statusError}</p>
          )}
        </div>
        <button className="btn-primary-s" onClick={handleTaskSubmit}>
          Create Task
        </button>
      </div>
    </div>
  );
};

export default NewTaskModel;
