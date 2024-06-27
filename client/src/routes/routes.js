import Home from '../Components/Home';
import ListDetails from '../Components/ListDetails';
import CreateList from '../Components/CreateList';

const routes = [
  {
<<<<<<< HEAD
    path: '/newTODO',
    component: NewTODO
  }, 
  {
    path: '/newTODO/to-do-list/:listId',
    component: NewTODO
  }, 
  {
=======
>>>>>>> 96d8a1b (Testing React Components)
    path: '/',
    component: Home
  },
  {
    path: '/list/:listId',
    component: ListDetails
  },
  {
    path: '/create-list',
    component: CreateList
  }
];

export default routes;