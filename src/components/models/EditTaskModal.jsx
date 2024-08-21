import React from "react";
import { useAppContext } from "../../AppContext";
import { useState } from "react";
import axios from "axios";
import './EditTaskModal.css'
function EditTaskModal({ open, onClose }) {
  const { theme, boardClicked, setBoardClicked, taskClicked } =
    useAppContext();

  const [showStatusDropdown, setShowStatusDropdown] = useState(false);
  const [taskEdited, setTaskEdited] = useState({
    title: taskClicked.title,
    description: taskClicked.description,
    subtasks: [...taskClicked.subtasks],
    // Since the context loads asynchronously, board.statuses is undefined when this component first loads
    // We can't get [0] on undefined, so we add the ?. to make javascript ignore it if it's undefined
    status: taskClicked.status,
  });
  console.log("taskEdited:", taskEdited);
  const handleCloseAddTask = () => {
    // setShowDropdown(false); // Close the dropdown
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
    setTaskEdited((prevState) => {
      return {
        ...prevState,
        subtasks: prevState.subtasks.filter((subtask) => subtask.id !== id),
      };
    });
  };

  const handleAddSubtask = () => {
    setTaskEdited((prevState) => {
      return {
        ...prevState,
        subtasks: [...prevState.subtasks, { id: Date.now(), title: "" }],
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
    // console.log("Task edited:", taskEdited);

    const data = {
      ...taskEdited,
      boardId: boardClicked._id,
    };
    // console.log("taskClicked  :", taskClicked);
    let taskData = await axios.put(
      `http://localhost:5000/tasks/${taskClicked._id}`,
      data
    );
    let newTask = taskData.data;

    setBoardClicked((currentBoard) => {
      let newBoard = { ...currentBoard };

      // splice old column
      let oldColumn = newBoard.columns.find((c) => c.name === taskClicked.status);
      let oldTaskIndex = oldColumn.tasks.findIndex((t) => t._id === newTask._id);
      oldColumn.tasks.splice(oldTaskIndex,1);

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
    <div onClick={handleCloseAddTask} className="overlay">
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
          {taskEdited.subtasks.map((subtask) => {
            return (
              <div key={subtask.id} className={`subtask-input ${theme}`}>
                <input
                  type="text"
                  id="st-input-box"
                  value={subtask.title}
                  onInput={(e) =>
                    handleSubtaskChange(subtask.id, e.target.value)
                  }
                />
                <button onClick={() => handleRemoveSubtask(subtask.id)}>
                  <img src="/assets/icon-cross.svg" alt="delete cross" />
                </button>
              </div>
            );
          })}
          <button onClick={handleAddSubtask} className={`btn-secondry ${theme}`}>
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
              className={`dd-menu`}
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
        <button onClick={handleTaskEditSubmit} className="btn-primary-s">
          Save changes
        </button>
      </div>
    </div>
  );
}

export default EditTaskModal;
