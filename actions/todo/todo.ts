"use server"
import * as z from "zod"
import {prisma} from "@/lib/prisma"
import { get_current_user, get_logged_user } from "../users/users"
import { TaskStatus, TaskTag, todoSchema } from "@/schemas"
import { describe } from "node:test"


export const create_todo = async(values : z.infer<typeof todoSchema>)=>{
    console.log(values)
    try {
        const current_user = await get_current_user();
        if(!current_user?.id || !current_user?.email){
            throw new Error("Unauthorized")
        }

        const highest_position_task = await prisma.todo.findFirst({
            where : {
                state : values.state,
                userId : current_user?.id
            },
            orderBy : {
                position : 'desc'
            }
        }) || undefined;

        const new_position = highest_position_task === undefined ? 1000 :  highest_position_task.position + 1000 ;

        const new_todo = await prisma.todo.create({
            data : {
                 title : values.title,
                 description : values.description,
                 state : values.state || "PENDING",
                 tag : values.tag || "LOW",
                 userId : current_user?.id,
                 position : new_position ,
            }
        });
        if(!new_todo){
            return {error : "Failed to create new todo"}
        }
        await prisma.user.update({
            where : {id :  current_user?.id},
            data : {
                todoIds : {
                    push : new_todo.id
                }
            }
        })
        return {
            message : "Successfully created todo",
            todo : JSON.stringify(new_todo)
        }
    } catch (error) {
        return {
            error :  "Failed to create error"
        }
    }
    
}


export const get_todos_by_id = async() =>{
    try {
        const current_user = await get_current_user();
        if(!current_user?.id || !current_user?.email){
            throw new Error("Unauthorized")
        }
        // const todos = await prisma.user.findUnique({
        //     where : { id : current_user?.id},
        //     include : {
        //         todos : true
        //     }
        // })

        const todos = await prisma.todo.findMany({
            where : {
                userId : current_user?.id
            }
        })
        console.log("this is the new todos",todos);
        
        return {
            message : "got todods",
            todos : JSON.stringify(todos)
        }
    } catch (error) {
        return {
            errror : "Failed to get todos"
        }
        
    }
}



export const bulk_update = async(tasks : {id : string; state : TaskStatus; position : number}[]) =>{
    try {
        const current_user = await get_current_user();
        if(!current_user?.id || !current_user?.email){
            throw new Error("Unauthorized");
        }
        
        
        const updated_task = await Promise.all(
            tasks.map(async(task) =>{
                const {id, state, position} = task;
                return await prisma.todo.update({
                    where : { id},
                    data : {
                        state,
                        position
                    }
                })
            })
        );
        return {
            message : "updated successfully",
            bulk_update : JSON.stringify(updated_task)
        }
    } catch (error) {
        return {error : "Something went wrong"}
        
    }
}


interface update_todo_props{
    title : string,
    description : string,
    tag : TaskTag.HIGH | TaskTag.LOW | TaskTag.MEDIUM;
    state : TaskStatus.DONE | TaskStatus.ONGOING | TaskStatus.PENDING,
    id : string
}

export const update_todo = async(values : update_todo_props) =>{
    try {
        const current_user = await get_current_user();
        if(!current_user?.id || !current_user?.email){
            throw new Error ("Unauthrized")
        }
        const check_existence = await prisma.todo.findUnique({
            where : {id : values.id}
        });

        if(!check_existence){
            return {error : "No any todo present"}
        }
        const update_todo = await prisma.todo.update({
            where : {id : values.id},
            data : {
                title : values.title,
                description : values.description,
                tag : values.tag,
                state : values.state,
                date : new Date()
            }
        });
        if(!update_todo){
            return {error : "Failed to update the todo"}
        }
        return {
            message : "Successfully updated todo",
            updated_todo : update_todo
        }
    } catch (error) {
        return {error : "Failed to update the todo"}
        
    }

}