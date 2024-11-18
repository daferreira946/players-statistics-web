'use client'

import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/table";
import {Input} from "@/components/input";
import {Heading} from "@/components/heading";
import {ChangeEvent, useContext, useEffect, useState} from "react";
import LoggedContext from "@/app/context";
import {Button} from "@/components/button";
import {TrashIcon} from "@heroicons/react/16/solid";
import {Field, Fieldset, Label} from "@/components/fieldset";
import {Select} from "@/components/select";
import axios from "@/lib/axios";
import {useRouter} from "next/navigation";
import {getCompleteDate} from "@/helper/date-formatter";

interface Player {
    id: number;
    name: string;
    is_monthly: boolean;
    goals: number;
    assists: number;
}

interface Players {
    players: Player[];
}

interface Stat {
    name: string,
    goals: number,
    assists: number
}

export default function Sheet() {
    const formatedDateDefault = getCompleteDate()
    const {user} = useContext(LoggedContext);
    const [players, setPlayers] = useState<Player[]>([]);
    const [statsToSave, setStatsToSave] = useState<Stat[]>(() => {
        const saved = localStorage.getItem("stats")
        if (!saved) {
            return [];
        }
        const initialValue = JSON.parse(saved)
        return initialValue || []
    });
    const [date, setDate] = useState<string>(formatedDateDefault);
    const router = useRouter();

    useEffect(() => {
        axios.get<Players>(`/players`)
            .then(res => setPlayers(res.data.players))
    }, []);

    useEffect(() => {
        localStorage.setItem("stats", JSON.stringify(statsToSave));
    }, [statsToSave]);

    if (!user) {
        return (
            <Heading level={1}>
                Not logged in
            </Heading>
        )
    }

    function handleSelected(value: string) {
        let alreadyExists = false;

        if (!value) {
            return;
        }

        statsToSave.map((item) => {
            if (item.name == value) {
                alreadyExists = true;
            }
        })

        if (alreadyExists) {
            return;
        }

        const stat: Stat = {
            name: value,
            assists: 0,
            goals: 0
        };

        setStatsToSave([...statsToSave, stat]);
    }

    function handleDeleted(value: string) {
        const canDelete = confirm(`Do you really wanna delete ${value.toUpperCase()}`);
        if (!canDelete) {
            return;
        }

        setStatsToSave(
            statsToSave => statsToSave.filter(item =>
                item.name != value
            )
        );
    }

    function handleStatChange(
        event: ChangeEvent<HTMLInputElement>,
        stat: Stat,
        field: keyof Stat
    ) {
        const value = event.target.value;
        setStatsToSave(
            statsToSave => statsToSave.map(item =>
                item.name == stat.name ? {...item, [field]: parseInt(value)} : item
            )
        );
    }

    function handleSaveSheet() {
        if (!user) {
            return;
        }

        axios.post(
            '/sheet',
            {
                "date": date,
                "stats": statsToSave
            },
            {
                headers: {
                    Authorization: `Bearer ${user.token}`
                }
            }
        ).then(
            () => {
                localStorage.removeItem("stats")
                router.push("/")
            }
        );
    }

    return (
        <>
            <Fieldset className="my-5">
                <Field>
                    <Label>Player</Label>
                    <Select defaultValue="" onChange={(e) => handleSelected(e.target.value)}>
                        <option selected label={"Select the player"}/>
                        {
                            players.map((player, index) => (
                                <option key={index}>{player.name}</option>
                            ))
                        }
                    </Select>
                </Field>
            </Fieldset>
            <Table className="my-5">
                <TableHead>
                    <TableRow>
                        <TableHeader>Name</TableHeader>
                        <TableHeader>Goals</TableHeader>
                        <TableHeader>Assists</TableHeader>
                        <TableHeader>Delete</TableHeader>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {
                        statsToSave.map((player, index) => (
                            <TableRow key={index}>
                                <TableCell>
                                    <Input value={player.name} readOnly/>
                                </TableCell>
                                <TableCell>
                                    <Input type={"number"} min={0} value={player.goals}
                                           onChange={(e) => handleStatChange(e, player, 'goals')}/>
                                </TableCell>
                                <TableCell>
                                    <Input type={"number"} min={0} value={player.assists}
                                           onChange={(e) => handleStatChange(e, player, 'assists')}/>
                                </TableCell>
                                <TableCell>
                                    <Button color="red" onClick={() => handleDeleted(player.name)}>
                                        <TrashIcon/>
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))
                    }
                </TableBody>
            </Table>
            <Fieldset className="grid grid-cols-1 lg:grid-cols-2 gap-4 my-5">
                <Field>
                    <Label>Date:</Label>
                    <Input type={"date"} value={date} onChange={(e) => setDate(e.target.value)}/>
                </Field>
                <Button color="green" onClick={() => handleSaveSheet()}>Save</Button>
            </Fieldset>
        </>
    );
}