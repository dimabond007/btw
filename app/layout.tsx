import { DM_Sans, Plus_Jakarta_Sans, JetBrains_Mono } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from '@/components/theme-provider'
import { Toaster } from '@/components/ui/sonner'
import { ChunkLoadErrorHandler } from '@/components/chunk-load-error-handler'

const dmSans = DM_Sans({ subsets: ['latin'], variable: '--font-sans' })
const jakartaSans = Plus_Jakarta_Sans({ subsets: ['latin'], variable: '--font-display' })
const jetbrainsMono = JetBrains_Mono({ subsets: ['latin'], variable: '--font-mono' })

export const dynamic = 'force-dynamic';

export function generateMetadata() {
  const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';
  return {
    title: 'BE THE WEAPON',
    description: 'Not fitness. Not sport. Preparation for reality.',
    metadataBase: new URL(baseUrl),
    icons: {
      icon: '/favicon.png',
      shortcut: '/favicon.png',
    },
    openGraph: {
      title: 'BE THE WEAPON',
      description: 'Not fitness. Not sport. Preparation for reality.',
      images: ['/og-image.png'],
    },
  };
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script src="https://apps.abacus.ai/chatllm/appllm-lib.js"></script>
      </head>
      <body className={`${dmSans.variable} ${jakartaSans.variable} ${jetbrainsMono.variable} font-sans bg-[hsl(0,0%,7%)] text-[hsl(0,0%,95%)]`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
          disableTransitionOnChange
        >
          {children}
          <Toaster />
          <ChunkLoadErrorHandler />
        </ThemeProvider>
      </body>
    </html>
  )
}
