'use client'

import {Field, FieldGroup, Fieldset, Label, Legend} from "@/components/fieldset";
import {Input} from "@/components/input";
import {useContext, useState} from "react";
import {Button} from "@/components/button";
import LoggedContext from "@/app/context";
import {useRouter} from "next/navigation";
import axios from "@/lib/axios";
import { decodeJwt } from "jose";

interface TokenInterface {
    exp: string;
    username: string;
    id: string;
}

export default function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const router = useRouter();

    const {user, setUser} = useContext(LoggedContext);

    const handleLogin = async () => {
        if (user) {
            return;
        }

        const res = await axios.post(`/user/login`, {
            username: username,
            password: password,
        });

        const decoded = decodeJwt(res.data.token);
        console.log(decoded);

        if (res.data.token) {
            const decoded = decodeJwt<TokenInterface>(res.data.token);
            setUser({
                username: decoded.username,
                id: decoded.id,
                token: res.data.token
            });
            router.push("/players")
            return
        }

        setUser(null);
    }

    return (
        <Fieldset>
            <Legend>
                Login for editing
            </Legend>
            <FieldGroup>
                <Field>
                    <Label>Login</Label>
                    <Input value={username} onChange={(e) => setUsername(e.target.value)}/>
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
