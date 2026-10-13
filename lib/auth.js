import { currentUser } from "@clerk/nextjs/server";
import { cache } from "react";
import { toAppUser } from "@/lib/auth-user";
import User from "@/models/User";
import connectDB from "@/utils/db";
export const getAppUser = cache(async () => toAppUser(await currentUser()));

// Preserve existing panel references and await provisioning before data access.
export async function getDatabaseUser() {
  const user = await getAppUser();
  if (!user?.email) return null;
  await connectDB();
  return User.findOneAndUpdate(
    { email: user.email },
    {
      $set: {
        name: [user.given_name, user.family_name].filter(Boolean).join(" ") || user.email,
        image: user.picture,
      },
      $setOnInsert: { email: user.email, panels: [] },
    },
    { upsert: true, new: true, runValidators: true }
  );
}
