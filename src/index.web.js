/**
 * @format
 */

import React from 'react';
import ReactDOM from 'react-dom';
import App from './src/App';
import {name as appName} from './app.json';

document.title = appName;

ReactDOM.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>,
    document.getElementById('root')
    );
