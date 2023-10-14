"use client";

import { useState } from "react";

import Image from "next/image";

import { ArrowPathIcon } from "@heroicons/react/20/solid";

import { type Config, type IAScryfallCard, initConfig } from "@/types";

import AboutModal from "@/components/AboutModal";
import Button from "@/components/Button";
import CardList from "@/components/CardList";
import Footer from "@/components/Footer";
import FormPanel from "@/components/FormPanel";
import ImportPanel from "@/components/ImportPanel";
import Logo from "@/components/Logo";
import { useExportImage, useImportDeckList } from "@/util/queries";

const Home = () => {
  const [config, setConfig] = useState(initConfig);
  const updateConfig = (key: keyof Config, value: string) =>
    setConfig((config) => ({ ...config, [key]: value }));
  const [textAreaInput, setTextAreaInput] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [enCards, setEnCards] = useState<IAScryfallCard[]>([]);
  const [jaCards, setJaCards] = useState<IAScryfallCard[]>([]);
  const [image, setImage] = useState("");

  const { mutate, isValidating } = useImportDeckList(
    textAreaInput,
    setEnCards,
    setJaCards,
  );
  const { mutate: getImage, isValidating: isLoadingImage } = useExportImage(
    config.cardLang === "en" ? enCards : jaCards,
    config,
    setImage,
  );

  return (
    <main className="flex min-h-screen flex-col justify-between bg-gray-200">
      <div className="px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-screen-xl overflow-hidden rounded-lg bg-white shadow">
          <div className="p-4 sm:p-6 lg:p-8">
            <Logo />
            {image ? (
              <div className="mt-8 flex flex-col gap-8">
                <Image
                  src={image}
                  width={0}
                  height={0}
                  alt="Deck Image"
                  className="h-auto w-full"
                />
                <Button
                  secondary
                  onClick={() => {
                    setImage("");
                  }}
                >
                  やり直し
                </Button>
              </div>
            ) : (
              <div className="mt-8 flex flex-col gap-8 lg:flex-row">
                <div className="flex flex-1 flex-col gap-8">
                  {enCards.length && jaCards.length ? (
                    <>
                      <CardList
                        config={config}
                        updateConfig={updateConfig}
                        enCards={enCards}
                        jaCards={jaCards}
                      />
                      <Button
                        secondary
                        onClick={() => {
                          setEnCards([]);
                          setJaCards([]);
                          updateConfig("selectedCardId", "");
                        }}
                        disabled={isLoadingImage}
                      >
                        リセット
                      </Button>
                    </>
                  ) : (
                    <>
                      <ImportPanel
                        textAreaInput={textAreaInput}
                        setTextAreaInput={setTextAreaInput}
                        disabled={isValidating}
                      />
                      <Button onClick={() => mutate()} disabled={isValidating}>
                        {isValidating ? (
                          <ArrowPathIcon className="mx-auto h-5 w-5 animate-spin" />
                        ) : (
                          "インポート"
                        )}
                      </Button>
                    </>
                  )}
                </div>
                <div className="flex flex-1 flex-col gap-8">
                  <FormPanel
                    config={config}
                    updateConfig={updateConfig}
                    disabled={isLoadingImage}
                  />
                  <Button
                    onClick={() => getImage()}
                    disabled={
                      !enCards.length || !jaCards.length || isLoadingImage
                    }
                  >
                    {isLoadingImage ? (
                      <ArrowPathIcon className="mx-auto h-5 w-5 animate-spin" />
                    ) : (
                      "画像生成"
                    )}
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="px-4 pb-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-screen-xl">
          <Footer setIsModalOpen={setIsModalOpen} />
        </div>
      </div>
      <AboutModal isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} />
    </main>
  );
};

export default Home;
