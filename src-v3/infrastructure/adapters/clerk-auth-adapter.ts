import { getAppUser } from "@/lib/auth";
import { AuthProvider } from "../../application/ports";
import { ID } from "../../domain/types";

export class ClerkAuthAdapter implements AuthProvider {
  async requireUser(userId: ID): Promise<{ id: ID; tz: string }> {
    const user = await getAppUser();
    if (!user?.email || user.email !== userId) throw new Error("Unauthorized");
    return { id: user.email, tz: "UTC" };
  }
}
