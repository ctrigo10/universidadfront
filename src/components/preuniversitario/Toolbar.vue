<template>
  <div>
    <v-app-bar color="secondary darken-1" fixed dark app>
      <v-app-bar-nav-icon @click.stop="drawerToggle"></v-app-bar-nav-icon>
      <v-toolbar-title>PREUNIVERSITARIO</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn icon @click="fullScreen()">
        <v-icon>{{ icon_fs }}</v-icon>
      </v-btn>
      <v-btn v-if="!isAuth" color="primary" dark @click="showDialogLoggin">
        <v-icon>mdi-user</v-icon>Ingresar
      </v-btn>
      <v-menu
        v-else
        offset-y
        origin="center center"
        :nudge-bottom="10"
        transition="scale-transition"
      >
        <template v-slot:activator="{ on, attrs }">
          <v-btn icon v-bind="attrs" v-on="on">
            <v-avatar size="42px">
              <img v-bind:src="require('../../assets/user.svg')" alt="User" />
            </v-avatar>
          </v-btn>
        </template>
        <v-list class="pa-0">
          <!-- <v-list-item @click="perfil()" ripple="ripple" rel="noopener">
            <v-list-item-icon>
              <v-icon>mdi-account-edit</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>Perfil</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <v-divider></v-divider> -->
          <v-list-item @click="logout()" ripple="ripple" rel="noopener">
            <v-list-item-icon>
              <v-icon color="error">mdi-close</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>Salir</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </v-menu>
    </v-app-bar>
    <v-dialog
      v-model="dialogLoggin"
      persistent
      max-width="500px"
      transition="dialog-transition"
    >
      <v-form ref="lform">
        <v-card>
          <v-card-title>Iniciar Sesión</v-card-title>
          <v-divider></v-divider>
          <v-card-text>
            <v-text-field
              v-model="user.username"
              label="Usuario"
              autocomplete="off"
              prepend-icon="mdi-account"
              :rules="[vrules.required, vrules.usuario_min5]"
            ></v-text-field>
            <v-text-field
              v-model="user.password"
              label="Contraseña"
              autocomplete="off"
              prepend-icon="mdi-key"
              :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
              :type="showPassword ? 'text' : 'password'"
              @click:append="showPassword = !showPassword"
              :rules="[vrules.required, vrules.password_min5]"
            ></v-text-field>
            <span v-if="message != ''" class="text-center red--text">
              {{ message }}
            </span>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="primary" @click="dialogLoggin = false">Cerrar</v-btn>
            <v-btn color="secondary" :loading="loading" @click="login"
              >Ingresar</v-btn
            >
          </v-card-actions>
        </v-card>
      </v-form>
    </v-dialog>
    <v-snackbar
      v-model="snack.state"
      top="top"
      right="right"
      rounded="pill"
      :color="snack.color"
      timeout="2500"
      >{{ snack.text }}</v-snackbar
    >
  </div>
</template>
<script>
export default {
  name: "toolbar",
  data: () => ({
    icon_fs: "mdi-fullscreen",
    showPassword: false,
    dialogLoggin: false,
    loading: false,
    message: "",
    user: {
      username: "",
      password: "",
    },
    vrules: {
      required: (value) => !!value || "Requerido",
      usuario_min5: (value) => value.length >= 5 || "Mínimo 5 caracteres",
      password_min5: (value) => value.length >= 5 || "Mínimo 5 caracteres",
    },
    snack: {
      state: false,
      color: "success",
      text: "",
    },
  }),
  computed: {
    isAuth() {
      return this.$store.getters.isAuthenticated;
    },
  },
  // mounted() {
  //   console.log(this.isAuth);
  // },
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

    showDialogLoggin() {
      this.dialogLoggin = true;
      if (this.$refs.lform) this.$refs.lform.resetValidation();
    },
    login() {
      this.message = "";
      if (this.$refs.lform.validate()) {
        this.loading = true;
        this.$store
          .dispatch("login", this.user)
          .then((response) => {
            if (response.status == "success") {
              this.loading = false;
              this.dialogLoggin = false;
              if (this.$router.currentRoute.name != "pre-escritorio") {
                this.$router.push({ name: "pre-escritorio" });
              }
              this.toast("success", "Autenticación exitosa " + response.nombre);
            } else {
              this.toast("warning", "No se pudo Autenticar");
            }
          })
          .catch((error) => {
            console.log(error.msg.msg);
            this.loading = false;
            // let texto = error;
            // if (error.response) texto = error.response.data;
            // if (error.msg.msg) texto = error.msg.msg;
            // if (error.msg.errors) texto = error.msg.errors[0].msg;
            // this.dialogLoggin = false;
            this.message = error.msg.msg;
            this.toast("error", "Autenticación exitosa");
          });
      }
    },

    logout() {
      this.$store.dispatch("logout").then(() => {
        this.$router.push({ name: "root" });
      });
    },

    toast(mcolor, mtext) {
      this.snack.color = mcolor;
      this.snack.text = mtext;
      this.snack.state = true;
    },

    perfil() {
      this.$router.push("/perfil");
    },
  },
};
</script>
