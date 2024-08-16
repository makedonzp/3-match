// src/App.js
import React from "react";
import GameBoard from "./components/GameBoard";
import styles from "./App.module.css";

const App = () => {
  return (
    <div className={styles.App}>
      <h1 className={styles.title}>Три в Ряд</h1>
      <GameBoard />
    </div>
  );
};

export default App;
