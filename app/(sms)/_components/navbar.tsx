import React from 'react'
import Logout from './logout';
import { UserButton } from './user-button';
import Link from 'next/link';

function Navbar() {
  return (
    <div className='p-4 flex justify-between'>
        <div className=' p-4 size-12 flex justify-center items-center rounded-full  bg-white'>
          <Link href={"/dashboard"} className='text-semibold text-muted-foreground'>SMS</Link>
        </div>
        <div>
          <UserButton />
        </div>
    </div>
  )
}

export default Navbar;
