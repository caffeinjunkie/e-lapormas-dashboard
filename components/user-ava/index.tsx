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
    name: nameClass = "",
    description: descriptionClass = "",
  } = classNames || {};

  return (
    <div className={`flex items-center gap-4 ${container}`}>
      <Avatar
        src={imageSrc}
        showFallback
        fallback={
          displayName !== "-"
            ? displayName.slice(0, 3)
            : description.slice(0, 1).toUpperCase() + description.slice(1, 3)
        }
        name={displayName}
        className={avatar}
      />
      <div className="flex-1 flex-col overflow-hidden ">
        <div className="flex flex-row items-center">
          <p
            className={`text-sm truncate ${nameClass}`}
            style={{
              color: theme.name,
            }}
          >
            {displayName || "-"}
          </p>
          {indicator && <span>{indicator}</span>}
        </div>
        <p className={`text-xs text-gray-400 truncate ${descriptionClass}`}>
          {description}
        </p>
      </div>
    </div>
  );
};
