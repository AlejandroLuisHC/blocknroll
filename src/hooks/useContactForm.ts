import { useState } from "react";
import { useTranslation } from "react-i18next";
import type { FormData, PackageType } from "../types";

export const useContactForm = () => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState<FormData>({
    inquiryType: "join",
    fullName: "",
    email: "",
    phone: "",
    players: 1,
    level: undefined,
    packageType: "one_per_week",
    availability: [],
  });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Basic client-side validation
  const isNonEmptyName = (value?: string) => Boolean(value && value.trim().length >= 2);
  const isValidEmail = (value?: string) => Boolean(value && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value));
  const isValid = isNonEmptyName(formData.fullName) && isValidEmail(formData.email);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setStatus("loading");
      setSubmitError(null);
      const endpoint = import.meta.env.VITE_CONTACT_ENDPOINT || "/api/send-email";
      const message = buildEmailMessage(formData);
      const payload = {
        name: formData.fullName,
        message,
        email: formData.email,
        phone: formData.phone,
        meta: formData,
      };
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Request failed");

      setFormData({
        inquiryType: "join",
        fullName: "",
        email: "",
        phone: "",
        players: 1,
        level: undefined,
        packageType: "one_per_week",
        availability: [],
      });
      setStatus("success");
    } catch (error) {
      console.error("Submit error:", error);
      setStatus("error");
      setSubmitError(t("contact.form.errorMessage"));
    }
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    if (name === "players") {
      setFormData({ ...formData, players: Number(value) });
      return;
    }
    if (name === "packageType") {
      setFormData({ ...formData, packageType: value as PackageType });
      return;
    }
    if (name === "inquiryType") {
      const newType = value as FormData["inquiryType"];
      setFormData((prev) => ({
        ...prev,
        inquiryType: newType,
      }));
      return;
    }
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const toggleAvailability = (slotKey: string) => {
    setFormData((prev) => {
      const exists = prev.availability?.includes(slotKey);
      const next = exists
        ? (prev.availability || []).filter((k) => k !== slotKey)
        : [ ...(prev.availability || []), slotKey ];
      return { ...prev, availability: next };
    });
  };

  const buildEmailMessage = (data: FormData) => {
    if (data.inquiryType === "talk") {
      return [
        t("contact.email.typeTalk"),
        `${t("contact.email.name")}: ${data.fullName}`,
        `${t("contact.email.email")}: ${data.email}`,
        data.phone ? `${t("contact.email.phone")}: ${data.phone}` : undefined,
      ]
        .filter(Boolean)
        .join("\n");
    }

    const availabilityText = (data.availability || []).length
      ? (data.availability || []).join(", ")
      : t("contact.email.availabilityNone");

    return [
      t("contact.email.typeJoin"),
      `${t("contact.email.name")}: ${data.fullName}`,
      `${t("contact.email.email")}: ${data.email}`,
      data.phone ? `${t("contact.email.phone")}: ${data.phone}` : undefined,
      data.players ? `${t("contact.email.players")}: ${data.players}` : undefined,
      data.level ? `${t("contact.email.level")}: ${data.level}` : undefined,
      data.packageType ? `${t("contact.email.package")}: ${readablePackage(data.packageType)}` : undefined,
      data.packageType !== "private" ? `${t("contact.email.availability")}: ${availabilityText}` : undefined,
    ]
      .filter(Boolean)
      .join("\n");
  };

  const readablePackage = (p?: PackageType) => {
    switch (p) {
      case "one_per_week":
        return t("contact.form.packages.onePerWeek");
      case "two_per_week":
        return t("contact.form.packages.twoPerWeek");
      case "private":
        return t("contact.form.packages.private");
      default:
        return "";
    }
  };

  return {
    formData,
    handleSubmit,
    handleChange,
    toggleAvailability,
    status,
    submitError,
    isValid,
  };
};
