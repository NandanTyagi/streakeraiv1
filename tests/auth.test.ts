import assert from "node:assert/strict";
import { test } from "node:test";
import { toAppUser } from "../lib/auth-user";
const profile = {
  id: "user_clerk", firstName: "Test", lastName: "User", imageUrl: "https://img.clerk.com/test",
  primaryEmailAddress: { emailAddress: "existing@example.com", verification: { status: "verified" } },
};
test("signed-out sessions have no app identity", () => {
  assert.equal(toAppUser(null), null);
  assert.equal(toAppUser(undefined), null);
});
test("verified Clerk email preserves the legacy data key and profile fields", () => {
  assert.deepEqual(toAppUser(profile), {
    id: "user_clerk", email: "existing@example.com", given_name: "Test", family_name: "User", picture: profile.imageUrl,
  });
});
test("unverified or absent emails cannot claim existing user data", () => {
  assert.equal(toAppUser({ ...profile, primaryEmailAddress: null })?.email, null);
  assert.equal(toAppUser({ ...profile, primaryEmailAddress: { ...profile.primaryEmailAddress, verification: null } })?.email, null);
  assert.equal(toAppUser({ ...profile, primaryEmailAddress: { ...profile.primaryEmailAddress, verification: { status: "unverified" } } })?.email, null);
});
test("optional profile names have usable defaults", () => {
  const user = toAppUser({ ...profile, firstName: null, lastName: null });
  assert.equal(user?.given_name, "");
  assert.equal(user?.family_name, "");
});
