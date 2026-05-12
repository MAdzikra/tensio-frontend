// Simple state management for the app
export interface ScreeningResult {
  id: string;
  userId: string;
  userName: string;
  date: string;
  riskLevel: 'not-at-risk' | 'at-risk';
  riskLabel: string;
  riskCategory: 'low' | 'medium' | 'high';
  probability: number;
  systolic: number;
  diastolic: number;
  data: ScreeningFormData;
}

export interface ScreeningFormData {
  age: number;
  gender: string;
  height: number; // cm
  weight: number; // kg
  bmi: number;
  systolic: number;
  diastolic: number;
  saltIntake: number; // in grams
  sleepDuration: number;
  smokingStatus: string; // Yes, No
  exerciseLevel: string; // Low, Moderate, High
  medicationType: string; // None, Beta Blocker, Diuretic, ACE Inhibitor, Other
  familyHistory: string; // Yes, No
  stressScore: number; // 0-10
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  dateOfBirth: string;
  gender: string;
  height: number;
  weight: number;
  role: 'user' | 'admin';
  isActive: boolean;
  isDeleted: boolean;
}

class Store {
  private currentUser: UserProfile | null = null;

  private users: UserProfile[] = [
    {
      id: '1',
      name: 'Pengguna',
      email: 'user@tensio.com',
      dateOfBirth: '1990-01-01',
      gender: 'male',
      height: 170,
      weight: 65,
      role: 'user',
      isActive: true,
      isDeleted: false,
    },
    {
      id: '2',
      name: 'Admin',
      email: 'admin@tensio.com',
      dateOfBirth: '1985-05-15',
      gender: 'female',
      height: 165,
      weight: 60,
      role: 'admin',
      isActive: true,
      isDeleted: false,
    },
    {
      id: '3',
      name: 'Ahmad Hidayat',
      email: 'ahmad@example.com',
      dateOfBirth: '1992-08-20',
      gender: 'male',
      height: 175,
      weight: 75,
      role: 'user',
      isActive: true,
      isDeleted: false,
    },
    {
      id: '4',
      name: 'Siti Nurhaliza',
      email: 'siti@example.com',
      dateOfBirth: '1988-03-10',
      gender: 'female',
      height: 160,
      weight: 55,
      role: 'user',
      isActive: false,
      isDeleted: false,
    },
  ];

  private screeningResults: ScreeningResult[] = [
    {
      id: '1',
      userId: '1',
      userName: 'Pengguna',
      date: '2026-03-15',
      riskLevel: 'not-at-risk',
      riskLabel: 'Tidak Berisiko',
      riskCategory: 'low',
      probability: 0.15,
      systolic: 118,
      diastolic: 76,
      data: {
        gender: 'male',
        age: 36,
        height: 170,
        weight: 65,
        bmi: 22.5,
      } as ScreeningFormData,
    },
    {
      id: '2',
      userId: '1',
      userName: 'Pengguna',
      date: '2026-03-10',
      riskLevel: 'at-risk',
      riskLabel: 'Berisiko Hipertensi',
      riskCategory: 'high',
      probability: 0.82,
      systolic: 145,
      diastolic: 92,
      data: {
        gender: 'male',
        age: 36,
        height: 170,
        weight: 65,
        bmi: 22.5,
      } as ScreeningFormData,
    },
    {
      id: '3',
      userId: '3',
      userName: 'Ahmad Hidayat',
      date: '2026-04-01',
      riskLevel: 'at-risk',
      riskLabel: 'Berisiko Hipertensi',
      riskCategory: 'medium',
      probability: 0.65,
      systolic: 138,
      diastolic: 88,
      data: {
        gender: 'male',
        age: 34,
        height: 175,
        weight: 75,
        bmi: 24.5,
      } as ScreeningFormData,
    },
    {
      id: '4',
      userId: '4',
      userName: 'Siti Nurhaliza',
      date: '2026-03-28',
      riskLevel: 'not-at-risk',
      riskLabel: 'Tidak Berisiko',
      riskCategory: 'low',
      probability: 0.22,
      systolic: 115,
      diastolic: 72,
      data: {
        gender: 'female',
        age: 38,
        height: 160,
        weight: 55,
        bmi: 21.5,
      } as ScreeningFormData,
    },
  ];

  private latestResult: ScreeningResult | null = null;

  // Login
  login(email: string): UserProfile | null {
    const user = this.users.find(u => u.email === email && !u.isDeleted && u.isActive);
    if (user) {
      this.currentUser = user;
      return user;
    }
    return null;
  }

  logout() {
    this.currentUser = null;
    this.latestResult = null;
  }

  getCurrentUser() {
    return this.currentUser || this.users[0];
  }

  isAdmin() {
    return this.currentUser?.role === 'admin';
  }

  setCurrentUser(name: string, email: string) {
    if (this.currentUser) {
      this.currentUser.name = name;
      this.currentUser.email = email;
    }
  }

  updateUserProfile(profile: Partial<UserProfile>) {
    if (this.currentUser) {
      this.currentUser = { ...this.currentUser, ...profile };
      const userIndex = this.users.findIndex(u => u.id === this.currentUser!.id);
      if (userIndex !== -1) {
        this.users[userIndex] = { ...this.users[userIndex], ...profile };
      }
    }
  }

  // Screening Results (User)
  getScreeningResults() {
    if (!this.currentUser) return [];
    return this.screeningResults.filter(r => r.userId === this.currentUser.id);
  }

  addScreeningResult(result: ScreeningResult) {
    this.screeningResults.unshift(result);
    this.latestResult = result;
  }

  deleteScreeningResult(id: string) {
    this.screeningResults = this.screeningResults.filter(r => r.id !== id);
    if (this.latestResult?.id === id) {
      this.latestResult = null;
    }
  }

  getLatestResult() {
    return this.latestResult || this.getScreeningResults()[0];
  }

  setLatestResult(result: ScreeningResult | null) {
    this.latestResult = result;
  }

  // Admin: Users Management
  getAllUsers() {
    return this.users.filter(u => !u.isDeleted);
  }

  toggleUserStatus(userId: string) {
    const user = this.users.find(u => u.id === userId);
    if (user) {
      user.isActive = !user.isActive;
    }
  }

  softDeleteUser(userId: string) {
    const user = this.users.find(u => u.id === userId);
    if (user) {
      user.isDeleted = true;
    }
  }

  // Admin: All Screening Results
  getAllScreeningResults() {
    return [...this.screeningResults];
  }

  // Admin: Statistics
  getAdminStats() {
    const activeUsers = this.users.filter(u => !u.isDeleted);
    const totalScreenings = this.screeningResults.length;
    const highRisk = this.screeningResults.filter(r => r.riskLevel === 'at-risk').length;
    const lowRisk = this.screeningResults.filter(r => r.riskLevel === 'not-at-risk').length;

    return {
      totalUsers: activeUsers.length,
      totalScreenings,
      highRisk,
      lowRisk,
    };
  }
}

export const store = new Store();