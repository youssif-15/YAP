"use client";

import {
    Bell
} from "lucide-react";

import {
    useEffect,
    useState
} from "react";

import {
    useRouter
} from "next/navigation";

import {
    supabase
} from "@/lib/supabase";

export default function NotificationBell(){

    const router = useRouter();

    const [open,setOpen] = useState(false);

    const [notifications,setNotifications] = useState([]);

    const [unread,setUnread] = useState(0);

    useEffect(()=>{

        loadNotifications();

    },[]);

    async function loadNotifications(){

        const {

            data:{
                user
            }

        } = await supabase.auth.getUser();

        if(!user){

            return;

        }

        const {

            data,

            error

        } = await supabase

        .from("notifications")

        .select(`
            *,
            actor:profiles!notifications_actor_id_fkey(
                username,
                avatar_url
            )
        `)

        .eq(

            "user_id",

            user.id

        )

        .order(

            "created_at",

            {

                ascending:false

            }

        )

        .limit(20);

        if(error){

            console.log(error);

            return;

        }

        setNotifications(data || []);

        setUnread(

            data?.filter(

                item=>!item.read

            ).length || 0

        );

    }

    async function openNotifications(){

        const newState=!open;

        setOpen(newState);

        if(!newState){

            return;

        }

        await loadNotifications();

        const {

            data:{
                user
            }

        } = await supabase.auth.getUser();

        if(!user){

            return;

        }

        await supabase

        .from("notifications")

        .update({

            read:true

        })

        .eq(

            "user_id",

            user.id

        )

        .eq(

            "read",

            false

        );

        setUnread(0);

        setNotifications(prev=>

            prev.map(item=>({

                ...item,

                read:true

            }))

        );

    }

    function openNotification(item){

        setOpen(false);

        if(

            item.type==="follow"

            &&

            item.actor?.username

        ){

            router.push(

                `/profile/${item.actor.username}`

            );

            return;

        }

        if(item.type==="like"){

            router.push(

                `/post/${item.post_id}`

            );

            return;

        }

        if(item.type==="comment"){

            router.push(

                `/post/${item.post_id}?comment=${item.comment_id}`

            );

        }

    }

    return(

        <div className="notification-wrapper">

            <button

                className="notification-button"

                onClick={openNotifications}

            >

                <Bell size={24}/>

                {

                unread>0 &&

                <span className="notification-count">

                    {unread}

                </span>

                }

            </button>

            {

            open &&

            <div className="notification-popup">

                <h3>

                    Notifications

                </h3>

                {

                notifications.length===0

                ?

                <p>

                    No notifications yet

                </p>

                :

                notifications.map(item=>(

                    <div

                        key={item.id}

                        className={`notification-item ${item.read ? "read" : "unread"}`}

                        onClick={()=>openNotification(item)}

                    >

                        {

                        item.actor?.avatar_url

                        ?

                        <img

                            src={item.actor.avatar_url}

                            alt="avatar"

                        />

                        :

                        <div className="notification-avatar"/>

                        }

                        <div>

                            <p>

                                <b>

                                    {

                                    item.actor?.username ||

                                    "Someone"

                                    }

                                </b>

                                {

                                item.type==="follow" &&

                                " started following you"

                                }

                                {

                                item.type==="like" &&

                                " liked your post"

                                }

                                {

                                item.type==="comment" &&

                                " commented on your post"

                                }

                            </p>

                        </div>

                    </div>

                ))

                }

            </div>

            }

        </div>

    );

}