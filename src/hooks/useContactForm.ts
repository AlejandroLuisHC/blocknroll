import { useState } from "react";
import { useTranslation } from "react-i18next";
import type { FormData } from "../types";

export const useContactForm = () => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    phone: "",
    program: "basic",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Create email content
    const emailTo = "blocknroll.bcnclub@gmail.com";
    const subject = `Contact Form: ${formData.name} - ${t(
      `contact.form.programs.${formData.program}` as string
    )}`;
    const emailContent = `Name: ${formData.name}
Email: ${formData.email}
Phone: ${formData.phone || "Not provided"}
Program Interest: ${t(`contact.form.programs.${formData.program}` as string)}

Message:
${formData.message}

--
This message was sent from the Block n' Roll contact form.`;

    // Create different URL options
    const mailtoUrl = `mailto:${emailTo}?subject=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(emailContent)}`;
    const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${emailTo}&su=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(emailContent)}`;

    // Debug: Log the URLs
    console.log("Mailto URL:", mailtoUrl);
    console.log("Gmail URL:", gmailUrl);

    // Try multiple methods
    const tryEmailClient = () => {
      try {
        // Method 1: Try native mailto
        window.open(mailtoUrl, "_self");

        // If that doesn't work, offer alternatives
        setTimeout(() => {
          const userChoice = confirm(
            "Did your email client open? Click 'OK' if yes, or 'Cancel' to try Gmail web interface."
          );

          if (!userChoice) {
            // User wants Gmail interface
            window.open(gmailUrl, "_blank");
          }
        }, 2000);
      } catch (error) {
        console.error("Error opening email client:", error);
        showFallbackOptions();
      }
    };

    const showFallbackOptions = () => {
      const choice = confirm(
        "Email client couldn't open automatically. Would you like to:\n\n" +
          "✅ OK = Open Gmail in browser\n" +
          "❌ Cancel = Copy email content to clipboard"
      );

      if (choice) {
        // Open Gmail
        window.open(gmailUrl, "_blank");
      } else {
        // Copy to clipboard
        const fullEmailText = `To: ${emailTo}\nSubject: ${subject}\n\n${emailContent}`;

        if (navigator.clipboard) {
          navigator.clipboard.writeText(fullEmailText).then(() => {
            alert(
              "✅ Email content copied to clipboard!\n\nNow open your email client and paste (Ctrl+V)"
            );
          });
        } else {
          // Fallback for older browsers
          const textArea = document.createElement("textarea");
          textArea.value = fullEmailText;
          document.body.appendChild(textArea);
          textArea.select();
          document.execCommand("copy");
          document.body.removeChild(textArea);
          alert(
            "✅ Email content copied to clipboard!\n\nNow open your email client and paste (Ctrl+V)"
          );
        }
      }
    };

    // Execute the email attempt
    tryEmailClient();

    // Show success message
    alert(t("contact.form.successMessage" as string));

    // Reset form
    setFormData({
      name: "",
      email: "",
      phone: "",
      program: "basic",
      message: "",
    });
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
