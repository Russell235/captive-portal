// src/services/admin.service.js
import { apiClient } from "../auth"; // adjust path to your apiClient file

const adminService = {
  /* =============== STUDENTS =============== */
  async listStudents() {
    try {
      const { data } = await apiClient().get("/admin/students");
      return data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  async getStudent(id) {
    try {
      const { data } = await apiClient().get(`/admin/students/${id}`);
      return data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  async createStudent(payload) {
    try {
      const { data } = await apiClient().post("/admin/students", payload);
      return data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  async updateStudent(id, payload) {
    try {
      const { data } = await apiClient().put(`/admin/students/${id}`, payload);
      return data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  async deleteStudent(id) {
    try {
      const { data } = await apiClient().delete(`/admin/students/${id}`);
      return data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  /* =============== DEVICES =============== */
  async listDevices() {
    try {
      const { data } = await apiClient().get("/admin/devices");
      return data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  async blockDevice(id) {
    try {
      const { data } = await apiClient().put(`/admin/devices/${id}/block`);
      return data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  async unblockDevice(id) {
    try {
      const { data } = await apiClient().put(`/admin/devices/${id}/unblock`);
      return data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  /* =============== SESSIONS =============== */
  async listSessions() {
    try {
      const { data } = await apiClient().get("/admin/sessions");
      return data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  async getSession(id) {
    try {
      const { data } = await apiClient().get(`/admin/sessions/${id}`);
      return data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  /* =============== TIMETABLE =============== */
  async listTimetable() {
    try {
      const { data } = await apiClient().get("/admin/timetable");
      return data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  async createTimetable(payload) {
    try {
      const { data } = await apiClient().post("/admin/timetable", payload);
      return data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  async updateTimetable(id, payload) {
    try {
      const { data } = await apiClient().put(`/admin/timetable/${id}`, payload);
      return data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  async deleteTimetable(id) {
    try {
      const { data } = await apiClient().delete(`/admin/timetable/${id}`);
      return data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  /* =============== ANNOUNCEMENTS =============== */
  async listAnnouncements() {
    try {
      const { data } = await apiClient().get("/admin/announcements");
      return data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  async createAnnouncement(payload) {
    try {
      const { data } = await apiClient().post("/admin/announcements", payload);
      return data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  async updateAnnouncement(id, payload) {
    try {
      const { data } = await apiClient().put(
        `/admin/announcements/${id}`,
        payload
      );
      return data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  async deleteAnnouncement(id) {
    try {
      const { data } = await apiClient().delete(`/admin/announcements/${id}`);
      return data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  /* =============== DOCUMENTS =============== */
  async listDocuments() {
    try {
      const { data } = await apiClient().get("/admin/documents");
      return data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  async createDocument(payload) {
    try {
      const { data } = await apiClient().post("/admin/documents", payload);
      return data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  async updateDocument(id, payload) {
    try {
      const { data } = await apiClient().put(`/admin/documents/${id}`, payload);
      return data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  async deleteDocument(id) {
    try {
      const { data } = await apiClient().delete(`/admin/documents/${id}`);
      return data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  /* =============== TICKETS =============== */
  async listTickets() {
    try {
      const { data } = await apiClient().get("/admin/tickets");
      return data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  async getTicket(id) {
    try {
      const { data } = await apiClient().get(`/admin/tickets/${id}`);
      return data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  async addTicketMessage(id, message) {
    try {
      const { data } = await apiClient().post(
        `/admin/tickets/${id}/messages`,
        { message }
      );
      return data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  async updateTicketStatus(id, status) {
    try {
      const { data } = await apiClient().put(`/admin/tickets/${id}/status`, {
        status,
      });
      return data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  /* =============== FAQS =============== */
  async listFaqs() {
    try {
      const { data } = await apiClient().get("/admin/faqs");
      return data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  async createFaq(payload) {
    try {
      const { data } = await apiClient().post("/admin/faqs", payload);
      return data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  async updateFaq(id, payload) {
    try {
      const { data } = await apiClient().put(`/admin/faqs/${id}`, payload);
      return data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  async deleteFaq(id) {
    try {
      const { data } = await apiClient().delete(`/admin/faqs/${id}`);
      return data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  /* =============== ADMINISTRATORS =============== */
  async listAdministrators() {
    try {
      const { data } = await apiClient().get("/admin/administrators");
      return data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  async createAdministrator(payload) {
    try {
      const { data } = await apiClient().post("/admin/administrators", payload);
      return data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  async updateAdministrator(id, payload) {
    try {
      const { data } = await apiClient().put(
        `/admin/administrators/${id}`,
        payload
      );
      return data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  async deleteAdministrator(id) {
    try {
      const { data } = await apiClient().delete(`/admin/administrators/${id}`);
      return data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  /* =============== REPORTS =============== */
  async getOverviewReport() {
    try {
      const { data } = await apiClient().get("/admin/reports/overview");
      return data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  async getSessionsReport() {
    try {
      const { data } = await apiClient().get("/admin/reports/sessions");
      return data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  async getStudentsReport() {
    try {
      const { data } = await apiClient().get("/admin/reports/students");
      return data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  /* =============== LOGS =============== */
  async listLogs() {
    try {
      const { data } = await apiClient().get("/admin/logs");
      return data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  /* =============== SETTINGS =============== */
  async getSettings() {
    try {
      const { data } = await apiClient().get("/admin/settings");
      return data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  async updateSetting(key, value) {
    try {
      const { data } = await apiClient().put(`/admin/settings/${key}`, {
        value,
      });
      return data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
};

export default adminService;