import {Dialog, DialogActions, DialogBody, DialogDescription, DialogTitle} from "@/components/dialog";
import {Field, Label} from "@/components/fieldset";
import {Input} from "@/components/input";
import {Button} from "@/components/button";
import {Dispatch, SetStateAction, useContext, useEffect, useState} from "react";
import axios from "@/lib/axios";
import {Checkbox} from "@/components/checkbox";
import LoggedContext from "@/app/context";

interface EditFormsProps {
    showPlayerForm: boolean,
    setShowPlayerForm: Dispatch<SetStateAction<boolean>>
    player: Player | undefined,
    setReload: Dispatch<SetStateAction<boolean>>
}

interface Player {
    id: number;
    name: string;
    is_monthly: boolean;
}

export default function PlayerForm(
    {
        showPlayerForm,
        setShowPlayerForm,
        player,
        setReload
    }: EditFormsProps
) {
    const [name, setName] = useState<string>("");
    const [isMonthly, setIsMonthly] = useState<boolean>(false);

    const {user, setUser} = useContext(LoggedContext);

    useEffect(() => {
        setName(player?.name ?? "")
        setIsMonthly(player?.is_monthly ?? false)
    }, [player]);

    function handleForm() {
        if (!user) {
            return;
        }

        if (!player) {
            axios.post(
                `/player`,
                {
                    name: name,
                    is_monthly: isMonthly,
                },
                {
                    headers: {
                        Authorization: `Bearer ${user.token}`
                    }
                }
            )
                .then(
                    () => {
                        setName("")
                        setIsMonthly(false)
                        setReload(true)
                        setShowPlayerForm(false)
                    }
                )
                .catch(
                    err => {
                        if (err.response?.status === 401) {
                            setUser(null)
                        }
                    }
                )

            return
        }

        axios.patch(
            `/player/${player.id}`,
            {
                name: name,
                is_monthly: isMonthly,
            },
            {
                headers: {
                    Authorization: `Bearer ${user.token}`
                }
            }
        ).then(
            () => {
                setName("")
                setIsMonthly(false)
                setReload(true)
                setShowPlayerForm(false)
            }
        )
    }

    function handleCancel() {
        setName("")
        setIsMonthly(false)
        setShowPlayerForm(false)
    }

    return (
        <Dialog open={showPlayerForm} onClose={setShowPlayerForm}>
            <DialogTitle>Player form</DialogTitle>
            <DialogDescription>
                Inform the name and if is monthly
            </DialogDescription>
            <DialogBody>
                <Field>
                    <Label>Name</Label>
                    <Input name="name" type="text" value={name} onChange={e => setName(e.target.value)} autoFocus/>
                </Field>
                <Field>
                    <Label className="mr-2">Is Monthly ?</Label>
                    <Checkbox checked={isMonthly} color="green" onChange={() => setIsMonthly(!isMonthly)}/>
                </Field>
            </DialogBody>
            <DialogActions>
                <Button plain onClick={handleCancel}>
                    Cancel
                </Button>
                <Button onClick={handleForm}>Save</Button>
            </DialogActions>
        </Dialog>
    );
}