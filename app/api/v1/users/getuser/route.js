import { getDatabaseUser } from "@/lib/auth";
export const dynamic = "force-dynamic";
export async function GET() {
  try {
    const user = await getDatabaseUser();
    if (!user) return Response.json({ message: "Sign in with a verified email address." }, { status: 401 });
    return Response.json(user);
  } catch (error) {
    console.error("Get user operation failed", error);
    return Response.json({ message: "Error" }, { status: 500 });
  }
}
