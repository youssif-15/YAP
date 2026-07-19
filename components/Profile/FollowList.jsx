"use client";

import "./FollowList.css";

import {

    useEffect,

    useState

} from "react";

import {

    useRouter

} from "next/navigation";

import { supabase } from "@/lib/supabase";

export default function FollowList({

    username,

    type

}){

    const router = useRouter();

    const [loading,setLoading] = useState(true);

    const [users,setUsers] = useState([]);

    useEffect(()=>{

        loadUsers();

    },[username,type]);

    async function loadUsers(){

        try{

            setLoading(true);

            setUsers([]);

            const {

                data:profile,

                error:profileError

            } = await supabase

            .from("profiles")

            .select("id")

            .eq(

                "username",

                username

            )

            .single();

            if(profileError || !profile){

                console.log(profileError);

                setLoading(false);

                return;

            }

            let rows=[];

            if(type==="followers"){

                const {

                    data,

                    error

                } = await supabase

                .from("followers")

                .select("follower_id")

                .eq(

                    "following_id",

                    profile.id

                );

                if(error){

                    console.log(error);

                    setLoading(false);

                    return;

                }

                rows=data||[];

            }

            else{

                const {

                    data,

                    error

                } = await supabase

                .from("followers")

                .select("following_id")

                .eq(

                    "follower_id",

                    profile.id

                );

                if(error){

                    console.log(error);

                    setLoading(false);

                    return;

                }

                rows=data||[];

            }

            if(!rows.length){

                setUsers([]);

                setLoading(false);

                return;

            }

            const ids=

                type==="followers"

                ?

                rows.map(item=>item.follower_id)

                :

                rows.map(item=>item.following_id);

            const {

                data:profiles,

                error

            } = await supabase

            .from("profiles")

            .select("*")

            .in(

                "id",

                ids

            );

            if(error){

                console.log(error);

                setLoading(false);

                return;

            }

            const sortedUsers=

                ids

                .map(id=>

                    profiles.find(

                        profile=>profile.id===id

                    )

                )

                .filter(Boolean);

            setUsers(sortedUsers);

        }

        catch(error){

            console.log(error);

        }

        finally{

            setLoading(false);

        }

    }

    if(loading){

        return(

            <div className="follow-loading">

                Loading...

            </div>

        );

    }

    if(!users.length){

        return(

            <div className="follow-empty">

                {

                    type==="followers"

                    ?

                    "No followers yet."

                    :

                    "Not following anyone yet."

                }

            </div>

        );

    }

    return(

        <div className="follow-list">

            {

                users.map(user=>(

                    <div

                        key={user.id}

                        className="follow-user"

                        onClick={()=>{

                            router.push(

                                `/profile/${user.username}`

                            );

                        }}

                    >

                        <img

                            src={

                                user.avatar_url ||

                                "/default-avatar.png"

                            }

                            alt={user.username}

                            className="follow-avatar"

                        />

                        <div className="follow-info">

                            <div className="follow-username">

                                {user.username}

                            </div>

                            {

                                user.full_name &&

                                <div className="follow-name">

                                    {user.full_name}

                                </div>

                            }

                        </div>

                    </div>

                ))

            }

        </div>

    );

}