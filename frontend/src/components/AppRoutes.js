import { Route, Routes, Navigate } from "react-router-dom";
import Query from "../pages/Query";
import Login from "../pages/Login";
import Properties from "../pages/Properties";
import QueryList from "../pages/QueryList";
import { useContext } from "react";
import UserContext from "../repository/userContext";

export default function AppRoutes() {
  const { user, token } = useContext(UserContext);

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/query" element={user && token ? <Query /> : <Navigate to="/login" replace />} />
      <Route path="/query-list" element={user && token ? <QueryList /> : <Navigate to="/login" replace />} />
      <Route path="/properties" element={user && token ? <Properties /> : <Navigate to="/login" replace />} />
    </Routes>
  );
}