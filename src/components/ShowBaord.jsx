import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import TaskModel from "./models/TaskModel";

import { useAppContext } from "../AppContext";
import "./ShowBoard.css";
// import dotenv from "dotenv";
// dotenv.config();
/*
    1. component mounts, JSX renders
    2. useEffect is called
*/
const ShowBoard = ({setShowEditBoard}) => {
  const { theme, showModal, setShowModal, taskClicked, setTaskClicked } =
    useAppContext();
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
      const boardData = await axios.get(
        `${import.meta.env.VITE_API_ROOT}/boards/${id}`
      );
      // console.log(boardData.data)
      setBoardClicked({ ...boardData.data });
    }
    fetchBoard();
  }, [id, fetchBoard]);
  const columnColors = ["purple", "green", "blue"];
  return (
    <div className="board">
      <div className="column-headers">
        {boardClicked.columns &&
          boardClicked.columns.map((column, index) => {
            return (
              <h4 className="column-heading" key={index}>
                <img
                  src={`/assets/circle-solid-${columnColors[index]}.svg`}
                  alt={`${columnColors[index]} circle`}
                />
                {column.name} ({column.tasks.length})
              </h4>
            );
          })}
      </div>
      <div className="columns-container">
        {boardClicked.columns &&
          boardClicked.columns.map((column, index) => {
            return (
              <div key={index} className="column-container">
                {column.tasks.map((task) => {
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
        <button className={`add-column-btn ${theme}`} onClick={ () => setShowEditBoard(true)}>
          <h1> + New Column</h1>
        </button>
      </div>
      <TaskModel open={showModal} onClose={closeModal} task={taskClicked} />
    </div>
  );
};

export default ShowBoard;
