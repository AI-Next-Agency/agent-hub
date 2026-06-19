export interface AuditLeadData {
  email: string;
  source: "hero" | "audit";
  score?: number;
  level?: string;
  teamT?: number;
  teamE?: number;
  teamA?: number;
  teamM?: number;
  departments?: string;
  blockers?: string;
  tools?: string;
  goal?: string;
  budget?: string;
  timeline?: string;
  teamSize?: string;
  aiUsage?: string;
}

export async function submitAuditLead(data: AuditLeadData): Promise<void> {
  const webhookUrl = process.env.NEXT_PUBLIC_GAS_WEBHOOK_URL;
  if (!webhookUrl) return;

  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(data)) {
    if (value !== undefined && value !== null) {
      params.set(key, String(value));
    }
  }

  await fetch(`${webhookUrl}?${params.toString()}`, { mode: "no-cors" });
}
