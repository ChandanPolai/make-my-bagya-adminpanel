// Dashboard Stats Interface (new backend shape)
export interface DashboardStats {
  totalUsers: number;
  totalEarnings: number;
  totalServices: number;
  dateRange: {
    fromDate: string | Date;
    toDate: string | Date;
    newUsers: number;
    earnings: number;
  };
}

// API Response Interface
export interface DashboardStatsResponse {
  message: string;
  data: DashboardStats;
  status: number;
}

// Request Interface for date range
export interface GetDashboardStatsRequest {
  fromDate: string | Date;
  toDate: string | Date;
}