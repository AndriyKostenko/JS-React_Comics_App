import { useHttp } from "../hooks/http.hook";




// getting info from API
const useMarvelService = () => {
    // getting info about connection to API
    const {loading, request, error, clearError} = useHttp();

    //here will be your api key from marvel website
    const _apiBase = 'https://gateway.marvel.com:443/v1/public/';
    const _apiKey = 'apikey=949a4bdb9d664fb2b0668fcf3534336a';
    const _baseOffset = 210;


    const get9Characters = async (offset = _baseOffset) => {
        const res = await request(`${_apiBase}characters?limit=9&offset=${offset}&${_apiKey}`);
        return res.data.results.map(_transformCharacter); // appliying for each received data from response Object
    }

    const getCharacter = async (id) => {
        const res = await request(`${_apiBase}characters/${id}?limit=9&offset=210&${_apiKey}`)
        return _transformCharacter(res.data.results[0]); // get a character object
    }

    const _transformCharacter = (char) => {
        return {
            id:char.id,
            name: char.name,
            description: char.description ? `${char.description.slice(0, 210)}...` : 'There is no descr. for this charachter.',
            thumbnail: char.thumbnail.path + '.' + char.thumbnail.extension,
            homepage: char.urls[0].url,
            wiki: char.urls[1].url,
            comics: char.comics.items
        }
    }

    return {loading, error, get9Characters, getCharacter, clearError};


}

export default useMarvelService;