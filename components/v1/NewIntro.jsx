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
    <div className="min-h-screen flex flex-col">
      <section>
        <Hero />
      </section>
      <section className="flex flex-1 items-center justify-center px-6 sm:px-10 py-16">
        <div className="w-full max-w-2xl space-y-6">
          <p className="text-sm uppercase tracking-[0.28em] text-[var(--ink-soft)]">
            Begin here
          </p>
          <h2 className="text-2xl sm:text-3xl font-semibold text-[var(--ink)]">
            Name the practice. Keep the record.
          </h2>
          <p className="text-base text-[var(--ink-soft)] leading-relaxed">
            Streaker offers a calm ledger. It holds the days as they pass, without
            reward or reprimand.
          </p>
          <div className="flex flex-col gap-3">
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
            <StandardButton text="Enter the ledger" type="pill" pushTo="/panel" />
            <DownloadApp />
          </div>
        </div>
      </section>
    </div>
  );
};

export default NewIntro;
