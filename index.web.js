/**
 * @format
 */

import React from 'react';
import ReactDOM from 'react-dom';
import App from './src/App';
import {displayName as appDisplayName} from './app.json';

document.title = appDisplayName;

ReactDOM.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>,
    document.getElementById('root')
    );
