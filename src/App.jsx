import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ShowBoard from "./components/ShowBaord";
import { useAppContext } from "./AppContext";

function App() {
  const { setShowEditBoard } = useAppContext();
  return (
    <>
      <Routes>
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route
          path="/"
          element={<Home />} // Home now includes the ShowBoard logic
        >
          <Route path="boards/details/:id" element={<ShowBoard />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
