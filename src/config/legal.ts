import { CLUB_EMAIL } from "../constants/club";

// Public information only. Complete from the club's official documents before publishing.
// null means unverified; registration may be "" only when confirmed not applicable.
export const LEGAL_DETAILS = {
  holderName: "BLOCK AND ROLL CLUB DE VOLEY PLAYA",
  taxId: null as string | null,
  address: "C/ de la Muntanya, núm. 101, baix, 08026 Barcelona",
  registration: "Registre d’Entitats Esportives de la Generalitat de Catalunya, núm. 20312",
  privacyEmail: CLUB_EMAIL,
  hostingProvider: "Vercel",
  emailDeliveryProvider: null as string | null,
  emailInboxProvider: null as string | null,
  internationalTransfers: {
    es: null as string | null,
    ca: null as string | null,
    en: null as string | null,
  },
};

export const LEGAL_UPDATED_AT = "2026-11-20";
export const LEGAL_PAGES = ["notice", "privacy", "cookies"] as const;
export type LegalPageKind = typeof LEGAL_PAGES[number];

export const hasPendingLegalDetails =
  !LEGAL_DETAILS.holderName?.trim() || !LEGAL_DETAILS.taxId?.trim() || !LEGAL_DETAILS.address?.trim() ||
  LEGAL_DETAILS.registration === null || !LEGAL_DETAILS.emailDeliveryProvider?.trim() ||
  !LEGAL_DETAILS.emailInboxProvider?.trim() ||
  Object.values(LEGAL_DETAILS.internationalTransfers).some((value) => !value?.trim());
