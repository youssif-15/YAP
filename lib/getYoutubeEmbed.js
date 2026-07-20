export function getYoutubeEmbed(text){

    if(!text) return null;

    const patterns = [

        /(?:https?:\/\/)?(?:www\.)?youtube\.com\/watch\?v=([a-zA-Z0-9_-]{11})/,

        /(?:https?:\/\/)?youtu\.be\/([a-zA-Z0-9_-]{11})/,

        /(?:https?:\/\/)?(?:www\.)?youtube\.com\/shorts\/([a-zA-Z0-9_-]{11})/,

        /(?:https?:\/\/)?(?:www\.)?youtube\.com\/embed\/([a-zA-Z0-9_-]{11})/

    ];

    for(const pattern of patterns){

        const match = text.match(pattern);

        if(match){

            return `https://www.youtube.com/embed/${match[1]}`;

        }

    }

    return null;

}

export function removeYoutubeLink(text){

    if(!text) return "";

    return text

        .replace(/https?:\/\/(www\.)?(youtube\.com|youtu\.be)\S+/g,"")

        .trim();

}