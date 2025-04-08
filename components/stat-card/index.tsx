import { Card, CardBody, CardFooter, CardHeader } from "@heroui/card";
import clsx from "clsx";
import { PropsWithChildren, ReactNode } from "react";

import { Line } from "./line";
import { Numbers } from "./numbers";
import { Pie } from "./pie";

interface StatCardProps extends PropsWithChildren {
  header?: ReactNode;
  footer?: ReactNode;
  className?: string;
}

export const StatCard = ({
  children,
  header,
  footer,
  className,
  ...props
}: StatCardProps) => {
  return (
    <Card
      className={clsx("min-h-36", className)}
      classNames={{
        header: "px-3 pt-3 pb-1",
        body: clsx("px-3 pt-0", footer ? "pb-1" : "pb-3"),
        footer: "px-3 pt-1 pb-3",
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
StatCard.Pie = Pie;
