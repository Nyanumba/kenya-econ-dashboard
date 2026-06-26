import axios from "axios";

const BASE_URL = process.env.REACT_APP_API_URL || "";

const api = axios.create({
  baseURL: BASE_URL,
});

export const fetchDashboard = async (startYear = 2000, endYear = 2023) => {
  const { data } = await api.get(
    `/api/dashboard?start_year=${startYear}&end_year=${endYear}`
  );
  return data;
};

export const fetchIndicator = async (code, startYear = 2000, endYear = 2023) => {
  const { data } = await api.get(
    `/api/indicators/${code}?start_year=${startYear}&end_year=${endYear}`
  );
  return data;
};

export const fetchIndicatorList = async () => {
  const { data } = await api.get("/api/indicators");
  return data;
};