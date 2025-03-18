import clsx from "clsx";
import React, { PropsWithChildren } from "react";

import { title as titleClass } from "@/components/primitives";

interface LayoutProps extends PropsWithChildren {
  className?: string;
  title?: string;
}

export const Layout = React.forwardRef<HTMLDivElement, LayoutProps>(
  ({ children, className, title }, ref) => {
    return (
      <section
        className={clsx(
          "flex md:ml-72 flex-col px-6 md:px-12 justify-center gap-4 pb-4 md:py-9",
          className,
        )}
      >
        <div className="inline-block p-2 md:p-0" ref={ref}>
          <h1 className={clsx(titleClass(), "mb-0 md:mb-4")}>{title}</h1>
          {children}
        </div>
      </section>
    );
  },
);

Layout.displayName = "Layout";
