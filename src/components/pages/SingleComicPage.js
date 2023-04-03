import { useParams, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';

import Spinner from '../spinner/spinner';
import ErrorMessage from '../errorMessage/errorMessage';
import useMarvelService from '../../services/MarvelService';

import './singleComicPage.scss';


const SingleComicPage = () => {
    const {comicId} = useParams(); // received from value ':comicId' after adding to SingleComicPage in App.js
    const [comic, setComic] = useState(null);
    const {loading, error, getComic, clearError} = useMarvelService();

    useEffect(() => {
        updateComic();
        // eslint-disable-next-line
    }, [comicId]) 
        

    const updateComic = () => {
        clearError();

        getComic(comicId) // when we receive a comic info it will be sent to method onComicLoaded as an arg. 'comic'
            .then(onComicLoaded) // otherwise - cath the error

    }

    // taking arg 'comic' from method updateComic if successed 
    const onComicLoaded = (comic) => {
        setComic(comic);
    }

    const error_message = error ? <ErrorMessage/> : null;
    const spinner = loading ? <Spinner/> : null;
    const content = !(loading || error || !comic) ? <View comic={comic}/> :null;

    return (
        <>
            {error_message}
            {spinner}
            {content}
        </>
    )

}

const View = ({comic}) => {
    const {title, description, pageCount, thumbnail, price, language} = comic;

    return (
        <div className="single-comic">
            <img src={thumbnail} alt={title} className="single-comic__img"/>
            <div className="single-comic__info">
                <h2 className="single-comic__name">{title}</h2>
                <p className="single-comic__descr">{description}</p>
                <p className="single-comic__descr">{pageCount}</p>
                <p className="single-comic__descr">Language: {language}</p>
                <div className="single-comic__price">{price}</div>
            </div>
            <Link to="/comics" className="single-comic__back">Back to all</Link>
        </div>

    )
}


export default SingleComicPage;