import { EyeIcon } from "@heroicons/react/24/solid";
import { Card } from "@heroui/card";
import { Skeleton } from "@heroui/skeleton";
import clsx from "clsx";
import { useEffect, useState } from "react";

import { BrokenImageIcon, ImageIcon } from "@/components/icons";
import { getByteSize } from "@/utils/string";

interface ImageAttachmentProps {
  src: string;
  onPress: () => void;
  className?: string;
}

export const ImageAttachment = ({
  src,
  onPress,
  className,
}: ImageAttachmentProps) => {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    const getImage = async () => {
      try {
        let blob = await fetch(src).then((r) => r.blob());

        if (!blob.type.includes("image")) return;

        const filename = "image"; // wait for upload from pekerja.ai
        const file = new File([blob], filename, {
          type: "image/png",
        });

        setFile(file);
      } catch (_) {
        return;
      } finally {
        setLoading(false);
      }
    };

    getImage();
  }, []);

  return (
    <Card
      isPressable={!!file}
      onPress={onPress}
      className={clsx(
        "hidden sm:flex flex-row justify-between items-center w-full shadow-none border-1 border-default-200 hover:bg-default-100 hover:scale-105 rounded-xl",
        className,
      )}
    >
      {loading ? (
        <Skeleton isLoaded={!loading} className="w-40 animate-pulse h-12" />
      ) : (
        <>
          <div className="flex flex-row w-40 items-center p-2 justify-start gap-2">
            {file ? (
              <ImageIcon size={32} color="#F31260" />
            ) : (
              <BrokenImageIcon size={32} color="#F31260" />
            )}
            <div className="flex flex-col gap-1 text-xs">
              <p className="font-semibold text-start line-clamp-1">
                {file?.name}
              </p>
              <div className="flex flex-row text-default-500 items-center gap-1">
                <p className="font-semibold">
                  {file?.type.split("/")[1].toUpperCase() || "ERROR"}
                </p>
                <span className="text-xs">•</span>
                <p className="text-start">
                  {getByteSize(file?.size as number)}
                </p>
              </div>
            </div>
          </div>
          <div className="px-4">
            <EyeIcon className="w-4 h-4 stroke-2 text-default-500" />
          </div>
        </>
      )}
    </Card>
  );
};
