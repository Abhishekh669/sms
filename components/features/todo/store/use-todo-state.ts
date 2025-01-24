import { TaskStatus } from "@/schemas";
import {atom, useAtom} from "jotai"



const modalState = atom<TaskStatus>(TaskStatus.PENDING)

export const useTodoState = () =>{
    return useAtom(modalState);
}