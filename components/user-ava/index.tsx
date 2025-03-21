import { Avatar } from "@heroui/avatar";

interface UserAvaProps {
  imageSrc?: string;
  displayName?: string;
  description: string;
  indicator?: React.ReactNode;
  theme?: {
    name?: string;
    description?: string;
  };
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
  indicator,
  theme = {
    name: "black",
    description: "",
  },
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
        className={avatar}
      />
      <div className="flex-1 flex-col overflow-hidden whitespace-nowrap">
        <span
          className={`text-sm truncate flex items-center ${name}`}
          style={{
            color: theme.name,
          }}
        >
          {displayName || "-"}
          {indicator && <span>{indicator}</span>}
        </span>
        <p className={`text-xs text-gray-400 truncate ${descriptionClass}`}>
          {description}
        </p>
      </div>
    </div>
  );
};
