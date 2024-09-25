import { Route, Routes, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ShowBoard from "./components/ShowBaord";
import ProtectedRoute from "./components/ProtectedRoute";
import { useAppContext } from "./AppContext";

function App() {
  const { setShowEditBoard } = useAppContext();
  return (
    <>
      <Routes>
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Navigate to="/signup" />} />
        <Route
          path="/home"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        >
          <Route
            path="boards/details/:id"
            element={<ShowBoard setShowEditBoard={setShowEditBoard} />}
          />
        </Route>
      </Routes>
    </>
  );
}

export default App;
