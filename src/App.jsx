import BoardsDropdown from "./components/BoardsDropdown";
import { useState } from "react";
import { useAppContext } from "./AppContext";
import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import ShowBoard from "./components/ShowBaord";
import NewTaskModel from "./components/models/NewTaskModel";
import NewBoardModal from "./components/models/NewBoardModal";
import "./App.css";
import EditBoardModal from "./components/models/EditBoardModal";
import DeleteBoardModal from "./components/models/DeleteBoardModal";
import BoardsAside from "./components/BoardsAside";

function App() {
  const { theme } = useAppContext();
  const [showAddTask, setShowAddTask] = useState(false);
  const [showAddBoard, setShowAddBoard] = useState(false);
  const [showBtns, setShowBtns] = useState(false);
  const [showEditBoard, setShowEditBoard] = useState(false);
  const [showDeleteBoard, setShowDeleteBoard] = useState(false);
  const closeAddTask = () => {
    setShowAddTask(false);
  };
  const closeAddBoard = () => {
    setShowAddBoard(false);
  };
  const closeEditBoard = () => {
    setShowEditBoard(false);
  };
  const handleEditBoardOpen = () => {
    setShowEditBoard(true);
    setShowBtns(false);
  };
  const handleDeleteBoardOpen = () => {
    setShowDeleteBoard(true);
    setShowBtns(false);
  };
  return (
    <>
      <header className={`${theme}`}>
        <div className="header-left">
          <img src="/assets/logo-mobile.svg" />
          <BoardsDropdown openAddBoard={() => setShowAddBoard(true)} />
        </div>
        <div className={`header-right ${theme}`}>
          <button
            onClick={() => setShowAddTask(!showAddTask)}
            className="btn-primary-l"
          >
            <img src="/assets/icon-add-task-mobile.svg" />
          </button>
          {/* ellipsis */}
          <button
            className="brd-options-btn"
            onClick={() => setShowBtns(!showBtns)}
          >
            <img src="/assets/icon-vertical-ellipsis.svg" alt="ellipsis" />
          </button>
          <div
            style={{ display: showBtns ? `block` : `none` }}
            className={`board-header-menu ${theme}`}
          >
            <button className="edit-b-btn" onClick={handleEditBoardOpen}>
              Edit Board
            </button>
            <button className="delete-b-btn" onClick={handleDeleteBoardOpen}>
              Delete Board
            </button>
          </div>
        </div>
      </header>
      <main>
        <BoardsAside />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/boards/details/:id" element={<ShowBoard />} />
        </Routes>
      </main>
      <EditBoardModal open={showEditBoard} onClose={closeEditBoard} />
      <DeleteBoardModal
        open={showDeleteBoard}
        onClose={() => setShowDeleteBoard(false)}
      />
      <NewBoardModal open={showAddBoard} onClose={closeAddBoard} />
      <NewTaskModel open={showAddTask} onClose={closeAddTask} />
    </>
  );
}

export default App;
