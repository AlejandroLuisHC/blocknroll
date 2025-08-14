// Common types used across the application

export interface NavItem {
  name: string;
  href: string;
}

export interface Stat {
  value: string;
  key: string;
  color: string;
}

export interface BackgroundElement {
  position: string;
  size: string;
  color: string;
}

export type InquiryType = "join" | "talk";

export type PackageType = "one_per_week" | "two_per_week" | "private";

export type EstimatedLevel = "Iniciación" | "Básico" | "Intermedio" | "Avanzado";

export interface FormData {
  inquiryType: InquiryType;
  fullName: string;
  email: string;
  phone?: string;
  players?: number; // 1 to 8
  level?: EstimatedLevel;
  packageType?: PackageType;
  availability?: string[]; // list of keys like "mon_18_1930"
}

export interface ContactInfo {
  title: string;
  content: string;
  description?: string;
}

export interface ServiceFeature {
  title: string;
  description: string;
  features: string[];
  price: string;
}

export interface GalleryImage {
  id: string;
  src: string;
  alt: string;
  category: string;
  // Instagram-specific properties (optional for fallback compatibility)
  permalink?: string;
  media_type?: "IMAGE" | "VIDEO" | "CAROUSEL_ALBUM";
  timestamp?: string;
  caption?: string;
}

export type SupportedLanguage = "es" | "en" | "ca";

export type GalleryCategory =
  | "all"
  | "training"
  | "competition"
  | "celebration"
  | "events";
