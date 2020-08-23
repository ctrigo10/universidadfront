import Vue from "vue";
import Router from "vue-router";
import NProgress from "nprogress";
import "nprogress/nprogress.css";
// import store from "../store.js";

let paths = [
  {
    path: "*",
    meta: { public: true },
    redirect: { path: "/404" },
  },
  {
    path: "/",
    meta: {},
    name: "root",
    component: () => import(`@/views/MainView.vue`),
  },
  {
    path: "/404",
    meta: { public: false },
    name: "not-found",
    component: () => import(`@/views/NotFound.vue`),
  },
  {
    path: "/universidades",
    meta: { public: false },
    name: "universidades",
    component: () => import(`@/views/universidades/UniversidadView.vue`),
    children: [ 
      { path: 'publico', component: () => import(`@/views/universidades/Publico.vue`) },
      { path: 'dashboard', component: () => import(`@/views/universidades/Dashboard.vue`) },
      { path: 'carreras', component: () => import(`@/views/universidades/Carreras.vue`) },
      { path: 'universidades', component: () => import(`@/views/universidades/Universidades.vue`) },
      { path: 'gestion/:sie', component: () => import(`@/views/universidades/UniversidadGestion.vue`) },
    ] 
  },
  
  /* {
    path: "/inicio",
    meta: { public: true },
    name: "inicio",
    component: () => import(`@/views/Inicio.vue`),
  },
  {
    path: "/autenticacion",
    meta: { public: true },
    name: "login",
    component: () => import(`@/views/Login.vue`),
  }, */
  /* {
    path: "/principal",
    meta: { public: false, requiresAuth: true },
    name: "principal",
    component: () => import(`@/views/Principal.vue`),
  }, */
  /* {
      path: '/usuarios',
      meta: { public: false, requiresAuth: true },
      name: 'usuarios',
      component: () => import(`@/views/Usuarios.vue`)
    },
    {
      path: '/roles',
      meta: { public: false, requiresAuth: true },
      name: 'roles',
      component: () => import(`@/views/Roles.vue`)
    }, */
];
Vue.use(Router);
const router = new Router({
  base: "/",
  mode: "hash",
  linkActiveClass: "active",
  routes: paths,
});

router.afterEach(() => {
  NProgress.done();
});
// const openRoutes = ["login"];
router.beforeEach((to, from, next) => {
  NProgress.start();
  if (to.matched.some((record) => record.meta.requiresAuth)) {
    /* if (store.getters.isAuthenticated) {
      next();
      return;
    } */
    next("/autenticacion");
  } else {
    next();
  }
  /* if(openRoutes.includes(to.name)) {
      next()
    } else if (store.getters.isAuthenticated){
      next()
    } else {
      next('/autenticacion')
    } */
});

export default router;
