import { environment } from "../../../env/env.local";

class ApiEndpoints {
    private PATH: string = `${environment.baseURL}/${environment.route}`;

      // Auth
  public  SIGN_IN: string = `${this.PATH}/login`;
  public  LOGOUT: string = `${this.PATH}/logout`;
  public  CHANGE_PASSWORD: string = `${this.PATH}/change-password`;
  public  UPDATE_PROFILE: string = `${this.PATH}/update-profile`;
  public  PROFILE: string = `${this.PATH}/profile`;


 
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

    // ==================== PUBLIC ROUTES (NO AUTH) ====================
    public PUBLIC_WEBSITE_DETAILS: string = `${this.PATH}/website/details`;
    public PUBLIC_SERVICES_LIST: string = `${this.PATH}/services/list`;
    public PUBLIC_SERVICE_BY_ID: string = `${this.PATH}/services/get`;

  
  
    public  REGISTER_USER: string = `${this.PATH}/register`;

    // Manual Access Management
    public GRANT_MANUAL_ACCESS: string = `${this.PATH}/manual-access/grant`;
    public LIST_MANUAL_ACCESSES: string = `${this.PATH}/manual-access/list`;
    public UPDATE_MANUAL_ACCESS: string = `${this.PATH}/manual-access/update`;
    public REVOKE_MANUAL_ACCESS: string = `${this.PATH}/manual-access/revoke`;
    public GET_USER_MANUAL_ACCESSES: string = `${this.PATH}/manual-access/user-accesses`;
  
  // User
public LIST_USERS: string = `${this.PATH}/users/list`;
public GET_USER_BY_ID: string = `${this.PATH}/users/get`;
public UPDATE_USER: string  = `${this.PATH}/users/update`;
public DELETE_USER: string = `${this.PATH}/users/delete`;
public CREATE_USER: string = `${this.PATH}/users/create`;

public SEND_NOTIFICATION: string = `${this.PATH}/users/sendmessages`;

// Delete Acount
public GET_ALL_DELETE_REQUESTS: string = `${this.PATH}/getall/delete-account-requests`;
public HANDLE_DELETE_REQUEST: string = `${this.PATH}/delete-account-request/status`;

// Category
public CREATE_CATEGORY: string = `${this.PATH}/categories/create`;
public LIST_CATEGORIES: string = `${this.PATH}/categories/list`;
public GET_CATEGORY_BY_ID: string = `${this.PATH}/categories/get`;
public UPDATE_CATEGORY: string = `${this.PATH}/categories/update`;
public DELETE_CATEGORY: string = `${this.PATH}/categories/delete`;

  // Subcategory
public CREATE_SUBCATEGORY: string = `${this.PATH}/subcategories/create`;
public LIST_SUBCATEGORIES: string = `${this.PATH}/subcategories/list`;
public GET_SUBCATEGORY_BY_ID: string = `${this.PATH}/subcategories/get`;
public UPDATE_SUBCATEGORY: string = `${this.PATH}/subcategories/update`;
public DELETE_SUBCATEGORY: string = `${this.PATH}/subcategories/delete`;

// Video
public CREATE_VIDEO: string = `${this.PATH}/videos/create`;
public LIST_VIDEOS: string = `${this.PATH}/videos/list`;
public GET_VIDEO_BY_ID: string = `${this.PATH}/videos/get`;
public UPDATE_VIDEO: string = `${this.PATH}/videos/update`;
public DELETE_VIDEO: string = `${this.PATH}/videos/delete`;

// Service 
// public CREATE_SERVICE: string = `${this.PATH}/services/create`;
// public LIST_SERVICES: string = `${this.PATH}/services/list`;
// public GET_SERVICE_BY_ID: string = `${this.PATH}/services/get`;
// public UPDATE_SERVICE: string = `${this.PATH}/services/update`;
// public DELETE_SERVICE: string = `${this.PATH}/services/delete`;


// Payments
public LIST_PAYMENTS: string = `${this.PATH}/payments/list`;
public GET_PAYMENTS_FOR_APPROVAL: string = `${this.PATH}/payments/for-approval`;
public GET_PAYMENT_BY_ID: string = `${this.PATH}/payments/get`;
public UPDATE_PAYMENT_STATUS: string = `${this.PATH}/payments/update-status`;
public DELETE_PAYMENT: string = `${this.PATH}/payments/delete`;


// Dashboard
public DASHBOARD: string = `${this.PATH}/dashboardCount`;


    //job description
    public GET_JOB: string = `${this.PATH}/get-job`;
    public UPDATE_JOB: string = `${this.PATH}/update-job`;
    public DELETE_JOB: string = `${this.PATH}/delete-job`;
    public UPDATE_STATUS: string = `${this.PATH}/update-status`;
    public GET_COMPANY: string = `${this.PATH}/companies-details`;
    public DOWNLOAD_JOB_DESCRIPTION: string = `${this.PATH}/download-job-description`;


    //job application
    public GET_APPLIED_JOB: string = `${this.PATH}/get-applied-jobs`;
    public DELETE_APPLIED_JOB: string = `${this.PATH}/delete-applied-job`;
    public UPDATE_APPLIED_JOB_STATUS: string = `${this.PATH}/update-applied-job-status`;

    //candidate
    public GET_CANDIDATE: string = `${this.PATH}/get-candidate`;
    public UPDATE_CANDIDATE: string = `${this.PATH}/update-candidate`;
    public DELETE_CANDIDATE: string = `${this.PATH}/delete-candidate`;
    public DOWNLOAD_RESUME: string = `${this.PATH}/download-resume`;
    public TOGGLE_CANDIDATE_ACTIVE: string = `${this.PATH}/update-candidate-status`;
    public UPDATE_CANDIDATE_STATUS: string = `${this.PATH}/update-candidate-interview-status`;
    public EXPORT_CANDIDATE: string = `${this.PATH}/excel-export-candidates`;

    //vendor
    public GET_VENDOR: string = `${this.PATH}/get-vendor`;
    public UPDATE_VENDOR: string = `${this.PATH}/update-vendor`;
    public DELETE_VENDOR: string = `${this.PATH}/delete-vendor`;
    public UPDATE_VENDOR_STATUS: string = `${this.PATH}/update-vendor-status`;
    public EXPORT_VENDORS: string = `${this.PATH}/excel-export-vendors`;
    public GET_VENDOR_CANDIDATES: string = `${this.PATH}/get-vendor-candidates`;

    //interview
    public SCHEDULE_INTERVIEW: string = `${this.PATH}/schedule-interview`;
    public GET_INTERVIEW_DETAILS: string = `${this.PATH}/get-interview-details`;
    public UPDATE_OUTCOME_DETAILS: string = `${this.PATH}/updateOutCome`;
    public GET_INTERVIEW_ROUND_DETAILS: string = `${this.PATH}/getInterviewRoundDetails`;
    public ADD_NEW_ROUND: string = `${this.PATH}/add-new-round`;
    public UPDATE_INTERVIEW_STATUS: string = `${this.PATH}/update-interview-status`;
    public DELETE_INTERVIEW: string = `${this.PATH}/delete-interview`;
    public UPDATE_INTERVIEW_ROUND: string = `${this.PATH}/update-interview-round`;
    public GET_RECENT_CANDIDATE: string = `${this.PATH}/getRecentCandidates`;
    public UPDATE_INTERVIEW: string = `${this.PATH}/update-interview`;
    public TIMELINE_DETAILS: string = `${this.PATH}/get-interview-timeline`;

    //dashboard
    public GET_COUNT_DASHBORD_DETAILS: string = `${this.PATH}/countDashbordData`;
    public GET_RECENT_ACTIVE_JD: string = `${this.PATH}/getActiveJobDescription`;
    public GET_USER: string = `${this.PATH}/getUser`;

    // interview rounds
    public GET_INTERVIEW_ROUNDS: string = `${this.PATH}/get-interview-Round`;

    //interview process
    public GET_INTERVIEW_PROCESS: string = `${this.PATH}/get-interview-process`;
    public DELETE_INTERVIEW_PROCESS: string = `${this.PATH}/delete-interview-process`;
    public UPDATE_INTERVIEW_PROCESS: string = `${this.PATH}/update-interview-process`;
    public UPDATE_INTERVIEW_PROCESS_STATUS: string = `${this.PATH}/update-interview-process-status`;
    public GET_PROCESS_BY_COMPANY: string = `${this.PATH}/get-processByCompany`;

    //question
    public GET_QUESTION: string = `${this.PATH}/get-questions`;
    public UPDATE_QUESTION: string = `${this.PATH}/update-question`;
    public DELETE_QUESTION: string = `${this.PATH}/delete-question`;
    public UPDATE_QUESTION_STATUS: string = `${this.PATH}/update-question-status`;
    public UPDATE_QUESTION_REQUIRED: string = `${this.PATH}/update-question-required`;

    //notification 
    public GET_NOTIFICATION: string = `${this.PATH}/get-notification`;
    public READ_NOTIFICATION: string = `${this.PATH}/notification-read`;

    //onboarding 
    public GET_ONBOARDING_DETAILS: string = `${this.PATH}/get-onboarding-details`;
    public UPDATE_ONBOARDING_STATUS: string = `${this.PATH}/status-modify-in-onboarding`;
    public UPDATE_ONBOARDING_DETAILS: string = `${this.PATH}/update-onboarding-details`;
    public DOWNLOAD_ONBOARD_DOCUMENT: string = `${this.PATH}/download-onboard-document`;

    //post-projects
    public CREATE_POST_PROJECT: string = `${this.PATH}/create-project`;
    public LIST_POST_PROJECT: string = `${this.PATH}/list-projects`;
    public UPDATE_POST_PROJECT: string = `${this.PATH}/update-project`;
    public DELETE_POST_PROJECT: string = `${this.PATH}/delete-project`;
    public UPDATE_POST_PROJECT_BUDGET: string = `${this.PATH}/update-project-budget`;

    //project-bids

    public LIST_PROJECT_BID: string = `${this.PATH}/list-bids`;
    public UPDATE_BID_STATUS: string = `${this.PATH}/update-bid-status`;
    public UPDATE_PROJECT_STATUS: string = `${this.PATH}/update-project-status`;

}

export let apiEndpoints = new ApiEndpoints();