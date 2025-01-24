import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { Edit, Trash } from "lucide-react";
import { Todo } from "@prisma/client";
import { Separator } from "@/components/ui/separator";
import EditOptionTodo from "./edit-option-todo";

interface EditTodoProps{
    openEdit : boolean;
    onClose : () => void;
    todo : Todo;
}


function EditTodo({
    openEdit,
    onClose,
    todo
} : EditTodoProps) {
    const [deleteOpen, setDeleteOpen] = useState();
    const [editOption, setEditOption] = useState(false);
    const [ConfirmDialog, confirm] = useConfirm(

      "Are you sure?",
      "This action is irreversible"
    );
  return (

<>
<ConfirmDialog />/
<EditOptionTodo todo={todo} editOption={editOption} onClose={()=> setEditOption(false)}/>
<Dialog open={openEdit} onOpenChange={onClose}>
      <DialogContent>
        <DialogTitle>Options</DialogTitle>
        <div className="flex flex-col gap-y-2">
          <div className="cursor-pointer flex justify-between hover:text-muted-foreground hover:bg-gray-200 p-2 rounded-md"
            onClick={() => setEditOption(true)}
          >
            Edit
            <Edit />
          </div>
          <Separator className="bg-black/40" />
          <div className="cursor-pointer flex justify-between text-red-400 hover:text-muted-foreground hover:bg-red-200 p-2 rounded-md hover:text-red-400 ">
            <button>
            Delete
            <Trash />
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
</>
    
  );
}

export default EditTodo;



                  