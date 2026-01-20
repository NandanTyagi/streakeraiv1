import StandardButton from "@/components/v1/StandardButton";
import DownloadApp from "@/components/v1/DownloadApp";
import Hero from "@/components/v1/Hero";
import {
  RegisterLink,
  LoginLink,
} from "@kinde-oss/kinde-auth-nextjs/components";
import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";

const NewIntro = () => {
  const { user } = useKindeBrowserClient();
  return (
    <div
      className="min-h-screen flex flex-col relative bg-[var(--paper)]"
      style={{
        backgroundImage:
          "radial-gradient(circle at top left, rgba(109,103,95,0.08), transparent 40%), radial-gradient(circle at 20% 60%, rgba(109,103,95,0.05), transparent 45%)",
      }}
    >
      <section className="relative z-10">
        <Hero />
      </section>
      <section className="relative z-10 flex flex-1 items-start justify-center px-6 sm:px-0 py-0">
        <div className="w-full max-w-2xl text-[var(--ink)]">
          <div className="mt-6 flex flex-col gap-3">
            {user && (
              <StandardButton
                text={`Return, ${user.given_name}`}
                type="pill"
                pushTo="/panel"
              />
            )}
            {!user && (
              <>
                <RegisterLink className="font-semibold w-full">
                  <StandardButton text="Sign up" type="pill" />
                </RegisterLink>
                <LoginLink title="Login" className="font-semibold w-full">
                  <StandardButton text="Log in" type="pill" />
                </LoginLink>
              </>
            )}
            <StandardButton text="Enter the ledger" type="pill" pushTo="/about" />
            <DownloadApp />
          </div>
        </div>
      </section>
    </div>
  );
};

export default NewIntro;
