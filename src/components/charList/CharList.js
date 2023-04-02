import {useState, useEffect, useRef} from 'react';
import PropTypes from 'prop-types';

import Spinner from '../spinner/spinner';
import ErrorMessage from '../errorMessage/errorMessage';

import './charList.scss';
import useMarvelService from '../../services/MarvelService';


const CharList = (props) => {

    //setting new states
    const [chars, setChars] = useState([]);
    const [newItemLoading, setNewItemLoading] = useState(false);
    const [offset, setOffset] = useState(210);
    const [charEnded, setCharEnded] = useState(false);


    const {loading, error, get9Characters} = useMarvelService();

    // will be initialized only one time and called when component has been fully created on the page
    useEffect(() => {
        onRequest(offset, true);
    }, [])


    //if initial loading of 9 chars - set to false, if need load more chars on page - true
    const onRequest = (offset, initial) => {
        initial ? setNewItemLoading(false) : setNewItemLoading(true);
        
        get9Characters(offset)
            .then(onCharsLoaded)
    }


    const onCharsLoaded = (newChars) => {
        let ended = false;
        if (newChars.length < 9) {
            ended = true
        } // checking if new chars added to the list


        // used callback to follow previous state
        setChars(chars => [...chars, ...newChars]);
        setNewItemLoading(newItemLoading => false);
        setOffset(offset => offset + 9);
        setCharEnded(charEnded => ended);
         
    }

    //creating the array of selected char. references from the list on page
    const charsRef = useRef([]);



    const focusOnChar = (id) => {
        charsRef.current.forEach(item => item.classList.remove('char__item_selected')); // first passing through all items and removing style in case
        charsRef.current[id].classList.add('char__item_selected'); // adding style for focused char
        charsRef.current[id].focus(); //setting focus on current char
    }


    // mapping info for rendering all chars info
    function renderItems(arr) {
        const items =  arr.map((item, i) => {
            let imgStyle = {'objectFit' : 'cover'};
            if (item.thumbnail === 'http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg') {
                imgStyle = {'objectFit' : 'unset'};
            }

            // 'el' - reference on DOM element
            return (
                <li
                    className="char__item"
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
            )
        });

        return (
            <ul className="char__grid">
                {items}
            </ul>
            
        )
    }

    
    const items = renderItems(chars);

    const error_message = error ? <ErrorMessage/> :null;
    const spinner = loading && !newItemLoading ? <Spinner/> : null;


    // created case if loading still in progress or not - to show necc. info only
    // on button used arrow func. to pass into current offset 
    return (
        <div className="char__list">
            {error_message}
            {spinner}
            {items}
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