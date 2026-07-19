let currentUpload = null;

export function cancelUpload(){

    if(currentUpload){

        currentUpload.abort();
        currentUpload = null;

    }

}

export async function uploadMedia(

    files,
    onProgress

){

    const uploadedUrls = [];

    for(const file of files){

        const formData = new FormData();

        formData.append(
            "file",
            file
        );

        formData.append(
            "upload_preset",
            "yap_upload"
        );

        const xhr = new XMLHttpRequest();

        currentUpload = xhr;

        const url =
            "https://api.cloudinary.com/v1_1/ax6ilhsa/auto/upload";

        const result = await new Promise((resolve,reject)=>{

            xhr.open(
                "POST",
                url
            );

            xhr.upload.onprogress = (event)=>{

                if(event.lengthComputable){

                    const progress = Math.round(

                        (event.loaded / event.total) * 100

                    );

                    if(onProgress){

                        onProgress({

                            file,
                            progress

                        });

                    }

                }

            };

            xhr.onload = ()=>{

                currentUpload = null;

                if(xhr.status>=200 && xhr.status<300){

                    resolve(

                        JSON.parse(xhr.responseText)

                    );

                }

                else{

                    reject(

                        new Error(

                            "Upload failed"

                        )

                    );

                }

            };

            xhr.onerror = ()=>{

                currentUpload = null;

                reject(

                    new Error(

                        "Upload failed"

                    )

                );

            };

            xhr.onabort = ()=>{

                currentUpload = null;

                reject(

                    new Error(

                        "Upload cancelled"

                    )

                );

            };

            xhr.send(formData);

        });

        uploadedUrls.push(

            result.secure_url

        );

    }

    return uploadedUrls;

}