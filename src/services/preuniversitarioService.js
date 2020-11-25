// import axios from "axios";
// import general from '@/services/general'
export default {
  setMenuPreuniversitario(rol_id) {
    let menu = [];
    switch (rol_id) {
      // 49 Universidad Tecnico Preuniversitario Nacional
      case 52: //Universidad Responsable Preuniversitario
        menu = [
          {
            text: "Inicio",
            path: "/preuniversitario",
            icon: "mdi-view-dashboard",
          },
          {
            text: "Universidades",
            path: "/preuniversitario/universidades",
            icon: "mdi-bank",
          },
          {
            text: "Inscripción",
            path: "/preuniversitario/inscripcion",
            icon: "mdi-file-account",
          },
          {
            text: "Test Vocacional",
            icon: "mdi-account-check",
            submenu: [
              {
                text: "Aptitud numérica",
                path: "/preuniversitario/aptitud/numerica",
                icon: "mdi-check",
              },
              {
                text: "Aptitud verbal",
                path: "/preuniversitario/aptitud/verbal",
                icon: "mdi-check",
              },
              {
                text: "Aptitud mecánica",
                path: "/preuniversitario/aptitud/mecanica",
                icon: "mdi-check",
              },
              {
                text: "Aptitud espacial",
                path: "/preuniversitario/aptitud/espacial",
                icon: "mdi-check",
              },
              {
                text: "Aptitud abstracta",
                path: "/preuniversitario/aptitud/abstracta",
                icon: "mdi-check",
              },
              {
                text: "Interes ocupacional",
                path: "/preuniversitario/interes/ocupacional",
                icon: "mdi-check",
              },
              {
                text: "Estilo aprendizaje",
                path: "/preuniversitario/estilo/aprendizaje",
                icon: "mdi-check",
              },
              {
                text: "Resultado",
                path: "/preuniversitario/resultado/prueba",
                icon: "mdi-check",
              },
            ],
          },
          {
            text: "Configuración",
            icon: "mdi-cog",
            submenu: [
              {
                text: "Habilitar inscripción",
                path: "/preuniversitario/habilitar",
                icon: "mdi-check",
              },
              {
                text: "Categoría",
                path: "/preuniversitario/categoria",
                icon: "mdi-check",
              },
              {
                text: "Preguntas",
                path: "/preuniversitario/pregunta",
                icon: "mdi-check",
              },
              {
                text: "Opciones",
                path: "/preuniversitario/opcion",
                icon: "mdi-check",
              },
            ],
          },
        ];
        break;
      default:
        menu = [
          {
            text: "Inicio",
            path: "/preuniversitario",
            icon: "mdi-view-dashboard",
          },
          {
            text: "Universidades",
            path: "/preuniversitario/universidades",
            icon: "mdi-bank",
          },
          {
            text: "Inscripción",
            path: "/preuniversitario/inscripcion",
            icon: "mdi-file-account",
          },
          {
            text: "Test Vocacional",
            icon: "mdi-account-check",
            submenu: [
              {
                text: "Aptitud numérica",
                path: "/preuniversitario/aptitud/numerica",
                icon: "mdi-check",
              },
              {
                text: "Aptitud verbal",
                path: "/preuniversitario/aptitud/verbal",
                icon: "mdi-check",
              },
              {
                text: "Aptitud mecánica",
                path: "/preuniversitario/aptitud/mecanica",
                icon: "mdi-check",
              },
              {
                text: "Aptitud espacial",
                path: "/preuniversitario/aptitud/espacial",
                icon: "mdi-check",
              },
              {
                text: "Aptitud abstracta",
                path: "/preuniversitario/aptitud/abstracta",
                icon: "mdi-check",
              },
              {
                text: "Interes ocupacional",
                path: "/preuniversitario/interes/ocupacional",
                icon: "mdi-check",
              },
              {
                text: "Estilo aprendizaje",
                path: "/preuniversitario/estilo/aprendizaje",
                icon: "mdi-check",
              },
              {
                text: "Resultado",
                path: "/preuniversitario/resultado/prueba",
                icon: "mdi-check",
              },
            ],
          },
        ];
        break;
    }
    return localStorage.setItem("ewkuia", JSON.stringify(menu));
  },
  getMenuPreuniversitario() {
    return sessionStorage.getItem("ewkuia")
      ? JSON.parse(sessionStorage.getItem("ewkuia"))
      : null;
  },
  removeMenuPreuniversitario() {
    return sessionStorage.removeItem("ewkuia");
  },
};
