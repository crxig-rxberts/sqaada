import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Home from '../Components/Home'

const userName = "Craig";
const routes = [
    {
      path: '/home',
      component: Home,
      userName: "John Doe"
    },
 
  ]


 export default routes;