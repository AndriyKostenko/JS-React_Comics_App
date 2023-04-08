import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';

import Spinner from '../spinner/spinner';
import ErrorMessage from '../errorMessage/errorMessage';
import useMarvelService from '../../services/MarvelService';
import AppBanner from '../appBanner/AppBanner';

import './singleCharacterPage.scss';


const SingleCharacterPage = () => {
    const {charId} = useParams(); // received from value ':charId' after adding to SingleCharPage in App.js
    const [char, setChar] = useState(null);
    const {loading, error, getCharacter, clearError} = useMarvelService();

    useEffect(() => {
        updateChar();
        // eslint-disable-next-line
    }, [charId]) 
        

    const updateChar = () => {
        clearError();

        getCharacter(charId) // when we receive a char info it will be sent to method onCharLoaded as an arg. 'char'
            .then(onCharLoaded) // otherwise - cath the error

    }

    // taking arg 'char' from method updateChar if successed 
    const onCharLoaded = (char) => {
        setChar(char);
    }

    const error_message = error ? <ErrorMessage/> : null;
    const spinner = loading ? <Spinner/> : null;
    const content = !(loading || error || !char) ? <View char={char}/> :null;

    return (
        <>
            <AppBanner/>
            {error_message}
            {spinner}
            {content}
        </>
    )

}

const View = ({char}) => {
    const {name, description, thumbnail} = char;

    return (
        <div className="single-char">
            <img src={thumbnail} alt={name} className="single-char__char-img"/>
            <div className="single-char__info">
                <h2 className="single-char__name">{name}</h2>
                <p className="single-char__descr">{description}</p>
            </div>
        </div>
    )
}


export default SingleCharacterPage;