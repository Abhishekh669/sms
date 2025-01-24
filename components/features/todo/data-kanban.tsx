import { Todo } from "@prisma/client";
import {
    DragDropContext,
    Droppable,
    Draggable,
    type DropResult,
    DraggableStateSnapshot
} from "@hello-pangea/dnd"
import { TaskStatus } from "@/schemas";
import { useCallback, useEffect, useState } from "react";
import KanbanColumnHeader from "./kanban-column-header";
import KanbanCard from "./kanban-card";

interface DataKanbanProps{
    data : Todo[],
    onChange : (task : {id : string, state : TaskStatus, position : number}[]) => void
}

const boards : TaskStatus[] = [
    TaskStatus.PENDING,
    TaskStatus.ONGOING,
    TaskStatus.DONE
];

type TaskState = {
    [key in TaskStatus] : Todo[]
}

export const DataKanban = ({data, onChange} : DataKanbanProps) =>{
    const [tasks, setTasks] = useState<TaskState>(()=>{
        const initialTasks : TaskState = {
            [TaskStatus.PENDING] :  [],
            [TaskStatus.ONGOING] :  [],
            [TaskStatus.DONE] :  [],
        };
        data?.forEach((task) =>{
            initialTasks[task.state].push(task);
        });
        Object?.keys(initialTasks)?.forEach((state)=> {
            initialTasks[state as TaskStatus].sort((a,b)=> a.position - b.position)
        });
        return initialTasks;
    })

    useEffect(()=>{
        const newTasks : TaskState = {
            [TaskStatus.PENDING] :  [],
            [TaskStatus.ONGOING] :  [],
            [TaskStatus.DONE] :  [],
        };
        data?.forEach((task) =>{
            newTasks[task.state].push(task);
        });
        Object?.keys(newTasks)?.forEach((state)=> {
            newTasks[state as TaskStatus].sort((a,b)=> a.position - b.position)
        });
        setTasks(newTasks);
    },[data])

    const onDragEnd=useCallback((result : DropResult)=>{
        if(!result.destination) return;
        const {source, destination} = result;
        const sourceStatus = source.droppableId as TaskStatus;
        const destStatus = destination.droppableId as TaskStatus;
        let updatedPayload : {id : string, state : TaskStatus, position : number}[] = [];
        setTasks((prevTasks) =>{
            const newTasks = {...prevTasks};
            //safely remov the task from the source column
            const sourceColumn = [...newTasks[sourceStatus]];
            const [movedTask] = sourceColumn.splice(source.index,1);
            //if no moved task found 
            if(!movedTask){
                console.error("No task found")
                return prevTasks;
            }

            //crate a new task object iwth updated stastu
            const updateMovedTask= sourceStatus !== destStatus
                ? {...movedTask, state: destStatus}
                : movedTask;
                //updating hte srouce column
            newTasks[sourceStatus] = sourceColumn;

            //adding the task to the destinatio ncolumn 
            const destColumn = [...newTasks[destStatus]];
            destColumn.splice(destination.index,0, updateMovedTask)
            newTasks[destStatus] = destColumn;

            //minimum update payload

            updatedPayload = [];


            //always update the move task 
            updatedPayload.push({
                id : updateMovedTask.id,
                state : destStatus,
                position : Math.min((destination.index + 1) * 1000, 1_000_000)

            })


            //update position   for affected task in the destinatio ncolum
            newTasks[destStatus].forEach((task,index)=>{
                if(task && task.id !== updateMovedTask.id){
                    const newPosition = Math.min((index + 1) * 1000, 1_000_000);
                    if(task.position !== newPosition){
                        updatedPayload.push({
                            id : task.id,
                            state : destStatus,
                            position : newPosition
                        });

                    }

                }
            });

            if(sourceStatus !== destStatus){
                newTasks[sourceStatus].forEach((task,index)=>{
                    if(task){
                        const newPosition = Math.min((index + 1)* 1000, 1_000_000);
                        if(task.position !== newPosition){
                            updatedPayload.push({
                                id : task.id,
                                state : sourceStatus,
                                position : newPosition
                            });
                        }
                    }
                })
            }

            return newTasks;




        });

    onChange(updatedPayload);

    },[onChange])
    console.log("tasks : ",tasks)
    return (
       <div className="flex justify-center pt-10   h-full">
        <DragDropContext
        onDragEnd={onDragEnd}
       >
        <div className="flex w-full">
            {boards.map((board) =>(
                <div
                    key={board}
                    className=" flex-1 mx-2 bg-muted px-2 py-3"
                >
                    <div>
                    <KanbanColumnHeader
                        board={board}
                        todoCount={tasks[board].length}
                    />
                    </div>
                    <Droppable
                        droppableId={board}       
                    >
                        {(provided)=>(
                            <div 
                                className="   flex flex-col gap-y-4 pt-3"
                                {...provided.droppableProps}
                                ref={provided.innerRef}

                            >
                            {tasks[board].map((task,index) =>(
                                <Draggable
                                    key={task.id}
                                    draggableId={task.id}
                                    index={index}
                                >
                                    {(provided,
                                        dragSnapshot: DraggableStateSnapshot
                                    )=>(
                                        <div
                                            {...provided.dragHandleProps}
                                            {...provided.draggableProps}
                                            ref={provided.innerRef}
                                        >
                                            <KanbanCard task={task} isDragging={dragSnapshot.isDragging}/>
                                        </div>
                                    )}
                                </Draggable>
                            ))}
                            {provided.placeholder}
                            </div>
                        )}
                    </Droppable>
                </div>
            ))}

        </div>


       </DragDropContext>
       </div>
    )
}