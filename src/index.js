import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
// import './input.css';
import App from './App';
import Projects from './component/projects';
import Blogs from './component/blogs';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
// import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  // <React.StrictMode>
  <BrowserRouter>
    <Routes>
      <Route path='/' element={<App />}/>
        {/* <Redirect to='/main' /> */}
      {/* </Route> */}
      <Route path="/projects" exact element={<Projects />} />
      <Route path="/blogs" exact element={<Blogs />} />
    </Routes>
  </BrowserRouter>
  // </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals();
