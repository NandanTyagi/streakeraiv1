import Loading from "@/components/Loading";
import Nav from "@/components/Nav";
import StreakerEmptyGrid from "@/components/v1/StreakerEmptyGrid";
import StreakerGrid from "@/components/v1/StreakerGrid";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";

const PanelPage = async () => {
  const session = getKindeServerSession();
  const user = await session.getUser();
  console.log("user in panel page", user);
  return (
    <>
      <Nav isNav={false} />
      <main className="overflowY-scroll relative z-1">
        {!user && <StreakerEmptyGrid />}
        {user && <StreakerGrid />}
      </main>
    </>
  );
};

export default PanelPage;
