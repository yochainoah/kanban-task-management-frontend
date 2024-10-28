import React from "react";
import { useDrop } from "react-dnd";
import TasksColumn from "./TasksColumn";
import axios from "axios";
import { useAppContext } from "../AppContext";
function DragNDropBoard({ handleTaskClick }) {


  return (
    <>
      {boardClicked.columns &&
        boardClicked.columns.map((column) => (
          <TasksColumn column={column} key={column._id} handleTaskClick={handleTaskClick}/>
        ))}
    </>
  );
}

export default DragNDropBoard;
