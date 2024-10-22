'use client'

import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/table";
import React, {ChangeEvent, useEffect, useState} from "react";
import axios from "@/lib/axios";
import {Checkbox} from "@/components/checkbox";
import {Field, Label} from "@/components/fieldset";
import {Input} from "@/components/input";
import { StarIcon } from "@heroicons/react/16/solid";
import {Switch} from "@/components/switch";
import {getYearMonthDate} from "@/helper/date-formatter";

interface TopPlayer{
    name: string;
    quantity: number;
    is_monthly: boolean;
    per_game: number;
}

interface Tops {
    top_assists: TopPlayer[];
    top_goals: TopPlayer[];
}

export default function PlayersIndex() {
    const formatedDateDefault = getYearMonthDate();
    const [tops, setTops] = useState<Tops>();
    const [limit, setLimit] = useState<number|null>(null);
    const [monthYear, setMonthYear] = useState<string|null>(formatedDateDefault);
    const [includeDiarist, setIncludeDiarist] = useState<boolean>(false);

    useEffect(() => {
        const timeOutId = setTimeout(
            () => axios.get<Tops>(`/top`, {
                params: {
                    limit: limit,
                    month_year: monthYear,
                    only_monthly: !includeDiarist
                }
            })
                .then(res => setTops(res.data)),
            500
        );
        return () => clearTimeout(timeOutId);
    }, [limit, monthYear, includeDiarist]);

    const handleChangeLimit = (event: ChangeEvent<HTMLInputElement>) => {
        setLimit(Number(event.target.value));
    }
    const handleChangeMonthYear = (event: ChangeEvent<HTMLInputElement>) => {
        setMonthYear(event.target.value);
    }

    return (
        <>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                <Field className="mb-4">
                    <Label>Limit</Label>
                    <Input type="number" max="10" onChange={handleChangeLimit}/>
                </Field>

                <Field className="mb-4">
                    <Label>Filter month</Label>
                    <Input type="month" onChange={handleChangeMonthYear} value={monthYear ? monthYear : ''}/>
                </Field>

                <Field className="mb-4">
                    <Label className="block">Include diarist</Label>
                    <Switch color="green" onChange={setIncludeDiarist}/>
                </Field>
            </div>
            <div className="grid lg:grid-cols-2 grid-cols-1 gap-4">
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableHeader>Name:</TableHeader>
                            <TableHeader className="text-center">Goals:</TableHeader>
                            <TableHeader className="text-center">Per Game:</TableHeader>
                            <TableHeader className="text-center">Is Monthly:</TableHeader>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {tops?.top_goals.map((topGoals, key) => (
                            <TableRow key={key}>
                                <TableCell className="font-medium flex justify-start">
                                    <StarIcon className={key == 0 ? 'h-6 w-6 mr-2 text-yellow-600' : key == 1 ? 'h-6 w-6 mr-2 text-gray-600' : key == 2 ? 'h-6 w-6 mr-2 text-orange-600' : 'hidden'} />
                                    {topGoals.name.toUpperCase()}
                                </TableCell>
                                <TableCell className="text-center">
                                    {topGoals.quantity}
                                </TableCell>
                                <TableCell className="text-center">
                                    {topGoals.per_game.toFixed(2)}
                                </TableCell>
                                <TableCell className="text-center">
                                    <Checkbox checked={topGoals.is_monthly} color="green"/>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableHeader>Name:</TableHeader>
                            <TableHeader className="text-center">Assists:</TableHeader>
                            <TableHeader className="text-center">Per Game:</TableHeader>
                            <TableHeader className="text-center">Is Monthly:</TableHeader>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {tops?.top_assists.map((topAssists, key) => (
                            <TableRow key={key}>
                                <TableCell className="font-medium flex justify-start">
                                    <StarIcon className={key == 0 ? 'h-6 w-6 mr-2 text-yellow-600' : key == 1 ? 'h-6 w-6 mr-2 text-gray-600' : key == 2 ? 'h-6 w-6 mr-2 text-orange-600' : 'hidden'} />
                                    {topAssists.name.toUpperCase()}
                                </TableCell>
                                <TableCell className="text-center">
                                    {topAssists.quantity}
                                </TableCell>
                                <TableCell className="text-center">
                                    {topAssists.per_game.toFixed(2)}
                                </TableCell>
                                <TableCell className="text-center">
                                    <Checkbox checked={topAssists.is_monthly} color="green" />
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </>
    );
}