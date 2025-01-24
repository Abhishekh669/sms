import React, { ReactElement, useState } from 'react'
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
  } from "@/components/ui/dialog";
import { DialogDescription } from '@radix-ui/react-dialog';
import { Button } from '@/components/ui/button';

const  useConfirm = (
    title : string,
    message : string
) : [() => ReactElement, ()=> Promise<unknown>] =>  {
    const [promise, setPromise] = useState<{resolve:(value:boolean) => void} | null>(null)

    const confirm = () => new Promise((resolve, reject) =>{
        setPromise({resolve})
    })

    const handleClose = () => {
        setPromise(null);
    }

    const handleCancel = () =>{
        promise?.resolve(false)
        handleClose();
    }

    const handleConfirm = () =>{
        promise?.resolve(true);
        handleClose();

    }


    const  ConfirmDialog = () =>(
        <Dialog open={promise !== null}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>
                        {title}
                    </DialogTitle>
                    <DialogDescription>
                        {message}
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter className='pt-2'>
                    <Button 
                        onClick={handleCancel}
                        variant={"outline"}
                    >
                       Cancel 
                    </Button>
                    <Button onClick={handleConfirm}  
                        className='bg-black text-white hover:bg-black rounded-[5px]'
                    >
                        Confirm
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )




  return [ConfirmDialog, confirm];
}

export default useConfirm