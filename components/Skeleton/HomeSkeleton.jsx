export default function HomeSkeleton(){


    return(


        <div className="home-skeleton">



            <div className="skeleton-story-row">


                {
                    [1,2,3,4,5].map(i=>(


                        <div

                        key={i}

                        className="skeleton-story"

                        />


                    ))
                }


            </div>







            {
                [1,2].map(i=>(


                    <div

                    key={i}

                    className="skeleton-post"


                    >



                        <div className="skeleton-post-header">


                            <div className="skeleton-avatar"/>


                            <div className="skeleton-lines">


                                <div/>


                                <div/>


                            </div>



                        </div>







                        <div className="skeleton-image"/>





                        <div className="skeleton-action"/>


                        <div className="skeleton-text"/>


                        <div className="skeleton-text small"/>



                    </div>


                ))
            }




        </div>


    );


}