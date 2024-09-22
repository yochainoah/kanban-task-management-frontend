import { createContext, useState, useContext, useEffect } from "react";
import axios from "axios";
const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [theme, setTheme] = useState("light"); // default theme
  const [showSidebar, setShowSidebar] = useState(true);
  const [boardClicked, setBoardClicked] = useState({});
  const [fetchBoard, setFetchBoard] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [taskClicked, setTaskClicked] = useState({});
  const [showEditBoard, setShowEditBoard] = useState(false);
  const [boardsState, setBoardsState] = useState({
    boards: [],
  });

  useEffect(() => {
    (async () => {
      const boardsData = await axios.get(
        `${import.meta.env.VITE_API_ROOT}/boards`
      );
      console.log("boardsData", boardsData);
      setBoardsState({
        boards: boardsData.data,
        boardSelected: boardsData.data[0].name,
      });
      setBoardClicked(boardsData.data[0]);
    })();
  }, []);
  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
  };
  const toggleSidebar = () => {
    setShowSidebar(!showSidebar);
  };

  return (
    <AppContext.Provider
      value={{
        theme,
        toggleTheme,
        boardClicked,
        setBoardClicked,
        fetchBoard,
        setFetchBoard,
        showModal,
        setShowModal,
        taskClicked,
        setTaskClicked,
        boardsState,
        setBoardsState,
        showSidebar,
        setShowSidebar,
        toggleSidebar,
        showEditBoard,
        setShowEditBoard,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);
