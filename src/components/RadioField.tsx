import { twMerge } from "tailwind-merge";

import type { Config } from "@/types";

const choices = [
  {
    id: "en",
    label: "英語",
    description: "",
  },
  {
    id: "ja",
    label: "日本語",
    description:
      "一部の両面カードや古いセットのカードなど対応していないものは、英語版のままの表示となります。",
  },
];

type Props = {
  id: "labelLang" | "cardLang";
  label: string;
  config: Config;
  updateConfig: (key: keyof Config, value: string) => void;
  disabled: boolean;
};

const RadioField = ({ id, label, config, updateConfig, disabled }: Props) => (
  <div>
    <label className="text-base font-semibold text-gray-900">{label}</label>
    <fieldset className="mt-4">
      <div className="space-y-4">
        {choices.map((choice) => (
          <div key={`${id}-${choice.id}`} className="relative flex items-start">
            <div className="flex h-6 items-center">
              <input
                id={`${id}-${choice.id}`}
                aria-describedby={`${id}-${choice.id}-description`}
                name={id}
                type="radio"
                className={twMerge(
                  "h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-600",
                  "disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-500 disabled:ring-gray-200",
                )}
                checked={config[id] === choice.id}
                onChange={() => updateConfig(id, choice.id)}
                disabled={disabled}
              />
            </div>
            <div className="ml-3 text-sm leading-6">
              <label
                htmlFor={`${id}-${choice.id}`}
                className="font-medium text-gray-900"
              >
                {choice.label}
              </label>
              {id === "cardLang" && choice.id === "ja" && (
                <p
                  id={`${id}-${choice.id}-description`}
                  className="text-gray-500"
                >
                  {choice.description}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </fieldset>
  </div>
);

export default RadioField;
