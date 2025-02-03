import MainLayout from "@/components/layouts/MainLayout";
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
import ReactQueryProvider from "@/context/QueryContext";

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
    <html lang="en">
      <body className={manrope.className}>
        <ReactQueryProvider>
          <AuthProvider>
            <WebSocketProvider>
              <MainLayout>
                <ToastProvider>
                  <PostProvider>
                    <VideoConferencingProvider>
                      <VideoPlaybackProvider>{children}</VideoPlaybackProvider>
                      <Toaster richColors expand />
                    </VideoConferencingProvider>
                  </PostProvider>
                </ToastProvider>
              </MainLayout>
            </WebSocketProvider>
          </AuthProvider>
        </ReactQueryProvider>

      </body>
    </html>
  );
}
