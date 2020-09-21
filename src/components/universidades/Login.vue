<template>
  <div>
    <v-icon @click="showDialogLogin">mdi-account</v-icon>

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
              v-model="username"
              label="Usuario"
              prepend-icon="mdi-account"
              :rules="[(v) => !!v || 'El usuario es requerido']"
            ></v-text-field>
            <v-text-field
              v-model="password"
              label="Contraseña"
              prepend-icon="mdi-key"
              :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
              :type="showPassword ? 'text' : 'password'"
              @click:append="showPassword = !showPassword"
            ></v-text-field>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="secondary" @click="dialogLogin = false">Cerrar</v-btn>
            <v-btn color="primary" @click="login">Ingresar</v-btn>
          </v-card-actions>
        </v-card>
      </v-form>
    </v-dialog>
  </div>
</template>

<script>
  export default {
    name: 'login',
    data: () => ({
      username: '',
      password: '',
      showPassword: false,
      dialogLogin: false
    }),
    methods: {
      showDialogLogin(){
        this.dialogLogin = true;
        // this.$refs.formLogin.resetValidation();
        if (this.$refs.formlogin) this.$refs.formLogin.resetValidation();
      },
      login(){
        if (this.$refs.formLogin.validate()) {
          console.log('Correcto')
        }else{
          console.log('login', 'Error al ingresar')
        }
      }
    }
  }
</script>

<style scoped>

</style>