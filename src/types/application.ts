export type ApplicationStatus = 'Pending' | 'Approved' | 'Rejected' | 'Need More Information';

export interface PersonalInfo {
  fullName: string;
  email: string;
  discordUsername: string;
  discordUserId?: string;
  collegeOrCompany: string;
  currentYearOrProfession: string;
  country: string;
  state: string;
  city: string;
}

export interface SocialLinks {
  github: string;
  linkedin: string;
  portfolio?: string;
  resumeUrl?: string; // URL of uploaded PDF
}

export interface WomenInTechData {
  isFemale: boolean;
  wantsAccess?: boolean;
  linkedinProfile?: string;
  githubProfile?: string;
}

export interface TechnicalContributorData {
  githubUrl?: string;
  bestProjectUrl?: string;
  openSourceExperience?: string;
  technicalBlogUrl?: string;
}

export interface CityLeadData {
  whyCityLead?: string;
  howHelpDevelopers?: string;
}

export interface CommunityApplication {
  applicationId?: string; // Firestore doc ID
  uid: string;
  status: ApplicationStatus;
  submittedAt: any; // Firestore Timestamp
  reviewedAt?: any;
  reviewedBy?: string; // Admin UID or Email
  
  personalInfo: PersonalInfo;
  socialLinks: SocialLinks;
  interests: string[];
  communityRoles: string[]; // e.g., 'Technical Contributor', 'Mentor'
  
  womenInTech: WomenInTechData;
  technicalContributor?: TechnicalContributorData;
  cityLead?: CityLeadData;
  
  whyJoinDevPath: string;
  anythingElse?: string;
  
  notes?: string; // Internal admin notes
}
