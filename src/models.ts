
export type ExperienceStatus = 'NoReply'|'Replied'|'Interview'|'Offer';

export type Experience = {
  id: string;
  company: string;
  role?: string;
  source?: string; // LinkedIn, Kariyer, Company
  city?: string;
  sector?: string;
  postUrl?: string;
  comment?: string;
  status: ExperienceStatus;
  createdAt: string; // ISO
};

export type CompanyStats = {
  company: string;
  total: number;
  replied: number;
  interviewed: number;
  offer: number;
  replyRate: number; // 0..1
};
