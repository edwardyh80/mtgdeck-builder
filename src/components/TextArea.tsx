import type { Dispatch, SetStateAction } from "react";

import { twMerge } from "tailwind-merge";

type Props = {
  textAreaInput: string;
  setTextAreaInput: Dispatch<SetStateAction<string>>;
  disabled: boolean;
};

const TextArea = ({ textAreaInput, setTextAreaInput, disabled }: Props) => (
  <textarea
    rows={12}
    name="deckList"
    id="deckList"
    className={twMerge(
      "block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300",
      "placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6",
      "disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-500 disabled:ring-gray-200",
      "flex-1 resize-none",
    )}
    placeholder="ここにペースト"
    value={textAreaInput}
    onChange={(e) => setTextAreaInput(e.target.value)}
    disabled={disabled}
  />
);

export default TextArea;
