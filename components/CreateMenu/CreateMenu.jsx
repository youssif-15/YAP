"use client";

import { useState } from "react";
import { SquarePlus } from "lucide-react";
import CreateModal from "./CreateModal";

export default function CreateMenu({ compact = false }) {

    const [menuOpen, setMenuOpen] = useState(false);

    const [modalOpen, setModalOpen] = useState(false);

    const [selectedType, setSelectedType] = useState(null);

    function openCreate(type) {

        setSelectedType(type);

        setMenuOpen(false);

        setModalOpen(true);

    }

    return (

        <>

            <div className="create-menu">

                <button
                    type="button"
                    className={
                        compact
                            ? "nav-create-button"
                            : "sidebar-create-button"
                    }
                    onClick={() => {

                        console.log("clicked");

                        // يفتح نفس شاشة What's on your mind
                        openCreate(null);

                    }}
                >

                    <SquarePlus size={24} />

                    {
                        !compact &&

                        <span>
                            Create
                        </span>
                    }

                </button>

                {
                    menuOpen &&

                    <div className="create-dropdown">

                        <button
                            type="button"
                            onClick={() => openCreate("text")}
                        >

                            📝

                            <span>
                                Text Post
                            </span>

                        </button>

                        <button
                            type="button"
                            onClick={() => openCreate("photo")}
                        >

                            🖼️

                            <span>
                                Photo Post
                            </span>

                        </button>

                        <button
                            type="button"
                            onClick={() => openCreate("reel")}
                        >

                            🎬

                            <span>
                                Reel
                            </span>

                        </button>

                    </div>

                }

            </div>

            {
                modalOpen &&

                <CreateModal

                    close={() => setModalOpen(false)}

                    initialType={selectedType}

                />

            }

        </>

    );

}