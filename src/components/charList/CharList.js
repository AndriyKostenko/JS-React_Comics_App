import { Component } from 'react';
import Spinner from '../spinner/spinner';
import ErrorMessage from '../errorMessage/errorMessage';

import './charList.scss';
import MarvelService from '../../services/MarvelService';


class CharList extends Component {

    state = {
        chars: [],
        loading: true,
        error: false
    }

    marvelService = new MarvelService();


    componentDidMount(){
        this.marvelService.get9Characters() // after getting infro for 9 chars all info will be sent to func onCharsLoaded()
            .then(this.onCharsLoaded)
            .catch(this.onError)
    }



    //cathing error and notifiying user
    onError = () => {
        this.setState({
            loading: false,
            error: true
        })
    }

    onCharsLoaded = (chars) => {
        this.setState({
            chars, 
            loading: false}) // when all data succss. loaded - loading will set to false
    }

    // mapping info for rendering all chars info
    renderItems(arr) {
        const items =  arr.map((item) => {
            let imgStyle = {'objectFit' : 'cover'};
            if (item.thumbnail === 'http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg') {
                imgStyle = {'objectFit' : 'unset'};
            }

            return (
                <li
                    className="char__item"
                    key={item.id}>
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
        const {chars, loading, error} = this.state;

        const items = this.renderItems(chars);

        const error_message = error ? <ErrorMessage/> :null;
        const spinner = loading ? <Spinner/> : null;
        const content = !(loading || error) ? items : null;

        // created case if loading still in progress or not - to show necc. info only
        return (
            <div className="char__list">
                {error_message}
                {spinner}
                {content}
                <button className='button button__main button__long'>
                    <div className='inner'>Load more</div>
                </button>
            </div>
        )
    }
    
}

export default CharList;