import {useState, useEffect, useRef, useMemo} from 'react';
import PropTypes from 'prop-types';
import {CSSTransition, TransitionGroup} from 'react-transition-group';

import Spinner from '../spinner/spinner';
import ErrorMessage from '../errorMessage/errorMessage';
import useMarvelService from '../../services/MarvelService';


import './charList.scss';


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

const CharList = (props) => {

    //setting new states
    const [chars, setChars] = useState([]);
    const [newItemLoading, setNewItemLoading] = useState(false);
    const [offset, setOffset] = useState(210);
    const [charEnded, setCharEnded] = useState(false);


    const {get9Characters, process, setProcess} = useMarvelService();

    // will be initialized only one time and called when component has been fully created on the page
    useEffect(() => {
        onRequest(offset, true);
        // eslint-disable-next-line
    }, [])


    //if initial loading of 9 chars - set to false, if need load more chars on page - true
    const onRequest = (offset, initial) => {
        initial ? setNewItemLoading(false) : setNewItemLoading(true);
        
        get9Characters(offset)
            .then(onCharsLoaded)
            .then(()=> setProcess('confirmed'))
    }


    const onCharsLoaded = (newChars) => {
        let ended = false;
        if (newChars.length < 9) {
            ended = true
        } // checking if new chars added to the list


        // used callback to follow previous state
        setChars([...chars, ...newChars]);
        setNewItemLoading(false);
        setOffset(offset + 9);
        setCharEnded(ended);
         
    }

    //creating the array of selected char. references from the list on page
    const charsRef = useRef([]);



    const focusOnChar = (id) => {
        charsRef.current.forEach(item => item.classList.remove('char__item_selected')); // first passing through all items and removing style in case
        charsRef.current[id].classList.add('char__item_selected'); // adding style for focused char
        charsRef.current[id].focus(); //setting focus on current char
    }


    // mapping info for rendering all chars info
    // added animation for li of chars with react-transition-group
    function renderItems(arr) {
        const items =  arr.map((item, i) => {
            let imgStyle = {'objectFit' : 'cover'};
            if (item.thumbnail === 'http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg') {
                imgStyle = {'objectFit' : 'unset'};
            }

            // 'el' - reference on DOM element
            //applied transition anim. to list of chars with transition-group lib.
            return (
                <CSSTransition key={item.id} timeout={500} classNames="char__item">
                    <li
                        className="char__item"
                        tabIndex={0}
                        ref={el => charsRef.current[i] = el}
                        key={item.id}
                        onClick={() => {
                            props.onCharSelected(item.id);
                            focusOnChar(i);
                        }}
                        onKeyDown={(event) => {
                            if (event.key === ' ' || event.key === "Enter") {
                                props.onCharSelected(item.id);
                                focusOnChar(i)
                            }
                        }}
                        >
                            <img src={item.thumbnail} alt={item.name} style={imgStyle}/>
                            <div className="char__name">{item.name}</div>
                    </li>
                </CSSTransition>

            )
        });

        return (
            <ul className="char__grid">
                <TransitionGroup component={null}>
                    {items}
                </TransitionGroup>
            </ul>
            
        )
    }

    // created var. elements with hook 'useMemo()' to save current state and to render only in case of process changes (states)
    const elements = useMemo(()=> {
        return setContent(process, () => renderItems(chars), newItemLoading);
        // eslint-disable-next-line
    }, [process])


    // created case if loading still in progress or not - to show necc. info only.
    // on button used arrow func. to pass into current offset 
    return (
        <div className="char__list">
            {elements}
            <button className='button button__main button__long'
                    disabled={newItemLoading}
                    style={{'display': charEnded ? 'none' : 'block'}}
                    onClick={() => onRequest(offset)}>
                <div className='inner'>Load more</div>
            </button>
        </div>
    )
}
    


CharList.propTypes = {
    onCharSelected: PropTypes.func
}


export default CharList;