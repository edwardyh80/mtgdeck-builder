import { type Dispatch, Fragment, type SetStateAction, useRef } from "react";

import Image from "next/image";

import { Dialog, Transition } from "@headlessui/react";
import { InformationCircleIcon } from "@heroicons/react/24/outline";

import CoffeeButton from "@/assets/default-yellow.png";

type Props = {
  isModalOpen: boolean;
  setIsModalOpen: Dispatch<SetStateAction<boolean>>;
};

const AboutModal = ({ isModalOpen, setIsModalOpen }: Props) => {
  const cancelButtonRef = useRef(null);

  return (
    <Transition.Root show={isModalOpen} as={Fragment}>
      <Dialog
        as="div"
        className="relative z-10"
        initialFocus={cancelButtonRef}
        onClose={() => setIsModalOpen(false)}
      >
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
          <div className="flex min-h-full min-w-[360px] items-center justify-center p-4 text-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-indigo-100 sm:mx-0 sm:h-10 sm:w-10">
                    <InformationCircleIcon
                      className="h-6 w-6 text-indigo-600"
                      aria-hidden="true"
                    />
                  </div>
                  <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                    <Dialog.Title
                      as="h2"
                      className="text-base font-semibold leading-6 text-gray-900"
                    >
                      mtgdeck-builderについて
                    </Dialog.Title>
                    <div className="mt-2">
                      <p className="text-base text-gray-900">
                        <span className="font-semibold">mtgdeck-builder</span>
                        は入力されたデッキリストにより、デッキの画像を生成するサービスです。
                      </p>
                      <p className="mt-2 text-base text-gray-900">
                        ツール及び生成された画像は基本的に無料でご利用頂けますが、☕️で応援して頂けると励みになります！
                      </p>
                      <a
                        href="https://www.buymeacoffee.com/asuka_mtg"
                        target="_blank"
                        className="mt-2 block"
                      >
                        <Image
                          src={CoffeeButton}
                          alt="Buy Me A Coffee"
                          className="mx-auto h-10 w-auto"
                        />
                      </a>
                      <p className="mt-8 text-xs text-gray-500">
                        <span className="font-semibold">mtgdeck-builder</span>は
                        <a
                          href="https://nextjs.org/"
                          className="text-indigo-600"
                        >
                          Next.js
                        </a>
                        で作成され、
                        <a
                          href="https://vercel.com/"
                          className="text-indigo-600"
                        >
                          Vercel
                        </a>
                        によってデプロイされます。
                      </p>
                      <p className="mt-2 text-xs text-gray-500">
                        カードのデータ及び画像は
                        <a
                          href="https://scryfall.com/"
                          className="text-indigo-600"
                        >
                          Scryfall
                        </a>
                        によって提供されます。
                      </p>
                      <p className="mt-2 text-xs text-gray-500">
                        マナ・シンボルの画像は
                        <a
                          href="https://mana.andrewgioia.com/"
                          className="text-indigo-600"
                        >
                          Andrew Gioia
                        </a>
                        さんによって提供されます。
                      </p>
                      <p className="mt-2 text-xs text-gray-500">
                        <span className="font-semibold">mtgdeck-builder</span>は
                        <a
                          href="https://company.wizards.com/ja/legal/fancontentpolicy"
                          className="text-indigo-600"
                        >
                          ファンコンテンツ・ポリシー
                        </a>
                        に沿った非公式のファンコンテンツです。
                        ウィザーズ社の認可/許諾は得ていません。
                        題材の一部に、ウィザーズ・オブ・ザ・コースト社の財産を含んでいます。
                        ©Wizards of the Coast LLC.
                      </p>
                    </div>
                  </div>
                </div>
                <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                  <button
                    type="button"
                    className="inline-flex w-full justify-center rounded-md bg-indigo-50 px-3 py-2 text-sm font-semibold text-indigo-600 shadow-sm hover:bg-indigo-100 sm:ml-3 sm:w-auto"
                    onClick={() => setIsModalOpen(false)}
                  >
                    閉じる
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
};

export default AboutModal;
