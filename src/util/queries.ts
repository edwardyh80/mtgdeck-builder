import type { Dispatch, SetStateAction } from "react";

import axios from "axios";
import type { IScryfallCard, IScryfallList } from "scryfall-types";
import useSWRImmutable from "swr/immutable";

import type { IAScryfallCard } from "@/types";
import type { Config } from "@/types";

import { chunk, getImportPayload, getNewCards } from "./import";

const base_url = "https://api.scryfall.com";

export const useImportDeckList = (
  textAreaInput: string,
  setEnCards: Dispatch<SetStateAction<IAScryfallCard[]>>,
  setJaCards: Dispatch<SetStateAction<IAScryfallCard[]>>,
) =>
  useSWRImmutable(
    base_url,
    async (url) => {
      const payload = getImportPayload(textAreaInput);
      const payloads = chunk(payload, 75);
      const enReses = await Promise.all(
        payloads.map((payload) =>
          axios.post<IScryfallList<IScryfallCard>>(`${url}/cards/collection`, {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            identifiers: payload.map(({ extra, ...keys }) => keys),
          }),
        ),
      );
      const enRes = enReses.map((res) => res.data.data).flat();
      const newEnCards = getNewCards(enRes, payload);
      setEnCards(newEnCards);

      const cardChunks = chunk(newEnCards, 20);
      const jaReses = await Promise.all(
        cardChunks.map((cardChunk) => {
          const query = cardChunk
            .map((card) => `name:"${card.name}"`)
            .join(" or ");
          return axios.get<IScryfallList<IScryfallCard>>(
            `${url}/cards/search?q=-is:promo -is:box lang:ja (${query})`,
          );
        }),
      );
      const jaRes = jaReses.map((res) => res.data.data).flat();
      const newJaCards = newEnCards.map((card) => {
        const jaCard = jaRes.find((refCard) => refCard.name === card.name);
        return jaCard ? { ...jaCard, extra: card.extra } : card;
      });
      setJaCards(newJaCards);
      return { enRes, jaRes };
    },
    { revalidateOnMount: false },
  );

export const useExportImage = (
  cards: IAScryfallCard[],
  config: Config,
  setImage: Dispatch<SetStateAction<string>>,
) =>
  useSWRImmutable(
    "/api/image",
    async (url) => {
      const res = await axios.post<Buffer>(
        url,
        {
          cards,
          ...config,
        },
        { responseType: "arraybuffer" },
      );
      const prefix = `data:${res.headers["content-type"]};base64,`;
      const base64 = Buffer.from(res.data).toString("base64");
      setImage(`${prefix}${base64}`);
      return res.data;
    },
    { revalidateOnMount: false },
  );
