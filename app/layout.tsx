import type { Metadata } from "next";
import { fontSirwan } from "@/public/fonts";
import { DirectionProvider } from "@/components/ui/direction";
import "./globals.css";

export const metadata: Metadata = {
  title: "دیکۆراتی مەلیک",
  description:
    "دیکۆراتی مەلیک — شکۆی بۆشاییەکانت بە دیزاینی مەغریبی و ئەسترۆپۆڵ. ئاستێک لە جوانی کە شایستەی تۆیە.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="ckb"
      dir="rtl"
      data-scroll-behavior="smooth"
      className={`${fontSirwan.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <DirectionProvider direction="rtl">{children}</DirectionProvider>
      </body>
    </html>
  );
}
