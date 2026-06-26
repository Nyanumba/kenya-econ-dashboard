import React from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from "recharts";

const CustomTooltip = ({ active, payload, label, unit }) => {
  if (active && payload && payload.length) {
    return (
      <div style={styles.tooltip}>
        <p style={styles.tooltipYear}>{label}</p>
        <p style={{ ...styles.tooltipValue, color: payload[0].color }}>
          {payload[0].value !== null ? `${payload[0].value}%` : "No data"}
        </p>
        <p style={styles.tooltipUnit}>{unit}</p>
      </div>
    );
  }
  return null;
};

const IndicatorChart = ({ title, data, color, unit }) => {
  return (
    <div style={styles.wrapper}>
      <p style={styles.title}>{title}</p>
      <ResponsiveContainer width="100%" height={220}>
        <LineChart data={data} margin={{ top: 8, right: 16, left: -10, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
          <XAxis dataKey="year" tick={{ fill: "#6b7280", fontSize: 11 }} tickLine={false} axisLine={{ stroke: "#1f2937" }} />
          <YAxis tick={{ fill: "#6b7280", fontSize: 11 }} tickLine={false} axisLine={false} tickFormatter={(v) => `${v}%`} />
          <Tooltip content={<CustomTooltip unit={unit} />} />
          <ReferenceLine y={0} stroke="#374151" strokeDasharray="4 4" />
          <Line type="monotone" dataKey="value" stroke={color} strokeWidth={2.5} dot={{ fill: color, r: 3, strokeWidth: 0 }} activeDot={{ r: 5, strokeWidth: 0 }} connectNulls={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

const styles = {
  wrapper: { background: "#111827", border: "1px solid #1f2937", borderRadius: "12px", padding: "1.25rem", flex: 1, minWidth: "280px" },
  title: { color: "#d1d5db", fontSize: "13px", fontWeight: "600", margin: "0 0 1rem 0", textTransform: "uppercase", letterSpacing: "0.06em" },
  tooltip: { background: "#1f2937", border: "1px solid #374151", borderRadius: "8px", padding: "10px 14px" },
  tooltipYear: { color: "#9ca3af", fontSize: "11px", margin: "0 0 4px 0" },
  tooltipValue: { fontSize: "18px", fontWeight: "700", margin: "0 0 2px 0", fontFamily: "'IBM Plex Mono', monospace" },
  tooltipUnit: { color: "#6b7280", fontSize: "11px", margin: 0 },
};

export default IndicatorChart;