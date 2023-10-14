import type { IScryfallCard } from "scryfall-types";

export type ExtraCardIdentifier = {
  count: number;
  isSideboard: boolean;
  isCommander: boolean;
  isCompanion: boolean;
  companionCount?: number;
};

export type CardIdentifier = {
  name?: string;
  set?: string;
  collector_number?: string;
  extra: ExtraCardIdentifier;
};

export type IAScryfallCard = IScryfallCard & {
  extra: {
    uuid: string;
  } & ExtraCardIdentifier;
};

export const initConfig = {
  labelLang: "en",
  cardLang: "en",
  deckName: "",
  author: "",
  format: "",
  customFormat: "",
  selectedCardId: "",
};

export type Config = typeof initConfig;
