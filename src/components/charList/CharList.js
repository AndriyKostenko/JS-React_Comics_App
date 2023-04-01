import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Spinner from '../spinner/spinner';
import ErrorMessage from '../errorMessage/errorMessage';

import './charList.scss';
import MarvelService from '../../services/MarvelService';


class CharList extends Component {

    state = {
        chars: [],
        loading: true,
        error: false,
        newItemLoading: false,
        offset: 210,
        charEnded: false
    }


    marvelService = new MarvelService();



    componentDidMount(){
        this.onRequest();
    }


    onRequest = (offset) => {
        this.onCharListLoading();
        this.marvelService.get9Characters(offset)
            .then(this.onCharsLoaded)
            .catch(this.onError)
    }

    onCharListLoading = () => {
        this.setState({
            newItemLoading: true
        })
    }



    //cathing error and notifiying user
    onError = () => {
        this.setState({
            loading: false,
            error: true
        })
    }

    onCharsLoaded = (newChars) => {
        let ended = false;
        if (newChars.length < 9) {
            ended = true
        } // checking if new chars added to the list

        this.setState(({chars, offset}) => ({
            chars: [...chars, ...newChars], 
            loading: false,
            newItemLoading: false,
            offset: offset + 9,
            charEnded: ended
        })) // when all data succss. loaded - loading will set to false
    }

    //creating the array of selected char. from the list on page
    charsRef = [];

    //pushing all loaded chars to an array  
    setRef = (ref) => {
        this.charsRef.push(ref);
    }

    focusOnChar = (i) => {
        this.charsRef.forEach(item => item.classList.remove('char__item_selected')); // first passing through all items and removing style in case
        this.charsRef[i].classList.add('char__item_selected'); // adding style for focused char
        this.charsRef[i].focus(); //setting focus on current char
    }


    // mapping info for rendering all chars info
    renderItems(arr) {
        const items =  arr.map((item, i) => {
            let imgStyle = {'objectFit' : 'cover'};
            if (item.thumbnail === 'http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg') {
                imgStyle = {'objectFit' : 'unset'};
            }

            return (
                <li
                    className="char__item"
                    ref={this.setRef}
                    key={item.id}
                    onClick={() => {
                        this.props.onCharSelected(item.id);
                        this.focusOnChar(i);
                    }}>
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

    render () {
        const {chars, loading, error, newItemLoading, offset, charEnded} = this.state;

        const items = this.renderItems(chars);

        const error_message = error ? <ErrorMessage/> :null;
        const spinner = loading ? <Spinner/> : null;
        const content = !(loading || error) ? items : null;

        // created case if loading still in progress or not - to show necc. info only
        // on button used arrow func. to pass into current offset 
        return (
            <div className="char__list">
                {error_message}
                {spinner}
                {content}
                <button className='button button__main button__long'
                        disabled={newItemLoading}
                        style={{'display': charEnded ? 'none' : 'block'}}
                        onClick={() => this.onRequest(offset)}>
                    <div className='inner'>Load more</div>
                </button>
            </div>
        )
    }
    
}

CharList.propTypes = {
    onCharSelected: PropTypes.func
}


export default CharList;