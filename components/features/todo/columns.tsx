"use client"

import { Todo } from "@prisma/client";
import {ColumnDef} from "@tanstack/react-table"

export const columns : ColumnDef<Todo>[] = [
    {
        accessorKey : "name",
        header : "Todo Name"

    },
];

