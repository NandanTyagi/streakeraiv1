type ClerkProfile = {
  id: string;
  firstName: string | null;
  lastName: string | null;
  imageUrl: string;
  primaryEmailAddress: {
    emailAddress: string;
    verification: { status: string | null } | null;
  } | null;
};

// Existing stores use email as their user key. Only a verified address may
// link a Clerk account to existing data.
export function toAppUser(user: ClerkProfile | null | undefined) {
  if (!user) return null;
  const email = user.primaryEmailAddress;
  return {
    id: user.id,
    email: email?.verification?.status === "verified" ? email.emailAddress : null,
    given_name: user.firstName || "",
    family_name: user.lastName || "",
    picture: user.imageUrl,
  };
}
