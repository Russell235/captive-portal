import { apiClient } from "../auth";

export const bandwidthService = {
  /**
   * Liste les profils de bande passante
   */
  async listProfiles() {
    const response = await apiClient().get("/admin/bandwidth/profiles");
    return response.data;
  },

  /**
   * Liste les élèves avec leur profil
   */
  async listStudents() {
    const response = await apiClient().get("/admin/bandwidth/students");
    return response.data;
  },

  /**
   * Change le profil d'un élève
   */
  async updateStudentProfile(studentId, bandwidthProfile) {
    const response = await apiClient().put(
      `/admin/bandwidth/students/${studentId}`,
      { bandwidth_profile: bandwidthProfile }
    );
    return response.data;
  },
};
