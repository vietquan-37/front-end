"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import CartModal from "./CartModal";
import { signOut, useSession } from "next-auth/react";
import UseAxiosAuth from "@/utils/axiosClient";

const NavIcons = () => {

    const { data: session } = useSession(); // Get the session data
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [isCartOpen, setIsCartOpen] = useState(false);

    const handleProfile = () => {
        setIsProfileOpen((prev) => !prev);
    };

    return (
        <div className='flex items-center gap-4 xl:gap-6 relative'>
            {session ? (
                // Render NavIcons for authenticated users
                <>
                    <Image
                        src="/profile.png"
                        alt="Profile"
                        width={22}
                        height={22}
                        className="cursor-pointer"
                        onClick={handleProfile}
                    />
                    {isProfileOpen && (
                        <div className="absolute p-4 rounded-md top-12 left-0 bg-white text-sm shadow-[0_3px_10px_rgb(0,0,0,0.2)] z-20">
                            <Link href="/user/profile">Profile</Link>
                            <Link href="/user/orders" className="block mt-2">Orders</Link>
                            <Link href="/user/reviews" className="block mt-2">Reviews</Link>
                            <button className="mt-2 cursor-pointer bg-transparent" onClick={() => signOut()}>Logout</button>
                        </div>
                    )}
                    <div className="relative cursor-pointer">
                        <Image
                            src="/cart.png"
                            alt="Cart"
                            width={22}
                            height={22}
                            onClick={() => setIsCartOpen(prev => !prev)}
                        />

                        {isCartOpen && <CartModal />}
                    </div>

                </>
            ) : (
                // Render Login and Register for unauthenticated users
                <>
                    <Link href="/login" className="text-sm text-blue-500">Login</Link>
                    <Link href="/register" className="text-sm text-blue-500">Register</Link>
                </>
            )}
        </div>
    );
};

export default NavIcons;
