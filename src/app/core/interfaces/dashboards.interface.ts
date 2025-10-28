// Dashboard Stats Interface
export interface DashboardStats {
  users: UserStats;
  earnings: EarningsStats;
}

// User Statistics
export interface UserStats {
  totalUsers: number;
  todayUsers: number;
  last7DaysUsers: number;
  currentMonthUsers: number;
}

// Earnings Statistics (amounts in paise)
export interface EarningsStats {
  totalEarnings: number;
  todayEarnings: number;
  last7DaysEarnings: number;
  currentMonthEarnings: number;
}

// API Response Interface
export interface DashboardStatsResponse {
  message: string;
  data: DashboardStats;
  status: number;
}

// Request Interface (optional date parameter)
export interface GetDashboardStatsRequest {
  date?: string | Date; // Optional: If not provided, current date is used
}