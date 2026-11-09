import { useRef, useState, type FormEvent } from "react";
import { useTranslation } from "react-i18next";
import type { FormData, InquiryType, PackageType } from "../types";

type ContactDraft = FormData & { question: string; trialRequested: boolean };

const INITIAL_FORM: ContactDraft = {
  inquiryType: "join",
  fullName: "",
  email: "",
  phone: "",
  players: 1,
  packageType: "one_per_week",
  availability: [],
  question: "",
  trialRequested: false,
};

type Submission =
  | { status: "idle" | "loading" | "error" }
  | { status: "success"; inquiryType: InquiryType };

export const useContactForm = () => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState(INITIAL_FORM);
  const [attempted, setAttempted] = useState(false);
  const [submission, setSubmission] = useState<Submission>({ status: "idle" });
  const pending = useRef(false);
  const nameValid = formData.fullName.trim().length >= 2;
  const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim());

  const setField = <K extends keyof ContactDraft>(field: K, value: ContactDraft[K]) => {
    if (pending.current) return;
    setFormData((draft) => ({ ...draft, [field]: value }));
    setSubmission({ status: "idle" });
  };

  const selectTraining = (packageType?: PackageType) => {
    if (pending.current) return;
    setFormData((draft) => ({
      ...draft,
      inquiryType: "join",
      packageType: packageType ?? draft.packageType,
      trialRequested: packageType === undefined,
    }));
    setSubmission({ status: "idle" });
  };

  const toggleAvailability = (slot: string) => {
    if (pending.current) return;
    setFormData((draft) => {
      const selected = draft.availability ?? [];
      return {
        ...draft,
        availability: selected.includes(slot)
          ? selected.filter((item) => item !== slot)
          : [...selected, slot],
      };
    });
    setSubmission({ status: "idle" });
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (pending.current) return;
    setAttempted(true);

    if (!nameValid || !emailValid) {
      const field = event.currentTarget.elements.namedItem(nameValid ? "email" : "fullName");
      if (field instanceof HTMLElement) field.focus();
      return;
    }

    const { inquiryType, players, level, packageType, availability, question, trialRequested } = formData;
    const name = formData.fullName.trim();
    const email = formData.email.trim();
    const phone = formData.phone?.trim() ?? "";
    const selectedSlots = availability ?? [];
    const meta: FormData = { inquiryType, fullName: name, email, phone, availability: selectedSlots };
    const lines = [
      t(inquiryType === "join" ? "contact.email.typeJoin" : "contact.email.typeTalk"),
      t("contact.email.name") + ": " + name,
      t("contact.email.email") + ": " + email,
    ];
    if (phone) lines.push(t("contact.email.phone") + ": " + phone);

    if (inquiryType === "join") {
      Object.assign(meta, { players, level, packageType });
      if (trialRequested) lines.push(t("contact.email.trial"));
      if (players) lines.push(t("contact.email.players") + ": " + players);
      if (level) lines.push(t("contact.email.level") + ": " + level);
      if (packageType) {
        lines.push(t("contact.email.package") + ": " + t(`training.programs.${packageType}.title`));
      }
    }

    lines.push(
      t("contact.email.availability") + ": " +
      (selectedSlots.join(", ") || t("contact.email.availabilityNone"))
    );
    if (inquiryType === "talk" && question.trim()) {
      lines.push("", question.trim());
    }

    pending.current = true;
    setSubmission({ status: "loading" });

    try {
      const response = await fetch(import.meta.env.VITE_CONTACT_ENDPOINT || "/api/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, phone, message: lines.join("\n"), meta }),
      });
      if (!response.ok) {
        setSubmission({ status: "error" });
        return;
      }
      setFormData({ ...INITIAL_FORM, inquiryType, packageType });
      setAttempted(false);
      setSubmission({ status: "success", inquiryType });
    } catch {
      setSubmission({ status: "error" });
    } finally {
      pending.current = false;
    }
  };

  return {
    formData,
    setField,
    selectTraining,
    toggleAvailability,
    handleSubmit,
    submission,
    nameError: attempted && !nameValid ? t("contact.form.nameError") : undefined,
    emailError: attempted && !emailValid ? t("contact.form.emailError") : undefined,
  };
};
