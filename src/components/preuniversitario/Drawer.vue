<template>
  <v-navigation-drawer
    id="drawer"
    app
    mini-variants
    v-model="drawer"
    :mini-variant.sync="mini"
    :dark="$vuetify.dark"
  >
    <v-toolbar @click="redirectTo" class="pa-0" style="cursor: pointer">
      <v-img src="../../assets/logo-minedu.png" class="logo" />
    </v-toolbar>
    <!-- <div class="logo">
      <img src="../../assets/minedu.png" alt="" class="logo" />
    </div> -->
    <v-divider></v-divider>
    <v-list nav dense link class="mb-4">
      <v-subheader>
        <span v-show="!mini">Menú</span>
        <v-spacer></v-spacer>
        <v-icon @click.stop="draweMini" color="teal">{{ icon_mini }}</v-icon>
      </v-subheader>
      <div v-for="(link, i) in isAuth && 1 ? auth_menu : public_menu" :key="i">
        <v-list-item
          v-if="!link.submenu"
          :to="link.path"
          active-class="highlighted"
          exact
        >
          <v-list-item-icon>
            <v-icon>{{ link.icon }}</v-icon>
          </v-list-item-icon>
          <v-list-item-title v-text="link.text" />
        </v-list-item>

        <v-list-group
          v-else
          :key="link.text"
          no-action
          :prepend-icon="link.icon"
          :value="false"
        >
          <template v-slot:activator>
            <v-list-item-title>{{ link.text }}</v-list-item-title>
          </template>

          <v-list-item
            v-for="sublink in link.submenu"
            :to="sublink.path"
            :key="sublink.text"
            active-class="grey lighten-3"
            exact
          >
            <!-- <v-list-item-icon>
              <v-icon>{{ sublink.icon }}</v-icon>
            </v-list-item-icon>-->
            <v-list-item-title>{{ sublink.text }}</v-list-item-title>
          </v-list-item>
        </v-list-group>
      </div>
    </v-list>
  </v-navigation-drawer>
</template>

<script>
// import Service from "../services/general";
export default {
  data: () => ({
    mini: false,
    icon_mini: "mdi-transfer-left",
    drawer: true,
    auth_menu: [
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
        text: "Registro de Inscripción",
        path: "/preuniversitario/inscripcion",
        icon: "mdi-file-account",
      },
      {
        text: "Lista de Inscripciones",
        path: "/preuniversitario/inscripciones",
        icon: "mdi-file-document-outline",
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
          {
            text: "Reporte",
            path: "/preuniversitario/reporte/prueba",
            icon: "mdi-check",
          },
        ],
      },
      {
        text: "Administración",
        icon: "mdi-cog",
        submenu: [
          {
            text: "Habilitar cursos",
            path: "/preuniversitario/habilitar/curso",
            icon: "mdi-check",
          },
          {
            text: "Comunicados",
            path: "/preuniversitario/comunicado",
            icon: "mdi-check",
          },
          {
            text: "Test Categorías",
            path: "/preuniversitario/categoria",
            icon: "mdi-check",
          },
          {
            text: "Test Preguntas",
            path: "/preuniversitario/pregunta",
            icon: "mdi-check",
          },
          {
            text: "Test Respuestas",
            path: "/preuniversitario/respuesta",
            icon: "mdi-check",
          },
        ],
      },
    ],
    public_menu: [
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
    ],
  }),
  created() {
    window.getApp.$on("DRAWER_TOGGLE", () => {
      this.drawer = !this.drawer;
    });
  },
  computed: {
    isAuth() {
      return this.$store.getters.isAuthenticated;
    },
  },
  methods: {
    draweMini() {
      this.mini = !this.mini;
      if (this.mini) {
        this.icon_mini = "mdi-transfer-right";
      } else {
        this.icon_mini = "mdi-transfer-left";
      }
    },
    redirectTo() {
      this.$router.replace({ name: "root" });
    },
  },
};
</script>

<style lang="css" scoped>
#drawer {
  overflow: hidden;
}
#drawer .drawer-menu--scroll {
  height: calc(100vh - 48px);
  overflow: auto;
}
/* .v-application--is-ltr
  .v-list--dense.v-list--nav
  .v-list-group--no-action
  > .v-list-group__items
  > .v-list-item {
  padding: 2 4px;
} */
</style>
