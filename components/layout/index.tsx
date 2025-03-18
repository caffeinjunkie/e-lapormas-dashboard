import clsx from "clsx";
import React, { PropsWithChildren } from "react";

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
        <div className="inline-block" ref={ref}>
          <h1 className="text-2xl font-bold hidden md:block">{title}</h1>
          {children}
        </div>
      </section>
    );
  },
);
