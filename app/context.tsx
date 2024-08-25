import React, {createContext, useState} from "react";
import {UserDTO} from "@/types/UserDTO";

type LoggedContextType = {
    user: UserDTO | null;
    setUser: (user: UserDTO | null) => void;
}

const LoggedContext = createContext<LoggedContextType>({
    user: null,
    setUser: () => {}
});

export const LoggedProvider = ({children}: Readonly<{
    children: React.ReactNode;
}>) => {
    const [user, setUser] = useState<UserDTO|null>(null);

    return (
        <LoggedContext.Provider value={{ user, setUser }}>
            { children }
        </LoggedContext.Provider>
    )
}

export default LoggedContext;