import React from 'react';
import ReactDOM from 'react-dom';
import './styles/index.css';
import { createMainApp } from './components/App/App';
import * as serviceWorker from './serviceWorker';
import WebFontLoader from 'webfontloader';
import { BrowserRouter as Router } from 'react-router-dom';


WebFontLoader.load({
    google: {
        families: ['Roboto:300,400,500,700', 'Material Icons'],
    },
});


const MainApp = createMainApp();

ReactDOM.render(<Router><MainApp /></Router>, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();