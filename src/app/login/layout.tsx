export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="flex flex-row">
      <div className="h-screen w-1/2 flex flex-col">{children}</div>
      <div className="h-screen w-1/2 flex items-center justify-center">
        <img
          src="/images/dashboard.png"
          className="h-full w-full object-cover"
        />
      </div>
    </main>
  );
}
