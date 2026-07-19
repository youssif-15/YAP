"use client";

import {

    useEffect,
    useState

} from "react";

import {

    Pencil,
    UserPlus,
    UserCheck

} from "lucide-react";

import {

    useRouter

} from "next/navigation";

import { supabase } from "@/lib/supabase";

import OwnerBadge from "@/components/OwnerBadge/OwnerBadge";

export default function ProfileHeader({

    profile,

    isOwner,

    postsCount,

    onRefresh

}){

    const router = useRouter();

    const [followers,setFollowers] = useState(0);

    const [following,setFollowing] = useState(0);

    const [followingUser,setFollowingUser] = useState(false);

    const [loading,setLoading] = useState(false);

    function getTextDirection(text){

        const arabic = /[\u0600-\u06FF]/;

        return arabic.test(text)

        ?

        "rtl"

        :

        "ltr";

    }

    useEffect(()=>{

        loadCounts();

    },[profile]);

    async function loadCounts(){

        if(!profile){

            return;

        }

        const [

            followersResult,

            followingResult,

            authResult

        ] = await Promise.all([

            supabase

            .from("followers")

            .select("*",{

                count:"exact",

                head:true

            })

            .eq(

                "following_id",

                profile.id

            ),

            supabase

            .from("followers")

            .select("*",{

                count:"exact",

                head:true

            })

            .eq(

                "follower_id",

                profile.id

            ),

            supabase.auth.getUser()

        ]);

        setFollowers(

            followersResult.count || 0

        );

        setFollowing(

            followingResult.count || 0

        );

        const user = authResult.data.user;

        if(

            !user ||

            user.id===profile.id

        ){

            return;

        }

        const {

            data

        } = await supabase

        .from("followers")

        .select("id")

        .eq(

            "follower_id",

            user.id

        )

        .eq(

            "following_id",

            profile.id

        )

        .maybeSingle();

        setFollowingUser(

            !!data

        );

    }

    async function toggleFollow(){

        const {

            data:{user}

        } = await supabase.auth.getUser();

        if(

            !user ||

            loading

        ){

            return;

        }

        setLoading(true);

        if(followingUser){

            const {

                error

            } = await supabase

            .from("followers")

            .delete()

            .eq(

                "follower_id",

                user.id

            )

            .eq(

                "following_id",

                profile.id

            );

            if(!error){

                setFollowingUser(false);

                setFollowers(prev=>

                    Math.max(prev-1,0)

                );

            }

        }

        else{

            const {

                error

            } = await supabase

            .from("followers")

            .insert({

                follower_id:user.id,

                following_id:profile.id

            });

            if(!error){

                setFollowingUser(true);

                setFollowers(prev=>

                    prev+1

                );

            }

        }

        setLoading(false);

        if(onRefresh){

            onRefresh();

        }

    }
        return(

        <div className="profile-header">

            <div className="profile-avatar-wrapper">

                {

                    profile.avatar_url

                    ?

                    <img

                        src={profile.avatar_url}

                        alt="avatar"

                        className="profile-avatar"

                    />

                    :

                    <div className="profile-avatar-empty"/>

                }

            </div>

            <div className="profile-info">

                <div className="profile-names">

                    <h2

                        dir={getTextDirection(

                            profile.full_name ||

                            profile.username

                        )}

                    >

                        {

                            profile.full_name ||

                            profile.username

                        }

                        {

                            profile.is_owner &&

                            <OwnerBadge/>

                        }

                    </h2>

                    <span

                        dir={getTextDirection(

                            profile.username

                        )}

                    >

                        @{profile.username}

                    </span>

                </div>

                {

                    profile.bio &&

                    <p

                        className="profile-bio"

                        dir={getTextDirection(profile.bio)}

                    >

                        {profile.bio}

                    </p>

                }

                <div className="profile-stats">

                    <div className="profile-stat">

                        <strong>

                            {postsCount}

                        </strong>

                        <span>

                            Posts

                        </span>

                    </div>

                    <div

                        className="profile-stat profile-stat-clickable"

                        onClick={()=>{

                            router.push(

                                `/profile/${profile.username}/followers`

                            );

                        }}

                    >

                        <svg

                            className="profile-stat-border"

                            viewBox="0 0 100 100"

                            preserveAspectRatio="none"

                        >

                            <defs>

                                <linearGradient

                                    id="followersBorder"

                                    x1="0%"

                                    y1="0%"

                                    x2="100%"

                                    y2="0%"

                                >

                                    <stop offset="0%" stopColor="#38bdf8"/>

                                    <stop offset="25%" stopColor="#60a5fa"/>

                                    <stop offset="50%" stopColor="#3b82f6"/>

                                    <stop offset="75%" stopColor="#2563eb"/>

                                    <stop offset="100%" stopColor="#1d4ed8"/>

                                </linearGradient>

                            </defs>

                            <rect

                                x="1.5"

                                y="1.5"

                                width="97"

                                height="97"

                                rx="14"

                                ry="14"

                                stroke="url(#followersBorder)"

                            />

                        </svg>

                        <strong>

                            {followers}

                        </strong>

                        <span>

                            Followers

                        </span>

                    </div>
                                        <div

                        className="profile-stat profile-stat-clickable"

                        onClick={()=>{

                            router.push(

                                `/profile/${profile.username}/following`

                            );

                        }}

                    >

                        <svg

                            className="profile-stat-border"

                            viewBox="0 0 100 100"

                            preserveAspectRatio="none"

                        >

                            <defs>

                                <linearGradient

                                    id="followingBorder"

                                    x1="0%"

                                    y1="0%"

                                    x2="100%"

                                    y2="0%"

                                >

                                    <stop offset="0%" stopColor="#38bdf8"/>

                                    <stop offset="25%" stopColor="#60a5fa"/>

                                    <stop offset="50%" stopColor="#3b82f6"/>

                                    <stop offset="75%" stopColor="#2563eb"/>

                                    <stop offset="100%" stopColor="#1d4ed8"/>

                                </linearGradient>

                            </defs>

                            <rect

                                x="1.5"

                                y="1.5"

                                width="97"

                                height="97"

                                rx="14"

                                ry="14"

                                stroke="url(#followingBorder)"

                            />

                        </svg>

                        <strong>

                            {following}

                        </strong>

                        <span>

                            Following

                        </span>

                    </div>

                </div>

                <div className="profile-buttons">

                    {

                        isOwner

                        ?

                        <button

                            className="edit-profile-button"

                            onClick={()=>{

                                router.push(

                                    "/profile/edit"

                                );

                            }}

                        >

                            <Pencil size={17}/>

                            Edit profile

                        </button>

                        :

                        <button

                            className={

                                followingUser

                                ?

                                "following-button"

                                :

                                "follow-button"

                            }

                            onClick={toggleFollow}

                            disabled={loading}

                        >

                            {

                                followingUser

                                ?

                                <>

                                    <UserCheck size={17}/>

                                    Following

                                </>

                                :

                                <>

                                    <UserPlus size={17}/>

                                    Follow

                                </>

                            }

                        </button>

                    }

                </div>
                            </div>

        </div>

    );

}