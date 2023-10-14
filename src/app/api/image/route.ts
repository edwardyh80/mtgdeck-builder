import {
  type Canvas,
  type CanvasRenderingContext2D,
  type Image,
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

const coverCardWidth = 626;

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
  const pad = 2 * padding[0];
  const deck = cardSize[0] * cardsPerRow + gap * (cardsPerRow - 1);
  const side = n > 0 && n <= 15 ? sideboardWidth : 0;
  return pad + deck + side;
};
const canvasHeightFn = (m: number, n: number) => {
  const deckRows = Math.max(2, Math.ceil(m / cardsPerRow));
  const sideRows = Math.max(2, Math.ceil(n / cardsPerRow));
  const pad = 2 * padding[1];
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

const applyShadow = (ctx: CanvasRenderingContext2D) => {
  ctx.shadowOffsetX = 8;
  ctx.shadowOffsetY = 8;
  ctx.shadowColor = "rgba(0,0,0,0.75)";
  ctx.shadowBlur = 8;
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
  ctx.fillStyle = "#000000bf";
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

const drawCommander = (
  ctx: CanvasRenderingContext2D,
  icon: Image,
  x: number,
  y: number,
) => {
  ctx.save();
  ctx.beginPath();
  ctx.arc(x + 8, y + 6.25, 36, 0, 2 * Math.PI);
  ctx.fillStyle = "#000000";
  ctx.fill();
  ctx.drawImage(icon, x - 16, y - 12.5, 48, 37.5);
  ctx.restore();
};

const drawCompanion = (
  ctx: CanvasRenderingContext2D,
  icon: Image,
  x: number,
  y: number,
) => {
  ctx.save();
  ctx.beginPath();
  ctx.arc(x + 8, y + 8, 36, 0, 2 * Math.PI);
  ctx.fillStyle = "#000000";
  ctx.fill();
  ctx.drawImage(icon, x - 16, y - 16, 48, 48);
  ctx.restore();
};

const drawCard = (
  ctx: CanvasRenderingContext2D,
  card: IAScryfallCard,
  img: Image | undefined,
  icons: Image[],
  x: number,
  y: number,
) => {
  ctx.save();
  roundRect(ctx, x, y, cardSize[0], cardSize[1], radius);
  if (card.extra.isCommander || card.extra.isCompanion) {
    ctx.strokeStyle = "#f59105";
    ctx.lineWidth = 8;
    ctx.stroke();
  }
  ctx.clip();
  if (img) ctx.drawImage(img, x, y, cardSize[0], cardSize[1]);
  ctx.restore();
  drawCount(ctx, card.extra.count.toString(), x, y);
  if (card.extra.isCommander) drawCommander(ctx, icons[0], x, y);
  if (card.extra.isCompanion) drawCompanion(ctx, icons[1], x, y);
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
    applyShadow(ctx);
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
    applyShadow(ctx);
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
  coverCardImg: Image | undefined,
) => {
  ctx.save();
  ctx.fillStyle = "#00000080";
  ctx.fillRect(0, canvas.height - footerHeight, canvas.width, footerHeight);
  ctx.restore();

  ctx.save();
  ctx.beginPath();
  ctx.moveTo(0, canvas.height - footerHeight - 0.5 * padding[1]);
  ctx.lineTo(
    coverCardWidth - padding[0],
    canvas.height - footerHeight - 0.5 * padding[1],
  );
  ctx.lineTo(coverCardWidth, canvas.height);
  ctx.lineTo(0, canvas.height);
  ctx.lineTo(0, canvas.height - footerHeight);
  ctx.closePath();
  ctx.clip();
  if (coverCardImg)
    ctx.drawImage(
      coverCardImg,
      0,
      canvas.height - 1.5 * footerHeight,
      coverCardImg.width,
      coverCardImg.height,
    );
  else {
    ctx.fillStyle = "#000000bf";
    ctx.fillRect(
      0,
      canvas.height - 1.5 * footerHeight,
      canvas.width,
      1.5 * footerHeight,
    );
  }
  ctx.restore();

  ctx.save();
  ctx.font = `normal normal ${variables.fontWeight[lang]} 96px ${variables.font[lang]}`;
  ctx.fillStyle = "#ffffff";
  applyShadow(ctx);
  ctx.fillText(
    deckName ?? "",
    coverCardWidth,
    canvas.height - footerHeight + 4 * padding[1],
  );
  ctx.restore();

  ctx.save();
  ctx.font = `normal normal ${variables.fontWeight[lang]} 48px ${variables.font[lang]}`;
  ctx.fillStyle = "#ffffff";
  applyShadow(ctx);
  ctx.fillText(
    author && format
      ? `${author} / ${format}`
      : author
      ? author
      : format
      ? format
      : "",
    coverCardWidth + 0.25 * padding[0],
    canvas.height - footerHeight + 6 * padding[1],
  );
  ctx.restore();

  ctx.save();
  ctx.font = "normal normal 200 18px Inter";
  ctx.fillStyle = "#ffffff";
  applyShadow(ctx);
  const v1Width = ctx.measureText("v1").width;
  ctx.fillText(
    "v1",
    canvas.width - 0.15 * padding[0] - v1Width,
    canvas.height - 2 * padding[1],
  );
  ctx.restore();

  ctx.save();
  ctx.font = "normal normal 200 36px Inter";
  ctx.fillStyle = "#ffffff";
  applyShadow(ctx);
  const deckBuilderWidth = ctx.measureText(siteTitle).width;
  ctx.fillText(
    siteTitle,
    canvas.width - 0.2 * padding[0] - deckBuilderWidth - v1Width,
    canvas.height - 1.5 * padding[1],
  );
  ctx.restore();

  ctx.save();
  ctx.font = "normal normal 200 24px Inter";
  ctx.fillStyle = "#ffffff";
  applyShadow(ctx);
  const urlWidth = ctx.measureText(siteUrl).width;
  ctx.fillText(
    siteUrl,
    canvas.width - 0.125 * padding[0] - urlWidth,
    canvas.height - 0.5 * padding[1],
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
    customFormat,
    selectedCardId,
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

  const images = await Promise.all(
    cards
      .filter(
        (
          card,
        ): card is Omit<IAScryfallCard, "image_uris"> & {
          image_uris: Record<string, string>;
        } => Boolean(getProperty(card, "image_uris")),
      )
      .map((card) =>
        loadImage(getProperty(card, "image_uris").normal).then((img) => ({
          id: card.id,
          canvasImg: img,
        })),
      ),
  );
  const icons = await Promise.all(
    [
      path.resolve("src/assets/MTGA_Commander.png"),
      path.resolve("src/assets/MTGA_Companion.png"),
    ].map((path) => loadImage(path)),
  );

  const coverCard = cards.find((card) => card.id === selectedCardId);
  let coverCardImg: Image | undefined = undefined;
  if (coverCard) {
    const image_uris = getProperty(coverCard, "image_uris");
    if (image_uris) coverCardImg = await loadImage(image_uris.art_crop);
  }

  for (const [index, card] of deckCards.entries()) {
    const x = padding[0] + (cardSize[0] + gap) * (index % cardsPerRow);
    const y =
      padding[1] + (cardSize[1] + gap) * Math.floor(index / cardsPerRow);
    const img = images.find((image) => image.id === card.id)?.canvasImg;
    drawCard(ctx, card, img, icons, x, y);
  }

  if (sideboardCards.length > 15)
    for (const [index, card] of sideboardCards.entries()) {
      const x = padding[0] + (cardSize[0] + gap) * (index % cardsPerRow);
      const y =
        padding[1] +
        (cardSize[1] + gap) * (Math.ceil(deckCards.length / cardsPerRow) - 1) +
        cardSize[1] +
        sideboardGap * (Math.floor(index / cardsPerRow) + 1);
      const img = images.find((image) => image.id === card.id)?.canvasImg;
      drawCard(ctx, card, img, icons, x, y);
    }
  else
    for (const [index, card] of sideboardCards.entries()) {
      const x =
        index % 2 === 0
          ? canvas.width - sideboardWidth
          : canvas.width - cardSize[0] - padding[0];
      const y = padding[1] + sideboardGap * index;
      const img = images.find((image) => image.id === card.id)?.canvasImg;
      drawCard(ctx, card, img, icons, x, y);
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
    coverCardImg,
  );

  return new Response(canvas.toBuffer("image/jpeg"), {
    headers: { "content-type": "image/jpeg" },
  });
};
