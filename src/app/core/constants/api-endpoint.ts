import { environment } from '../../../env/env.local';

class ApiEndpoints {
  private PATH: string = `${environment.baseURL}/${environment.route}`;

  // Auth
  public SIGN_IN: string = `${this.PATH}/login`;
  public LOGOUT: string = `${this.PATH}/logout`;
  public CHANGE_PASSWORD: string = `${this.PATH}/change-password`;
  public UPDATE_PROFILE: string = `${this.PATH}/update-profile`;
  public PROFILE: string = `${this.PATH}/profile`;

  // ==================== MAKE MY BHAGYA - MONEY SWITCH CODE ====================
  public GENERATE_MONEY_CODE: string = `${this.PATH}/money-switch/generate`;
  public RESEND_EMAIL: string = `${this.PATH}/money-switch/resend-email`;

  // ==================== SERVICE ROUTES ====================
  public CREATE_SERVICE: string = `${this.PATH}/services/create`;
  public LIST_SERVICES: string = `${this.PATH}/services/list`;
  public GET_SERVICE_BY_ID: string = `${this.PATH}/services/get`;
  public UPDATE_SERVICE: string = `${this.PATH}/services/update`;
  public DELETE_SERVICE: string = `${this.PATH}/services/delete`;

  // ==================== MONEY SWITCH USERS ====================
  public LIST_MONEY_SWITCH_USERS: string = `${this.PATH}/money-switch/users/list`;
  public GET_MONEY_SWITCH_USER_BY_ID: string = `${this.PATH}/money-switch/users/get`;

  // ==================== PAYMENT LOGS ====================
  public LIST_PAYMENT_LOGS: string = `${this.PATH}/payment-logs/list`;
  public GET_PAYMENT_LOG_BY_ID: string = `${this.PATH}/payment-logs/get`;

  // ==================== DASHBOARD ====================
  public DASHBOARD_STATS: string = `${this.PATH}/dashboard/stats`;

  // ==================== WEBSITE MANAGEMENT ====================
  public GET_WEBSITE_DETAILS: string = `${this.PATH}/website/get`;
  public UPDATE_WEBSITE_DETAILS: string = `${this.PATH}/website/update`;
}

export let apiEndpoints = new ApiEndpoints();
