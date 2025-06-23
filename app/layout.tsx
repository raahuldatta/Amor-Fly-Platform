import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { ClerkProvider } from '@clerk/nextjs'
import { ThemeProvider } from '@/components/theme-provider'
import { Toaster } from '@/components/ui/sonner'
import { Header } from './components/Header'
import Script from 'next/script'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Amor Fly',
  description: 'Find your co-founder',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider
      appearance={{
        elements: {
          // Hide development notifications
          developmentMode: false,
        },
        variables: {
          colorPrimary: '#8b5cf6',
          colorBackground: 'transparent',
        },
        layout: {
          // Hide any development-related UI
          showOptionalFields: false,
        },
      }}
      publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY}
    >
      <html lang="en" suppressHydrationWarning>
        <head>
          <Script id="hide-clerk-notifications" strategy="beforeInteractive">
            {`
              // Hide Clerk development notifications
              function hideClerkNotifications() {
                const selectors = [
                  '[data-clerk-development-mode="true"]',
                  '.clerk-development-mode',
                  '[data-clerk-claim-completed]',
                  '.clerk-claim-completed',
                  'div[data-clerk-development]',
                  'div[data-clerk-claim]',
                  '.clerk-development-banner',
                  '.clerk-claim-banner',
                  '.clerk-notification',
                  '.clerk-banner'
                ];
                
                selectors.forEach(selector => {
                  const elements = document.querySelectorAll(selector);
                  elements.forEach(el => {
                    el.style.display = 'none';
                    el.style.visibility = 'hidden';
                    el.style.opacity = '0';
                    el.style.pointerEvents = 'none';
                  });
                });
              }
              
              // Run immediately and also on DOM changes
              hideClerkNotifications();
              
              // Watch for new elements being added
              const observer = new MutationObserver(hideClerkNotifications);
              observer.observe(document.body, { childList: true, subtree: true });
            `}
          </Script>
        </head>
        <body className={`${inter.className} antialiased relative min-h-screen`}>
          <div
            className="fixed inset-0 w-full h-full z-0"
            style={{
              background: 'linear-gradient(120deg, #ffe0ec 0%, #e0c3fc 100%)',
            }}
          />
          <div className="fixed inset-0 w-full h-full z-0 backdrop-blur-2xl bg-white/30 dark:bg-black/30" />
          <div className="hearts-bg z-0">
            <div className="heart" />
            <div className="heart" />
            <div className="heart" />
            <div className="heart" />
            <div className="heart" />
            <div className="heart" />
          </div>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <Header />
            <div className="relative z-10">{children}</div>
            <Toaster />
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  )
}
