export default function AnnoucementsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section className="flex sm:ml-72 flex-col items-center justify-center gap-4 py-8 md:py-10">
      <div className="inline-block max-w-lg text-center justify-center">
        {children}
      </div>
    </section>
  );
}
