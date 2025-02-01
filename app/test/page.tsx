"use client";
import EditTodo from '@/components/features/todo/edit-todo'
import { uploadFile } from '@/lib/upload';
import React, { useState } from 'react'


function page() {
  const [image, setImage] = useState<File | null>();

const changeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
  if (e.target.files && e.target.files.length > 0) {
    setImage(e.target.files[0]);
  }
    };

    const checkState = (e : any) =>{
      e.preventDefault();
      uploadFile(image)
      


    }

return (
<form  onSubmit={checkState}>
          <input type="file" name="image" onChange={changeHandler} />
          <button type="submit">Upload</button>
        </form>
  )
}

export default page
