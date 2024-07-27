'use client'

import "./globals.css";
import React, {useState} from "react";
import {LoggedProvider} from "@/app/context";
import Header from "@/components/personal/header";

export default function RootLayout({children}: Readonly<{
    children: React.ReactNode;
}>) {
    const [darkTheme, setDarkTheme] = useState<boolean>(false);

    return (
        <html lang="pt-BR" className={darkTheme ? "min-h-full min-w-full dark" : "min-h-full min-w-full"}>
        <head>
            <title>Players</title>
        </head>
        <body className="mx-auto">
        <LoggedProvider>
            <Header setDarkTheme={setDarkTheme} />
            <main className="px-4 py-6 sm:px-6 lg:px-8">
                {children}
            </main>
        </LoggedProvider>
        </body>
        </html>
    )
}