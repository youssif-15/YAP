"use client";

import {
    useRef,
    useState
} from "react";

import {
    Image,
    X,
    Plus
} from "lucide-react";

import Caption from "./Caption";



export default function PhotoUploader({

    close,

    setUploading

}){

    const inputRef = useRef();

    const [images,setImages] = useState([]);

    const [files,setFiles] = useState([]);

    const [next,setNext] = useState(false);





    function addImages(selectedFiles){

        const validFiles = Array.from(selectedFiles)

        .filter(file=>

            file.type.startsWith("image/")

        );



        const previews = validFiles.map(file=>

            URL.createObjectURL(file)

        );



        setImages(prev=>[

            ...prev,

            ...previews

        ]);



        setFiles(prev=>[

            ...prev,

            ...validFiles

        ]);

    }






    function removeImage(index){

        setImages(prev=>

            prev.filter(

                (_,i)=>i!==index

            )

        );



        setFiles(prev=>

            prev.filter(

                (_,i)=>i!==index

            )

        );

    }







    if(next){

        return(

            <Caption

                type="image"

                media={images}

                files={files}

                close={close}

                setUploading={setUploading}

            />

        );

    }







    return(

        <div className="photo-uploader">



            {

            images.length===0 &&

            <label

                className="upload-box"

                onDragOver={(e)=>{

                    e.preventDefault();

                }}

                onDrop={(e)=>{

                    e.preventDefault();

                    addImages(

                        e.dataTransfer.files

                    );

                }}

            >



                <Image size={45}/>

                <h3>

                    Upload Photos

                </h3>

                <p>

                    Drag & Drop or Click

                </p>



                <input

                    hidden

                    ref={inputRef}

                    type="file"

                    multiple

                    accept="image/*"

                    onChange={(e)=>{

                        addImages(

                            e.target.files

                        );

                    }}

                />



            </label>

            }







            {

            images.length>0 &&

            <div className="media-grid">



                {

                images.map((img,index)=>(

                    <div

                        className="media-card"

                        key={img}

                    >

                        <img

                            src={img}

                            alt="preview"

                        />



                        <button

                            className="remove-media"

                            onClick={()=>{

                                removeImage(index);

                            }}

                        >

                            <X size={16}/>

                        </button>

                    </div>

                ))

                }



                <div

                    className="add-more-card"

                    onClick={()=>{

                        inputRef.current.click();

                    }}

                >

                    <Plus size={35}/>

                    <span>

                        Add more

                    </span>

                </div>



                <input

                    ref={inputRef}

                    hidden

                    type="file"

                    multiple

                    accept="image/*"

                    onChange={(e)=>{

                        addImages(

                            e.target.files

                        );

                    }}

                />



            </div>

            }







            {

            images.length>0 &&

            <button

                className="next-button"

                onClick={()=>{

                    setNext(true);

                }}

            >

                Next

            </button>

            }



        </div>

    );

}