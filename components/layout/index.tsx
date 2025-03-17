import React, { PropsWithChildren } from "react";
import clsx from "clsx";

interface LayoutProps extends PropsWithChildren {
  className?: string;
}

export const Layout = React.forwardRef<HTMLDivElement, LayoutProps>(
  ({ children, className }, ref) => {
    return (
      <section
        className={clsx(
          "flex md:ml-72 flex-col px-6 md:px-12 justify-center gap-4 py-4 md:py-9",
          className,
        )}
      >
        <div className="inline-block" ref={ref}>
          {children}
        </div>
      </section>
    );
  },
);
