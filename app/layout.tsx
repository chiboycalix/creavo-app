import MainLayout from "@/components/layouts/MainLayout";
import ReactQueryProvider from "@/context/QueryContext";
import ReduxProvider from "@/context/ReduxContext";
import { Manrope } from "next/font/google";
import { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { ToastProvider } from "@/context/ToastContext";
import { VideoPlaybackProvider } from "@/context/VideoPlaybackContext";
import { Toaster } from "@/components/ui/sonner";
import { PostProvider } from "@/context/PostContext";
import { WebSocketProvider } from "@/context/WebSocket";
import { VideoConferencingProvider } from "@/context/VideoConferencingContext";
import { CommentProvider } from "@/context/CommentsContext";
import { MarketProvider } from "@/context/MarketContext";

const manrope = Manrope({
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Creavo",
  description: "Creavo",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={manrope.className}>
        <ReactQueryProvider>
          <ReduxProvider>
            <AuthProvider>
              <MarketProvider>
                <WebSocketProvider>
                  <MainLayout>
                    <ToastProvider>
                      <PostProvider>
                        <VideoConferencingProvider>
                          <VideoPlaybackProvider>
                            {children}
                          </VideoPlaybackProvider>
                          <Toaster richColors expand />
                        </VideoConferencingProvider>
                      </PostProvider>
                    </ToastProvider>
                  </MainLayout>
                </WebSocketProvider>
              </MarketProvider>
            </AuthProvider>
          </ReduxProvider>
        </ReactQueryProvider>
      </body>
    </html>
  );
}
