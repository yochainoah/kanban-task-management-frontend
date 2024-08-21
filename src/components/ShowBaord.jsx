import React, { useEffect, useState } from "react";
import { useParams} from "react-router-dom";
import axios from "axios";
import TaskModel from "./models/TaskModel";

import { useAppContext } from "../AppContext";
import "./ShowBoard.css";

/*
    1. component mounts, JSX renders
    2. useEffect is called
*/
function handleSelectBoard(btnvalue) {
  setBoardsState((prevState) => {
    return { ...prevState, boardSelected: btnvalue };
  });
  // setOptionsShown((prevState) => !prevState);
}
const ShowBoard = () => {
  // const [showTaskModal, setShowTaskModal] = useState(false);
  const {
    theme,
    showModal,
    setShowModal,
    taskClicked,
    setTaskClicked,
  } = useAppContext();
  const { id } = useParams();
  // const [board, setBoard] = useState({});
  const { boardClicked, setBoardClicked, fetchBoard } = useAppContext();

  const handleTaskClick = (task) => {
    setTaskClicked(task);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setTaskClicked(null);
  };
  useEffect(() => {
    async function fetchBoard() {
      const boardData = await axios.get(`http://localhost:5000/boards/${id}`);
      // console.log(boardData.data)
      setBoardClicked({ ...boardData.data });
    }
    fetchBoard();
  }, [id, fetchBoard]);
  const columnColors = ["purple", "green", "blue"];
  return (
    <div className="board">
      {/* <BoardsAside /> */}
      {boardClicked.columns &&
        boardClicked.columns.map((column, index) => {
          // console.log("boardState:", board);
          return (
            <div key={index} className="column-container">
              <h4 className="column-heading">
                <img
                  src={`/assets/circle-solid-${columnColors[index]}.svg`}
                  alt={`${columnColors[index]} circle`}
                />
                {column.name} ({column.tasks.length})
              </h4>
              {column.tasks.map((task) => {
                //  "[Object object]"
                const stCompleted = task.subtasks.filter(
                  (st) => st.isCompleted === true
                );

                return (
                  <button
                    onClick={() => handleTaskClick(task)}
                    key={task._id}
                    className={`task ${theme}`}
                  >
                    <h3>{task.title}</h3>
                    <p>
                      {stCompleted.length} of {task.subtasks.length} subtasks
                    </p>
                  </button>
                );
              })}
            </div>
          );
        })}
      <TaskModel open={showModal} onClose={closeModal} task={taskClicked} />
    </div>
  );
};

export default ShowBoard;
