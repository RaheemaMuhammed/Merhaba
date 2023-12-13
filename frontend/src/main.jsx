import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { persistStore } from 'redux-persist'
import { PersistGate} from 'redux-persist/integration/react'
import { Provider } from 'react-redux'
import { store } from './Redux/Store.js'

let persistor= persistStore(store)
ReactDOM.createRoot(document.getElementById('root')).render(
  // <React.StrictMode>
    <Provider store={store}>
      <PersistGate persistor={persistor}></PersistGate>

    <App />
    </Provider>
  // </React.StrictMode>
  ,
)




