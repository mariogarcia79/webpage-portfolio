import { AboutInfo } from "../types/about";
import { ContactInformation } from "../types/contactInformation";

const info: AboutInfo = {
  section: "About Me",
  content: "About information",
  contact: undefined
};

export function getAboutInfo() {
  return info;
}