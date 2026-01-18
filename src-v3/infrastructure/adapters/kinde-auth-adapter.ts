import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { AuthProvider } from "../../application/ports";
import { ID } from "../../domain/types";

export class KindeAuthAdapter implements AuthProvider {
  async requireUser(userId: ID): Promise<{ id: ID; tz: string }> {
    const { getUser } = getKindeServerSession();
    const user = await getUser();
    if (!user || user.id !== userId) {
      throw new Error("Unauthorized");
    }
    return { id: user.id, tz: "UTC" };
  }
}
