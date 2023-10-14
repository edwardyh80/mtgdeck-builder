import type { Config } from "@/types";

import InputField from "./InputField";
import RadioField from "./RadioField";
import SelectField from "./SelectField";

type Props = {
  config: Config;
  updateConfig: (key: keyof Config, value: string) => void;
  disabled: boolean;
};

const FormPanel = ({ config, updateConfig, disabled }: Props) => (
  <div className="flex flex-1 flex-col gap-4">
    <RadioField
      id="labelLang"
      label="ラベルの言語"
      config={config}
      updateConfig={updateConfig}
      disabled={disabled}
    />
    <RadioField
      id="cardLang"
      label="カードの言語"
      config={config}
      updateConfig={updateConfig}
      disabled={disabled}
    />
    <InputField
      id="deckName"
      label="デッキ名"
      placeholder="独創力コンボ"
      config={config}
      updateConfig={updateConfig}
      disabled={disabled}
    />
    <InputField
      id="author"
      label="プレイヤー名"
      placeholder="リード・デューク"
      config={config}
      updateConfig={updateConfig}
      disabled={disabled}
    />
    <SelectField
      config={config}
      updateConfig={updateConfig}
      disabled={disabled}
    />
  </div>
);

export default FormPanel;
