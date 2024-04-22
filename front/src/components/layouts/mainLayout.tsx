import * as Layout from ".";

export default function MainLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="w-full min-h-screen flex flex-col bg-gray-900 text-white">
      <header className="bg-gray-600 w-full">
        <Layout.Header />
      </header>
      <main className="flex-1">{children}</main>
      <footer>
        <Layout.Footer />
      </footer>
    </div>
  );
}
