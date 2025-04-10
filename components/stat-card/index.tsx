import { Card, CardBody, CardFooter, CardHeader } from "@heroui/card";
import clsx from "clsx";
import { PropsWithChildren, ReactNode } from "react";

import { Bar } from "./bar";
import { Line } from "./line";
import { Numbers } from "./numbers";
import { Percentage } from "./percentage";
import { Pie } from "./pie";

interface StatCardProps extends PropsWithChildren {
  header?: ReactNode;
  footer?: ReactNode;
  classNames?: {
    root?: string;
    header?: string;
    body?: string;
    footer?: string;
  };
}

export const StatCard = ({
  children,
  header,
  footer,
  classNames,
  ...props
}: StatCardProps) => {
  return (
    <Card
      className={clsx("min-h-36", classNames?.root)}
      classNames={{
        header: clsx("px-3 pt-3 pb-1", classNames?.header),
        body: clsx("px-3 pt-0", footer ? "pb-1" : "pb-3", classNames?.body),
        footer: clsx("px-3 pt-1 pb-3", classNames?.footer),
      }}
      {...props}
    >
      {header && <CardHeader className="w-full">{header}</CardHeader>}
      <CardBody>{children}</CardBody>
      {footer && <CardFooter className="w-full">{footer}</CardFooter>}
    </Card>
  );
};

StatCard.displayName = "StatCard";
StatCard.Line = Line;
StatCard.Numbers = Numbers;
StatCard.Bar = Bar;
StatCard.Pie = Pie;
StatCard.Percentage = Percentage;

