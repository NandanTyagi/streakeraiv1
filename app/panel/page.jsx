import Loading from "@/components/Loading";
import Nav from "@/components/Nav";
import StreakerEmptyGrid from "@/components/v1/StreakerEmptyGrid";
import StreakerGrid from "@/components/v1/StreakerGrid";
import { getAppUser } from "@/lib/auth";

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: 'no',
};

const PanelPage = async () => {
  const user = await getAppUser();
  return (
    <div className="panel-shell">
      <Nav isNav={false} />
      <main className="panel-scroll relative z-1 ">
        {!user && <StreakerEmptyGrid />}
        {user && <StreakerGrid />}
      </main>
    </div>
  );
};

export default PanelPage;
