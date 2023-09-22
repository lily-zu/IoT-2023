// CustomGaugeChart.js
import React from 'react';
import GaugeChart from 'react-gauge-chart'; // Keep the import statement as it is

const CustomGaugeChart = ({ id, percent }) => {
  return <GaugeChart id={id} percent={percent} />;
};

export default CustomGaugeChart;
