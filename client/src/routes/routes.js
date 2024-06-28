import Home from '../Components/Home';
import ListDetails from '../Components/ListDetails';
import CreateList from '../Components/CreateList';

const routes = [
  {
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