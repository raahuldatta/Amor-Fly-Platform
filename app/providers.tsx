"use client"
import { ReactNode } from "react"
import { ThemeProvider as NextThemesProvider, type ThemeProviderProps } from "next-themes"

export function Providers({ children }: { children: ReactNode }) {
  return (
    <NextThemesProvider>
      {children}
    </NextThemesProvider>
  )
}

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>
} 