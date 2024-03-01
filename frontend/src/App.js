import { BrowserRouter as Router } from "react-router-dom";
import "./tailwind.css";
import Layout from "./components/Layout";
import AppRoutes from "./components/AppRoutes";
import UserContext from "./repository/userContext";
import { useState } from "react";

function App() {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);

  return (
    <UserContext.Provider value={{ user, setUser, token, setToken }}>
      <Router>
        <Layout>
          <AppRoutes />
        </Layout>
      </Router>
    </UserContext.Provider>
  );
}

export default App;
