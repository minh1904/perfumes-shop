import Navbar from "@/components/layout/Navbar";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        {/* Layout UI */}
        {/* Place children where you want to render a page or nested layout */}
        <Navbar></Navbar>
        <main>{children}</main>
      </body>
    </html>
  );
}
