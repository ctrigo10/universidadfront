import Vue from "vue";
import Router from "vue-router";
import NProgress from "nprogress";
import "nprogress/nprogress.css";
import store from "../store.js";
import general from "@/services/general";

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
    path: "/preuniversitario",
    meta: { public: true },
    component: () => import(`@/views/preuniversitario/Inicio.vue`),
    children: [
      {
        path: "",
        meta: { public: true },
        name: "pre-escritorio",
        component: () => import(`@/views/preuniversitario/Publico.vue`),
      },
      {
        path: "universidades",
        meta: { public: true },
        name: "pre-universidad",
        component: () => import(`@/views/preuniversitario/Universidad.vue`),
      },
      {
        path: "inscripcion",
        meta: { public: true },
        name: "pre-inscripcion",
        component: () => import(`@/views/preuniversitario/Inscripcion.vue`),
      },
      {
        path: "aptitud/numerica",
        meta: { public: true },
        name: "pre-aptitud-numerica",
        component: () => import(`@/views/preuniversitario/AptitudNumerica.vue`),
      },
      {
        path: "aptitud/verbal",
        meta: { public: true },
        name: "pre-aptitud-verbal",
        component: () => import(`@/views/preuniversitario/AptitudVerbal.vue`),
      },
      {
        path: "aptitud/mecanica",
        meta: { public: true },
        name: "pre-aptitud-mecanica",
        component: () => import(`@/views/preuniversitario/AptitudMecanica.vue`),
      },
      {
        path: "aptitud/espacial",
        meta: { public: true },
        name: "pre-aptitud-espacial",
        component: () => import(`@/views/preuniversitario/AptitudEspacial.vue`),
      },
      {
        path: "aptitud/abstracta",
        meta: { public: true },
        name: "pre-aptitud-abstracta",
        component: () =>
          import(`@/views/preuniversitario/AptitudAbstracta.vue`),
      },
      {
        path: "interes/ocupacional",
        meta: { public: true },
        name: "pre-interes-ocupacional",
        component: () =>
          import(`@/views/preuniversitario/InteresOcupacional.vue`),
      },
      {
        path: "resultado/prueba",
        meta: { public: true },
        name: "pre-resultado-prueba",
        component: () => import(`@/views/preuniversitario/ResultadoPrueba.vue`),
      },
    ],
  },
  /* {
    path: "/preuniversitario/orientacion/vocacional",
    meta: { public: false },
    name: "orientacion-vocacional",
    component: () => import(`@/views/preuniversitario/Publico.vue`),
  }, */
  /* {
    path: "/preuniversitario/universidades",
    meta: { public: false },
    name: "universidades",
    component: () => import(`@/views/preuniversitario/Publico.vue`),
  }, */
  {
    path: "/universidades",
    meta: { public: false },
    // name: "universidades",
    component: () =>
      import(`@/views/universidades/layout/UniversidadLayout.vue`),
    children: [
      {
        path: "",
        name: "universidades-publico",
        component: () => import(`@/views/universidades/Publico.vue`),
      },
      {
        path: "dashboard",
        name: "universidades-dashboard",
        // meta: { requiresAuth: true },
        component: () => import(`@/views/universidades/Dashboard.vue`),
      },
      {
        path: "carreras",
        name: "universidades-carreras",
        meta: { requiresAuth: true },
        component: () => import(`@/views/universidades/Carreras.vue`),
      },
      {
        path: "universidades",
        name: "universidades-universidades",
        meta: { requiresAuth: true },
        component: () => import(`@/views/universidades/Universidades.vue`),
      },
      {
        path: "gestion/:sie",
        name: "universidades-universidades-gestion",
        meta: { requiresAuth: true },
        component: () => import(`@/views/universidades/UniversidadGestion.vue`),
      },
      {
        path: "academico",
        name: "universidades-academico",
        meta: { requiresAuth: true },
        component: () => import(`@/views/universidades/Academico.vue`),
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
        path: "universidades/carreras",
        name: "becas-carreras",
        component: () => import("@/views/becas/Carreras.vue"),
      },
      {
        path: "universidades/carreras/solicitudes",
        name: "becas-solicitudes",
        meta: { requiresAuth: true },
        component: () => import("@/views/becas/Solicitudes.vue"),
      },
      {
        path: "seguimiento",
        name: "becas-seguimiento",
        component: () => import(`@/views/becas/Seguimiento.vue`),
      },
      {
        path: "convocatoria",
        name: "becas-convocatorias",
        meta: { requiresAuth: true, UniversidadTecnicoBecasNacional: true },
        component: () => import(`@/views/becas/Convocatoria.vue`),
      },
      {
        path: "usuarios",
        name: "becas-usuarios",
        meta: { requiresAuth: true, UniversidadTecnicoBecasNacional: true },
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
      if (to.meta.UniversidadTecnicoBecasNacional) {
        let op = false;
        for (let rol of general.getUser().roles) {
          if (rol.rol_tipo.rol == "Universidad Tecnico Becas Nacional")
            op = true;
        }
        op == true ? next() : next("/");
      }
      next();
      //return;
    } else {
      /* if (ruta == "preuniversitario") {
        next("/preuniversitario");
      }  */
      next("/");
    }
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
