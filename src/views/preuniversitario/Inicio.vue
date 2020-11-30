<template>
  <v-app>
    <toolbar class="app--toolbar"></toolbar>
    <drawer class="app--drawer"></drawer>

    <v-main>
      <v-container class="page-wrapper" fluid>
        <transition name="fade" mode="out-in">
          <router-view></router-view>
        </transition>
      </v-container>
      <v-footer height="auto" class="white pa-3 app--footer">
        <span class="caption"
          >{{ new Date().getFullYear() }} &copy; DGESU, Todos los
          derechos reservados</span
        >
        <v-spacer></v-spacer>
        <span class="caption mr-1">
          <a
            href="//minedu.gob.bo/"
            target="_blank"
            style="text-decoration: none"
            >Ministerio de Educación</a
          >
        </span>
      </v-footer>
    </v-main>
  </v-app>
</template>

<script>
import Toolbar from "@/components/preuniversitario/Toolbar";
import Drawer from "@/components/preuniversitario/Drawer";

export default {
  name: "preuniversitario-inicio",
  components: {
    Toolbar,
    Drawer,
  },
  data: () => ({}),
  created() {
    // window.getApp = this;
  },
  methods: {
    getPage(link) {
      this.$router.push(link);
    },
  },
};
</script>
<style lang="css" scope>
.page-wrapper {
  min-height: calc(100vh - 64px - 50px);
}
.fade-enter-active,
.fade-leave-active {
  transition-duration: 0.3s;
  transition-property: opacity;
  transition-timing-function: ease;
}
.fade-enter,
.fade-leave-active {
  opacity: 0;
}
.logo {
  width: 100%;
}
</style>