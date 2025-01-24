import { Separator } from "@/components/ui/separator";
import { Todo } from "@prisma/client";
import React, { useState } from "react";
import { format } from "date-fns";
import { CalendarIcon, Ellipsis } from "lucide-react";
import Hint from "../Hint";
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import EditTodo from "./edit-todo";

interface KanbanCardProps {
  task: Todo;
  isDragging: boolean;
}

function KanbanCard({ task, isDragging }: KanbanCardProps) {
  const [openEdit, setOpenEdit] = useState(false);
  return (
    <>
      <EditTodo  todo={task} openEdit={openEdit} onClose={()=>setOpenEdit(false)}/>
      <Card
      className={cn("px-2 pt-6 flex flex-col", isDragging && "bg-gray-100")}
    >
      <CardContent className="flex flex-col   gap-y-2">
        <CardTitle className="flex justify-between items-center">
          <span>{task.title}</span>
          <span>
           <Ellipsis className="size-5 text-muted-foreground" onClick={() => setOpenEdit(true)}/>
          </span>
        </CardTitle>
        <Separator />
        <CardDescription>{task.description}</CardDescription>
        <Separator />
        <div className="flex justify-between ">
          <Hint
            label={`${format(task.date, "yyyy-M-d")} ${format(task.date, "p")}`}
          >
            <div className="flex h-6 items-center gap-2 ">
              <CalendarIcon className="text-slate-500 size-4" />
              <CardDescription>{format(task.date, "yyyy-M-d")}</CardDescription>
            </div>
          </Hint>
          <CardDescription
            className={cn(
              "roudned-md p-0.5 rounded-sm ",
              task.tag === "HIGH" && "text-red-500 bg-red-50",
              task.tag === "LOW" && "text-green-500 bg-green-50",
              task.tag === "MEDIUM" && "text-yellow-500 bg-yellow-50"
            )}
          >
            <span className="text-xs">{task.tag}</span>
          </CardDescription>
        </div>
      </CardContent>
    </Card>
    </>
  );
}

export default KanbanCard;


