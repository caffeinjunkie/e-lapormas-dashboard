import { Avatar } from "@heroui/avatar";

interface UserAvaProps {
  imageSrc?: string;
  displayName?: string;
  description: string;
  classNames?: {
    container?: string;
    avatar?: string;
    name?: string;
    description?: string;
  };
}

export const UserAva = ({
  imageSrc = "",
  displayName = "",
  description,
  classNames,
}: UserAvaProps) => {
  const {
    container = "",
    avatar = "",
    name = "",
    description: descriptionClass = "",
  } = classNames || {};

  return (
    <div className={`flex items-center gap-4 ${container}`}>
      <Avatar
        src={imageSrc}
        showFallback
        name={displayName}
        className={`hidden sm:block ${avatar}`}
      />
      <div className="flex-1 flex-col overflow-hidden whitespace-nowrap">
        <p className={`text-sm truncate ${name}`}>{displayName || "-"}</p>
        <p className={`text-xs text-gray-400 truncate ${descriptionClass}`}>
          {description}
        </p>
      </div>
    </div>
  );
};
