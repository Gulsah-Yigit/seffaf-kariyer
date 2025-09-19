
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Experience, CompanyStats } from '../models';

const KEY = 'experiences_v1';

export async function getExperiences(): Promise<Experience[]> {
  const raw = await AsyncStorage.getItem(KEY);
  if (!raw) return [];
  try { return JSON.parse(raw) as Experience[]; } catch { return []; }
}

export async function addExperience(e: Experience) {
  const list = await getExperiences();
  list.unshift(e);
  await AsyncStorage.setItem(KEY, JSON.stringify(list));
}

export async function groupByCompany(experiences: Experience[]): Promise<CompanyStats[]> {
  const map = new Map<string, CompanyStats>();
  experiences.forEach(e => {
    const k = e.company.trim();
    if (!map.has(k)) map.set(k, { company: k, total: 0, replied: 0, interviewed: 0, offer: 0, replyRate: 0 });
    const s = map.get(k)!;
    s.total += 1;
    if (e.status === 'Replied') s.replied += 1;
    if (e.status === 'Interview') s.interviewed += 1;
    if (e.status === 'Offer') s.offer += 1;
  });
  for (const s of map.values()) {
    const responded = s.replied + s.interviewed + s.offer;
    s.replyRate = s.total > 0 ? responded / s.total : 0;
  }
  return Array.from(map.values()).sort((a,b)=> b.replyRate - a.replyRate || b.total - a.total);
}
