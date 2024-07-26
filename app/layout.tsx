'use client'

import "./globals.css";
import {Navbar, NavbarDivider, NavbarItem, NavbarSection} from "@/components/navbar";
import {Heading} from "@/components/heading";
import {usePathname} from "next/navigation";
import {Switch} from "@/components/switch";
import {MoonIcon, SunIcon} from "@heroicons/react/16/solid";
import React from "react";

interface Navigation {
    name: string,
    url: string
}

const navigation: Navigation[] = [
    {
        name: "Top",
        url: "/top"
    },
    {
        name: "Players",
        url: "/players"
    },
    {
        name: "Scores",
        url: "/scores"
    }
]

export default function RootLayout({children}: Readonly<{
    children: React.ReactNode;
}>) {
    const pathname = usePathname();
    const [darkTheme, setDarkTheme] = React.useState<boolean>(false);

    return (
        <html lang="pt-BR" className={darkTheme ? "min-h-full min-w-full dark" : "min-h-full min-w-full"}>
        <head>
            <title>Players</title>
        </head>
        <body className="mx-auto">
        <header>
            <Navbar className="flex justify-around px-4 bg-gray-400 dark:bg-gray-800">
                <NavbarSection>
                    <Heading level={1}>
                        Dashboard
                    </Heading>
                </NavbarSection>
                <NavbarDivider/>
                <NavbarSection>
                    {navigation.map((item) => (
                        <NavbarItem key={item.name} href={item.url} current={pathname == item.url}>
                            {item.name}
                        </NavbarItem>
                    ))}
                </NavbarSection>
                <NavbarDivider/>
                <NavbarSection>
                    <SunIcon className="text-yellow-600 h-6 w-6"/>
                    <Switch color="dark" onChange={setDarkTheme}/>
                    <MoonIcon className="text-gray-600 h-6 w-6"/>
                </NavbarSection>
            </Navbar>
        </header>
        <main className="px-4 py-6 sm:px-6 lg:px-8">
            {children}
        </main>
        </body>
        </html>
    )
}