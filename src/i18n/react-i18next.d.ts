/**
 * TypeScript declarations for react-i18next type safety
 */
import { TypedResources } from "./types";

declare module "react-i18next" {
  interface CustomTypeOptions {
    resources: TypedResources["es"];
    defaultNS: "translation";
    returnNull: false;
  }
}

declare module "i18next" {
  interface CustomTypeOptions {
    resources: TypedResources["es"];
    defaultNS: "translation";
    returnNull: false;
  }
}
