/*!

=========================================================
* Argon Dashboard React - v1.1.0
=========================================================

* Product Page: https://www.creative-tim.com/product/argon-dashboard-react
* Copyright 2019 Creative Tim (https://www.creative-tim.com)
* Licensed under MIT (https://github.com/creativetimofficial/argon-dashboard-react/blob/master/LICENSE.md)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
import Index from "./views/Index.js";
import AdminRezervacije from "./views/AdminRezervacije.js";
import AdminLokacije from "./views/AdminLokacije.js";
import AdminVozila from "./views/AdminVozila.js";

var adminRoutes = [
    {
        path: "/index",
        name: "Informacije",
        icon: "ni ni-tv-2",
        component: Index,
        layout: "/admin"
      },
      {
        path: "/najmovi",
        name: "Najmovi",
        icon: "ni ni-tag",
        component: AdminRezervacije,
        layout: "/admin"
      },
      {
        path: "/vozila",
        name: "Vozila",
        icon: "fas fa-car",
        component: AdminVozila,
        layout: "/admin"
      },
      {
        path: "/podruznice",
        name: "Podružnice",
        icon: "ni ni-square-pin",
        component: AdminLokacije,
        layout: "/admin"
      },
];
export default adminRoutes;
