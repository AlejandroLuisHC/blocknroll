import { useState } from "react";
import { useTranslation } from "react-i18next";
import type { FormData } from "../types";

export const useContactForm = () => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState<FormData>({
    name: "",
    message: ""
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const endpoint = import.meta.env.VITE_CONTACT_ENDPOINT || "/api/send-email";
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error("Request failed");

      alert(t("contact.form.successMessage"));

      setFormData({
        name: "",
        message: ""
      });
    } catch (error) {
      console.error("Submit error:", error);
      alert("Error sending message. Please try again.");
    }
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return {
    formData,
    handleSubmit,
    handleChange,
  };
};
