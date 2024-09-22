import React from "react";
import { v4 as uuidv4 } from "uuid";
import { useAppContext } from "../../AppContext";
import { useState } from "react";
import axios from "axios";
import "./EditTaskModal.css";
// import dotenv from "dotenv";
// dotenv.config();

function EditTaskModal({ open, onClose }) {
  const { theme, boardClicked, setBoardClicked, taskClicked } = useAppContext();
  const [warning, setWarning] = useState({
    warningStatus: false,
    warningId: "",
  });
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);
  const [taskEdited, setTaskEdited] = useState({
    title: taskClicked.title,
    description: taskClicked.description,
    subtasks: [...taskClicked.subtasks],
    // Since the context loads asynchronously, board.statuses is undefined when this component first loads
    // We can't get [0] on undefined, so we add the ?. to make javascript ignore it if it's undefined
    status: taskClicked.status,
  });
  const [validationErrors, setValidationErrors] = useState({
    titleError: "",
    statusError: "",
    subtasksError: "",
  });
  console.log("taskEdited:", taskEdited);
  const handleCloseEditTask = () => {
    // setShowDropdown(false); // Close the dropdown
    setValidationErrors({
      titleError: "",
      statusError: "",
      subtasksError: "",
    });
    onClose(); // Call the onClose function to close the modal
  };
  const handleTaskTitle = (titleAdded) => {
    setTaskEdited({ ...taskEdited, title: titleAdded });
  };
  const handleTaskDescription = (descriptionAdded) => {
    console.log("descriptionAdded:", descriptionAdded);
    setTaskEdited({ ...taskEdited, description: descriptionAdded });
  };
  const handelStatusDropdown = () => {
    setShowStatusDropdown(!showStatusDropdown);
  };
  const handleRemoveSubtask = (id) => {
    // setTaskEdited((prevState) => {
    //   return {
    //     ...prevState,
    //     subtasks: prevState.subtasks.filter((subtask) => subtask.id !== id),
    //   };
    // });
    const subtaskToBeDeleted = taskEdited.subtasks.find((el) => el.id === id);
    if (!subtaskToBeDeleted.title && taskEdited.subtasks.length <= 1) {
      setWarning((prevState) => {
        const newState = { ...prevState };
        newState.warningId = subtaskToBeDeleted.id;
        newState.warningStatus = true;
        return newState;
      });
    } else {
      setTaskEdited((prevState) => {
        return {
          ...prevState,
          subtasks: prevState.subtasks.filter((subtask) => subtask.id !== id),
        };
      });
    }
  };

  const handleAddSubtask = () => {
    setTaskEdited((prevState) => {
      return {
        ...prevState,
        subtasks: [
          ...prevState.subtasks,
          { title: "", isCompleted: false, id: uuidv4() },
        ],
      };
    });
  };
  const handleSubtaskChange = (id, value) => {
    setTaskEdited((prevState) => {
      return {
        ...prevState,
        subtasks: prevState.subtasks.map((subtask) =>
          subtask.id === id ? { ...subtask, title: value } : subtask
        ),
      };
    });
  };
  const handleTaskStatus = (newStatus) => {
    setTaskEdited({ ...taskEdited, status: newStatus });
    setShowStatusDropdown(!showStatusDropdown);
  };

  async function handleTaskEditSubmit() {
    let errors = {
      titleError: "",
      statusError: "",
      subtasksError: "",
    };

    // Title validation
    if (!taskEdited.title.trim()) {
      errors.titleError = "Title cannot be empty";
    }

    // Status validation
    if (!taskEdited.status) {
      errors.statusError = "Status must be selected";
    }

    // Subtasks validation
    const invalidSubtasks = taskEdited.subtasks.filter(
      (subtask) => !subtask.title.trim()
    );
    if (invalidSubtasks.length > 0) {
      4;
      errors.subtasksError = "Subtasks cannot be empty";
    }

    // Check if there are any errors
    if (errors.titleError || errors.statusError || errors.subtasksError) {
      setValidationErrors(errors);
      return;
    }

    const data = {
      ...taskEdited,
      boardId: boardClicked._id,
    };
    let taskData = await axios.put(
      `${import.meta.env.VITE_API_ROOT}/tasks/${taskClicked._id}`,
      data
    );
    let newTask = taskData.data;

    setBoardClicked((currentBoard) => {
      let newBoard = { ...currentBoard };

      // splice old column
      let oldColumn = newBoard.columns.find(
        (c) => c.name === taskClicked.status
      );
      let oldTaskIndex = oldColumn.tasks.findIndex(
        (t) => t._id === newTask._id
      );
      oldColumn.tasks.splice(oldTaskIndex, 1);

      // push to new column
      let column = newBoard.columns.find((c) => c.name === newTask.status);
      column.tasks.push(newTask);

      return newBoard;
    });

    onClose();
  }
  //  JSON.stringify    js obj -> json
  //  JSON.parse        json -> js obj

  if (!open) return null;
  return (
    <div onClick={handleCloseEditTask} className="overlay">
      <div
        onClick={(e) => {
          e.stopPropagation();
        }}
        className={`edit-task-modal ${theme}`}
      >
        <h2>Edit Task</h2>
        <div className="add-t-title">
          <label htmlFor="task-title" id="label">
            <p className="bold">Title</p>
          </label>
          <input
            type="text"
            id="task-title"
            value={`${taskEdited.title}`}
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
            onInput={(e) => handleTaskDescription(e.target.value)}
            value={taskEdited.description}
          />
        </div>
        <div className="input-st-container">
          <p className="bold">Subtasks</p>
          <div className="subtasks-container">
            {taskEdited.subtasks.map((subtask) => {
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
                    id="st-input-box"
                    value={subtask.title}
                    placeholder={
                      warning.warningStatus && warning.warningId === subtask.id
                        ? "Can't be empty"
                        : ""
                    }
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
              className={`dd-btn ${theme}`}
            >
              {taskEdited.status}
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
        </div>
        <button onClick={handleTaskEditSubmit} className="btn-primary-s">
          Save changes
        </button>
      </div>
    </div>
  );
}

export default EditTaskModal;
