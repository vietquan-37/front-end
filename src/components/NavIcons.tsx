"use client"

import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"
import CartModal from "./CartModal"
import { signOut } from "next-auth/react"


const NavIcons = () => {
    const router = useRouter()
    const [isProfileOpen, setIsProfileOpen] = useState(false)
    const [isCartOpen, setIsCartOpen] = useState(false)
    const isLoggedIn =true
    const handleProfile = () => {
       
        setIsProfileOpen((prev) => !prev)
    }
    return (
        <div className='flex items-center gap-4 xl:gap-6 relative'>
            <Image src="/profile.png" alt="" width={22} height={22} className="cursor-pointer" onClick={handleProfile} />
            {isProfileOpen && <div className="absolute p-4 rounded-md top-12 left-0 bg-white text-sm shadow-[0_3px_10px_rgb(0,0,0,0.2)] z-20">
                <Link href="/">Profile</Link>
                <button className="mt-2 cursor-pointer bg-transparent" onClick={()=>signOut()}>Logout</button>
            </div>
            }
            <div className="relative cursor-pointer"  onClick={()=>setIsCartOpen(prev=>!prev)}> 
            <Image src="/cart.png" alt="" width={22} height={22} 
           
             />
             <div className="absolute -top-4 -right-4 w-6 h-6 bg-quan rounded-full text-white text-sm flex items-center justify-center ">2</div>
             {isCartOpen&& <CartModal/>}
             </div>
        </div>
    )
}

export default NavIcons