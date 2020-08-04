<template>
  <v-toolbar color="blue darken-1" fixed dark app>
    <v-toolbar-side-icon @click.stop="drawerToggle"></v-toolbar-side-icon>
    <v-toolbar-title class="headline text-uppercase">
      <span>&nbsp;</span>
    </v-toolbar-title>
    <v-spacer></v-spacer>
    <v-btn icon @click="fullScreen()">
      <v-icon>{{ icon_fs }}</v-icon>
    </v-btn>
    <v-menu
      offset-y
      origin="center center"
      :nudge-bottom="10"
      transition="scale-transition"
    >
      <v-btn icon large flat slot="activator">
        <v-avatar size="30px">
          <img v-bind:src="require('../assets/user.svg')" alt="User" />
        </v-avatar>
      </v-btn>
      <v-list class="pa-0">
        <v-list-tile @click="perfil()" ripple="ripple" rel="noopener">
          <v-list-tile-action>
            <v-icon>account_circle</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>Perfil</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
        <v-divider></v-divider>
        <v-list-tile @click="logout()" ripple="ripple" rel="noopener">
          <v-list-tile-action>
            <v-icon color="error">exit_to_app</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>Salir</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
      </v-list>
    </v-menu>
  </v-toolbar>
</template>
<script>
export default {
  name: "toolbar",
  components: {
    //
  },
  data: () => ({
    icon_fs: "fullscreen",
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
        this.icon_fs = "fullscreen_exit";
      } else {
        cancelFullScreen.call(doc);
        this.icon_fs = "fullscreen";
      }
    },

    logout() {
      this.$store.dispatch("logout").then(() => {
        this.$router.push("/inicio/buscar");
      });
    },
    perfil() {
      this.$router.push("/perfil");
    },
  },
};
</script>
