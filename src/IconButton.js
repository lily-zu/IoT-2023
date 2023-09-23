// IconButton.js
import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const IconButton = ({ icon, label }) => {
  return (
    <div className="icon-button">
      <FontAwesomeIcon icon={icon} className="icon" />
      <span className="label">{label}</span>
    </div>
  );
};

export default IconButton;
