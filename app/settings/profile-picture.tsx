import { CameraIcon, TrashIcon } from "@heroicons/react/24/outline";
import { UserIcon } from "@heroicons/react/24/solid";
import { Avatar } from "@heroui/avatar";
import { Button } from "@heroui/button";
import { Skeleton } from "@heroui/skeleton";

interface ProfilePictureProps {
  image: string | null;
  isUploading: boolean;
  onPressUpload: () => void;
  onPressDelete: () => void;
  t: (key: string) => string;
}

export const ProfilePicture = ({
  image,
  isUploading,
  onPressUpload,
  onPressDelete,
  t,
}: ProfilePictureProps) => {
  return (
    <div className="flex flex-col w-full items-center gap-6 bg-default-50 rounded-xl py-6">
      <Skeleton isLoaded={!isUploading} className="rounded-full">
        <Avatar
          className="w-24 h-24 md:w-32 md:h-32 text-small"
          src={image ?? ""}
          fallback={<UserIcon className="size-8 md:size-9 text-white" />}
        />
      </Skeleton>
      <div className="flex flex-row gap-3">
        <Button
          color="primary"
          onPress={onPressUpload}
          isDisabled={isUploading}
          className="text-white"
          size="sm"
          startContent={<CameraIcon className="size-4 md:size-5" />}
        >
          {t("profile-picture-upload-text")}
        </Button>
        <Button
          onPress={onPressDelete}
          size="sm"
          color="danger"
          variant="ghost"
          isDisabled={!image || isUploading}
          startContent={<TrashIcon className="size-4 md:size-5" />}
        >
          {t("profile-picture-delete-text")}
        </Button>
      </div>
    </div>
  );
};
