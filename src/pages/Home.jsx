import React, { useEffect } from "react";
import { Outlet, useNavigate, useParams } from "react-router-dom";
import BoardsDropdown from "./../components/BoardsDropdown";
import { useState } from "react";
import { useAppContext } from "./../AppContext";
import NewTaskModel from "./../components/models/NewTaskModel";
import NewBoardModal from "./../components/models/NewBoardModal";
import EditBoardModal from "./../components/models/EditBoardModal";
import DeleteBoardModal from "./../components/models/DeleteBoardModal";
import BoardsAside from "./../components/BoardsAside";
import "./Home.css";
import ShowBoard from "../components/ShowBaord";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase";
import { signOut } from "firebase/auth";

const Home = () => {
  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        // User is signed in, see docs for a list of available properties
        // https://firebase.google.com/docs/reference/js/firebase.User
        const uid = user.uid;
        // ...
        console.log("uid", uid);
      } else {
        // User is signed out
        // ...
        console.log("user is logged out");
      }
    });
  }, []);
  const {
    theme,
    boardClicked,
    showSidebar,
    toggleSidebar,
    showEditBoard,
    setShowEditBoard,
  } = useAppContext();
  const [showAddTask, setShowAddTask] = useState(false);
  const [showAddBoard, setShowAddBoard] = useState(false);
  const [showBtns, setShowBtns] = useState(false);
  const [showDeleteBoard, setShowDeleteBoard] = useState(false);
  const { id } = useParams();
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
  const navigate = useNavigate();

  const handleLogout = () => {
    signOut(auth)
      .then(() => {
        // Sign-out successful.
        navigate("/login");
        console.log("Signed out successfully");
      })
      .catch((error) => {
        // An error happened.
        console.log(error);
      });
  };

  return (
    <>
      <header className={`${theme}`}>
        <div
          className={
            showSidebar
              ? `header-left add-sidebar-pd`
              : `header-left remove-sidebar-pd`
          }
        >
          <div className="header-desktop">
            <h1 className={theme}>{boardClicked.name}</h1>
          </div>
          <div className="header-mobile">
            <img src="/assets/logo-mobile.svg" />
            <BoardsDropdown openAddBoard={() => setShowAddBoard(true)} />
          </div>
        </div>
        <div className={`header-right ${theme}`}>
          <button onClick={handleLogout} className="btn-primary-l">
            <h4>Signout</h4>
          </button>
          <button
            onClick={() => setShowAddTask(!showAddTask)}
            className="btn-primary-l"
          >
            <h4 className="add-task-text">+Add New Task</h4>
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
      <main className={showSidebar ? `` : `remove-sidebar-pd`}>
        <BoardsAside openAddBoard={() => setShowAddBoard(true)} />
        {!id && <ShowBoard setShowEditBoard={setShowEditBoard} />}
        {id && <Outlet />}
        <button className={`show-asidebar-btn`} onClick={toggleSidebar}>
          <img
            src="/assets/icon-show-sidebar.svg"
            alt="eye for showing sidebar"
          />
        </button>
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
};

export default Home;
