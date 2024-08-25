import {Navbar, NavbarDivider, NavbarItem, NavbarSection} from "@/components/navbar";
import {Heading} from "@/components/heading";
import {MoonIcon, SunIcon} from "@heroicons/react/16/solid";
import {Switch} from "@/components/switch";
import {usePathname} from "next/navigation";
import {useContext} from "react";
import LoggedContext from "@/app/context";


interface Navigation {
    name: string,
    url: string,
    logged: boolean
}

const navigation: Navigation[] = [
    {
        name: "Top",
        url: "/",
        logged: false
    },
    {
        name: "Players",
        url: "/players",
        logged: true
    },
    {
        name: "Scores",
        url: "/scores",
        logged: false
    },
    {
        name: "Login",
        url: "/login",
        logged: false
    }
]

interface HeaderProps {
    setDarkTheme: (darkTheme: boolean) => void
}

export default function Header( {setDarkTheme}: HeaderProps ) {
    const pathname = usePathname();
    const {user} = useContext(LoggedContext);

    return (
        <header>
            <Navbar className="flex justify-around px-4 bg-gray-400 dark:bg-gray-800">
                <NavbarSection>
                    <Heading level={1}>
                        Dashboard
                    </Heading>
                </NavbarSection>
                <NavbarDivider/>
                <NavbarSection>
                    {navigation.map((item) => {
                        if (user || !!user == item.logged) {
                            return (
                                <NavbarItem key={item.name} href={item.url} current={pathname == item.url}>
                                    {item.name}
                                </NavbarItem>
                            )
                        }

                        return
                    })}
                </NavbarSection>
                <NavbarDivider/>
                <NavbarSection>
                    <SunIcon className="text-yellow-600 h-6 w-6"/>
                    <Switch color="dark" onChange={setDarkTheme}/>
                    <MoonIcon className="text-gray-600 h-6 w-6"/>
                </NavbarSection>
            </Navbar>
        </header>
    )
}