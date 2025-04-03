import { useTranslations } from "next-intl";

import { QuestionAnswer } from "@/types/report.types";

interface DescriptionProps {
  description: string;
  followUpQuestions?: QuestionAnswer[];
}

export const Description = ({
  description,
  followUpQuestions = [],
}: DescriptionProps) => {
  const t = useTranslations("ReportsPage");
  return (
    <div className="flex flex-col gap-3 w-full">
      <div className="flex flex-col gap-2">
        <p className="text-xs font-bold text-default-500">
          {t("description-text")}
        </p>
        <div className="flex w-full bg-default-100 p-2 rounded-xl">
          <p className="text-xs text-default-700">{description}</p>
        </div>
      </div>
      {followUpQuestions.length > 0 && (
        <div className="flex flex-col gap-2">
          <p className="text-xs font-bold text-default-500">
            {t("follow-up-questions-text")}
          </p>
          <div className="flex w-full flex-col gap-2 bg-default-100 p-2 rounded-xl">
            {followUpQuestions.map((item, index) => (
              <div key={index} className="flex flex-col gap-1">
                <span className="flex flex-row gap-1 items-start">
                  <p className="text-xs font-bold text-default-500 w-10">
                    {t("follow-up-questions-q-text")}
                  </p>
                  <p className="flex-1 text-xs font-light text-default-700">
                    {item.q}
                  </p>
                </span>
                <span className="flex flex-row gap-1 items-start">
                  <p className="text-xs font-bold text-default-500 w-10">
                    {t("follow-up-questions-a-text")}
                  </p>
                  <p className="flex-1 text-xs font-light text-default-700">
                    {item.a}
                  </p>
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

Description.displayName = "Description";
