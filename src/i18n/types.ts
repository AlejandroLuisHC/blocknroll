/**
 * Translation Schema - ensures all language files have the same structure
 *
 * This interface acts as a contract that all language files (es.json, en.json, ca.json)
 * must follow. If any key is missing in any language file, TypeScript will show an error.
 *
 * To check for missing translations, run: npm run check:translations
 */
export interface TranslationSchema {
  nav: {
    home: string;
    about: string;
    services: string;
    gallery: string;
    contact: string;
    joinNow: string;
    openMenu: string;
    closeMenu: string;
  };

  hero: {
    title: string;
    motto: string;
    subtitle: string;
    description: string;
    description2: string;
    joinButton: string;
    videoButton: string;
    stats: {
      completeTraining: string;
      players: string;
      sessions: string;
      freeTrial: string;
      privateTraining: string;
      experience: string;
    };
  };

  about: {
    badge: string;
    title: string;
    description1: string;
    description2: string;
    trainersTitle: string;
    trainer1: string;
    trainer2: string;
    trainersCredentials: string;
    trainersExperience: string;
    trainersPassion: string;
    stats: {
      experience: string;
      experienceLabel: string;
      players: string;
      playersLabel: string;
    };
    features: {
      excellence: {
        title: string;
        description: string;
      };
      community: {
        title: string;
        description: string;
      };
      goals: {
        title: string;
        description: string;
      };
      passion: {
        title: string;
        description: string;
      };
    };
    visualTitle: string;
    visualSubtitle: string;
  };

  services: {
    badge: string;
    title: string;
    subtitle: string;
    programs: {
      basic: {
        title: string;
        description: string;
        features: string[];
        price: string;
      };
      competitive: {
        title: string;
        description: string;
        features: string[];
        price: string;
      };
      elite: {
        title: string;
        description: string;
        features: string[];
        price: string;
      };
    };
    popular: string;
    joinButton: string;
    downloadInfo: string;
    additionalTitle: string;
    additional: {
      tournaments: {
        title: string;
        description: string;
      };
      clinics: {
        title: string;
        description: string;
      };
      schedule: {
        title: string;
        description: string;
      };
      trial: {
        title: string;
        description: string;
      };
    };
  };

  gallery: {
    badge: string;
    title: string;
    subtitle: string;
    categories: {
      all: string;
      training: string;
      competition: string;
      celebration: string;
      events: string;
    };
    noImages: string;
    noImagesDescription: string;
    loading: string;
    refresh: string;
    lastUpdate: string;
    error: string;
    filters: string;
    viewMore: string;
    status: {
      instagram: string;
      fallback: string;
    };
  };

  contact: {
    badge: string;
    title: string;
    subtitle: string;
    form: {
      title: string;
      description: string;
      name: string;
      email: string;
      phone: string;
      program: string;
      message: string;
      send: string;
      namePlaceholder: string;
      emailPlaceholder: string;
      phonePlaceholder: string;
      messagePlaceholder: string;
      required: string;
      inquiryTypeLabel: string;
      inquiryOptions: {
        join: string;
        talk: string;
      };
      playersLabel: string;
      levelLabel: string;
      packageLabel: string;
      levels: {
        iniciacion: string;
        basico: string;
        intermedio: string;
        avanzado: string;
      };
      packages: {
        onePerWeek: string;
        twoPerWeek: string;
        private: string;
      };
      selectPlaceholder: string;
      availabilityLabel: string;
      availability: {
        days: {
          mon: string;
          tue: string;
          wed: string;
          thu: string;
          fri: string;
        };
        slots: {
          '18_1930': string;
          '1930_21': string;
          '21_2230': string;
        };
      };
      programs: {
        basic: string;
        competitive: string;
        elite: string;
        other: string;
      };
      successMessage: string;
      errorMessage: string;
    };
    email: {
      typeJoin: string;
      typeTalk: string;
      name: string;
      email: string;
      phone: string;
      players: string;
      level: string;
      package: string;
      availability: string;
      availabilityNone: string;
    };
    info: {
      title: string;
      description: string;
      location: {
        title: string;
        content: string;
        description: string;
      };
      phone: {
        title: string;
        content: string;
        description: string;
      };
      email: {
        title: string;
        content: string;
        description: string;
      };
      schedule: {
        title: string;
        content: string;
        description: string;
      };
    };
  };

  footer: {
    description: string;
    followUs: string;
    quickLinks: string;
    contactInfo: string;
    newsletter: {
      title: string;
      description: string;
      placeholder: string;
      subscribe: string;
    };
    copyright: string;
    privacy: string;
    terms: string;
  };

  common: {
    years: string;
    players: string;
    month: string;
  };
}

/**
 * Type-safe resource structure for i18next
 */
export interface TypedResources {
  es: { translation: TranslationSchema };
  en: { translation: TranslationSchema };
  ca: { translation: TranslationSchema };
}
