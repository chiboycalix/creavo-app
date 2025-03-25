import ReactQueryProvider from "@/context/QueryContext";
import ReduxProvider from "@/context/ReduxContext";
import ClientLayout from "@/components/ClientLayout";
import NetworkStatusWrapper from "@/components/NetworkStatusWrapper";
import { Manrope } from "next/font/google";
import { Metadata } from "next";
import { AuthProvider } from "@/context/AuthContext";
import { ToastProvider } from "@/context/ToastContext";
import { VideoPlaybackProvider } from "@/context/VideoPlaybackContext";
import { Toaster } from "@/components/ui/sonner";
import { PostProvider } from "@/context/PostContext";
import { WebSocketProvider } from "@/context/WebSocket";
import { VideoConferencingProvider } from "@/context/VideoConferencingContext";
import { MarketProvider } from "@/context/MarketContext";
import { SettingsProvider } from "@/context/SettingsContext";
import { Suspense } from 'react';
import { RouterSpinner } from "@/components/Loaders/RouterSpinner";
import "./globals.css";
import dynamic from "next/dynamic";

const MainLayout = dynamic(() => import('../components/layouts/MainLayout'), {
  loading: () => <RouterSpinner />,
});

const manrope = Manrope({
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Crevoe",
  description: "Crevoe",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={manrope.className}>
        <Suspense fallback={<div>hello</div>}>
          <ClientLayout>
            <NetworkStatusWrapper>
              <ReactQueryProvider>
                <ReduxProvider>
                  <AuthProvider>
                    <MarketProvider>
                      <SettingsProvider>
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
                      </SettingsProvider>
                    </MarketProvider>
                  </AuthProvider>
                </ReduxProvider>
              </ReactQueryProvider>
            </NetworkStatusWrapper>
          </ClientLayout>
        </Suspense>
      </body>
    </html>
  );
}
