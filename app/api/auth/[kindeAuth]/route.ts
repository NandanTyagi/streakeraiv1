import {
  handleAuth,
  getKindeServerSession,
} from "@kinde-oss/kinde-auth-nextjs/server";
import User from "@/models/User";
import connectDB from "@/utils/db";

let connected = false;

export async function GET(
  request: any,
  { params }: { params: { kindeAuth: string } }
): Promise<void | Response> {
  const endpoint = params.kindeAuth;

  const session = getKindeServerSession(request);
  const user = await session.getUser();
  if (!connected) {
    connectDB();
    connected = true;
  }
  // connectDB();
  if (user) {
    User.findOne({ email: user.email }).then((existingUser) => {
        if (!existingUser) {
            User.create({
            email: user.email,
            name: user.given_name + " " + user.family_name,
            image: user.picture,
            role: "user",
            });
        }
    });
  }
  return handleAuth(request, endpoint) as unknown as Response;
}
