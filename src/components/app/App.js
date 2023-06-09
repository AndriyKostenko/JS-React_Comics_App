import { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import AppHeader from "../appHeader/AppHeader";
import Spinner from '../spinner/spinner';

const Page404 = lazy(() => import('../pages/404'));
const MainPage = lazy(() => import('../pages/MainPage'));
const ComicsPage = lazy(() => import('../pages/ComicsPage'));
const SingleComicPage = lazy(() => import('../pages/SingleComicPage'));
const SingleCharacterPage = lazy(() => import('../pages/SingleCharacterPage'));


const App = () => {

    // covering all components with a Router for correct working of Routes.
    // dynamic creation of route with params through adding ':comicId' (can be different value)
    // covering all routes with Suspense for correct dynamic loading of components 
    return (
        <Router>
            <div className="app">
                <AppHeader/>
                <main>
                    <Suspense fallback={<Spinner/>}>
                        <Routes>
                            <Route path="/" 
                                element={<MainPage/>}/>
                            <Route path="/comics" 
                                element={<ComicsPage/>}/>
                            <Route path="/comics/:comicId" 
                                element={<SingleComicPage/>}/>
                            <Route path="/characters/:charId"
                                element={<SingleCharacterPage/>}/>
                            <Route path="*"
                                element={<Page404/>}/>
                        </Routes>
                    </Suspense>

                </main>
            </div>
        </Router>
    )
}



export default App;