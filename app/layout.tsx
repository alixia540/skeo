import "./globals.css";
import { Providers } from "./providers";

export const metadata = {
  title: "Skolr",
  description: "Révise plus vite.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body className="transition-colors duration-500">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}

