"use client";


import {

  Home,
  Search,
  History,
  Film,
  User,
  Settings,
  LogOut

} from "lucide-react";


import {

  usePathname,
  useRouter

} from "next/navigation";


import { supabase } from "@/lib/supabase";





export default function Sidebar(){



  const router = useRouter();

  const pathname = usePathname();






  async function handleLogout(){


    await supabase.auth.signOut();


    router.push("/login");


  }






  async function openProfile(){



    const {

      data:{

        user

      }

    } = await supabase.auth.getUser();





    if(!user){

      return;

    }






    const {

      data:profile,

      error

    } = await supabase

    .from("profiles")

    .select(

      "username"

    )

    .eq(

      "id",

      user.id

    )

    .single();






    if(error){

      console.log(

        "PROFILE ERROR",

        error

      );

      return;

    }






    if(profile?.username){


      router.push(

        `/profile/${profile.username}`

      );


    }


  }







  const items = [

    {

      name:"Home",

      icon:<Home size={24}/>,

      path:"/home"

    },

    {

      name:"Search",

      icon:<Search size={24}/>,

      path:"/search"

    },

    {

      name:"Flashbacks",

      icon:<History size={24}/>,

      path:"/flashbacks"

    },

    {

      name:"Reels",

      icon:<Film size={24}/>,

      path:"/reels"

    }

  ];








  return(



    <aside className="sidebar">





      <div className="sidebar-top">





        {

          items.map((item,index)=>{


            const active =

              pathname === item.path;





            return(



              <button

                key={index}

                className={

                  active

                  ?

                  "sidebar-item active"

                  :

                  "sidebar-item"

                }

                onClick={()=>router.push(item.path)}

              >



                {item.icon}



                <span>

                  {item.name}

                </span>



              </button>



            );



          })

        }









        <button

          className={

            pathname.startsWith("/profile")

            ?

            "sidebar-item active"

            :

            "sidebar-item"

          }

          onClick={openProfile}

        >



          <User size={24}/>



          <span>

            Profile

          </span>



        </button>








        <button

          className={

            pathname === "/settings"

            ?

            "sidebar-item active"

            :

            "sidebar-item"

          }

          onClick={()=>router.push("/settings")}

        >



          <Settings size={24}/>



          <span>

            Settings

          </span>



        </button>





      </div>








      <div className="sidebar-bottom">





        <button

          className="sidebar-item logout-button"

          onClick={handleLogout}

        >



          <LogOut size={24}/>



          <span>

            Logout

          </span>



        </button>





      </div>





    </aside>



  );

}