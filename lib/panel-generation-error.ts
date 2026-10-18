export class PanelGenerationError extends Error {
  constructor(
    public status: number,
    public code?: string,
    public type?: string,
    public requestId?: string,
  ) {
    super("AI request failed");
    Object.setPrototypeOf(this, new.target.prototype);
    this.name = "PanelGenerationError";
  }
}

export function panelGenerationFailure(error: unknown) {
  if (error instanceof PanelGenerationError) {
    if (error.type === "insufficient_quota" || [
      "insufficient_quota", "credit_balance_exhausted", "billing_not_active",
      "organization_spend_limit_exceeded", "project_spend_limit_exceeded",
      "organization_usage_limit_exceeded",
    ].includes(error.code || "")) {
      return { status: 503, code: "ai_quota_unavailable", error: "AI drafting is unavailable because the service's AI credits or usage limit need attention. Please contact support. You can enter your practices manually below." };
    }
    if (error.status === 401 || error.status === 403) {
      return { status: 503, code: "ai_credentials_unavailable", error: "AI drafting is unavailable because the server's AI credentials need updating. You can enter your practices manually below." };
    }
    if (error.status === 429) {
      return { status: 429, code: "ai_rate_limited", error: "AI drafting is temporarily busy. Please wait a minute and try again." };
    }
  }
  return { status: 502, code: "ai_generation_failed", error: "A complete draft could not be generated. Your saved panels are unchanged. Please try again." };
}
