'use client'

import {Field, FieldGroup, Fieldset, Label, Legend} from "@/components/fieldset";
import {Input} from "@/components/input";
import {useContext, useState} from "react";
import {Button} from "@/components/button";
import LoggedContext from "@/app/context";
import {useRouter} from "next/navigation";

export default function Login() {
    const [login, setLogin] = useState("");
    const [password, setPassword] = useState("");
    const router = useRouter();

    const loginValid = process.env.NEXT_PUBLIC_LOGIN;
    const passwordValid = process.env.NEXT_PUBLIC_PASSWORD;

    const {logged, setLogged} = useContext(LoggedContext);

    const handleLogin = () => {
        if (logged) {
            return;
        }

        if (login == loginValid && password == passwordValid) {
            setLogged(true);
            router.push("/players")
            return
        }

        setLogged(false);
    }

    return (
        <Fieldset>
            <Legend>
                Login for editing
            </Legend>
            <FieldGroup>
                <Field>
                    <Label>Login</Label>
                    <Input value={login} onChange={(e) => setLogin(e.target.value)}/>
                </Field>
                <Field>
                    <Label>Password</Label>
                    <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)}/>
                </Field>
            </FieldGroup>
            <FieldGroup>
                <Button color="green" onClick={() => handleLogin()}>
                    Login
                </Button>
            </FieldGroup>
        </Fieldset>
    );
}
