import type { Dispatch, SetStateAction } from "react";
import { FaGithub, FaXTwitter } from "react-icons/fa6";

import Image from "next/image";

import { twMerge } from "tailwind-merge";

import CoffeeIcon from "@/assets/bmc-logo-yellow.png";

type Props = {
  setIsModalOpen: Dispatch<SetStateAction<boolean>>;
};

const Footer = ({ setIsModalOpen }: Props) => (
  <div className="flex flex-col gap-8 text-sm text-gray-500 sm:flex-row sm:justify-between">
    <div className="flex flex-row flex-wrap items-center justify-center gap-4">
      <button
        className="hover:text-gray-900"
        onClick={() => setIsModalOpen(true)}
      >
        mtgdeck-builderについて
      </button>
      <a
        className="hover:text-gray-900"
        href="https://mtgjp-events.vercel.app/"
        target="_blank"
      >
        MTGイベントカレンダー
      </a>
    </div>
    <div className="flex flex-row items-center justify-center gap-4">
      <a href="https://www.buymeacoffee.com/asuka_mtg" target="_blank">
        <Image
          src={CoffeeIcon}
          alt="Buy Me A Coffee"
          className={twMerge(
            "h-10 w-10 rounded-full grayscale-[100%] hover:grayscale-0",
            "transition duration-300 ease-in-out hover:-translate-y-1 hover:scale-125",
          )}
        />
      </a>
      <a
        className={twMerge(
          "hover:text-gray-900",
          "transition duration-300 ease-in-out hover:-translate-y-1 hover:scale-125",
        )}
        href="https://twitter.com/asuka_mtg"
        target="_blank"
      >
        <FaXTwitter className="h-8 w-8" />
      </a>
      <a
        className={twMerge(
          "hover:text-gray-900",
          "transition duration-300 ease-in-out hover:-translate-y-1 hover:scale-125",
        )}
        href="https://github.com/edwardyh80/mtgdeck-builder"
        target="_blank"
      >
        <FaGithub className="h-8 w-8" />
      </a>
    </div>
  </div>
);

export default Footer;
