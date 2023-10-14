import {
  type Canvas,
  type CanvasRenderingContext2D,
  createCanvas,
  loadImage,
  registerFont,
} from "canvas";
import path from "path";

import type { Config, IAScryfallCard } from "@/types";

import { choices as formatDict } from "@/components/SelectField";
import { getProperty } from "@/util/getProperty";
import { sortCards } from "@/util/sort";

const cardsPerRow = 8;
const gap = 8;

const cardSize = [244, 340];
const padding = [96, 32];
const radius = 16;

const countSize = 48;
const countPadding = [70, 42];
const countRadius = 8;

const sideboardWidth = 488;
const sideboardGap = 92;
const footerHeight = 256;

const siteTitle = "mtgdeck-builder";
const siteUrl = "mtgdeck-builder.vercel.app";
const variables = {
  deck: {
    en: "DECK",
    ja: "メイン",
  },
  sideboard: {
    en: "SIDEBOARD",
    ja: "サイド",
  },
  font: {
    en: "Inter",
    ja: "NotoSansJP",
  },
  fontWeight: {
    en: 800,
    ja: 600,
  },
};

const canvasWidthFn = (n: number) => {
  const pad = padding[0] * 2;
  const deck = cardSize[0] * cardsPerRow + gap * (cardsPerRow - 1);
  const side = n > 0 && n <= 15 ? sideboardWidth : 0;
  return pad + deck + side;
};
const canvasHeightFn = (m: number, n: number) => {
  const deckRows = Math.max(2, Math.ceil(m / cardsPerRow));
  const sideRows = Math.max(2, Math.ceil(n / cardsPerRow));
  const pad = padding[1] * 2;
  const deck = cardSize[1] * deckRows + gap * (deckRows - 1);
  const side = n > 15 ? 0 : cardSize[1] + (n - 1) * sideboardGap;
  const addSide = n > 15 ? cardSize[1] + sideboardGap * sideRows : 0;
  return Math.max(pad + deck, pad + side) + addSide + footerHeight;
};

const roundRect = (
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number,
) => {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + width - radius, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
  ctx.lineTo(x + width, y + height - radius);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  ctx.lineTo(x + radius, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
};

const drawCount = (
  ctx: CanvasRenderingContext2D,
  count: string,
  x: number,
  y: number,
) => {
  ctx.save();
  roundRect(
    ctx,
    x + cardSize[0] - countPadding[0],
    y + countPadding[1],
    countSize,
    countSize,
    countRadius,
  );
  ctx.clip();
  ctx.fillStyle = "#000000e6";
  ctx.fillRect(
    x + cardSize[0] - countPadding[0],
    y + countPadding[1],
    countSize,
    countSize,
  );
  ctx.restore();

  ctx.save();
  ctx.font = "32px Inter";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillStyle = "#ffffff";
  ctx.fillText(
    count,
    x + cardSize[0] - countPadding[0] + countSize / 2,
    y + countPadding[1] + countSize / 2,
  );
  ctx.restore();
};

/*const drawCompanion = async (
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
) => {
  const image = await loadImage("src/assets/Icon_Companion.png");
  ctx.save();
  ctx.drawImage(image, x - 35, y - 30, 70, 60);
  ctx.restore();
};*/

const drawCard = async (
  ctx: CanvasRenderingContext2D,
  card: IAScryfallCard,
  x: number,
  y: number,
) => {
  const image_url = getProperty(card, "image_uris");
  if (image_url) {
    const image = await loadImage(image_url.normal);
    ctx.save();
    roundRect(ctx, x, y, cardSize[0], cardSize[1], radius);
    ctx.clip();
    ctx.drawImage(image, x, y, cardSize[0], cardSize[1]);
    ctx.restore();
    drawCount(ctx, card.extra.count.toString(), x, y);
    //if (card.extra.isCompanion) await drawCompanion(ctx, x, y);
  }
};

const drawBackground = (canvas: Canvas, ctx: CanvasRenderingContext2D) => {
  ctx.save();
  const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
  gradient.addColorStop(0, "#312e81");
  gradient.addColorStop(1, "#111827");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.restore();
};

const drawTitles = (
  canvas: Canvas,
  ctx: CanvasRenderingContext2D,
  deckCards: IAScryfallCard[],
  sideboardCards: IAScryfallCard[],
  lang: "en" | "ja",
) => {
  const deckCount = deckCards.reduce((acc, n) => (acc += n.extra.count), 0);
  const sideboardCount = sideboardCards.reduce(
    (acc, n) => (acc += n.extra.count),
    0,
  );

  if (deckCount) {
    const deckTitle = `${variables.deck[lang]} - ${deckCount}`;
    ctx.save();
    ctx.font = `normal normal ${variables.fontWeight[lang]} 48px ${variables.font[lang]}`;
    ctx.fillStyle = "#ffffff";
    const deckTitleWidth = ctx.measureText(deckTitle).width;
    ctx.translate(0.8 * padding[0], 1.5 * padding[1] + deckTitleWidth);
    ctx.rotate((-90 * Math.PI) / 180);
    ctx.fillText(deckTitle, 0, 0);
    ctx.restore();
  }

  if (sideboardCount) {
    const sideboardTitle = `${variables.sideboard[lang]} - ${sideboardCount}`;
    ctx.save();
    ctx.font = `normal normal ${variables.fontWeight[lang]} 48px ${variables.font[lang]}`;
    ctx.fillStyle = "#ffffff";
    const sideboardTitleWidth = ctx.measureText(sideboardTitle).width;
    if (sideboardCards.length > 15)
      ctx.translate(
        0.8 * padding[0],
        1.5 * padding[1] +
          (cardSize[1] + gap) *
            (Math.ceil(deckCards.length / cardsPerRow) - 1) +
          cardSize[1] +
          sideboardGap +
          sideboardTitleWidth,
      );
    else
      ctx.translate(
        canvas.width - sideboardWidth - 0.2 * padding[0],
        1.5 * padding[1] + sideboardTitleWidth,
      );
    ctx.rotate((-90 * Math.PI) / 180);
    ctx.fillText(sideboardTitle, 0, 0);
    ctx.restore();
  }
};

const drawFooter = (
  canvas: Canvas,
  ctx: CanvasRenderingContext2D,
  deckName: string,
  author: string,
  format: string,
  lang: "en" | "ja",
) => {
  ctx.save();
  ctx.fillStyle = "#00000080";
  ctx.fillRect(0, canvas.height - footerHeight, canvas.width, footerHeight);
  ctx.restore();

  ctx.save();
  ctx.font = `normal normal ${variables.fontWeight[lang]} 96px ${variables.font[lang]}`;
  ctx.fillStyle = "#ffffff";
  ctx.fillText(
    deckName ?? "",
    padding[0],
    canvas.height - footerHeight + 4 * padding[1],
  );
  ctx.restore();

  ctx.save();
  ctx.font = `normal normal ${variables.fontWeight[lang]} 48px ${variables.font[lang]}`;
  ctx.fillStyle = "#ffffff";
  ctx.fillText(
    author && format
      ? `${author} / ${format}`
      : author
      ? author
      : format
      ? format
      : "",
    padding[0],
    canvas.height - footerHeight + 6 * padding[1],
  );
  ctx.restore();

  ctx.save();
  ctx.font = "normal normal 200 36px Inter";
  ctx.fillStyle = "#ffffff";
  const v1Width = ctx.measureText("v1").width;
  ctx.fillText(
    "v1",
    canvas.width - padding[0] - v1Width,
    canvas.height - footerHeight + 2.5 * padding[1],
  );
  ctx.restore();

  ctx.save();
  ctx.font = "normal normal 200 96px Inter";
  ctx.fillStyle = "#ffffff";
  const deckBuilderWidth = ctx.measureText(siteTitle).width;
  ctx.fillText(
    siteTitle,
    canvas.width - 1.1 * padding[0] - deckBuilderWidth - v1Width,
    canvas.height - footerHeight + 4 * padding[1],
  );
  ctx.restore();

  ctx.save();
  ctx.font = "normal normal 200 48px Inter";
  ctx.fillStyle = "#ffffff";
  const urlWidth = ctx.measureText(siteUrl).width;
  ctx.fillText(
    siteUrl,
    canvas.width - padding[0] - urlWidth,
    canvas.height - footerHeight + 6 * padding[1],
  );
  ctx.restore();
};

export const POST = async (req: Request) => {
  const {
    cards,
    labelLang,
    deckName,
    author,
    format,
    customFormat, //selectedCardId,
  }: { cards: IAScryfallCard[] } & Config = await req.json();
  const deckCards = cards
    .filter((card) => !card.extra.isSideboard)
    .sort(sortCards(false));
  const sideboardCards = cards
    .filter((card) => card.extra.isSideboard)
    .sort(sortCards(true));

  const resolved = path.resolve("src/assets/fonts/NotoSansJP-SemiBold.ttf");
  registerFont(resolved, { family: "NotoSansJP" });
  const canvas = createCanvas(
    canvasWidthFn(sideboardCards.length),
    canvasHeightFn(deckCards.length, sideboardCards.length),
  );
  const ctx = canvas.getContext("2d");

  drawBackground(canvas, ctx);

  for (const [index, card] of deckCards.entries()) {
    const x = padding[0] + (cardSize[0] + gap) * (index % cardsPerRow);
    const y =
      padding[1] + (cardSize[1] + gap) * Math.floor(index / cardsPerRow);
    await drawCard(ctx, card, x, y);
  }

  if (sideboardCards.length > 15)
    for (const [index, card] of sideboardCards.entries()) {
      const x = padding[0] + (cardSize[0] + gap) * (index % cardsPerRow);
      const y =
        padding[1] +
        (cardSize[1] + gap) * (Math.ceil(deckCards.length / cardsPerRow) - 1) +
        cardSize[1] +
        sideboardGap * (Math.floor(index / cardsPerRow) + 1);
      await drawCard(ctx, card, x, y);
    }
  else
    for (const [index, card] of sideboardCards.entries()) {
      const x =
        index % 2 === 0
          ? canvas.width - sideboardWidth
          : canvas.width - cardSize[0] - padding[0];
      const y = padding[1] + sideboardGap * index;
      await drawCard(ctx, card, x, y);
    }

  drawTitles(
    canvas,
    ctx,
    deckCards,
    sideboardCards,
    labelLang === "ja" ? "ja" : "en",
  );
  drawFooter(
    canvas,
    ctx,
    deckName,
    author,
    format === "Others"
      ? customFormat
      : labelLang === "ja"
      ? formatDict.find((f) => f.value === format)?.label ?? ""
      : format,
    labelLang === "ja" ? "ja" : "en",
  );

  return new Response(canvas.toBuffer("image/jpeg"), {
    headers: { "content-type": "image/jpeg" },
  });
};
