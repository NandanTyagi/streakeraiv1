import {
  RegisterLink,
  LoginLink,
  LogoutLink,
  getKindeServerSession,
} from "@kinde-oss/kinde-auth-nextjs/server";
export default async function Auth() {
  const {
    getAccessToken,
    getBooleanFlag,
    getFlag,
    getIntegerFlag,
    getOrganization,
    getPermission,
    getPermissions,
    getStringFlag,
    getUser,
    getUserOrganizations,
    isAuthenticated,
  } = getKindeServerSession();

  return (
    <>
      <div className="absolute top-0 right-0 flex justify-between gap-5 pr-5 pt-1 text-white text-[0.8rem]">
     {await isAuthenticated() && <div className="text-[1.2rem]">{await getUser().name}</div>}
          <LoginLink>Sign in</LoginLink>
        {await isAuthenticated() ? (
          <LogoutLink>Log Out</LogoutLink>
        ) : (
          <LoginLink>Sign in</LoginLink>
        )}
        {await !isAuthenticated() && <RegisterLink>Sign up</RegisterLink>}
      </div>
    </>
  );
};

// export default Auth;
