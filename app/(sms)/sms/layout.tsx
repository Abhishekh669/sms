import React from 'react'
 function AppLayout({children} : {children : React.ReactNode}) {
  return (
    <div className='w-full min-h-screen h-full'>
        {children}
    </div>
  )
}

export default AppLayout
