<template>
  <div>
    <v-icon v-if="!usuarioLogueado" @click="showDialogLogin">mdi-account</v-icon>
    <v-menu v-else offset-y>
      <template v-slot:activator="{ on, attrs }">
        <v-btn
          color="primary"
          dark
          v-bind="attrs"
          v-on="on"
        >
          {{ usuarioLogueado.nombre }} {{ usuarioLogueado.materno }}
        </v-btn>
      </template>
      <v-list>
        <v-list-item
          @click="logout()"
        >
          <v-list-item-title>Cerrar sesion</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>

    <v-dialog
      v-model="dialogLogin"
      max-width="500px"
      transition="dialog-transition"
    >
      <v-form ref="formLogin">
        <v-card>
          <v-card-title>
            Ingreso al Sistema
          </v-card-title>
          <v-card-text>
            <v-text-field
              v-model="usuario.username"
              label="Usuario"
              autocomplete="off"
              prepend-icon="mdi-account"
              :rules="[(v) => !!v || 'El usuario es requerido']"
            ></v-text-field>
            <v-text-field
              v-model="usuario.password"
              label="Contraseña"
              autocomplete="off"
              prepend-icon="mdi-key"
              :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
              :type="showPassword ? 'text' : 'password'"
              @click:append="showPassword = !showPassword"
            ></v-text-field>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="secondary" @click="dialogLogin = false">Cerrar</v-btn>
            <v-btn color="primary" @click="loginUser">Ingresar</v-btn>
          </v-card-actions>
        </v-card>
      </v-form>
    </v-dialog>
  </div>
</template>

<script>
  import Servicio from '@/services/general'
  export default {
    name: 'login',
    data: () => ({
      usuario: {
        username: '',
        password: ''
      },
      showPassword: false,
      dialogLogin: false,
      usuarioLogueado: '',
      menu: [

      ]
    }),
    mounted() {
      this.usuarioLogueado = this.usuarioLogueado = Servicio.getUser();
      console.log('usuariologueado', this.usuarioLogueado)
    },
    methods: {
      showDialogLogin(){
        this.dialogLogin = true;
        // this.$refs.formLogin.resetValidation();
        if (this.$refs.formlogin) this.$refs.formLogin.resetValidation();
      },
      async loginUser(){
        if (this.$refs.formLogin.validate()) {
          console.log(this.usuario)
          let response = await this.$store.dispatch("login", this.usuario);
          console.log(response)
          this.dialogLogin = false;
          this.usuarioLogueado = Servicio.getUser();
          console.log('usuariologueado', this.usuarioLogueado)
          this.$router.push({ name: "universidades-carreras" });
        }else{
          console.log('login', 'Error al ingresar')
        }
      },
      logout() {
        this.$store.dispatch("logout");
        this.usuarioLogueado = null;
        this.$router.push({ name: "universidades" });
      },
    }
  }
</script>

<style scoped>

</style>