import React, {StrictMode} from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import './styles/responsive.css';
import App from './App';
import 'bootstrap-icons/font/bootstrap-icons.css';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <StrictMode>
        <App/>
    </StrictMode>
);

