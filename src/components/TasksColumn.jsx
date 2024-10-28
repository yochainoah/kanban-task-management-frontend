import React from "react";
import { useDrop } from "react-dnd";
import Task from "./Task";
import axios from "axios";
import { useAppContext } from "../AppContext";
function TasksColumn({ column, handleTaskClick }) {
  const { theme, boardClicked, setBoardClicked } = useAppContext();
  async function updateColumn(task, newTaskColumn) {
    // console.log("board clicked:", boardClicked);
    setBoardClicked((prevBoard) => {
      const newBoard = { ...prevBoard };
      const oldColumn = newBoard.columns.find((c) => c.name === task.status);
      const newColumn = newBoard.columns.find((c) => c.name === newTaskColumn);
      const oldTaskIndex = oldColumn.tasks.findIndex((t) => t._id === task._id);
      oldColumn.tasks.splice(oldTaskIndex, 1);
      newColumn.tasks.push({ ...task, status: newTaskColumn });

      return newBoard;
    });

    const data = await axios.put(
      `${import.meta.env.VITE_API_ROOT}/tasks/updateStatus/${
        task._id
      }/${newTaskColumn}/${boardClicked._id}`
    );
    // console.log(data);
  }
  const [{}, drop] = useDrop(() => ({
    accept: "BOX",
    drop: (item) => updateColumn(item.task, column.name),
  }));
  return (
    <div ref={drop} className="column-container">
      {column.tasks.map((task) => {
        const stCompleted = task.subtasks.filter(
          (st) => st.isCompleted === true
        );

        return (
          <Task
            key={task._id}
            task={task}
            theme={theme}
            stCompleted={stCompleted}
            handleTaskClick={handleTaskClick}
          />
        );
      })}
    </div>
  );
}

export default TasksColumn;
