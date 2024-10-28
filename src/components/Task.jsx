import { useDrag } from "react-dnd";

export default function Task({ task, stCompleted, handleTaskClick, theme }) {
  // const [collected, dragRef] = useDrag(
  //   () => ({
  //     type: "Box",
  //     item: { title: "???" },
  //   }),
  //   []
  // );
  const [{ isDragging }, drag] = useDrag(() => ({
    // "type" is required. It is used by the "accept" specification of drop targets.
    type: "BOX",
    // The collect function utilizes a "monitor" instance (see the Overview for what this is)
    // to pull important pieces of state from the DnD system.
    item: { task: task },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  return (
    <button
      ref={drag}
      draggable="true"
      onClick={() => handleTaskClick(task)}
      key={task._id}
      data-id={task._id}
      className={`task ${theme}`}
      style={{ opacity: isDragging ? 0.5 : 1 }}
      // onDragStart={handleTaskDragStart}
      // onDragEnd={handleTaskDragEnd}
    >
      <h3>{task.title}</h3>
      <p>
        {stCompleted.length} of {task.subtasks.length} subtasks
      </p>
    </button>
  );
}
