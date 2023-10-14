import { twMerge } from "tailwind-merge";

import type { Config } from "@/types";

type Props = {
  id: "deckName" | "author";
  label: string;
  placeholder: string;
  config: Config;
  updateConfig: (key: keyof Config, value: string) => void;
  disabled: boolean;
};

const InputField = ({
  id,
  label,
  placeholder,
  config,
  updateConfig,
  disabled,
}: Props) => (
  <div>
    <div className="flex justify-between">
      <label
        htmlFor={id}
        className="block text-sm font-medium leading-6 text-gray-900"
      >
        {label}
      </label>
      <span className="text-sm leading-6 text-gray-500" id={`${id}-optional`}>
        任意
      </span>
    </div>
    <div className="mt-2">
      <input
        type="text"
        name={id}
        id={id}
        className={twMerge(
          "block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300",
          "placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6",
          "disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-500 disabled:ring-gray-200",
        )}
        placeholder={placeholder}
        aria-describedby={`${id}-optional`}
        value={config[id]}
        onChange={(e) => updateConfig(id, e.target.value)}
        disabled={disabled}
      />
    </div>
  </div>
);

export default InputField;
