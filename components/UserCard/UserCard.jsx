"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function UserCard() {

    const router = useRouter();

    const [currentUser, setCurrentUser] = useState(null);

    const [users, setUsers] = useState([]);

    const [followingUsers, setFollowingUsers] = useState([]);

    useEffect(() => {

        loadUsers();

    }, []);

    async function loadUsers() {

        const {
            data: { user }
        } = await supabase.auth.getUser();

        if (!user) return;

        setCurrentUser(user);

        const {
            data: following
        } = await supabase
            .from("followers")
            .select("following_id")
            .eq("follower_id", user.id);

        const followingIds =
            following?.map(item => item.following_id) || [];

        setFollowingUsers(followingIds);

        const {
            data,
            error
        } = await supabase
            .from("profiles")
            .select(`
                id,
                username,
                full_name,
                avatar_url
            `)
            .neq("id", user.id)
            .limit(5);

        if (error) {

            console.log(error);

            return;

        }

        setUsers(data || []);
    }

    async function followUser(id) {

        if (!currentUser) return;

        const alreadyFollow =
            followingUsers.includes(id);

        if (alreadyFollow) {

            const { error } = await supabase
                .from("followers")
                .delete()
                .eq("follower_id", currentUser.id)
                .eq("following_id", id);

            if (error) return;

            setFollowingUsers(prev =>
                prev.filter(userId => userId !== id)
            );

            return;
        }

        const { error } = await supabase
            .from("followers")
            .insert({
                follower_id: currentUser.id,
                following_id: id
            });

        if (error) return;

        setFollowingUsers(prev => [
            ...prev,
            id
        ]);
    }

    return (

        <aside className="right-sidebar">

            <h3>People you may know</h3>

            {users.map(user => (

                <div
                    className="suggestion"
                    key={user.id}
                >

                    <div
                        className="suggestion-user"
                        onClick={() =>
                            router.push(`/profile/${user.username}`)
                        }
                    >

                        <img
                            src={user.avatar_url}
                            className="avatar-small"
                            alt=""
                        />

                        <div className="suggestion-info">

                            <strong>
                                {user.username}
                            </strong>

                            <small>
                                {user.full_name}
                            </small>

                        </div>

                    </div>

                    <button
                        onClick={() => followUser(user.id)}
                    >
                        {
                            followingUsers.includes(user.id)
                                ? "Following"
                                : "Follow"
                        }
                    </button>

                </div>

            ))}

        </aside>

    );

}