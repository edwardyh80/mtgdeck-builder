import React, { memo } from "react";

const MANA_COST_REGEX = /(?:\{([^{}\s]+?)\}|( \/\/ ))/g;

const ManaCost = ({ mana_cost }: { mana_cost: string }) => {
  const splitManaCostMatchAll = mana_cost.matchAll(MANA_COST_REGEX);
  const splitManaCost = Array.from(splitManaCostMatchAll).map(
    ([, group1, group2]) => group1 || group2,
  );
  return (
    splitManaCost &&
    Array.from(splitManaCost).map((symbol, i) =>
      symbol === " // " ? (
        <span key={i}> &#47;&#47; </span>
      ) : (
        <i
          key={i}
          className={`ms ms-${symbol
            .replace("/", "")
            .toLowerCase()} ms-cost ms-shadow`}
        />
      ),
    )
  );
};

export default memo(ManaCost);
