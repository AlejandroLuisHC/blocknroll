import type { ReactNode } from "react";
import { useTranslation } from "react-i18next";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const MainLayout = ({ children }: { children: ReactNode }) => {
  const { t } = useTranslation();

  return (
    <>
      <a className="skip-link" href="#main-content">{t("nav.skip")}</a>
      <Navbar />
      <main id="main-content" tabIndex={-1}>{children}</main>
      <Footer />
    </>
  );
};

export default MainLayout;
