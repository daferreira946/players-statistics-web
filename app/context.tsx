import React, {createContext, useState} from "react";

type LoggedContextType = {
    logged: boolean;
    setLogged: (logged: boolean) => void;
}

const LoggedContext = createContext<LoggedContextType>({
    logged: false,
    setLogged: () => {}
});

export const LoggedProvider = ({children}: Readonly<{
    children: React.ReactNode;
}>) => {
    const [logged, setLogged] = useState(false);

    return (
        <LoggedContext.Provider value={{ logged, setLogged }}>
            { children }
        </LoggedContext.Provider>
    )
}

export default LoggedContext;