import React, { useContext, useState } from "react";
import { FiMenu, FiX, FiLogIn, FiLogOut } from "react-icons/fi";
import { Link, useNavigate } from "react-router-dom";
import UserContext from "../repository/userContext";

// Navbar component
const Navbar = () => {
  const { user, setUser, setToken } = useContext(UserContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear user and token
    setUser(null);
    setToken(null);

    // Navigate to login page
    navigate("/login");
  };
  return (
    <div className="flex justify-between items-center bg-sky-950 text-white p-5">
      <h1 className="text-2xl">DMIT 2015 - Course Project</h1>
      {user ? (
        <button
          onClick={handleLogout}
          className="text-white text-2xl mr-3 hover:bg-sky-800 rounded-full p-2"
        >
          <FiLogOut />
        </button>
      ) : (
        <Link to="/login">
          <button className="text-white text-2xl mr-3 hover:bg-sky-800 rounded-full p-2">
            <FiLogIn />
          </button>
        </Link>
      )}
    </div>
  );
};

// Sidebar component
const Sidebar = ({ isOpen, setIsOpen }) => {
  const { user } = useContext(UserContext);
  return (
    <div
      className={`transform top-0 left-0 w-64 bg-gradient-to-r from-sky-800 to-sky-950 text-white p-3 fixed h-full drop-shadow-md overflow-auto ease-in-out transition-all duration-300 z-30 font-light 
    ${isOpen ? "translate-x-0" : "translate-x-[-192px]"}
    `}
    >
      <div className="flex justify-between items-center mt-2 mb-5">
        <h2 className="text-xl my-0 pl-2">Menu</h2>
        <div className="bg-transparent hover:bg-sky-800 rounded-full p-2">
          <button onClick={() => setIsOpen(!isOpen)} className="text-white p-2">
            {isOpen ? <FiX /> : <FiMenu />}
          </button>
        </div>
      </div>
      {user && (
        <ul>
          <Link to="/query">
            <li className="hover:bg-sky-700 p-2 rounded-md">Query Single</li>
          </Link>
          <Link to="/query-list">
            <li className="hover:bg-sky-700 p-2 rounded-md">Query List</li>
          </Link>
          <Link to="/properties">
            <li className="hover:bg-sky-700 p-2 rounded-md">Property CRUD</li>
          </Link>
        </ul>
      )}
    </div>
  );
};

// Layout component
const Layout = ({ children }) => {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="flex">
      <Sidebar isOpen={isOpen} setIsOpen={setIsOpen} />
      <div
        style={{
          width: isOpen ? "calc(100% - 16rem)" : "100%",
        }}
        className={`transition-all duration-300 bg-slate-100 overflow-auto ${
          isOpen ? "ml-64" : "ml-16"
        }`}
      >
        <Navbar />
        {children}
      </div>
    </div>
  );
};

export default Layout;
