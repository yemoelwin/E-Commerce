import React from 'react';
import ReactDOM from "react-dom/client";
// import './index.css';
import App from './App';
import { Provider } from 'react-redux';
import store from './app/store';
import { persistStore } from 'redux-persist';
import { PersistGate } from 'redux-persist/integration/react'


const root = ReactDOM.createRoot(document.getElementById('root'));
let persistor = persistStore(store);

root.render(
    <Provider store={store}>
        <PersistGate persistor={persistor}>
            {/* <React.StrictMode> */}
                <App />
            {/* </React.StrictMode> */}
        </PersistGate>
    </Provider>
)

// function Root() {
//     return (
//         <Provider store={store}>
//         <PersistGate loading={null} persistor={persistor}>
//             <App />
//         </PersistGate>
//         </Provider>
//     );
// }

// export default Root;



// import reportWebVitals from './reportWebVitals';

// const root = ReactDOM.createRoot(document.getElementById('root'));
// root.render(<App />);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals();
