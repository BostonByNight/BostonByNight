import "./wdyr";
import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import {HashRouter} from "react-router-dom";
import * as serviceWorkerRegistration from './serviceWorkerRegistration';
import reportWebVitals from './reportWebVitals';
import {requestDesktopNotificationPermission} from "./_base/notification-utils";
import { createRoot } from 'react-dom/client';

// Older API
// The project will keep the older React compatibility for now, because the new version of React still has some problems.
// Test again with the official release, in the meantime changed the package.json to reference version 17.0.2, having that
// nothing in the app is using the new functionalities of React
const root = createRoot(document.getElementById('root'))
root.render(
    <React.StrictMode>
        <HashRouter>
            <App />
        </HashRouter>
    </React.StrictMode>
);

// Newer API
// Change to this management when the new React library will be released
// const container = document.getElementById('root');
//
// const root = ReactDOM.createRoot(container);
//
// root.render(
//     <React.StrictMode>
//         <HashRouter>
//             <App />
//         </HashRouter>
//     </React.StrictMode>
// );

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://cra.link/PWA
serviceWorkerRegistration.register();

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.debug))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

document.addEventListener("DOMContentLoaded", requestDesktopNotificationPermission, false);