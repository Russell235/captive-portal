// src/services/student.service.js
import { apiClient } from "../auth"; // adjust path to your apiClient file

const studentService = {
  /**
   * Get current student profile
   * GET /api/student/profile
   */
  async getStudentProfile() {
    try {
      const { data } = await apiClient().get("/student/profile");
      return data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  /**
   * Update student profile
   * PUT /api/student/profile
   * @param {Object} payload
   * @param {string} [payload.email]
   * @param {string} [payload.phone]
   * @param {string} [payload.profile_image]
   */
  async updateStudentProfile(payload) {
    try {
      const { data } = await apiClient().put("/student/profile", payload);
      return data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  /**
   * Change student password
   * PUT /api/student/password
   * @param {Object} payload
   * @param {string} payload.oldPassword
   * @param {string} payload.newPassword
   */
  async changeStudentPassword({ oldPassword, newPassword }) {
    try {
      const { data } = await apiClient().put("/student/password", {
        oldPassword,
        newPassword,
      });
      return data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  /* =============== TIMETABLE =============== */
  async getMyTimetable() {
    try {
      const { data } = await apiClient().get("/timetable");
      return data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  /* =============== DOCUMENTS =============== */
  async listDocuments() {
    try {
      const { data } = await apiClient().get("/documents");
      return data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  async getDocument(id) {
    try {
      const { data } = await apiClient().get(`/documents/${id}`);
      return data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  /* =============== NOTIFICATIONS / ANNOUNCEMENTS =============== */
  async listNotifications() {
    try {
      const { data } = await apiClient().get("/notifications");
      return data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  async markNotificationRead(id) {
    try {
      const { data } = await apiClient().put(`/notifications/${id}/read`);
      return data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  /* =============== TICKETS / SUPPORT =============== */
  async listMyTickets() {
    try {
      const { data } = await apiClient().get("/tickets");
      return data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  async createTicket(payload) {
    try {
      const { data } = await apiClient().post("/tickets", payload);
      return data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  async getTicket(id) {
    try {
      const { data } = await apiClient().get(`/tickets/${id}`);
      return data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  async addTicketMessage(id, message) {
    try {
      const { data } = await apiClient().post(`/tickets/${id}/messages`, {
        message,
      });
      return data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  /* =============== FAQS =============== */
  async listFaqs() {
    try {
      const { data } = await apiClient().get("/faqs");
      return data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
};

export default studentService;
