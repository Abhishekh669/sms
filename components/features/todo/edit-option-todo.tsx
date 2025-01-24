import React from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import { editSchema, TaskStatus, TaskTag, todoSchema } from "@/schemas";
import { Todo } from "@prisma/client";
import { useUpdateTodo } from "@/utils/hooks/mutate-hooks/todos/use-update-todo";

interface EditOptionTodoProps {
  todo: Todo;
  editOption: boolean;
  onClose: () => void;
}

function EditOptionTodo({ editOption, onClose, todo }: EditOptionTodoProps) {
  const { mutate: update_todo, isPending: todoLoading } = useUpdateTodo();
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<z.infer<typeof editSchema>>({
    resolver: zodResolver(editSchema),
    defaultValues: {
      title: todo.title,
      description: todo.description,
      tag: todo.tag,
      state: todo.state,
    },
  });

  const onSubmit = async (values: z.infer<typeof editSchema>) => {
    if (
      values.title == todo.title &&
      values.description == todo.description &&
      values.state == todo.state &&
      values.tag == todo.tag
    ) {
      toast.error("Please do some change to update");
      return;
    }
    update_todo(
      {
        id: todo.id,
        title: values.title,
        description: values.description,
        tag: values.tag as TaskTag,
        state: values.state as TaskStatus,
      },
      {
        onSuccess: (res) => {
          if (res.message && res.updated_todo) {
            toast.success(res.message || "Updated Successfully");
            reset();
            onClose();
          } else {
            toast.error(res.message || "Failed to update todo");
          }
        },
        onError: () => {
          toast.error("Failed to update todo");
        },
      }
    );
  };
  return (
    <div>
      <Dialog open={editOption} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add Todo</DialogTitle>
            <DialogDescription>
              Keep track of your daily tasks
            </DialogDescription>
          </DialogHeader>
          <div>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Title
                </label>
                <Input
                  placeholder="Enter title"
                  {...register("title")}
                  disabled={todoLoading}
                />
                {errors.title && (
                  <p className="text-sm text-red-500">{errors.title.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Description
                </label>
                <Textarea
                  placeholder="Enter description"
                  {...register("description")}
                  disabled={todoLoading}
                />
                {errors.description && (
                  <p className="text-sm text-red-500">
                    {errors.description.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Tag
                </label>
                <Select
                  onValueChange={(value: TaskTag) => setValue("tag", value)}
                  defaultValue={todo.tag}
                  disabled={todoLoading}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={TaskTag.HIGH}>High</SelectItem>
                    <SelectItem value={TaskTag.MEDIUM}>Medium</SelectItem>
                    <SelectItem value={TaskTag.LOW}>Low</SelectItem>
                  </SelectContent>
                </Select>
                {errors.tag && (
                  <p className="text-sm text-red-500">{errors.tag.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Status
                </label>
                <Select
                  onValueChange={(value: TaskStatus) =>
                    setValue("state", value)
                  }
                  defaultValue={todo.state}
                  disabled={todoLoading}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={TaskStatus.PENDING}>Pending</SelectItem>
                    <SelectItem value={TaskStatus.ONGOING}>Ongoing</SelectItem>
                    <SelectItem value={TaskStatus.DONE}>Done</SelectItem>
                  </SelectContent>
                </Select>
                {errors.tag && (
                  <p className="text-sm text-red-500">{errors.tag.message}</p>
                )}
              </div>

              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 transition-all duration-300 transform hover:scale-105"
                disabled={todoLoading}
              >
                {todoLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Updating...
                  </>
                ) : (
                  "Update Todo"
                )}
              </Button>
            </form>
          </div>

          <DialogFooter>
            <DialogClose asChild>
              <Button className="w-full">Cancel</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default EditOptionTodo;       