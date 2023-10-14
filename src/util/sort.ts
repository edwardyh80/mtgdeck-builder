import type { IScryfallColor } from "scryfall-types";

import type { IAScryfallCard } from "@/types";

import { getProperty } from "./getProperty";

const cardTypes = [
  "Creature",
  "Planeswalker",
  "Battle",
  "Instant",
  "Sorcery",
  "Enchantment",
  "Artifact",
  "Land",
];
const colors: IScryfallColor[] = ["W", "U", "B", "R", "G"];

const getFirstCardTypeIndex = (card: IAScryfallCard) => {
  const typeIndex = cardTypes.findIndex((cardType) =>
    getProperty(card, "type_line").includes(cardType),
  );
  return typeIndex === -1 ? 99 : typeIndex;
};

const getFirstColorIndex = (card: IAScryfallCard) => {
  const colorIndex = colors.findIndex(
    (color) => getProperty(card, "colors")?.includes(color),
  );
  return colorIndex === -1 ? 99 : colorIndex;
};

export const sortCards =
  (sb: boolean) => (cardA: IAScryfallCard, cardB: IAScryfallCard) =>
    sb
      ? Number(cardB.extra.isCompanion) - Number(cardA.extra.isCompanion) ||
        (getProperty(cardA, "colors")?.length ?? 0) -
          (getProperty(cardB, "colors")?.length ?? 0) ||
        getFirstColorIndex(cardA) - getFirstColorIndex(cardB) ||
        cardA.cmc - cardB.cmc ||
        getFirstCardTypeIndex(cardA) - getFirstCardTypeIndex(cardB) ||
        cardA.name.localeCompare(cardB.name)
      : Number(cardB.extra.isCommander) - Number(cardA.extra.isCommander) ||
        getFirstCardTypeIndex(cardA) - getFirstCardTypeIndex(cardB) ||
        cardA.cmc - cardB.cmc ||
        (getProperty(cardA, "colors")?.length ?? 0) -
          (getProperty(cardB, "colors")?.length ?? 0) ||
        getFirstColorIndex(cardA) - getFirstColorIndex(cardB) ||
        cardA.name.localeCompare(cardB.name);
