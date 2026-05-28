import React from "react";
import Navbar from "./components/Navbar";
import Dashboard from "./components/Dashboard";

const App = () => (
  <div>
    <h1 style={{ fontSize: "20px", marginBottom: "5px" }}>
      1. All Request Screen
    </h1>
    <Navbar />
    <Dashboard />
  </div>
);

export default App;
