import { ContactInformation } from "./contactInformation";

export interface Admin {
  name: string | undefined,
  surnames: string | undefined,
  username: string,
  contact: ContactInformation | undefined,
  password: string,
  twofactor: boolean,
  verified: boolean
};