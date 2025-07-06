import { Routes, Route } from "react-router-dom";
import { HomePage } from "../pages";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      {/* Future routes can be added here:
      <Route path="/about" element={<AboutPage />} />
      <Route path="/services" element={<ServicesPage />} />
      <Route path="/contact" element={<ContactPage />} />
      <Route path="/gallery" element={<GalleryPage />} />
      <Route path="*" element={<NotFoundPage />} />
      */}
    </Routes>
  );
};

export default AppRoutes;
