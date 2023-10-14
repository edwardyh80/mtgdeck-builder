import type { Dispatch, SetStateAction } from "react";
import { useDropzone } from "react-dropzone";

import {
  ClipboardDocumentCheckIcon,
  ClipboardDocumentListIcon,
  XCircleIcon,
} from "@heroicons/react/24/outline";
import { twMerge } from "tailwind-merge";

type Props = {
  setTextAreaInput: Dispatch<SetStateAction<string>>;
  disabled: boolean;
  isValidating: boolean;
};

const DndZone = ({ setTextAreaInput, disabled, isValidating }: Props) => {
  const onDrop = (files: File[]) => {
    const reader = new FileReader();
    reader.onload = () => {
      const text = reader.result;
      if (typeof text === "string") setTextAreaInput(text);
    };
    reader.readAsText(files[0]);
  };
  const { getRootProps, getInputProps, isDragAccept, isDragReject } =
    useDropzone({
      onDrop,
      disabled,
    });

  return (
    <div {...getRootProps()}>
      <input {...getInputProps()} />
      {isDragAccept ? (
        <div
          className={twMerge(
            "overflow-hidden rounded-lg border border-dashed border-indigo-300 bg-indigo-50",
            isValidating ? "cursor-not-allowed" : "cursor-pointer",
          )}
        >
          <div className="flex flex-col items-center gap-4 px-4 py-5 text-gray-500 sm:p-6">
            <ClipboardDocumentCheckIcon className="h-12 w-12" />
            <p className="text-center text-sm">
              ここにテキストファイルをドロップしてください
            </p>
          </div>
        </div>
      ) : isDragReject ? (
        <div
          className={twMerge(
            "overflow-hidden rounded-lg border border-dashed border-rose-300 bg-rose-50",
            isValidating ? "cursor-not-allowed" : "cursor-pointer",
          )}
        >
          <div className="flex flex-col items-center gap-4 px-4 py-5 text-gray-500 sm:p-6">
            <XCircleIcon className="h-12 w-12" />
            <p className="text-center text-sm">無効なファイルです</p>
          </div>
        </div>
      ) : (
        <div
          className={twMerge(
            "overflow-hidden rounded-lg border border-dashed border-gray-300 bg-gray-50",
            isValidating ? "cursor-not-allowed" : "cursor-pointer",
          )}
        >
          <div className="flex flex-col items-center gap-4 px-4 py-5 text-gray-500 sm:p-6">
            <ClipboardDocumentListIcon className="h-12 w-12" />
            <p className="text-center text-sm">
              ここにテキストファイルをドラッグするか、
              <button
                className={twMerge(
                  "font-semibold text-indigo-600",
                  isValidating && "cursor-not-allowed",
                )}
              >
                アップロード
              </button>
              してください
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default DndZone;
