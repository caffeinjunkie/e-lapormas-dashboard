"use client";

import clsx from "clsx";
import React, { PropsWithChildren } from "react";

import { title as titleClass } from "@/components/primitives";

interface LayoutProps extends PropsWithChildren {
  title?: string;
  headerComponent?: React.ReactNode;
  isMobile?: boolean;
  classNames?: {
    layout?: string;
    container?: string;
    title?: string;
    header?: string;
    body?: string;
  };
}

const Layout = React.forwardRef<HTMLDivElement, LayoutProps>(
  ({ children, classNames, title, headerComponent, isMobile }, ref) => {
    return (
      <section
        className={clsx(
          "flex md:ml-[282px] flex-col md:absolute md:rounded-xl top-16 right-0 left-0 md:top-2 md:right-2 md:bottom-2 md:left-0 overflow-y-scroll gap-4 md:py-0 bg-white",
          classNames?.layout,
        )}
      >
        <div
          className={`inline-block overflow-y-scroll ${classNames?.container || "px-0"}`}
          ref={ref}
        >
          <div
            className={clsx(
              "flex flex-col w-full z-30 md:pt-6 pb-2 mb-2 md:mb-3 bg-white",
              isMobile
                ? "absolute top-0 shadow-none sm:shadow-sm"
                : "px-6 shadow-none",
              classNames?.header,
            )}
          >
            <h1
              className={clsx(
                "hidden md:block",
                titleClass(),
                isMobile ? "sm:px-6" : "px-0",
                classNames?.title,
              )}
            >
              {title}
            </h1>
            {headerComponent}
          </div>
          <div className={classNames?.body}>{children}</div>
        </div>
      </section>
    );
  },
);

Layout.displayName = "Layout";

export { Layout };
