import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Home from '../Components/Home';
import NewTODO from '../Components/NewTODO'

const userName = "Craig";
const routes = [
  {
    path: '/newTODO',
    component: NewTODO
  }, 
  {
    path: '/',
    component: Home
  },
  ]


 export default routes;