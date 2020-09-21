import Vue from "vue";
import Router from "vue-router";
import NProgress from "nprogress";
import "nprogress/nprogress.css";
import store from "../store.js";
import general from '@/services/general'

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
    path: "/prefacultad",
    meta: { public: true },
    // name: "prefacultads",
    component: () => import(`@/views/prefacultad/Inicio.vue`),
    children: [
      {
        path: "",
        meta: { public: true },
        name: "orientacion",
        component: () => import(`@/views/prefacultad/Publico.vue`),
      },
      {
        path: "orientacion/vocacional",
        meta: { public: true },
        name: "orientacion-vocacional1",
        component: () =>
          import(`@/views/prefacultad/OrientacionVocacional.vue`),
      },
      {
        path: "universidades",
        meta: { public: true },
        name: "universidad",
        component: () => import(`@/views/prefacultad/Universidad.vue`),
      },
      /* {
        path: "universidades",
        component: () => import(`@/views/universidades/Universidades.vue`),
      }, */
    ],
  },
  /* {
    path: "/prefacultad/orientacion/vocacional",
    meta: { public: false },
    name: "orientacion-vocacional",
    component: () => import(`@/views/prefacultad/Publico.vue`),
  }, */
  /* {
    path: "/prefacultad/universidades",
    meta: { public: false },
    name: "universidades",
    component: () => import(`@/views/prefacultad/Publico.vue`),
  }, */
  {
    path: "/universidades",
    meta: { public: false },
    name: "universidades",
    component: () => import(`@/views/universidades/UniversidadView.vue`),
    children: [
      {
        path: "",
        component: () => import(`@/views/universidades/Publico.vue`),
      },
      {
        path: "dashboard",
        component: () => import(`@/views/universidades/Dashboard.vue`),
      },
      {
        path: "carreras",
        component: () => import(`@/views/universidades/Carreras.vue`),
      },
      {
        path: "universidades",
        component: () => import(`@/views/universidades/Universidades.vue`),
      },
      {
        path: "gestion/:sie",
        component: () => import(`@/views/universidades/UniversidadGestion.vue`),
      },
    ],
  },

  //Becas
  {
    path: "/becas",
    meta: { public: false },
    name: "becasLayout",
    redirect: "becas/seguimiento",
    component: () => import(`@/views/becas/layout/BecasLayout.vue`),
    children: [
      {
        path: "escritorio",
        name: "becas-escritorio",
        meta: { requiresAuth: true },
        component: () => import(`@/views/becas/Escritorio.vue`),
      },
      {
        path: "universidades",
        name: "becas-universidades",
        component: () => import(`@/views/becas/Universidades.vue`),
      },
      {
        path: 'universidades/carreras',
        name: "becas-carreras",
        component: () =>import('@/views/becas/Carreras.vue'),
      },
      {
        path: 'universidades/carreras/solicitudes',
        name: "becas-solicitudes",
        meta: { requiresAuth: true },
        component: () =>import('@/views/becas/Solicitudes.vue'),
      },
      {
        path: "seguimiento",
        name: "becas-seguimiento",
        component: () => import(`@/views/becas/Seguimiento.vue`),
      },
      {
        path: "convocatoria",
        name: "becas-convocatorias",
        meta: { requiresAuth: true , UniversidadTecnicoBecasNacional : true},
        component: () => import(`@/views/becas/Convocatoria.vue`),
      },
      {
        path: "usuarios",
        name: "becas-usuarios",
        meta: { requiresAuth: true , UniversidadTecnicoBecasNacional : true},
        component: () => import(`@/views/becas/Usuarios.vue`),
      },
    ],
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
     if (store.getters.isAuthenticated) {
       if(to.meta.UniversidadTecnicoBecasNacional){
         let op = false;
          for(let rol of general.getUser().roles){
            if(rol.rol_tipo.rol == "Universidad Tecnico Becas Nacional")
              op = true;
          }
          op == true ? next():next("/");
       }
      next();
      //return;
    }else
    /* if (ruta == "prefacultad") {
      next("/prefacultad");
    }  */
    next("/");
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
