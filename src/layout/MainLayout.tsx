import Header from "./Header";
import Footer from "./Footer";

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow w-full pt-[var(--app-header-offset)]">{children}</main>
      <Footer />
    </div>
  );
}
