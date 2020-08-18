<template>
  <v-app-bar color="teal" fixed dark app>
    <v-app-bar-nav-icon @click.stop="drawerToggle"></v-app-bar-nav-icon>
    <!-- <v-app-bar-nav-icon></v-app-bar-nav-icon> -->
    <!-- <v-toolbar-title class="headline text-uppercase">
      <span>&nbsp;</span>ddds
    </v-toolbar-title>-->
    <v-toolbar-title>Sistema de Universidades</v-toolbar-title>
    <v-spacer></v-spacer>
    <v-btn icon @click="fullScreen()">
      <v-icon>{{ icon_fs }}</v-icon>
    </v-btn>
    <v-btn color="teal" dark>
      <v-icon>mdi-user</v-icon>Ingresar
    </v-btn>
    <!-- <v-menu offset-y origin="center center" :nudge-bottom="10" transition="scale-transition">
      <v-btn icon large slot="activator">
        <v-avatar size="30px">
          <img v-bind:src="require('../assets/user.svg')" alt="User" />
        </v-avatar>
      </v-btn>
      <v-list class="pa-0">
        <v-list-item @click="perfil()" ripple="ripple" rel="noopener">
          <v-list-item-action>
            <v-icon>account_circle</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Perfil</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-divider></v-divider>
        <v-list-item @click="logout()" ripple="ripple" rel="noopener">
          <v-list-item-action>
            <v-icon color="error">exit_to_app</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Salir</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-menu>-->
  </v-app-bar>
</template>
<script>
export default {
  name: "toolbar",
  components: {
    //
  },
  data: () => ({
    icon_fs: "mdi-fullscreen",
    cod: "",
  }),
  mounted() {},
  methods: {
    drawerToggle() {
      window.getApp.$emit("DRAWER_TOGGLE");
    },
    fullScreen() {
      let doc = window.document;
      let docEl = doc.documentElement;

      let requestFullScreen =
        docEl.requestFullscreen ||
        docEl.mozRequestFullScreen ||
        docEl.webkitRequestFullScreen ||
        docEl.msRequestFullscreen;
      let cancelFullScreen =
        doc.exitFullscreen ||
        doc.mozCancelFullScreen ||
        doc.webkitExitFullscreen ||
        doc.msExitFullscreen;

      if (
        !doc.fullscreenElement &&
        !doc.mozFullScreenElement &&
        !doc.webkitFullscreenElement &&
        !doc.msFullscreenElement
      ) {
        requestFullScreen.call(docEl);
        this.icon_fs = "mdi-fullscreen-exit";
      } else {
        cancelFullScreen.call(doc);
        this.icon_fs = "mdi-fullscreen";
      }
    },

    logout() {
      this.$store.dispatch("logout").then(() => {
        this.$router.push({ name: "prefacultad" });
      });
    },

    perfil() {
      this.$router.push("/perfil");
    },
  },
};
</script>
