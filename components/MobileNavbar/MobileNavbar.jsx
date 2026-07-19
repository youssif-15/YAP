"use client";


import {
    useState
} from "react";


import {
    MoreVertical,
    Home,
    Search,
    Film,
    User,
    Settings,
    LogOut
} from "lucide-react";


import {
    useRouter,
    usePathname
} from "next/navigation";


import {
    supabase
} from "@/lib/supabase";


import NotificationBell from "@/components/Notifications/NotificationBell";






export default function MobileNavbar(){


    const router = useRouter();

    const pathname = usePathname();


    const [open,setOpen] = useState(false);







    async function logout(){


        await supabase.auth.signOut();


        router.push("/login");


    }






    async function openProfile(){


        const {

            data:{

                user

            }

        } = await supabase.auth.getUser();




        if(!user) return;



        const {

            data:profile

        } = await supabase

        .from("profiles")

        .select("username")

        .eq("id",user.id)

        .single();




        if(profile?.username){

            router.push(
                `/profile/${profile.username}`
            );

        }


    }







    return(

        <>


        <nav className="mobile-top-navbar">



            <img

                src="/icon.png"

                className="mobile-logo"

                onClick={()=>router.push("/home")}

            />





            <div className="mobile-top-actions">


                <NotificationBell />



                <button

                    onClick={()=>setOpen(!open)}

                    className="mobile-menu-button"

                >

                    <MoreVertical size={26}/>

                </button>


            </div>



        </nav>







        {
        open &&


        <div className="mobile-side-menu">


            <button onClick={()=>router.push("/home")}>

                <Home size={22}/>

                Home

            </button>



            <button onClick={()=>router.push("/search")}>

                <Search size={22}/>

                Search

            </button>




            <button onClick={()=>router.push("/reels")}>

                <Film size={22}/>

                Reels

            </button>




            <button onClick={openProfile}>

                <User size={22}/>

                Profile

            </button>





            <button onClick={()=>router.push("/settings")}>

                <Settings size={22}/>

                Settings

            </button>





            <button

                onClick={logout}

                className="logout-mobile"

            >

                <LogOut size={22}/>

                Logout

            </button>



        </div>

        }


        </>


    );


}