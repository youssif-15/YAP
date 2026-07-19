"use client";


export default function StoryRing({

    stories = [],

    avatar,

    add = false

}){


    return(

        <div

            className={

                add

                ?

                "story-add-avatar"

                :

                "story-ring"

            }

        >


            {
            stories.length > 0 &&

            <div className="story-count">

                {stories.length}

            </div>
            }



            <img

                src={avatar}

                className="story-avatar"

                alt="avatar"

            />







            {

            add &&

            <div className="add-story-button">

                +

            </div>

            }



        </div>


    );


}