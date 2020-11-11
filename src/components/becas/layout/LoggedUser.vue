<template>
  <div>
    <div v-if="usuario">
      <v-menu bottom offset-y>
        <template v-slot:activator="{ on }">
          <v-btn fab icon class="ma-0" v-on="on">
            <v-avatar size="35" :color="`${randomColor} darken-2`">
              <span class="subtitle-1 font-weight-medium">{{ usuario.nombre.substring(0,2) }}</span>
            </v-avatar>
          </v-btn>
        </template>
        <v-list dense>
          <!--<v-list-item :to="{ name: 'profile' }">
                    <v-list-item-icon class="ml-0 mr-2">
                        <v-icon>mdi-account-box</v-icon>
                    </v-list-item-icon>
                    <v-list-item-title>Perfil</v-list-item-title>
          </v-list-item>-->
          <v-list-item link @click.stop="logout()">
            <v-list-item-icon class="ml-0 mr-2">
              <v-icon>mdi-lock</v-icon>
            </v-list-item-icon>
            <v-list-item-title>Cerrar sesión</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </div>
    <div v-if="!usuario">
      <v-tooltip bottom>
        <template v-slot:activator="{ on, attrs }">
      <v-btn  v-bind="attrs" v-on="on" class="ma-2" icon color="white" @click="showDialogLoggin()">
        <v-icon>mdi-account-key</v-icon>
      </v-btn>
        </template>
        <span>Ingresar</span>
      </v-tooltip>
    </div>
    <!-- modal -->
    <v-row justify="center">
      <v-dialog v-model="dialogLoggin" max-width="500px">
        <v-card>
          <v-card-title>
            <span class="headline">Iniciar Sesión</span>
          </v-card-title>
          <v-form ref="form" lazy-validation>
            <v-card-text>
              <v-container>
                <v-row>
                  <v-col cols="12" sm="12" md="12">
                    <v-text-field
                      prepend-icon="mdi-account"
                      type="text"
                      v-model="user.username"
                      label="Nombre de Usuario"
                      @keyup.enter="ingresar"
                      required
                      color="secondary"
                      maxlength="20"
                      minlength="5"
                      :rules="[rules.required, rules.usuario_min5]"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="12" md="12">
                    <v-text-field
                      prepend-icon="mdi-key"
                      v-model="user.password"
                      label="Contraseña"
                      required
                      color="secondary"
                      maxlength="20"
                      minlength="5"
                      :append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"
                      :rules="[rules.required, rules.password_min5]"
                      :type="show1 ? 'text' : 'password'"
                      counter
                      @click:append="show1 = !show1"
                      @keyup.enter="ingresar"
                    ></v-text-field>
                  </v-col>
                </v-row>
              </v-container>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="primary" dark @click="dialogLoggin = false">Cerrar</v-btn>
              <v-btn
                color="secondary"
                class="white--text"
                @click="ingresar"
                :loading="loading"
                :disabled="loading"
              >Ingresar</v-btn>
            </v-card-actions>
          </v-form>
        </v-card>
      </v-dialog>
    </v-row>
  </div>
</template>

<script>
import GeneralService from "@/services/general";
import { mapActions, mapGetters } from "vuex";
export default {
  name: "app-logger-user",
  data: () => ({
    user: {
      username: "",
      password: "",
    },
    loader: null,
    loading: false,
    usuario: null,
    show1: false,
    dialogLoggin: false,
    rules: {
      required: (value) => !!value || "Requerido",
      usuario_min5: (value) => value.length >= 5 || "Mínimo 5 caracteres",
      password_min5: (value) => value.length >= 5 || "Mínimo 5 caracteres",
    },
  }),
  mounted() {
    this.usuario = this.usuario = GeneralService.getUser();
  },
  computed: {
    ...mapGetters(["isAuthenticated"]),
    randomColor() {
      let colors = [
        "red",
        "pink",
        "purple",
        "blue",
        "light-blue",
        "cyan",
        "teal",
        "green",
        "light-green",
        "amber",
        "orange",
        "deep-orange",
      ];
      return colors[Math.floor(Math.random() * colors.length)];
    },
  },

  watch: {
    loader() {
      const l = this.loader;
      this[l] = !this[l];

      setTimeout(() => (this[l] = false), 2000);

      this.loader = null;
    },
  },
  methods: {
    ...mapActions(["alert"]),
    logout() {
      this.$store.dispatch("logout");
      //this.$router.go("root");
      this.usuario = null;
      this.$router.push({ name: "root" });
    },
    showDialogLoggin() {
      this.dialogLoggin = true;
      this.user.username = this.user.password = "";
      if (this.$refs.form) this.$refs.form.resetValidation();
    },
    async ingresar() {
      try {
        if (this.$refs.form.validate() == true) {
          this.loader = "loading";
          let res = await this.$store.dispatch("login", this.user);
          this.dialogLoggin = false;
          this.usuario = GeneralService.getUser();
          this.$router.push({ name: "becas-escritorio" });
          this.alert({
            text: `Hola ${res.nombre}, Bienvenido!!!`,
            color: "primary",
          });
        }
      } catch (error) {
        let texto = error;
        if (error.response) texto = error.response.data;
        if (error.msg.msg) texto = error.msg.msg;
        if (error.msg.errors) texto = error.msg.errors[0].msg;
        this.dialogLoggin = false;
        this.alert({
          text: texto,
          color: "red",
        });
      }
    },
  },
};
</script>
