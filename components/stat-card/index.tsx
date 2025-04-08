import { Card, CardBody, CardFooter, CardHeader } from "@heroui/card";
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
    <Card {...props}>
      {header && <CardHeader>{header}</CardHeader>}
      <CardBody>{children}</CardBody>
      {footer && <CardFooter>{footer}</CardFooter>}
    </Card>
  );
};

StatCard.displayName = "StatCard";
StatCard.Line = Line;
StatCard.Numbers = Numbers;
StatCard.Pie = Pie;
