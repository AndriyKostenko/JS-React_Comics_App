// getting info from API
class MarvelService {
    //here will be your api key from marvel website
    _apiBase = 'https://gateway.marvel.com:443/v1/public/';
    _apiKey = 'apikey=949a4bdb9d664fb2b0668fcf3534336a';

    getResource = async (url) => {
        let res = await fetch(url);

        if (!res.ok) {
            throw new Error(`Can't fetch ${url}, status: ${res.status}`);
        }

        return await res.json();
    }

    get9Characters = async () => {
        const res = await  this.getResource(`${this._apiBase}characters?limit=9&offset=210&${this._apiKey}`);
        return res.data.results.map(this._transformCharacter); // appliying for each received data from response Object
    }

    getCharacter = async (id) => {
        const res = await this.getResource(`${this._apiBase}characters/${id}?limit=9&offset=210&${this._apiKey}`)
        return this._transformCharacter(res.data.results[0]); // get a character object
    }

    _transformCharacter = (char) => {
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


}

export default MarvelService;