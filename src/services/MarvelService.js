
// getting info from API
class MarvelService {
    _apiBase = 'https://gateway.marvel.com:443/v1/public/';
    _apiKey = 'apikey=949a4bdb9d664fb2b0668fcf3534336a';

    getResource = async (url) => {
        let res = await fetch(url);

        if (!res.ok) {
            throw new Error(`Can't fetch ${url}, status: ${res.status}`);
        }

        return await res.json();
    }

    getAllCharacters = () => {
        return this.getResource(`${this._apiBase}characters?limit=9&offset=210&${this._apiKey}`);
    }

    getCharacter = (id) => {
        return this.getResource(`${this._apiBase}characters/${id}?limit=9&offset=210&${this._apiKey}`)
    }


}

export default MarvelService;
