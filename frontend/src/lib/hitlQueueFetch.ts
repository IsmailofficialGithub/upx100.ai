import api from '@/lib/api';
import {
  countPendingItems,
  mapPortToHitl,
  mapScriptToHitl,
  mapUploadToHitl,
  mapVoiceCloneToHitl,
} from '@/lib/hitlQueue';

/** Pending HITL count for sidebar badge (respects GCC tenant scope via api interceptor). */
export async function fetchPendingHitlCount(): Promise<number> {
  const [uploadsRes, scriptsRes, clonesRes, phonesRes] = await Promise.all([
    api.get('/admin/target-uploads'),
    api.get('/admin/script-requests'),
    api.get('/admin/voice-clones'),
    api.get('/admin/phone-numbers'),
  ]);

  const items = [
    ...(uploadsRes.data.data ?? []).map((r: Record<string, unknown>) => mapUploadToHitl(r)),
    ...(scriptsRes.data.data ?? []).map((r: Record<string, unknown>) => mapScriptToHitl(r)),
    ...(clonesRes.data.data ?? []).map((r: Record<string, unknown>) => mapVoiceCloneToHitl(r)),
    ...(phonesRes.data.data ?? [])
      .filter((r: Record<string, unknown>) => r.port_requested)
      .map((r: Record<string, unknown>) => mapPortToHitl(r)),
  ];

  return countPendingItems(items);
}
