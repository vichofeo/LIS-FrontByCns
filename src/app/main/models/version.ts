export interface Version {
  version: string;
  buildDate: string;
}

export type VersionesState = Record<string, Version>;
