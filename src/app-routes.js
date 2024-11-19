import { HomePage, Appointment, Item, Specialty, DoctorList,Receipt } from './pages';
import { withNavigationWatcher } from './contexts/navigation';

const routes = [
    {
        path: '/home',
        element: HomePage
    },
    {
        path: '/appointment',
        element: Appointment
    },
    {
        path: '/item',
        element: Item
    },
    {
        path: '/specialty',
        element: Specialty
    },
    {
        path:'/doctor',
        element: DoctorList
    },
    {
        path:'receipt',
        element: Receipt
    }
];

export default routes.map(route => {
    return {
        ...route,
        element: withNavigationWatcher(route.element, route.path)
    };
});
