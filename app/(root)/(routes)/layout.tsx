import React from 'react'
import Navbar from '@/components/ui/Navbar'
import Footer from '@/components/ui/Footer'
import AppProviders from '@/components/providers/AppProviders'

const RootLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <AppProviders>
            <div className="flex flex-col min-h-screen bg-zinc-50/50 dark:bg-zinc-950/20">
                <Navbar />
                <main className="grow">
                    {children}
                </main>
                <Footer />
            </div>
        </AppProviders>
    )
}

export default RootLayout