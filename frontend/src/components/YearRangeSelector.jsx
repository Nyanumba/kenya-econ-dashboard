import React from "react";

const YearRangeSelector = ({ startYear, endYear, onChange }) => {
  const years = [];
  for (let y = 1990; y <= 2023; y++) years.push(y);

  const selectStyle = {
    background: "#1f2937", border: "1px solid #374151", borderRadius: "8px",
    color: "#d1d5db", fontSize: "13px", padding: "6px 10px", cursor: "pointer", outline: "none",
  };

  return (
    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
      <span style={{ color: "#6b7280", fontSize: "13px" }}>From</span>
      <select style={selectStyle} value={startYear} onChange={(e) => onChange(Number(e.target.value), endYear)}>
        {years.map((y) => <option key={y} value={y} disabled={y >= endYear}>{y}</option>)}
      </select>
      <span style={{ color: "#6b7280", fontSize: "13px" }}>to</span>
      <select style={selectStyle} value={endYear} onChange={(e) => onChange(startYear, Number(e.target.value))}>
        {years.map((y) => <option key={y} value={y} disabled={y <= startYear}>{y}</option>)}
      </select>
    </div>
  );
};

export default YearRangeSelector;