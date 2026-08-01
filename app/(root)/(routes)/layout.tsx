import React from 'react'
import Navbar from '@/components/ui/Navbar'
import Footer from '@/components/ui/Footer'

const RootLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <div className="flex flex-col min-h-screen bg-zinc-50/50 dark:bg-zinc-950/20">
            <Navbar />
            <main className="grow">
                {children}
            </main>
            <Footer />
        </div>
    )
}

export default RootLayout