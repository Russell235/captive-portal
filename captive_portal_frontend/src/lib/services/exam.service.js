import { apiClient } from "../auth";

export const examService = {
  /**
   * Liste toutes les sessions d'examen
   */
  async list() {
    const response = await apiClient().get("/admin/exam-sessions");
    return response.data;
  },

  /**
   * Liste les options (départements + classes)
   */
  async getOptions() {
    const response = await apiClient().get("/admin/exam-sessions/options");
    return response.data;
  },

  /**
   * Crée une session d'examen
   */
  async create(data) {
    const response = await apiClient().post("/admin/exam-sessions", data);
    return response.data;
  },

  /**
   * Met à jour une session
   */
  async update(id, data) {
    const response = await apiClient().put(`/admin/exam-sessions/${id}`, data);
    return response.data;
  },

  /**
   * Supprime une session
   */
  async delete(id) {
    const response = await apiClient().delete(`/admin/exam-sessions/${id}`);
    return response.data;
  },
};
