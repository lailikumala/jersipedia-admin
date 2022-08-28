/*!

=========================================================
* Paper Dashboard React - v1.3.1
=========================================================

* Product Page: https://www.creative-tim.com/product/paper-dashboard-react
* Copyright 2022 Creative Tim (https://www.creative-tim.com)

* Licensed under MIT (https://github.com/creativetimofficial/paper-dashboard-react/blob/main/LICENSE.md)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
import { 
  Dashboard,
  EditJersey,
  EditLiga,
  Icons,
  ListJersey,
  ListLiga,
  TambahJersey,
  TambahLiga,
} from "./views";

var routes = [
  {
    path: "/dashboard",
    name: "Beranda",
    icon: "nc-icon nc-bank",
    component: Dashboard,
    layout: "/admin",
    sidebar: true,

  },
  {
    path: "/liga",
    name: "Master Liga",
    icon: "nc-icon nc-world-2",
    component: ListLiga,
    layout: "/admin",
    sidebar: true,
  },
  {
    path: "/liga/tambah",
    name: "Tambah Liga",
    component: TambahLiga,
    layout: "/admin",
    sidebar: false,
  },
  {
    path: "/liga/edit/:id",
    name: "Edit Liga",
    component: EditLiga,
    layout: "/admin",
    sidebar: false,
  },
  {
    path: "/jersey",
    name: "Master Jersey",
    icon: "nc-icon nc-cart-simple",
    component: ListJersey,
    layout: "/admin",
    sidebar: true,
  },
  {
    path: "/jersey/tambah",
    name: "Tambah Jersey",
    component: TambahJersey,
    layout: "/admin",
    sidebar: false,
  },
  {
    path: "/jersey/edit/:id",
    name: "Edit Jersey",
    component: EditJersey,
    layout: "/admin",
    sidebar: false,
  },
  {
    path: "/icons",
    name: "Ikon",
    icon: "nc-icon nc-diamond",
    component: Icons,
    layout: "/admin",
    sidebar: true,
  },
];
export default routes;
