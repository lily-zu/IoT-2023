// Switch.js
import React, { useState } from 'react';

const Switch = ({ label }) => {
  const [isChecked, setIsChecked] = useState(false);

  const toggleSwitch = () => {
    setIsChecked(!isChecked);
  };

  return (
    <div className={`switch ${isChecked ? 'on' : 'off'}`} onClick={toggleSwitch}>
      <div className="slider"></div>
      <span className="label">{label}</span>
    </div>
  );
};

export default Switch;
