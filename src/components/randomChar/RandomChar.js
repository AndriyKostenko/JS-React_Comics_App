import { useEffect, useState } from 'react';
import Spinner from '../spinner/spinner';
import ErrorMessage from '../errorMessage/errorMessage';

import './randomChar.scss';

import mjolnir from '../../resources/img/mjolnir.png';
import MarvelService from '../../services/MarvelService';


const RandomChar = (props) => {
    // created state (char - all null), by default loading - true - before getting info
    const [char, setChar] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    
    
    const marvelService = new MarvelService();

    //will be called after rendering of component
    useEffect(() => {
        updateChar();
        const timerId = setInterval(updateChar, 60000);

        return () => {
            clearInterval(timerId);
        }
    }, []) 


    const onCharLoaded = (char) => {
        setChar(char); // creating char-object from received info
        setLoading(false);
    }

    const onCharLoading = () => {
        setLoading(true);
    }

    //updating state with received info from API
    const updateChar = () => {
        const id = Math.floor(Math.random() * (1011400 - 1011000) + 1011000); // range of all characters id from website
        onCharLoading();
        marvelService
            .getCharacter(id)
            .then(onCharLoaded) // argument 'char' will be iserted automatically 
            .catch(onError);
        }

    //cathing error and notifiying user
    const onError = () => {
        setError(true);
        setLoading(false);
    }


    const error_message = error ? <ErrorMessage/> :null;
    const spinner = loading ? <Spinner/> : null;
    const content = !(loading || error) ? <View char={char}/> : null;

    // created case if loading still in progress or not to show necc. info only
    return (
        <div className="randomchar">
            {error_message}
            {spinner}
            {content}
            <div className="randomchar__static">
                <p className="randomchar__title">
                    Random character for today!<br/>
                    Do you want to get to know him better?
                </p>
                <p className="randomchar__title">
                    Or choose another one
                </p>
                <button onClick={updateChar} className="button button__main">
                    <div className="inner">try it</div>
                </button>
                <img src={mjolnir} alt="mjolnir" className="randomchar__decoration"/>
            </div>
        </div>
    )
    }



// charachter view
const View = ({char}) => {
    const {name, description, thumbnail, homepage, wiki} = char;
    //checking for missed character's photo and fixing error photo from server
    let imgStyle = {'objectFit' : 'cover'};
    if (thumbnail === 'http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg') {
        imgStyle = {'objectFit': 'contain'}
    }

    return (
        <div className="randomchar__block">
        <img src={thumbnail} alt="Random character" className="randomchar__img" style={imgStyle}/>
            <div className="randomchar__info">
                <p className="randomchar__name">{name}</p>
                <p className="randomchar__descr">
                    {description}
                </p>
                <div className="randomchar__btns">
                    <a href={homepage} className="button button__main">
                        <div className="inner">homepage</div>
                    </a>
                    <a href={wiki} className="button button__secondary">
                        <div className="inner">Wiki</div>
                </a>
                </div>
            </div>
        </div>
    )
}

export default RandomChar;