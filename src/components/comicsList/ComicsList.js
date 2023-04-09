import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';

import useMarvelService from '../../services/MarvelService';
import Spinner from '../spinner/spinner';
import ErrorMessage from '../errorMessage/errorMessage';


import './comicsList.scss';


//generating a content according to the current process state (http.js)
const setContent = (process, Component, newItemLoading) => {
    switch (process) {
        case 'waiting':
            return <Spinner/>;
        case 'loading':
            return newItemLoading ? <Component/> : <Spinner/>; // if loading new elems - render component, if no- first render with spinner
        case 'confirmed':
            return <Component/>;
        case 'error':
            return <ErrorMessage/>;
        default:
            throw new Error('Unexpected process state');
    }
}



const ComicsList = () => {
    //creatiing states
    const [comicsList, setComicsList] = useState([]);
    const [newItemLoading, setNewItemLoading] = useState(false);
    const [offset, setOffset] = useState(0);
    const [comicsEnded, setComicsEnded] = useState(false);

    //getting states info after request to API
    const {get8Comics, process, setProcess} = useMarvelService();

    //will be 1 time initialized after rendering the page 
    useEffect(() => {
        onRequest(offset, true);
        // eslint-disable-next-line
    }, [])

    const onRequest = (offset, initial) => {
        initial ? setNewItemLoading(false) : setNewItemLoading(true);
        get8Comics(offset)
            .then(onComicsListLoaded)
            .then(() => setProcess('confirmed'));
    }

    const onComicsListLoaded = (newComicsList) => {
        let ended = false;
        if (newComicsList.length < 8) {
            ended = true;
        }
        setComicsList([...comicsList, ...newComicsList]);
        setNewItemLoading(false);
        setOffset(offset + 8);
        setComicsEnded(ended);
    }


    function renderItems (arr) {
        const items = arr.map((item, i) => {
            return (
                <li className='comics__item' key={i}>
                    <Link to={`/comics/${item.id}`}>
                        <img src={item.thumbnail} alt={item.title} className='comics__item-img'/>
                        <div className='comics__item-name'>{item.title}</div>
                        <div className='comics__item-price'>{item.price}</div>
                    </Link>
                </li>
            )
        })
        return (
            <ul className='comics__grid'>
                {items}
            </ul>
        )
    }


    return (
        <div className="comics__list">
            <Helmet>
                <meta
                    name="description"
                    content='marvel comics list'
                />
                <title>Marvel comics list.</title>
            </Helmet>
            {setContent(process, () => renderItems(comicsList), newItemLoading)}
            <button 
                disabled={newItemLoading} 
                style={{'display' : comicsEnded ? 'none' : 'block'}}
                className="button button__main button__long"
                onClick={() => onRequest(offset)}>
                <div className="inner">load more</div>
            </button>
        </div>
    )
}

export default ComicsList;