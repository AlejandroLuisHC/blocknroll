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

export interface FormData {
  name: string;
  message: string;
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
