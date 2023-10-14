import type { Dispatch, SetStateAction } from "react";

import DndZone from "./DndZone";
import Separator from "./Separator";
import TextArea from "./TextArea";

type Props = {
  textAreaInput: string;
  setTextAreaInput: Dispatch<SetStateAction<string>>;
  disabled: boolean;
};

const ImportPanel = ({ textAreaInput, setTextAreaInput, disabled }: Props) => (
  <div className="flex flex-1 flex-col gap-4">
    <DndZone setTextAreaInput={setTextAreaInput} disabled={disabled} />
    <Separator />
    <TextArea
      textAreaInput={textAreaInput}
      setTextAreaInput={setTextAreaInput}
      disabled={disabled}
    />
  </div>
);

export default ImportPanel;
