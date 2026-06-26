import React from "react";

const StatCard = ({ title, value, unit, change, year, color }) => {
  const isPositive = change > 0;
  const changeColor = change === null ? "#888" : isPositive ? "#22c55e" : "#ef4444";
  const arrow = change === null ? "" : isPositive ? "▲" : "▼";

  return (
    <div style={styles.card}>
      <div style={{ ...styles.colorBar, background: color }} />
      <div style={styles.content}>
        <p style={styles.title}>{title}</p>
        <p style={styles.value}>
          {value !== null && value !== undefined ? `${value}%` : "N/A"}
        </p>
        <p style={styles.unit}>{unit}</p>
        <div style={styles.footer}>
          <span style={{ ...styles.change, color: changeColor }}>
            {change !== null ? `${arrow} ${Math.abs(change)}pp vs prev year` : ""}
          </span>
          <span style={styles.year}>{year}</span>
        </div>
      </div>
    </div>
  );
};

const styles = {
  card: { background: "#111827", border: "1px solid #1f2937", borderRadius: "12px", overflow: "hidden", display: "flex", flexDirection: "column", minWidth: "200px", flex: 1 },
  colorBar: { height: "4px", width: "100%" },
  content: { padding: "1.25rem" },
  title: { color: "#9ca3af", fontSize: "12px", textTransform: "uppercase", letterSpacing: "0.08em", margin: "0 0 8px 0" },
  value: { color: "#f9fafb", fontSize: "32px", fontWeight: "700", margin: "0 0 2px 0", fontFamily: "'IBM Plex Mono', monospace" },
  unit: { color: "#6b7280", fontSize: "11px", margin: "0 0 12px 0" },
  footer: { display: "flex", justifyContent: "space-between", alignItems: "center" },
  change: { fontSize: "12px", fontWeight: "500" },
  year: { color: "#4b5563", fontSize: "11px" },
};

export default StatCard;