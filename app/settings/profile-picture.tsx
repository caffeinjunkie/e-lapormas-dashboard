import { CameraIcon } from "@heroicons/react/24/outline";
import { UserIcon } from "@heroicons/react/24/solid";
import { Avatar } from "@heroui/avatar";
import { Button } from "@heroui/button";
import { Skeleton } from "@heroui/skeleton";

interface ProfilePictureProps {
  image: string | null;
  isUploading: boolean;
  onCameraPress: () => void;
}

export const ProfilePicture = ({
  image,
  isUploading,
  onCameraPress,
}: ProfilePictureProps) => {
  return (
    <div className="flex flex-col w-full items-center gap-6 py-6">
      <Skeleton isLoaded={!isUploading} className="rounded-full relative">
        <Avatar
          className="w-24 h-24 md:w-32 md:h-32 text-small"
          src={image ?? ""}
          fallback={<UserIcon className="size-8 md:size-9 text-white" />}
        />
        <div className="absolute bottom-1 right-1">
          <Button
            color="primary"
            onPress={onCameraPress}
            isDisabled={isUploading}
            isIconOnly
            radius="full"
            size="sm"
            startContent={
              <CameraIcon className="size-4 md:size-5 outline-none" />
            }
          />
        </div>
      </Skeleton>
    </div>
  );
};
