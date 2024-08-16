// src/components/Tile.js
import React, { useEffect, useState } from "react";

const Tile = ({ value, onClick, animateClass, dropAnimation }) => {
  const [animationClass, setAnimationClass] = useState(animateClass);
  const [dropClass, setDropClass] = useState(dropAnimation);

  useEffect(() => {
    if (animateClass) {
      setAnimationClass(animateClass);
      const timeout = setTimeout(() => {
        setAnimationClass("");
      }, 300); // Duration of the animation
      return () => clearTimeout(timeout);
    }
  }, [animateClass]);

  useEffect(() => {
    if (dropAnimation) {
      setDropClass(dropAnimation);
      const timeout = setTimeout(() => {
        setDropClass("");
      }, 1500); // Duration of the drop animation
      return () => clearTimeout(timeout);
    }
  }, [dropAnimation]);

  return (
    <div className={`tile ${animationClass} ${dropClass}`} onClick={onClick}>
      <img src={value} alt="tile" />
    </div>
  );
};

export default Tile;
