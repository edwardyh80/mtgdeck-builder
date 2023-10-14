import type { IAScryfallCard } from "@/types";

import { getProperty } from "./getProperty";

const basicLandName = {
  Plains: "平地",
  Island: "島",
  Swamp: "沼",
  Mountain: "山",
  Forest: "森",
};

const checkBasicLandName = (str: string | null | undefined) => {
  if (!str) return str;
  if (str in basicLandName)
    return basicLandName[str as keyof typeof basicLandName];
  return str;
};

export const getExportPrintedName = (card: IAScryfallCard) =>
  card.layout === "split" && card.card_faces
    ? card.card_faces
        .map((card_face) => card_face.printed_name)
        .filter((printed_name): printed_name is string => Boolean(printed_name))
        .join(card.keywords.includes("Aftermath") ? " /// " : " // ")
    : checkBasicLandName(getProperty(card, "printed_name"));

export const getExportName = (card: IAScryfallCard) =>
  card.layout === "split" && card.card_faces
    ? card.card_faces
        .map((card_face) => card_face.name)
        .join(card.keywords.includes("Aftermath") ? " /// " : " // ")
    : getProperty(card, "name");

export const getExportManaCost = (card: IAScryfallCard) =>
  card.layout === "split" && card.card_faces
    ? card.card_faces
        .map((card_face) => card_face.mana_cost)
        .join(card.keywords.includes("Aftermath") ? " /// " : " // ")
    : getProperty(card, "mana_cost");
