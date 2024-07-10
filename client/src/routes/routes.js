import Home from '../Components/Home';
import ListDetails from '../Components/ListDetails';
import CreateList from '../Components/CreateList';
import PrivacyPolicy from '../Components/PrivacyPolicy';

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
  },
  {
    path: '/privacyandpolicies',
    component: PrivacyPolicy
  },
];

export default routes;