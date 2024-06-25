import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Home from '../Components/Home';
import OpenExistingTODO from '../Components/OpenExistingTODO';

const userName = "Craig";
const routes = [
    {
      path: '/home',
      component: Home
    },
    {
      path: '/existingTODOList',
      component: OpenExistingTODO
    },
 
  ]


 export default routes;