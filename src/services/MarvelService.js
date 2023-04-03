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

    const get8Comics = async (offset = 0) => {
        const res = await request(
			`${_apiBase}comics?orderBy=issueNumber&limit=8&offset=${offset}&${_apiKey}`
		);
		return res.data.results.map(_transformComics);
    }

    const getComic = async (id) => {
		const res = await request(`${_apiBase}comics/${id}?${_apiKey}`);
		return _transformComics(res.data.results[0]);
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

    const _transformComics = (comics) => {
        return {
            id: comics.id,
            title: comics.title,
            description: comics.description ? `${comics.description.slice(0,200)}...` : 'There is no description for this comics.',
            pageCount: comics.pageCount ? `${comics.pageCount} p.` : 'No info. about the number of pages.',
            thumbnail: comics.thumbnail.path + "." + comics.thumbnail.extension,
            language: comics.textObjects[0]?.language || "en-us",
            price: comics.prices[0].price ? `${comics.prices[0].price}$` : 'Not available.'
        }
    }

    return {loading, 
            error, 
            get9Characters, 
            getCharacter, 
            clearError, 
            get8Comics, 
            getComic};


}

export default useMarvelService;