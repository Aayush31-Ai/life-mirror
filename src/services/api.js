/**
 * API Service
 * Centralized communication with JSON Server backend
 */

import axios from "axios";

const API_BASE = import.meta.env.VITE_JSON_SERVER_URL || "http://localhost:3001";

const api = axios.create({
  baseURL: API_BASE,
  headers: {
    "Content-Type": "application/json",
  },
});

// User endpoints
export const userAPI = {
  get: () => api.get("/user"),
  update: (data) => api.patch("/user/1", data),
};

// Health state endpoints
export const healthStateAPI = {
  get: () => api.get("/healthState"),
  update: (data) => api.patch("/healthState", data),
};

// Life moments endpoints
export const lifeMomentsAPI = {
  getAll: () => api.get("/lifeMoments"),
  getById: (id) => api.get(`/lifeMoments/${id}`),
  create: (data) => api.post("/lifeMoments", data),
  update: (id, data) => api.patch(`/lifeMoments/${id}`, data),
  delete: (id) => api.delete(`/lifeMoments/${id}`),
};


export const twinsAPI = {

  getAll: () => api.get("/twins"),
  updateCurrent: (data) => api.patch("/twins", { current: data }),
  updateWhatIf: (data) => api.patch("/twins", { whatIf: data }),
};

// Organ conversations endpoints
export const organConversationsAPI = {
  getAll: () => api.get("/organConversations"),
  getByOrgan: (organ) => api.get(`/organConversations?organ=${organ}`),
  create: (data) => api.post("/organConversations", data),
  update: (id, data) => api.patch(`/organConversations/${id}`, data),
};

// Nudges endpoints
export const nudgesAPI = {
  getAll: () => api.get("/nudges"),
  create: (data) => api.post("/nudges", data),
  update: (id, data) => api.patch(`/nudges/${id}`, data),
};

// Memories endpoints
export const memoriesAPI = {
  getAll: () => api.get("/memories"),
  create: (data) => api.post("/memories", data),
  update: (id, data) => api.patch(`/memories/${id}`, data),
};

// Narrative history endpoints
export const narrativeHistoryAPI = {
  getAll: () => api.get("/narrativeHistory"),
  create: (data) => api.post("/narrativeHistory", data),
};

export default api;
