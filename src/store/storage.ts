import AsyncStorage from "@react-native-async-storage/async-storage";
import { CompanyStats, Experience, WaitBucket } from "../models";

const KEY = "experiences_v1";

export async function getExperiences(): Promise<Experience[]> {
  const raw = await AsyncStorage.getItem(KEY);
  if (!raw) return [];
  try {
    const list = JSON.parse(raw) as Experience[];
    // Eski kayıtlarla uyumlu kal (alanlar olmayabilir)
    return list.map((e) => ({ ...e }));
  } catch {
    return [];
  }
}

export async function addExperience(e: Experience) {
  const list = await getExperiences();
  list.unshift(e);
  await AsyncStorage.setItem(KEY, JSON.stringify(list));
}

function emptyDist(): Record<WaitBucket, number> {
  return { lt1w: 0, "1-2w": 0, "2-4w": 0, "1-2m": 0, gt2m: 0 };
}

export async function groupByCompany(
  experiences: Experience[]
): Promise<CompanyStats[]> {
  const map = new Map<string, CompanyStats>();

  experiences.forEach((e) => {
    const key = (e.company || "").trim();
    if (!key) return;

    if (!map.has(key)) {
      map.set(key, {
        company: key,
        total: 0,
        replied: 0,
        interviewed: 0,
        offer: 0,
        replyRate: 0,
        noReplyDist: emptyDist(),
        responseDist: emptyDist(),
      });
    }
    const s = map.get(key)!;

    s.total += 1;
    if (e.status === "Replied") s.replied += 1;
    if (e.status === "Interview") s.interviewed += 1;
    if (e.status === "Offer") s.offer += 1;

    if (e.status === "NoReply" && e.noReplyWait) {
      s.noReplyDist[e.noReplyWait] += 1;
    } else if (e.status !== "NoReply" && e.responseDelay) {
      s.responseDist[e.responseDelay] += 1;
    }
  });

  for (const s of map.values()) {
    const responded = s.replied + s.interviewed + s.offer;
    s.replyRate = s.total > 0 ? responded / s.total : 0;
  }

  return Array.from(map.values()).sort(
    (a, b) => b.replyRate - a.replyRate || b.total - a.total
  );
}
