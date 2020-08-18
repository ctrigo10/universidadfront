<template>
  <div id="appRoot" app>
    <template>
      <v-app>
        <transition>
          <keep-alive transition="scale-transition">
            <router-view :key="$route.fullpath"></router-view>
          </keep-alive>
        </transition>
      </v-app>
    </template>
    <!-- <v-footer height="auto" class="white pa-3 app--footer">
            <span class="caption">
              {{ new Date().getFullYear() }} &copy; CCTP, Todos los derechos
              reservados
            </span>
            <v-spacer></v-spacer>
            <span class="caption mr-1">
              <a
                href="//minedu.gob.bo/"
                target="_blank"
                style="text-decoration: none"
              >Ministerio de Educación</a>
            </span>
    </v-footer>-->
  </div>
</template>

<script>
export default {
  name: "App",
  data() {
    return {
      //
    };
  },
  created() {
    window.getApp = this;
  },
};
</script>
<style lang="css" scoped>
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
