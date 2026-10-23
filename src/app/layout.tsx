import { JetBrains_Mono } from "next/font/google";
import "@fontsource-variable/space-grotesk";
import Nav from "@/components/landingPageComponents/Nav";
import "./globals.css";
import Providers from "@/components/provider";
import Notifications from "@/components/notification/Notifications";
import GlobalLoader from "@/components/GlobalLoader";

// const display = Space_Grotesk({
//   subsets: ["latin"],
//   weight: ["500", "600", "700"],
//   variable: "--font-display",
//   display: "swap",
// });

const mono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata = {
  title: "Make It Print • 3D Art",
  description:
    "Custom models and toys for makers. 3D printing, engineering drawings, miniature fabrication and custom toys from Make It Print.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <Nav />
          {children}
        </Providers>
        <GlobalLoader />
        <Notifications />
      </body>
    </html>
  );
}
