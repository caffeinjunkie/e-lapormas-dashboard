import { EyeIcon, PhotoIcon } from "@heroicons/react/24/solid";
import { Card } from "@heroui/card";
import clsx from "clsx";
import { useEffect, useState } from "react";

import { ImageIcon } from "@/components/icons";

interface ImageAttachmentProps {
  src: string;
  alt?: string;
  onPress: () => void;
  className?: string;
}

export const ImageAttachment = ({
  src,
  alt = "image attached",
  onPress,
  className,
}: ImageAttachmentProps) => {
  const [file, setFile] = useState<File | null>(null);
  useEffect(() => {
    const getImage = async () => {
      let blob = await fetch(src).then((r) => r.blob());

      const filename = "wip"; // wait for upload from pekerja.ai
      const file = new File([blob], filename, {
        type: "image/png",
      });

      setFile(file);
    };

    getImage();
  }, []);

  return (
    <Card
      isPressable
      onPress={onPress}
      className={clsx(
        "hidden sm:flex flex-row justify-between items-center w-full p-2 shadow-none border-1 border-default-200 hover:bg-default-100 rounded-xl",
        className,
      )}
    >
      <div className="flex flex-row items-center w-full justify-start gap-2 pr-4">
        <ImageIcon size={32} color="#F31260" />
        <div className="flex flex-col gap-1 text-xs">
          <p className="font-semibold text-start line-clamp-1">
            {file?.name || alt}
          </p>
          <div className="flex flex-row text-default-500 items-center gap-1">
            <p className="font-semibold">
              {file?.type.split("/")[1].toUpperCase() || "IMAGE"}
            </p>
            <span className="text-xs">•</span>
            <p className="text-start">
              {((file?.size as number) / 1048576).toFixed(2)}MB
            </p>
          </div>
        </div>
      </div>
      <div className="px-2">
        <EyeIcon className="w-4 h-4 stroke-2 text-default-500" />
      </div>
    </Card>
  );
};
