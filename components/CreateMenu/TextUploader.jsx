"use client";

import { useState } from "react";

import { supabase } from "@/lib/supabase";

export default function TextUploader({ close }) {

    const [text, setText] = useState("");

    const [loading, setLoading] = useState(false);

    async function publish() {

        if (!text.trim()) return;

        try {

            setLoading(true);

            const {
                data: { user }
            } = await supabase.auth.getUser();

            if (!user) {

                throw new Error("Please login first");

            }

            const { error } = await supabase

                .from("posts")

                .insert({

                    user_id: user.id,

                    type: "text",

                    content: text,

                    media: []

                });

            if (error) {

                throw error;

            }

            window.dispatchEvent(

                new CustomEvent("toast", {

                    detail: {

                        type: "success",

                        message: "Post published successfully."

                    }

                })

            );

            setTimeout(() => {

                close?.();

            }, 800);

        }

        catch (err) {

            window.dispatchEvent(

                new CustomEvent("toast", {

                    detail: {

                        type: "error",

                        message: err.message

                    }

                })

            );

        }

        finally {

            setLoading(false);

        }

    }

    return (

        <div className="text-uploader">

            <textarea

                className="text-post-input"

                placeholder="What's on your mind?"

                value={text}

                onChange={(e) => {

                    setText(e.target.value);

                }}

            />

            <button

                className="publish-button"

                disabled={!text.trim() || loading}

                onClick={publish}

            >

                {

                    loading

                        ? "Publishing..."

                        : "Publish"

                }

            </button>

        </div>

    );

}