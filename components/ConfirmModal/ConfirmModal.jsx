"use client";

import "@app/global.css";

export default function ConfirmModal({

    title,

    message,

    onConfirm,

    onCancel

}){


    return(

        <div className="confirm-overlay">


            <div className="confirm-box">


                <h3>

                    {title}

                </h3>



                <p>

                    {message}

                </p>




                <div className="confirm-buttons">


                    <button

                        className="confirm-cancel"

                        onClick={onCancel}

                    >

                        Cancel

                    </button>




                    <button

                        className="confirm-delete"

                        onClick={onConfirm}

                    >

                        Delete

                    </button>



                </div>


            </div>


        </div>

    );

}