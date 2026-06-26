import React, { useState, useEffect, useCallback } from "react";
import StatCard from "./components/StatCard";
import IndicatorChart from "./components/IndicatorChart";
import YearRangeSelector from "./components/YearRangeSelector";
import { fetchDashboard } from "./api/client";

const COLORS = {
  gdp: "#10b981",
  inflation: "#f59e0b",
  unemployment: "#6366f1",
};

function App() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [startYear, setStartYear] = useState(2000);
  const [endYear, setEndYear] = useState(2023);

  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await fetchDashboard(startYear, endYear);
      setData(result);
    } catch (err) {
      setError("Failed to load data from the World Bank API. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [startYear, endYear]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleYearChange = (newStart, newEnd) => {
    setStartYear(newStart);
    setEndYear(newEnd);
  };

  return (
    <div style={styles.app}>
      {/* Header */}
      <header style={styles.header}>
        <div style={styles.headerLeft}>
          <div style={styles.flag}>🇰🇪</div>
          <div>
            <h1 style={styles.title}>Kenya Economic Dashboard</h1>
            <p style={styles.subtitle}>
              World Bank open data · GDP · Inflation · Unemployment
            </p>
          </div>
        </div>
        <YearRangeSelector
          startYear={startYear}
          endYear={endYear}
          onChange={handleYearChange}
        />
      </header>

      {/* Error */}
      {error && (
        <div style={styles.error}>
          <span>⚠️ {error}</span>
          <button style={styles.retryBtn} onClick={loadData}>
            Retry
          </button>
        </div>
      )}

      {/* Stat Cards */}
      {loading ? (
        <div style={styles.loadingRow}>
          {[1, 2, 3].map((i) => (
            <div key={i} style={styles.skeletonCard} />
          ))}
        </div>
      ) : data ? (
        <>
          <div style={styles.cardRow}>
            <StatCard
              title="GDP Growth"
              value={data.gdp_growth.latest_value}
              unit={data.gdp_growth.unit}
              change={data.gdp_growth.change_from_prev}
              year={data.gdp_growth.latest_year}
              color={COLORS.gdp}
            />
            <StatCard
              title="Inflation (CPI)"
              value={data.inflation.latest_value}
              unit={data.inflation.unit}
              change={data.inflation.change_from_prev}
              year={data.inflation.latest_year}
              color={COLORS.inflation}
            />
            <StatCard
              title="Unemployment Rate"
              value={data.unemployment.latest_value}
              unit={data.unemployment.unit}
              change={data.unemployment.change_from_prev}
              year={data.unemployment.latest_year}
              color={COLORS.unemployment}
            />
          </div>

          {/* Charts */}
          <div style={styles.chartRow}>
            <IndicatorChart
              title="GDP Growth (Annual %)"
              data={data.gdp_growth.data}
              color={COLORS.gdp}
              unit={data.gdp_growth.unit}
            />
            <IndicatorChart
              title="Inflation / CPI (Annual %)"
              data={data.inflation.data}
              color={COLORS.inflation}
              unit={data.inflation.unit}
            />
          </div>
          <div style={{ ...styles.chartRow, marginTop: "12px" }}>
            <IndicatorChart
              title="Unemployment Rate (% of labor force)"
              data={data.unemployment.data}
              color={COLORS.unemployment}
              unit={data.unemployment.unit}
            />
            <div style={styles.infoCard}>
              <p style={styles.infoTitle}>About this dashboard</p>
              <p style={styles.infoText}>
                Data is fetched live from the{" "}
                <a
                  href="https://data.worldbank.org/country/KE"
                  target="_blank"
                  rel="noreferrer"
                  style={{ color: "#10b981" }}
                >
                  World Bank Open Data API
                </a>{" "}
                and cached in PostgreSQL. Adjust the year range above to explore
                different periods.
              </p>
              <div style={styles.legendList}>
                {[
                  { label: "GDP Growth", color: COLORS.gdp, code: "NY.GDP.MKTP.KD.ZG" },
                  { label: "Inflation (CPI)", color: COLORS.inflation, code: "FP.CPI.TOTL.ZG" },
                  { label: "Unemployment", color: COLORS.unemployment, code: "SL.UEM.TOTL.ZS" },
                ].map((item) => (
                  <div key={item.code} style={styles.legendItem}>
                    <span style={{ ...styles.dot, background: item.color }} />
                    <div>
                      <span style={styles.legendLabel}>{item.label}</span>
                      <span style={styles.legendCode}>{item.code}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      ) : null}

      <footer style={styles.footer}>
        Source: World Bank Open Data &nbsp;·&nbsp; Country: Kenya (KE) &nbsp;·&nbsp;
        Built with FastAPI + React
      </footer>
    </div>
  );
}

const styles = {
  app: {
    minHeight: "100vh",
    background: "#030712",
    color: "#f9fafb",
    fontFamily: "'Inter', system-ui, sans-serif",
    padding: "1.5rem 2rem 3rem",
    maxWidth: "1200px",
    margin: "0 auto",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    flexWrap: "wrap",
    gap: "1rem",
    marginBottom: "2rem",
    paddingBottom: "1.25rem",
    borderBottom: "1px solid #1f2937",
  },
  headerLeft: { display: "flex", alignItems: "center", gap: "12px" },
  flag: { fontSize: "36px" },
  title: { margin: 0, fontSize: "22px", fontWeight: "700", color: "#f9fafb" },
  subtitle: { margin: "4px 0 0", fontSize: "13px", color: "#6b7280" },
  error: {
    background: "#1f0a0a",
    border: "1px solid #7f1d1d",
    borderRadius: "8px",
    color: "#fca5a5",
    padding: "12px 16px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "1.5rem",
    fontSize: "13px",
  },
  retryBtn: {
    background: "#7f1d1d",
    border: "none",
    borderRadius: "6px",
    color: "#fca5a5",
    padding: "6px 12px",
    cursor: "pointer",
    fontSize: "12px",
  },
  loadingRow: {
    display: "flex",
    gap: "12px",
    marginBottom: "12px",
    flexWrap: "wrap",
  },
  skeletonCard: {
    flex: 1,
    minWidth: "200px",
    height: "130px",
    background: "#111827",
    borderRadius: "12px",
    animation: "pulse 1.5s ease-in-out infinite",
  },
  cardRow: {
    display: "flex",
    gap: "12px",
    marginBottom: "12px",
    flexWrap: "wrap",
  },
  chartRow: {
    display: "flex",
    gap: "12px",
    flexWrap: "wrap",
  },
  infoCard: {
    background: "#111827",
    border: "1px solid #1f2937",
    borderRadius: "12px",
    padding: "1.25rem",
    flex: 1,
    minWidth: "280px",
  },
  infoTitle: {
    color: "#d1d5db",
    fontSize: "13px",
    fontWeight: "600",
    margin: "0 0 10px 0",
    textTransform: "uppercase",
    letterSpacing: "0.06em",
  },
  infoText: {
    color: "#9ca3af",
    fontSize: "13px",
    lineHeight: "1.7",
    margin: "0 0 1.25rem 0",
  },
  legendList: { display: "flex", flexDirection: "column", gap: "10px" },
  legendItem: { display: "flex", alignItems: "center", gap: "10px" },
  dot: {
    width: "10px",
    height: "10px",
    borderRadius: "50%",
    flexShrink: 0,
  },
  legendLabel: { color: "#d1d5db", fontSize: "13px", display: "block" },
  legendCode: {
    color: "#4b5563",
    fontSize: "11px",
    fontFamily: "'IBM Plex Mono', monospace",
    display: "block",
  },
  footer: {
    marginTop: "2.5rem",
    textAlign: "center",
    color: "#374151",
    fontSize: "12px",
    borderTop: "1px solid #111827",
    paddingTop: "1.5rem",
  },
};

export default App;