import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';

import useMarvelService from '../../services/MarvelService';
import AppBanner from '../appBanner/AppBanner';
import setContent from '../../utils/setContent';

import './singleCharacterPage.scss';


const SingleCharacterPage = () => {
    const {charId} = useParams(); // received from value ':charId' after adding to SingleCharPage in App.js
    const [char, setChar] = useState(null);
    const {getCharacter, clearError, process, setProcess} = useMarvelService();

    useEffect(() => {
        updateChar();
        // eslint-disable-next-line
    }, [charId]) 
        

    const updateChar = () => {
        clearError();

        getCharacter(charId) // when we receive a char info it will be sent to method onCharLoaded as an arg. 'char'
            .then(onCharLoaded) // otherwise - cath the error
            .then(() => setProcess('confirmed'));
    }

    // taking arg 'char' from method updateChar if successed 
    const onCharLoaded = (char) => {
        setChar(char);
    }


    return (
        <>
            <AppBanner/>
            {setContent(process, View, char)}
        </>
    )

}


const View = ({data}) => {
    const {name, description, thumbnail} = data;

    return (
        
        <div className="single-char">
            <Helmet>
                <meta
                    name="description"
                    content={`${name} - info.`}
                />
                <title>{name} - char info</title>
            </Helmet>
            <img src={thumbnail} alt={name} className="single-char__char-img"/>
            <div className="single-char__info">
                <h2 className="single-char__name">{name}</h2>
                <p className="single-char__descr">{description}</p>
            </div>
        </div>
    )
}


export default SingleCharacterPage;