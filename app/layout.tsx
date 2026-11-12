import { Rubik, Oswald, JetBrains_Mono } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from '@/components/theme-provider'
import { Toaster } from '@/components/ui/sonner'
import { ChunkLoadErrorHandler } from '@/components/chunk-load-error-handler'

const rubik = Rubik({ subsets: ['latin', 'hebrew', 'cyrillic'], variable: '--font-sans' })
const oswald = Oswald({ subsets: ['latin', 'cyrillic'], variable: '--font-display' })
const jetbrainsMono = JetBrains_Mono({ subsets: ['latin'], variable: '--font-mono' })

export const dynamic = 'force-dynamic';

export function generateMetadata() {
  const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';
  return {
    title: 'BE THE WEAPON',
    description: 'Bringing Manhood Back. Fitness, close combat and shooting in one method.',
    metadataBase: new URL(baseUrl),
    icons: {
      icon: '/favicon.png',
      shortcut: '/favicon.png',
    },
    openGraph: {
      title: 'BE THE WEAPON',
      description: 'Bringing Manhood Back. Fitness, close combat and shooting in one method.',
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
    <html lang="he" suppressHydrationWarning>
      <head>
        <script src="https://apps.abacus.ai/chatllm/appllm-lib.js"></script>
      </head>
      <body className={`${rubik.variable} ${oswald.variable} ${jetbrainsMono.variable} font-sans bg-[hsl(0,0%,7%)] text-[hsl(0,0%,95%)]`}>
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
