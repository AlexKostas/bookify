import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { AuthProvider } from './context/AuthProvider';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import {SearchProvider} from "./context/SearchContext";
import {FilterOptionsProvider} from "./context/FilterOptionsContext";

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
          <SearchProvider>
              <FilterOptionsProvider>
                <Routes>
                  <Route path="/*" element={<App />} />
                </Routes>
            </FilterOptionsProvider>
          </SearchProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById('root')
);