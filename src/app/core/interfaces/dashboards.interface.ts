// dashboard.interface.ts
export interface DashboardCounts {
  users: {
    active: number;
    inactive: number;
    total: number;
  };
  videos: {
    active: number;
    inactive: number;
    total: number;
  };
  categories: {
    active: number;
    inactive: number;
    total: number;
  };
  subCategories: {
    active: number;
    inactive: number;
    total: number;
  };
  services: {
    total: number;
  };
}

export interface DashboardResponse {
  success: boolean;
  message: string;
  data: DashboardCounts;
}