export type ExperienceStatus = "NoReply" | "Replied" | "Interview" | "Offer";

// Süre aralıkları (bekleme/yanıt)
export type WaitBucket = "lt1w" | "1-2w" | "2-4w" | "1-2m" | "gt2m";

export const WAIT_LABELS: Record<WaitBucket, string> = {
  lt1w: "< 1 hafta",
  "1-2w": "1–2 hafta",
  "2-4w": "2–4 hafta",
  "1-2m": "1–2 ay",
  gt2m: "2+ ay",
};

export type Experience = {
  id: string;
  company: string;
  role?: string;
  source?: string; // LinkedIn, Kariyer, Company...
  city?: string;
  sector?: string;
  postUrl?: string;
  comment?: string;

  status: ExperienceStatus;

  // Formda opsiyonel seçilen süreler:
  noReplyWait?: WaitBucket; // status === 'NoReply' ise: kaç zamandır yanıt yok?
  responseDelay?: WaitBucket; // status !== 'NoReply' ise: kaç zamanda yanıt geldi?

  createdAt: string; // ISO
};

export type CompanyStats = {
  company: string;
  total: number;
  replied: number;
  interviewed: number;
  offer: number;

  // Normal oran (yanıt veren/toplam)
  replyRate: number;

  // Dağılımlar (kartın altında göstereceğiz)
  noReplyDist: Record<WaitBucket, number>;
  responseDist: Record<WaitBucket, number>;
};
