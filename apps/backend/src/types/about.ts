import { ContactInformation } from "./contactInformation";

export interface AboutInfo {
  section: string,
  content: string,
  contact: ContactInformation | undefined
};