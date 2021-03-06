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

  //Preuniversitario
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
        path: "inscripciones",
        meta: { public: false },
        name: "pre-inscripciones",
        component: () =>
          import(`@/views/preuniversitario/ListaInscripcion.vue`),
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
        path: "estilo/aprendizaje",
        meta: { public: true },
        name: "pre-estilo-aprendizaje",
        component: () =>
          import(`@/views/preuniversitario/EstiloAprendizaje.vue`),
      },
      {
        path: "resultado/prueba",
        meta: { public: true },
        name: "pre-resultado-prueba",
        component: () => import(`@/views/preuniversitario/ResultadoPrueba.vue`),
      },
      {
        path: "reporte/prueba",
        meta: { public: false },
        name: "pre-reporte-prueba",
        component: () => import(`@/views/preuniversitario/ReportePrueba.vue`),
      },
      {
        path: "habilitar/curso",
        meta: { public: false },
        name: "pre-habilitar-curso",
        component: () => import(`@/views/preuniversitario/HabilitarCurso.vue`),
      },
      {
        path: "comunicado",
        meta: { public: false },
        name: "pre-comunicado",
        component: () => import(`@/views/preuniversitario/Comunicado.vue`),
      },
      {
        path: "categoria",
        meta: { public: false },
        name: "pre-categoria",
        component: () => import(`@/views/preuniversitario/Categoria.vue`),
      },
      {
        path: "pregunta",
        meta: { public: false },
        name: "pre-pregunta",
        component: () => import(`@/views/preuniversitario/Pregunta.vue`),
      },
      {
        path: "respuesta",
        meta: { public: false },
        name: "pre-respuesta",
        component: () => import(`@/views/preuniversitario/Opcion.vue`),
      },
    ],
  },

  //Universidades
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
        component: () => import(`@/views/universidades/publico/Publico.vue`),
      },
      {
        path: "informacion/:sie",
        name: "universidades-publico-informacion",
        component: () =>
          import(`@/views/universidades/publico/Informacion.vue`),
      },
      {
        path: "dashboard",
        name: "universidades-dashboard",
        meta: { requiresAuth: true },
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
        path: "academico",
        name: "universidades-admin-home",
        meta: { requiresAuth: true },
        component: () => import(`@/views/universidades/admin/Home.vue`),
      },
      {
        path: "admin/sedes-subsedes",
        name: "universidades-admin-sedes-subsedes",
        component: () =>
          import(`@/views/universidades/admin/ListSedesSubsedes.vue`),
      },
      {
        path: "admin/academico",
        name: "universidades-admin-information",
        component: () => import(`@/views/universidades/admin/Information.vue`),
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
      {
        path: "tramites",
        name: "universidades-tramites",
        meta: { requiresAuth: true },
        component: () => import(`@/views/universidades/Tramites.vue`),
      },
      {
        path: "buscar-estudiante",
        name: "estudiante-buscar",
        meta: { requiresAuth: true },
        component: () =>
          import(`@/views/universidades/estudiante/BuscarEstudiante.vue`),
      },
      {
        path: "usuarios-permisos",
        name: "universidades-usuarios-permisos",
        meta: { requiresAuth: true },
        component: () => import(`@/views/universidades/UsuariosPermisos.vue`),
      },
      {
        path: "gestion-operativos",
        name: "universidades-gestion-operativos",
        meta: { requiresAuth: true },
        component: () => import(`@/views/universidades/GestionOperativos.vue`),
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
        path: "universidades/carreras/solicitud",
        name: "becas-solicitud",
        component: () => import("@/views/becas/Solicitud.vue"),
      },
      {
        path: "seguimiento",
        props: true,
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
      {
        path: "solicitud/:solicitud_id/pdf",
        name: "becas-solicitud_pdf",
        props: true,
        component: () => import(`@/components/becas/shared/SolicitudPdf.vue`),
      },
    ],
  },
];
Vue.use(Router);
const router = new Router({
  base: "/",
  //mode: "hash",
  mode: "history",
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
