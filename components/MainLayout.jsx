import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function MainLayout({ children }) {
  return (
    <>
      <div className="main-layout">
        <Header />
        {children}
        <Footer />
      </div>
    </>
  );
}
