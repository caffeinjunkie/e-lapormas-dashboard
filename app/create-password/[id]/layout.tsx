export default function CreatePasswordLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section className="flex min-h-screen w-full flex-col items-center justify-center">
      {children}
    </section>
  );
}
