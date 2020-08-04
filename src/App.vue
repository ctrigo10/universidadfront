<template>
  <div id="appRoot" data-app>
    <template v-if="loggedIn && !$route.meta.public">
      <v-app>
        <toolbar class="app--toolbar"></toolbar>
        <drawer class="app--drawer"></drawer>
        <v-content>
          <div class="page-wrapper">
            <transition name="fade" mode="out-in">
              <router-view></router-view>
            </transition>
          </div>
          <v-footer height="auto" class="white pa-3 app--footer">
            <span class="caption"
              >{{ new Date().getFullYear() }} &copy; CCTP, Todos los derechos
              reservados</span
            >
            <v-spacer></v-spacer>
            <span class="caption mr-1"
              ><a
                href="//minedu.gob.bo/"
                target="_blank"
                style="text-decoration: none"
                >Ministerio de Educación</a
              ></span
            >
          </v-footer>
        </v-content>
      </v-app>
    </template>
    <template v-else>
      <transition>
        <keep-alive transition="scale-transition">
          <router-view :key="$route.fullpath"></router-view>
        </keep-alive>
      </transition>
    </template>
  </div>
</template>

<script>
import Toolbar from "@/components/Toolbar";
import Drawer from "@/components/Drawer";

export default {
  name: "App",
  components: {
    Toolbar,
    Drawer,
  },
  data() {
    return {
      //
    };
  },
  computed: {
    loggedIn: function() {
      return this.$store.getters.isAuthenticated;
    },
  },
  created() {
    window.getApp = this;
  },
};
</script>
<style lang="css" scoped>
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
</style>
