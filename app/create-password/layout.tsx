import { Suspense } from "react";
import { Spinner } from "@heroui/spinner";

export default function CreatePasswordLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section className="flex min-h-screen w-full flex-col items-center justify-center">
      <Suspense fallback={<Spinner />}>{children}</Suspense>
    </section>
  );
}
