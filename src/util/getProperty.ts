import type { IScryfallCard, IScryfallCardFace } from "scryfall-types";

type GetAllowedProps<T extends IScryfallCard> = T extends {
  card_faces: IScryfallCardFace[];
}
  ? Exclude<keyof T["card_faces"][0] | keyof T, "card_faces">
  : keyof T;

const hasProperty = <Obj, Prop extends string>(
  obj: Obj,
  prop: Prop,
): obj is Obj & Record<Prop, unknown> =>
  Object.prototype.hasOwnProperty.call(obj, prop);

export function getProperty<
  C extends IScryfallCard & { card_faces: IScryfallCardFace[] },
  K extends keyof C["card_faces"][0],
>(card: C, key: K): C["card_faces"][0][K];

export function getProperty<
  C extends
    | (IScryfallCard & { card_faces: IScryfallCardFace[] })
    | IScryfallCard,
  K extends Exclude<keyof C, "card_faces">,
>(card: C, key: K): C[K];

export function getProperty<
  C extends IScryfallCard,
  K extends GetAllowedProps<C>,
>(card: IScryfallCard, key: K) {
  const { card_faces } = card;
  if (
    Array.isArray(card_faces) &&
    card_faces[0] &&
    hasProperty(card_faces[0], key)
  )
    return card_faces[0][key];
  return card[key];
}
