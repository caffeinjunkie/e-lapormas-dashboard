export default function UnauthorizedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section className="flex flex-col sm:ml-72 items-center justify-center gap-4">
      <div className="inline-block max-w-lg text-center justify-center">
        {children}
      </div>
    </section>
  );
}
