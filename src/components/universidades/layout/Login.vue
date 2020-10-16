<template>
  <div>
    <v-btn v-if="!usuarioLogueado" @click="showDialogLogin" color="primary" class="elevation-10">Ingresar</v-btn>
    <v-menu v-else offset-y>
      <template v-slot:activator="{ on, attrs }">
        <v-btn
          color="primary"
          dark
          v-bind="attrs"
          v-on="on"
          elevation="0"
        >
          <v-avatar size="25px">
            <img
              src="../../../assets/user.svg"
              alt="John"
              class="uni-avatar"
            >
          </v-avatar>
          <span class="username">{{ usuarioLogueado.nombre }} {{ usuarioLogueado.materno }}</span>
        </v-btn>
      </template>
      <v-list>
        <v-list-item
          @click="logout()"
        >
          <v-list-item-title> <v-icon>mdi-logout</v-icon> Cerrar sesion</v-list-item-title>
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
import { mapMutations } from 'vuex';
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
      // console.log('usuariologueado', this.usuarioLogueado)
    },
    methods: {
      ...mapMutations(['uniAlert']),
      showDialogLogin(){
        this.dialogLogin = true;
        // this.$refs.formLogin.resetValidation();
        if (this.$refs.formlogin) this.$refs.formLogin.resetValidation();
      },
      async loginUser(){
        try {
          if (this.$refs.formLogin.validate()) {
            console.log(this.usuario)
            let response = await this.$store.dispatch("login", this.usuario);
            console.log(response)
            this.dialogLogin = false;
            this.usuarioLogueado = Servicio.getUser();
            console.log('usuariologueado', this.usuarioLogueado);

            // // definir la pagina de incio segun el rol
            // let rol;
            // this.usuarioLogueado.roles.forEach(usuarioRol => {
            //   if (usuarioRol.rol_tipo_id == 51) {
            //     permiso = true;
            //   }
            // });

            if (this.usuarioLogueado.roles[0].rol_tipo_id == 51) {
              this.$router.push({ name: "universidades-admin-home" });
            }else{
              this.$router.push({ name: "universidades-dashboard" });  
            }
            this.$emit('actualizarUsuario', true);
          }else{
            console.log('login', 'Error al ingresar')
          }
        } catch (error) {
          console.log('login error', error)
          this.uniAlert({ color: 'error', text: 'El usuario y/o contraseña no son válidos'});
        }
      },
      logout() {
        this.$store.dispatch("logout");
        this.usuarioLogueado = null;
        this.$router.push({ name: "universidades-publico" });

        this.$emit('actualizarUsuario', true);
      },
    }
  }
</script>

<style scoped>
  .uni-avatar {
    /* margin-right: ; */
  }
  .username {
    margin-left: 10px;
  }
</style>