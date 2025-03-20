import clsx from "clsx";
import React, { PropsWithChildren } from "react";

import { title as titleClass } from "@/components/primitives";

interface LayoutProps extends PropsWithChildren {
  title?: string;
  classNames?: {
    layout?: string;
    container?: string;
    title?: string;
  };
}

export const Layout = React.forwardRef<HTMLDivElement, LayoutProps>(
  ({ children, classNames, title }, ref) => {
    return (
      <section
        className={clsx(
          "flex md:ml-[282px] flex-col md:absolute md:rounded-xl right-2 top-2 bottom-2 left-0 overflow-y-scroll gap-4 md:py-0 bg-white",
          classNames?.layout,
        )}
      >
        <div
          className={`inline-block overflow-y-scroll ${classNames?.container || "px-6 pb-4 pt-2 md:py-6"}`}
          ref={ref}
        >
          <h1 className={clsx(titleClass(), "mb-0", classNames?.title)}>
            {title}
          </h1>
          {children}
        </div>
      </section>
    );
  },
);

Layout.displayName = "Layout";
