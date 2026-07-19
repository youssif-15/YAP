"use client";


import {

  Search,
  Home,
  User,
  Film

} from "lucide-react";


import {

  useState

} from "react";


import {

  useRouter,
  usePathname

} from "next/navigation";


import {

  supabase

} from "@/lib/supabase";


import CreateMenu from "@/components/CreateMenu/CreateMenu";


import NotificationBell from "@/components/Notifications/NotificationBell";








export default function Navbar({

  settingsMode = false

}){


  const router = useRouter();


  const pathname = usePathname();


  const [search,setSearch] = useState("");









  function handleSearch(e){


    if(

      e.key === "Enter"

      &&

      search.trim()

    ){


      router.push(

        `/search?q=${search}`

      );


    }


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

      data:profile

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






    if(profile?.username){


      router.push(

        `/profile/${profile.username}`

      );


    }



  }









  return(


    <>


      <nav className="navbar">



        <div

          className="logo"

          onClick={()=>router.push("/home")}

        >


          <img

            src="/icon.png"

            alt="YAP"

            className="logo-image"

          />


        </div>





        {

        !settingsMode && (


          <div className="search">


            <Search size={20}/>



            <input


              placeholder="Search"


              value={search}


              onChange={(e)=>

                setSearch(e.target.value)

              }


              onKeyDown={handleSearch}


            />


          </div>


        )

        }
                <div className="actions">



          <Home

            size={24}

            className={

              pathname === "/home"

              ?

              "active-icon"

              :

              ""

            }

            onClick={()=>router.push("/home")}

            style={{

              cursor:"pointer"

            }}

          />







          {

          !settingsMode && (


            <>


              <CreateMenu compact />





              <NotificationBell />





              <User

                size={24}

                className={

                  pathname.startsWith("/profile")

                  ?

                  "active-icon"

                  :

                  ""

                }

                onClick={openProfile}

                style={{

                  cursor:"pointer"

                }}

              />



            </>


          )


          }



        </div>



      </nav>
            {


      !settingsMode && (


        <div className="mobile-bottom-nav">





          <button

            className={

              pathname === "/home"

              ?

              "active"

              :

              ""

            }

            onClick={()=>router.push("/home")}

          >

            <Home size={24}/>

          </button>







          <button

            className={

              pathname.startsWith("/search")

              ?

              "active"

              :

              ""

            }

            onClick={()=>router.push("/search")}

          >

            <Search size={24}/>

          </button>







          <div className="create-button">


            <CreateMenu compact />


          </div>







          <button

            className={

              pathname === "/reels"

              ?

              "active"

              :

              ""

            }

            onClick={()=>router.push("/reels")}

          >

            <Film size={24}/>

          </button>







          <button

            className={

              pathname.startsWith("/profile")

              ?

              "active"

              :

              ""

            }

            onClick={openProfile}

          >

            <User size={24}/>

          </button>







        </div>


      )


      }




    </>


  );


}