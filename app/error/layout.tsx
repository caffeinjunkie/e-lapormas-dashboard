import { Spinner } from "@heroui/spinner";
import { Suspense } from "react";

export default function ErrorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section className="flex flex-col w-full items-center justify-center gap-4 py-8 md:py-10">
      <div className="inline-block max-w-lg text-center justify-center">
        <Suspense fallback={<Spinner />}>{children}</Suspense>
      </div>
    </section>
  );
}
