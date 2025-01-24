"use client"
import Todo from '@/components/features/todo/todo';
import { useGetTodosById } from '@/utils/hooks/query-hooks/use-get-todos-by-id';
import { Loader } from 'lucide-react';
import React from 'react'

function TodoPage() {
  const {data :todos, isLoading : todos_loading } = useGetTodosById();
  return (
    <div className='w-full h-full p-2'>
        
        {todos_loading ? (
          <div className='w-full h-full flex items-center justify-center'>
              <Loader  className='size-5 animate-spin text-muted-foreground'/>
          </div>
        ) : (
          <>
          <Todo todos={todos?.todos}  />
          </>
        )}

    </div>
  )
}

export default TodoPage;
