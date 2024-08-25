'use client'

import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/table";
import {ChangeEvent, useContext, useEffect, useState} from "react";
import axios from "@/lib/axios";
import {Checkbox} from "@/components/checkbox";
import {Field, FieldGroup, Label} from "@/components/fieldset";
import {Input} from "@/components/input";
import {PencilSquareIcon, PlusIcon, TrashIcon} from "@heroicons/react/16/solid";
import {Button} from "@/components/button";
import AddStatistics from "@/components/personal/add-statistics";
import PlayerForm from "@/components/personal/player-form";
import LoggedContext from "@/app/context";
import {Heading} from "@/components/heading";

interface Player{
    id: number;
    name: string;
    is_monthly: boolean;
    goals: number;
    assists: number;
}

interface Players {
    players: Player[];
}

export default function PlayersIndex() {
    const [players, setPlayers] = useState<Player[]>([]);
    const [name, setName] = useState<string>("");
    const [showAddStatics, setShowAddStatics] = useState<boolean>(false);
    const [showPlayerForm, setShowPlayerForm] = useState<boolean>(false);
    const [editFormType, setEditFormType] = useState<string>("");
    const [player, setPlayer] = useState<Player|undefined>(undefined);
    const [reload, setReload] = useState<boolean>(false);
    const { user, setUser } = useContext(LoggedContext)

    useEffect(() => {
        if (reload) {
            setReload(false)
        }
        const timeOutId = setTimeout(
            () => axios.get<Players>(`/players`, {
                params: {
                    name: name
                }
            })
                .then(res => setPlayers(res.data.players)),
            1000
        );
        return () => clearTimeout(timeOutId);
    }, [name, reload]);

    const handleSearchByName = (event: ChangeEvent<HTMLInputElement>) => {
        setName(event.target.value);
    }

    const handleDelete = (playerId: number, playerName: string) => {
        if (!user) {
            return;
        }

        const canDelete = confirm(`Do you really wanna delete ${playerName.toUpperCase()}`)

        if (canDelete) {
            axios.delete(
                `/player/${playerId}`,
                {
                    headers: {
                        Authorization: `Bearer ${user.token}`
                    }
                }
            )
                .then(() => setReload(true))
                .catch(
                    err => {
                        if (err.response?.status === 401) {
                            setUser(null)
                        }
                    }
                )
        }
    }

    if (!user) {
        return (
            <Heading level={1}>
                Not logged in
            </Heading>
        )
    }

    return (
        <>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <FieldGroup>
                    <Field className="mb-4">
                        <Label>Search by name</Label>
                        <Input onChange={handleSearchByName}/>
                    </Field>
                </FieldGroup>
                <FieldGroup className="flex justify-center">
                    <Button color="green" onClick={() => {
                        setPlayer(undefined)
                        setShowPlayerForm(true)
                    }}>
                        Add player
                        <PlusIcon/>
                    </Button>
                </FieldGroup>
            </div>
            <div className="grid grid-cols-1 gap-4">
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableHeader className="text-left">Name:</TableHeader>
                            <TableHeader className="text-center">Goals:</TableHeader>
                            <TableHeader className="text-center">Assists:</TableHeader>
                            <TableHeader className="text-center">Is Monthly:</TableHeader>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {players.map((player) => (
                            <TableRow key={player.id}>
                                <TableCell className="font-medium grid grid-cols-1 sm:grid-cols-2">
                                    {player.name.toUpperCase()}
                                    <div className="flex justify-around">
                                        <Button color="blue" onClick={() => {
                                            setPlayer(player)
                                            setShowPlayerForm(true)
                                        }}>
                                            <PencilSquareIcon />
                                        </Button>
                                        <Button color="red" onClick={() => handleDelete(player.id, player.name)}>
                                            <TrashIcon />
                                        </Button>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <Button className="w-full" onClick={() => {
                                        setShowAddStatics(true)
                                        setEditFormType("goals")
                                        setPlayer(player)
                                    }}>
                                        {player.goals}
                                        <PencilSquareIcon />
                                    </Button>
                                </TableCell>
                                <TableCell>
                                    <Button className="w-full" onClick={() => {
                                        setShowAddStatics(true)
                                        setEditFormType("assists")
                                        setPlayer(player)
                                    }}>
                                        {player.assists}
                                        <PencilSquareIcon />
                                    </Button>
                                </TableCell>
                                <TableCell className="text-center">
                                    <Checkbox checked={player.is_monthly} color="green"/>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
            <AddStatistics showEditForm={showAddStatics} setShowEditForm={setShowAddStatics} type={editFormType} player={player} setReload={setReload} />
            <PlayerForm showPlayerForm={showPlayerForm} setShowPlayerForm={setShowPlayerForm} player={player} setReload={setReload} />
        </>
    );
}