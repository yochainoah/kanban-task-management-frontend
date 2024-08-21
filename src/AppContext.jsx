import { createContext, useState, useContext, useEffect } from "react";
import axios from "axios";
const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [theme, setTheme] = useState("light"); // default theme
  const [boardClicked, setBoardClicked] = useState({});
  const [fetchBoard, setFetchBoard] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [taskClicked, setTaskClicked] = useState({});
  const [boardsState, setBoardsState] = useState({
    boards: [],
  });

  useEffect(() => {
    (async () => {
      const boardsData = await axios.get(`http://localhost:5000/boards`);
      setBoardsState({
        boards: boardsData.data,
        boardSelected: boardsData.data[0].name,
      });
      setBoardClicked(boardsData.data[0])
    })();
  }, []);

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
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
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);
