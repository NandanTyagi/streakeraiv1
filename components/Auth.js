import { getAppUser } from "@/lib/auth";
import { LoginLink, RegisterLink, LogoutLink } from "@/components/auth/AuthLinks";
export default async function Auth() {
  const user = await getAppUser();
  return (
    <div className="absolute top-0 right-0 flex justify-between gap-5 pr-5 pt-1 text-white text-[0.8rem]">
      {user ? <><span>{user.given_name}</span><LogoutLink>Log out</LogoutLink></> :
        <><LoginLink>Sign in</LoginLink><RegisterLink>Sign up</RegisterLink></>}
    </div>
  );
}
