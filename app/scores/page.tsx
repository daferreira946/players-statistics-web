'use client'

import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/table";
import {ChangeEvent, useEffect, useState} from "react";
import axios from "@/lib/axios";
import {Field, Label} from "@/components/fieldset";
import {Input} from "@/components/input";
import {Heading} from "@/components/heading";
import {getYearMonthDate} from "@/helper/date-formatter";

interface Score {
    quantity: number;
    date: string;
    player_name: string;
}

interface AssistData {
    assists: Score[]
}

interface GoalData {
    goals: Score[]
}

export default function PlayersIndex() {
    const formatedDateDefault = getYearMonthDate();
    const [assists, setAssists] = useState<Score[]>();
    const [goals, setGoals] = useState<Score[]>();
    const [monthYear, setMonthYear] = useState<string|null>(formatedDateDefault);

    useEffect(() => {
        const timeOutId = setTimeout(
            function () {
                axios.get<AssistData>(`/assists`, {
                    params: {
                        month_year: monthYear
                    }
                })
                    .then(res => setAssists(res.data.assists))

                axios.get<GoalData>(`/goals`, {
                    params: {
                        month_year: monthYear
                    }
                })
                    .then(res => setGoals(res.data.goals))
            },
            1000
        );
        return () => clearTimeout(timeOutId);
    }, [monthYear]);

    const handleChangeMonthYear = (event: ChangeEvent<HTMLInputElement>) => {
        setMonthYear(event.target.value);
    }

    return (
        <>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <Field className="mb-4">
                    <Label>Filter month</Label>
                    <Input type="month" onChange={handleChangeMonthYear} value={monthYear ? monthYear : ''}/>
                </Field>
            </div>
            <div className="grid lg:grid-cols-2 grid-cols-1 gap-4">
                <div>
                    <Heading level={2}>Goals</Heading>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableHeader>Name:</TableHeader>
                                <TableHeader className="text-center">Quantity:</TableHeader>
                                <TableHeader className="text-center">Date:</TableHeader>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {goals?.map((item, index) => (
                                <TableRow key={index}>
                                    <TableCell className="font-medium flex justify-start">
                                        {item.player_name.toUpperCase()}
                                    </TableCell>
                                    <TableCell className="text-center">
                                        {item.quantity}
                                    </TableCell>
                                    <TableCell className="text-center">
                                        {item.date}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
                <div>
                    <Heading level={2}>Assists</Heading>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableHeader>Name:</TableHeader>
                                <TableHeader className="text-center">Quantity:</TableHeader>
                                <TableHeader className="text-center">Date:</TableHeader>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {assists?.map((item, index) => (
                                <TableRow key={index}>
                                    <TableCell className="font-medium flex justify-start">
                                        {item.player_name.toUpperCase()}
                                    </TableCell>
                                    <TableCell className="text-center">
                                        {item.quantity}
                                    </TableCell>
                                    <TableCell className="text-center">
                                        {item.date}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </div>
        </>
    );
}