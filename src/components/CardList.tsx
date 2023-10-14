import "mana-font";
import { twMerge } from "tailwind-merge";

import type { IAScryfallCard } from "@/types";
import type { Config } from "@/types";

import {
  getExportManaCost,
  getExportName,
  getExportPrintedName,
} from "@/util/export";
import { sortCards } from "@/util/sort";

import ManaCost from "./ManaCost";

type Props = {
  config: Config;
  updateConfig: (key: keyof Config, value: string) => void;
  enCards: IAScryfallCard[];
  jaCards: IAScryfallCard[];
};

const CardList = ({ config, updateConfig, enCards, jaCards }: Props) => {
  const cards = config.cardLang === "en" ? enCards : jaCards;
  const classifiedCards = [
    {
      id: "commander",
      label: "統率者",
      cards: cards.filter((card) => card.extra.isCommander),
    },
    {
      id: "companion",
      label: "相棒",
      cards: cards.filter((card) => card.extra.isCompanion),
    },
    {
      id: "deck",
      label: "メイン",
      cards: cards
        .filter((card) => !card.extra.isSideboard && !card.extra.isCommander)
        .sort(sortCards(false)),
    },
    {
      id: "sideboard",
      label: "サイド",
      cards: cards
        .filter((card) => card.extra.isSideboard)
        .sort(sortCards(true)),
    },
  ].map((cls) => ({
    ...cls,
    count: cls.cards.reduce((n, card) => (n += card.extra.count), 0),
  }));

  return (
    <div className="flex h-[360px] flex-grow flex-col overflow-y-scroll rounded-md px-2 py-1.5 ring-1 ring-inset ring-gray-300">
      {classifiedCards.map(
        (cls) =>
          cls.count > 0 && (
            <div key={cls.id} className="mb-4">
              <h3 className="text-sm font-semibold">
                {cls.label} ({cls.count})
              </h3>
              <ul className="text-sm">
                {cls.cards.map((card) => (
                  <li
                    key={card.extra.uuid}
                    className={twMerge(
                      "flex cursor-pointer flex-row justify-between rounded-md px-1",
                      config.selectedCardId === card.id && "bg-indigo-100",
                    )}
                    onClick={() =>
                      updateConfig(
                        "selectedCardId",
                        config.selectedCardId === card.id ? "" : card.id,
                      )
                    }
                  >
                    <p>
                      {card.extra.count}{" "}
                      {getExportPrintedName(card) || getExportName(card)}
                    </p>
                    <p className="flex flex-row gap-0.5">
                      <ManaCost mana_cost={getExportManaCost(card) ?? ""} />
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          ),
      )}
    </div>
  );
};

export default CardList;
