import { Toaster } from "@/components/ui/sonner";
import { authOptions } from "@/lib/auth/auth";
import BackdropProvider from "@/providers/BackdropProvider";
import DialogProvider from "@/providers/DialogProvider";
import DrawerProvider from "@/providers/DrawerProvider";
import LanguageProvider from "@/providers/LanguageProvider";
import PermissionProvider from "@/providers/PermissionProvider";
import "@fortawesome/fontawesome-free/css/all.min.css";
import { getServerSession } from "next-auth";
import { getMessages } from "next-intl/server";
import AuthProvider from "../../providers/AuthProvider";
import QueryClientProvider from "../../providers/QueryProvider";
import ThemeProvider from "../../providers/ThemeProvider";
import "../globals.css";



type LayoutProps<T> = {
  children: React.ReactNode;
  params: Promise<T>;
};

export default async function RootLayout({
  children,
  params
}: LayoutProps<{ locale: string; }>) {
  const { locale } = await params;
  const messages = await getMessages({ locale });
  const session = await getServerSession(authOptions);
  return (
    <ThemeProvider>
      <AuthProvider session={session}>
        <LanguageProvider locale={locale} messages={messages} >
          <PermissionProvider permissions={session?.permissions ?? []}>
            <QueryClientProvider>
              <div className="relative">
                <main className="min-h-screen">{children}</main>
                <DialogProvider />
                <DrawerProvider />
                <Toaster />
                <BackdropProvider />
              </div>
            </QueryClientProvider>
          </PermissionProvider>
        </LanguageProvider>
      </AuthProvider>
    </ThemeProvider>

  );
}
