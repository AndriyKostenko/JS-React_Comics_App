import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

import Spinner from '../spinner/spinner';
import ErrorMessage from '../errorMessage/errorMessage';
import Skeleton from '../skeleton/Skeleton';

import './charInfo.scss';
import useMarvelService from '../../services/MarvelService';


const CharInfo = (props) => {
    // created state (char - all null), by default loading - true before getting info
    const [char, setChar] = useState(null);

    
    const {loading, error, getCharacter, clearError} = useMarvelService();

    // called when component has been fully created and following for changes in charId
    // comparing prev charId and new charId

    useEffect(() => {
        updateChar();
        // eslint-disable-next-line
    }, [props.charId]) 
        

    const updateChar = () => {
        const {charId} = props;
        if (!charId) {
            return;
        }
        clearError();

        getCharacter(charId) // when we receive a char info it will be sent to method onCharLoaded as an arg. 'char'
            .then(onCharLoaded) // otherwise - cath the error

    }

    // taking arg 'char' from method updateChar if successed 
    const onCharLoaded = (char) => {
        setChar(char);
    }




    const skeleton = char || loading || error ? null : <Skeleton/>
    const error_message = error ? <ErrorMessage/> :null;
    const spinner = loading ? <Spinner/> : null;
    const content = !(loading || error || !char) ? <View char={char}/> : null;
    
    return (
        <div className="char__info">
            {skeleton}
            {error_message}
            {spinner}
            {content}
        </div>
    )
}
    


const View = ({char}) => {
    const {name, description, thumbnail, homepage, wiki, comics} = char;

    //checking for missed character's photo and fixing error photo from server
    let imgStyle = {'objectFit' : 'cover'};
    if (thumbnail === 'http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg') {
        imgStyle = {'objectFit': 'contain'}
    }
    return (

        <>
            <div className="char__basics">
                    <img src={thumbnail} alt={name} style={imgStyle}/>
                    <div>
                        <div className="char__info-name">{name}</div>
                        <div className="char__btns">
                            <a href={homepage} className="button button__main">
                                <div className="inner">homepage</div>
                            </a>
                            <a href={wiki} className="button button__secondary">
                                <div className="inner">Wiki</div>
                            </a>
                        </div>
                    </div>
                </div>
                <div className="char__descr">
                    {description}
                </div>
                <div className="char__comics">Comics:</div>
                <ul className="char__comics-list">
                    {comics.length > 0 ? null : 'There is no comics with this character.'}

                    { 
                        comics.map((item, i) => {

                            if (i >= 10){     //showing only 10 comics with char
                                // eslint-disable-next-line
                                return;
                            }
                            return ( 
                                <li key={i} className="char__comics-item">
                                    {item.name}
                                </li> 
                                )
                        })
                    }

                    
                    
                </ul>
        </>
    )
}

CharInfo.propTypes = {
    charId: PropTypes.number
}

export default CharInfo;