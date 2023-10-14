import type { IScryfallCard } from "scryfall-types";
import { v4 } from "uuid";

import type { CardIdentifier, IAScryfallCard } from "@/types";

import { getProperty } from "./getProperty";

const inputMode = [
  {
    label: "Commander",
    params: {
      isSideboard: false,
      isCommander: true,
      isCompanion: false,
    },
  },
  {
    label: "Companion",
    params: {
      isSideboard: true,
      isCommander: false,
      isCompanion: true,
    },
  },
  {
    label: "Deck",
    params: { isSideboard: false, isCommander: false, isCompanion: false },
  },
  {
    label: "Sideboard",
    params: {
      isSideboard: true,
      isCommander: false,
      isCompanion: false,
    },
  },
];

const compareIdentifier = (
  card: IScryfallCard | Omit<CardIdentifier, "extra">,
  identifier: Omit<CardIdentifier, "extra">,
) =>
  (Object.keys(identifier) as (keyof typeof identifier)[]).every((key) => {
    const cardValue = "id" in card ? getProperty(card, key) : card[key];
    const identifierValue = identifier[key];
    return (
      cardValue &&
      identifierValue &&
      !cardValue.localeCompare(identifierValue, "en", {
        sensitivity: "base",
      })
    );
  });

export const chunk = <T>(arr: T[], size: number): T[][] =>
  [...Array(Math.ceil(arr.length / size))].map((_, i) =>
    arr.slice(size * i, size + size * i),
  );

export const getImportPayload = (inputText: string) => {
  let extraParams = inputMode[2].params;
  const companions: CardIdentifier[] = [];
  return inputText
    .split(/\r?\n/)
    .map((l) => {
      const line = l.trim();
      const mode = inputMode.find(({ label }) => label === line);
      if (mode) {
        extraParams = mode.params;
        return null;
      }

      const pattern = line.match(/^(\d+)\s(.+?)(?:\s\((\w{3})\)\s(\w+))?$/);
      if (!pattern) return null;

      const [, count, name, set, collector_number] = pattern;
      const normalizedName = name.replace(/\s\/\/.*$/, "");
      const extra = { count: Number(count), ...extraParams };

      let identifier: CardIdentifier | null = null;
      if (collector_number && set)
        identifier = { collector_number, set, extra };
      else if (name && set) identifier = { name: normalizedName, set, extra };
      else if (name) identifier = { name: normalizedName, extra };
      if (!identifier) return null;

      if (identifier.extra.isCompanion) {
        companions.push(identifier);
        return null;
      }
      if (identifier.extra.isSideboard) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { extra, ...keys } = identifier;
        const companion = companions.find((card) =>
          compareIdentifier(card, keys),
        );
        if (companion) {
          const companionCount = Math.min(
            companion.extra.count,
            identifier.extra.count,
          );
          companion.extra.count -= companionCount;
          identifier.extra.isCompanion = true;
          identifier.extra.companionCount = companionCount;
        }
      }

      return identifier;
    })
    .filter((obj): obj is CardIdentifier => Boolean(obj));
};

export const getNewCards = (
  refCards: IScryfallCard[],
  payload: CardIdentifier[],
) =>
  payload
    .map(({ extra, ...keys }) => {
      const refCard = refCards.find((card) => compareIdentifier(card, keys));
      return refCard ? { ...refCard, extra: { ...extra, uuid: v4() } } : null;
    })
    .filter((obj): obj is IAScryfallCard => Boolean(obj));
