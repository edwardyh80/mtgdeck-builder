import { twMerge } from "tailwind-merge";

import type { Config } from "@/types";

export const choices = [
  { id: "empty", value: "", label: "" },
  { id: "standard", value: "Standard", label: "スタンダード" },
  { id: "pioneer", value: "Pioneer", label: "パイオニア" },
  { id: "modern", value: "Modern", label: "モダン" },
  { id: "legacy", value: "Legacy", label: "レガシー" },
  { id: "vintage", value: "Vintage", label: "ヴィンテージ" },
  { id: "pauper", value: "Pauper", label: "パウパー" },
  { id: "commander", value: "Commander", label: "統率者戦" },
  { id: "sealed", value: "Sealed", label: "シールド" },
  { id: "draft", value: "Draft", label: "ドラフト" },
  { id: "others", value: "Others", label: "その他" },
];

type Props = {
  config: Config;
  updateConfig: (key: keyof Config, value: string) => void;
  disabled: boolean;
};

const SelectField = ({ config, updateConfig, disabled }: Props) => (
  <div>
    <div className="flex justify-between">
      <label
        htmlFor="format"
        className="block text-sm font-medium leading-6 text-gray-900"
      >
        フォーマット
      </label>
      <span className="text-sm leading-6 text-gray-500" id="format-optional">
        任意
      </span>
    </div>
    <select
      id="format"
      name="format"
      className={twMerge(
        "mt-2 block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300",
        "focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6",
        "disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-500 disabled:ring-gray-200",
      )}
      value={config.format}
      onChange={(e) => updateConfig("format", e.target.value)}
      disabled={disabled}
    >
      {choices.map((choice) => (
        <option key={choice.id} value={choice.value}>
          {choice.label}
        </option>
      ))}
    </select>
    {config.format === "Others" && (
      <input
        type="text"
        name="customFormat"
        id="customFormat"
        className={twMerge(
          "block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300",
          "placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6",
          "disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-500 disabled:ring-gray-200",
          "mt-2",
        )}
        placeholder="アルケミー"
        value={config.customFormat}
        onChange={(e) => updateConfig("customFormat", e.target.value)}
        disabled={disabled}
      />
    )}
  </div>
);

export default SelectField;
