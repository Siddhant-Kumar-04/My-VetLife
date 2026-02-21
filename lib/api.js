const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

class ApiClient {
  constructor() {
    this.baseURL = API_BASE_URL;
    this.token = null;
  }

  setToken(token) {
    this.token = token;
    if (typeof window !== "undefined") {
      if (token) {
        localStorage.setItem("token", token);
      } else {
        localStorage.removeItem("token");
      }
    }
  }

  getToken() {
    if (typeof window !== "undefined") {
      return this.token || localStorage.getItem("token");
    }
    return this.token;
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const token = this.getToken();

    const config = {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
    };

    if (options.body && typeof options.body === "object") {
      config.body = JSON.stringify(options.body);
    }

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Something went wrong");
      }

      return data;
    } catch (error) {
      console.error("API Error:", error);
      throw error;
    }
  }

  // Auth endpoints
  async register(userData) {
    const data = await this.request("/auth/register", {
      method: "POST",
      body: userData,
    });
    if (data.token) {
      this.setToken(data.token);
    }
    return data;
  }

  async login(credentials) {
    const data = await this.request("/auth/login", {
      method: "POST",
      body: credentials,
    });
    if (data.token) {
      this.setToken(data.token);
    }
    return data;
  }

  async logout() {
    try {
      await this.request("/auth/logout");
    } catch (_) {
      // ignore – we still want to clear the local token
    } finally {
      this.setToken(null);
    }
  }

  async getCurrentUser() {
    return this.request("/auth/me");
  }

  async updateProfile(userData) {
    return this.request("/auth/updatedetails", {
      method: "PUT",
      body: userData,
    });
  }

  async updatePassword(passwords) {
    return this.request("/auth/updatepassword", {
      method: "PUT",
      body: passwords,
    });
  }

  // Doctor endpoints
  async getDoctors(filters = {}) {
    const params = new URLSearchParams(filters).toString();
    return this.request(`/doctors${params ? `?${params}` : ""}`);
  }

  async getDoctor(id) {
    return this.request(`/doctors/${id}`);
  }

  async getDoctorProfile() {
    return this.request("/doctors/profile/me");
  }

  async updateDoctorProfile(data) {
    return this.request("/doctors/profile", {
      method: "PUT",
      body: data,
    });
  }

  async updateDoctorAvailability(availability) {
    return this.request("/doctors/availability", {
      method: "PUT",
      body: { availability },
    });
  }

  async getDoctorStats() {
    return this.request("/doctors/stats/me");
  }

  // Set doctor online / offline status
  async setDoctorOnlineStatus(isOnline) {
    return this.request("/doctors/online-status", {
      method: "PUT",
      body: { isOnline },
    });
  }

  // Pet endpoints
  async getPets() {
    return this.request("/pets");
  }

  async getPet(id) {
    return this.request(`/pets/${id}`);
  }

  async createPet(petData) {
    return this.request("/pets", {
      method: "POST",
      body: petData,
    });
  }

  async updatePet(id, petData) {
    return this.request(`/pets/${id}`, {
      method: "PUT",
      body: petData,
    });
  }

  async deletePet(id) {
    return this.request(`/pets/${id}`, {
      method: "DELETE",
    });
  }

  // Appointment endpoints
  async getAppointments(filters = {}) {
    const params = new URLSearchParams(filters).toString();
    return this.request(`/appointments${params ? `?${params}` : ""}`);
  }

  async getAppointment(id) {
    return this.request(`/appointments/${id}`);
  }

  async createAppointment(appointmentData) {
    return this.request("/appointments", {
      method: "POST",
      body: appointmentData,
    });
  }

  async updateAppointment(id, data) {
    return this.request(`/appointments/${id}`, {
      method: "PUT",
      body: data,
    });
  }

  async updateAppointmentStatus(id, status, payload = {}) {
    return this.request(`/appointments/${id}/status`, {
      method: "PUT",
      body: { status, ...payload },
    });
  }
  async updateLiveLocation(id, longitude, latitude) {
    return this.request(`/appointments/${id}/location`, {
      method: "PUT",
      body: { longitude, latitude },
    });
  }

  async getLiveTracking(id) {
    return this.request(`/appointments/${id}/tracking`);
  }
  async cancelAppointment(id, reason) {
    return this.request(`/appointments/${id}/cancel`, {
      method: "PUT",
      body: { reason },
    });
  }

  async confirmAppointment(id) {
    return this.request(`/appointments/${id}/confirm`, {
      method: "PUT",
    });
  }

  async completeAppointment(id, data) {
    return this.request(`/appointments/${id}/complete`, {
      method: "PUT",
      body: data,
    });
  }

  async rateAppointment(id, rating, review) {
    return this.request(`/appointments/${id}/rate`, {
      method: "PUT",
      body: { rating, review },
    });
  }

  // Admin endpoints
  async getAdminStats() {
    return this.request("/admin/stats");
  }

  async getAllUsers(filters = {}) {
    const params = new URLSearchParams(filters).toString();
    return this.request(`/admin/users${params ? `?${params}` : ""}`);
  }

  async getPendingDoctors() {
    return this.request("/admin/doctors/pending");
  }

  async approveDoctor(id) {
    return this.request(`/admin/doctors/${id}/approve`, {
      method: "PUT",
    });
  }

  async rejectDoctor(id, reason) {
    return this.request(`/admin/doctors/${id}/reject`, {
      method: "PUT",
      body: { reason },
    });
  }

  async getAllAppointments(filters = {}) {
    const params = new URLSearchParams(filters).toString();
    return this.request(`/admin/appointments${params ? `?${params}` : ""}`);
  }

  async suspendUser(id, reason) {
    return this.request(`/admin/users/${id}/suspend`, {
      method: "PUT",
      body: { reason },
    });
  }

  async deleteUser(id) {
    return this.request(`/admin/users/${id}`, {
      method: "DELETE",
    });
  }
}

// Export singleton instance
export const api = new ApiClient();
export default api;
