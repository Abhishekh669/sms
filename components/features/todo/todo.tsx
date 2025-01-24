"use client"

import React, { useCallback, useState } from 'react'
import { Todo as todo_type} from '@prisma/client'
import { DataKanban } from './data-kanban'
import { TaskStatus } from '@/schemas';
import { useBulkUpdateTodo } from '@/utils/hooks/mutate-hooks/todos/use-bulk-update-todo';


interface TodoDataProps{
    todos : todo_type[];
}
function Todo({todos} : TodoDataProps) {
  const {mutate : bulk_update_todo} = useBulkUpdateTodo();
      const onKanbanChange = useCallback((
        tasks : {id : string; state : TaskStatus; position : number;}[],
      )=>{
            bulk_update_todo(tasks)        
      },[bulk_update_todo])
  return (
    <div>
      <DataKanban data={todos} onChange={onKanbanChange}/>
    </div>
  )
}

export default Todo
