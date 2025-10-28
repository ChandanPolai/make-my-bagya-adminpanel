
export interface DashboardDetails {
    job: Job;
    candidate: Candidate;
    interviews: Interview;
    vendors: Vendor;
    onboarding: onboarding

}


export interface onboarding {
    acceptedCount: number;
    pendingCount: number;
    rejectedCount: number;
    totalDocsCount: number
}


export interface Candidate {
    totalCandidateCount: number;
    totalWithVendor: number;
    totalDirect: number

}

export interface Interview {
    interviewTodayCount: number,
    completedCount: number,
    rejectedCount: number,
    rescheduledCount: number,
    scheduledCount: number,
    totalInterviewCount:number}

export interface Job {
    ActiveJobcount: number;
    deActiveJobcount: number;
    totalJobCount: number
}


export interface Vendor {
    totalVendors: number;
    activeVendor: number;
    inactiveVendor: number

}


export interface RecentActiveJD {
    message: string;
    data: Data;
    status: number;
}

export interface RecentCandidateData {
    _id: string;
    email: string;
    status: string;
    candidateStatus: string;
    name: string;
    mobile: string;
    skills: string[];
    education: string[];
    experience: number;
    resume: string;
    availability: string;
    vendorId: VendorInfo;
    itfuturzCandidate: boolean;
    profileImage: null | string;
    charges: number;
    isDeleted: boolean;
    createdAt: Date;
    updatedAt: Date;
    __v: number;
}

export interface VendorInfo {
    _id: string;
    company: string;
}


export interface Data {
    docs: Doc[];
    totalDocs: number;
    limit: number;
    totalPages: number;
    page: number;
    pagingCounter: number;
    hasPrevPage: boolean;
    hasNextPage: boolean;
    prevPage: null;
    nextPage: null;
}

export interface Doc {
    _id: string;
    jobTitle: string;
    jobType: string;
    workType: string;
    summary: string;
    responsibilities: string;
    requiredSkills: string[];
    preferredSkills: string[];
    experienceLevel: string;
    education: string[];
    status: string;
    jobCode: string;
    deadline: null;
    createdAt: Date;
    updatedAt: Date;
    __v: number;
    id: string;
    postedLabel: string;
    appliedCount: number;
}

// export interface RecentActiveCandidate {
//     _id:               string;
//     email:             string;
//     status:            string;
//     candidateStatus:   string;
//     name:              string;
//     mobile:            string;
//     skills:            string[];
//     education:         string[];
//     experience:        number;
//     resume:            string;
//     availability:      string;
//     vendorId:          string;
//     itfuturzCandidate: boolean;
//     profileImage:      null | string;
//     charges:           number;
//     isDeleted:         boolean;
//     createdAt:         Date;
//     updatedAt:         Date;
//     __v:               number;
// }
