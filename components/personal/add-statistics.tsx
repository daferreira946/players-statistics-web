import {Dialog, DialogActions, DialogBody, DialogDescription, DialogTitle} from "@/components/dialog";
import {Field, Label} from "@/components/fieldset";
import {Input} from "@/components/input";
import {Button} from "@/components/button";
import {Dispatch, SetStateAction, useContext, useState} from "react";
import axios from "@/lib/axios";
import LoggedContext from "@/app/context";

interface EditFormsProps {
    showEditForm: boolean,
    setShowEditForm: Dispatch<SetStateAction<boolean>>
    type: string,
    player: Player | undefined,
    setReload: Dispatch<SetStateAction<boolean>>
}

interface Player {
    id: number;
    name: string;
    is_monthly: boolean;
}

export default function AddStatistics(
    {
        showEditForm,
        setShowEditForm,
        type,
        player,
        setReload
    }: EditFormsProps
) {
    const dateDefault = new Date();
    const formatedDateDefault = `${dateDefault.getFullYear()}-${(dateDefault.getMonth() + 1).toString().padStart(2, '0')}-${dateDefault.getDate().toString().padStart(2, '0')}`
    const [quantity, setQuantity] = useState<number>(1);
    const [date, setDate] = useState<string>(formatedDateDefault);

    const {user, setUser} = useContext(LoggedContext);

    function handleForm() {

        if (!user) {
            return;
        }

        if (!player) {
            setShowEditForm(false)
            return
        }

        axios.post(
            `/player/${player.id}/${type == "goals" ? "addGoal" : type == "assists" ? "addAssist" : ""}`,
            {
                quantity: quantity,
                date: date,
            },
            {
                headers: {
                    Authorization: `Bearer ${user.token}`
                }
            }
        ).then(
            () => {
                setQuantity(1)
                setDate(formatedDateDefault)
                setReload(true)
                setShowEditForm(false)
            }
        )
            .catch(
                err => {
                    if (err.response?.status === 401) {
                        setUser(null)
                    }
                }
            )
    }

    function handleCancel() {
        setQuantity(1)
        setDate(formatedDateDefault)
        setShowEditForm(false)
    }

    return (
        <Dialog open={showEditForm} onClose={setShowEditForm}>
            <DialogTitle>Add {type == 'goals' ? 'Goals' : type == 'assists' ? 'Assists' : ''}</DialogTitle>
            <DialogDescription>
                Inform the quantity and the date
            </DialogDescription>
            <DialogBody>
                <Field>
                    <Label>Quantity</Label>
                    <Input name="quantity" placeholder="1" type="number" value={quantity}
                           onChange={e => setQuantity(Number(e.target.value))} autoFocus/>
                </Field>
                <Field>
                    <Label>Date</Label>
                    <Input name="date" type="date" value={date} onChange={e => setDate(e.target.value)} autoFocus/>
                </Field>
            </DialogBody>
            <DialogActions>
                <Button plain onClick={handleCancel}>
                    Cancel
                </Button>
                <Button onClick={handleForm}>Add</Button>
            </DialogActions>
        </Dialog>
    );
}