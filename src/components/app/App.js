import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import AppHeader from "../appHeader/AppHeader";
import MainPage from "../pages/MainPage";
import ComicsPage from "../pages/ComicsPage";

const App = () => {

    // covering all components with a Router for correct working of Routes
    return (
        <Router>
            <div className="app">
                <AppHeader/>
                <main>
                    <Routes>
                        <Route path="/" element={<MainPage/>}></Route>
                        <Route path="/comics" element={<ComicsPage/>}></Route>
                    </Routes>
                </main>
            </div>
        </Router>
    )
}



export default App;