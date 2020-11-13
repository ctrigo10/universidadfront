<template>
  <v-form ref="form" lazy-validation>
    <v-container>
      <v-row>
        <v-col cols="12" sm="6" md="6">
          <v-text-field
            prepend-icon="mdi-card-account-details-outline"
            v-model="consulta.carnet_identidad"
            :rules="[rules.required, rules.numberRule]"
            label="Número de identidad"
            @keyup.enter="consultar"
            required
            color="secondary"
            maxlength="9"
            onkeypress="if (event.keyCode < 45 || event.keyCode > 57) event.returnValue = false;"
          ></v-text-field>
        </v-col>
        <v-col cols="12" sm="6" md="6">
          <v-text-field
            prepend-icon="mdi-minus"
            v-model="consulta.complemento"
            label="Complemento"
            @keyup.enter="consultar"
            required
            color="secondary"
            maxlength="2"
          ></v-text-field>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12" sm="6" md="6">
          <v-text-field
            prepend-icon="mdi-account-tie"
            v-model="consulta.codigo_rude"
            :rules="[rules.required, rules.rude, rules.alphanumerics]"
            onkeyup="this.value = this.value.toUpperCase();"
            label="Registro Rude"
            class="my-input"
            required
            color="secondary"
            @keyup.enter="consultar"
            maxlength="16"
          ></v-text-field>
        </v-col>
        <v-col cols="12" sm="6" md="6">
          <v-menu
            ref="menu"
            v-model="menu"
            :close-on-content-click="false"
            transition="scale-transition"
            offset-y
            min-width="290px"
          >
            <template v-slot:activator="{ on, attrs }">
              <v-text-field
                v-model="fecha_nacimiento"
                :rules="[rules.required]"
                label="Fecha de nacimiento"
                prepend-icon="mdi-calendar"
                @keyup.enter="consultar"
                readonly
                v-bind="attrs"
                v-on="on"
              ></v-text-field>
            </template>
            <v-date-picker
              ref="picker"
              v-model="consulta.fecha_nacimiento"
              :max="new Date().toISOString().substr(0, 10)"
              min="1950-01-01"
              @change="save"
            ></v-date-picker>
          </v-menu>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12" sm="12" md="12">
          <template>
            <vue-recaptcha
              sitekey="6Le0dbYZAAAAAA-9DYVUvoMWdHqbB_qqWCEmiDwe"
              @verify="onCaptchaVerified"
              :loadRecaptchaScript="true"
              ref="recaptcha"></vue-recaptcha>
          </template>
          <br>
          <v-btn color="primary" dark @click="cancelar">Cancelar</v-btn>&nbsp;&nbsp;&nbsp;
          <v-btn
            v-if="!buscar"
            color="secondary"
            class="white--text"
            disabled
          >Consultar</v-btn>
          <v-btn
            v-else
            color="secondary"
            class="white--text"
            @click="consultarConfirmar"
            :loading="loading"
            :disabled="loading"
          >Consultar</v-btn>
        </v-col>
      </v-row>
    </v-container>
  </v-form>
</template>

<script>
import becasService from "@/services/becasService"
import VueRecaptcha from "vue-recaptcha";
import { mapActions } from 'vuex';
export default {
  props:{solicitud_id:{default: 0}},
  components: { VueRecaptcha },
  mounted(){
    if(this.solicitud_id!=0){
      this.llenarDatos();
    }
  },
  data() {
    return {
      consulta: {
        carnet_identidad: "",
        complemento: "",
        codigo_rude: "",
        fecha_nacimiento: "",
      },
      buscar: true, //cambiar a false
      menu: false,
      loader: null,
      loading: false,
      rules: {
        required: (value) => !!value || "Requerido",
        numberRule: (value) => {
          if (
            !isNaN(parseFloat(value)) &&
            value >= 100000 &&
            value <= 999999999
          )
            return true;
          return "Debe tener entre 6 a 9 dígitos";
        },
        rude: (value) => {
          if (value.length >= 8 && value.length <= 16)
            return true;
          return "Debe tener entre 8 a 16 caracteres";
        },
        alphanumerics: (value) => {
          var re = /^[a-zA-Z0-9-_]+$/;
          if(re.test(value))return true;
          return 'Caracter no válido'
        }
      },
    };
  },
  watch: {
    menu(val) {
      val && setTimeout(() => (this.$refs.picker.activePicker = "YEAR"));
    },
    loader() {
      const l = this.loader;
      this[l] = !this[l];

      setTimeout(() => (this[l] = false), 2000);

      this.loader = null;
    },
  },
  computed: {
    fecha_nacimiento() {
      if (this.consulta.fecha_nacimiento != "") {
        let [year, month, day] = this.consulta.fecha_nacimiento.split("-");
        return `${day}/${month}/${year}`;
      }
      return "";
    },
  },
  methods: {
    ...mapActions(["alert"]),
    upper(e) {
        e.target.value = e.target.value.toUpperCase()
    },
    onCaptchaVerified(){
      this.buscar = true;
    },
    save(date) {
      this.$refs.menu.save(date);
    },
    cancelar() {
      if (this.$refs.form) this.$refs.form.resetValidation();
      this.$refs.recaptcha.reset();
      this.buscar = false;
      this.consulta.fecha_nacimiento = this.consulta.carnet_identidad = this.consulta.complemento = this.consulta.codigo_rude = "";
      //cambiar el mensaje
      this.$emit("mensajes", 0);
      //if (this.$refs.form) this.$refs.form.reset();
    },
    consultarConfirmar(){
      if (this.$refs.form.validate() == true) {
        this.consulta.codigo_rude = this.consulta.codigo_rude.toUpperCase();
        this.$vuetifyConfirmDialog
            .open(
              "Confirmación",
              "Confimar si todos sus datos son correctos para realizar la consulta. Gracias.",
              "Cancelar",
              "Confirmar",
              "primary",
              "secondary"
            )
            .then((state) => {
              if (state == true) this.consultar();
            });
      }
    },
    async consultar() {
        this.loader = "loading";
        this.$refs.recaptcha.reset();
        this.buscar = false;
        const resp = await becasService.getEstudiante(this.consulta);
        let mensaje = "";
        // el estudiante existe pero no registro su solicitud
        if(resp.data.data && resp.data.data.id != 0)
          mensaje = "Usted no realizó ninguna solicitud de beca, puede realizarlo ingresando a Universidades.";
        if(resp.data && resp.data.msg)mensaje = resp.data.msg;
        this.consulta.fecha_nacimiento = this.consulta.carnet_identidad = this.consulta.complemento = this.consulta.codigo_rude = "";
        if (this.$refs.form) this.$refs.form.resetValidation();
        this.$emit("mensajes", mensaje);
    },
    async llenarDatos(){
      try{
        let datos = await becasService.getEstudianteBySolicitud(this.solicitud_id);
        datos = datos.data.data;
        this.consulta.carnet_identidad = datos.estudiante.carnet_identidad;
        this.consulta.complemento = datos.estudiante.complemento;
        this.consulta.codigo_rude = datos.estudiante.codigo_rude;
        this.consulta.fecha_nacimiento = datos.estudiante.fecha_nacimiento;
      }catch(error){
         let texto = error;
        if (error.response) texto = error.response.data.msg;
        this.alert({
          text: texto,
          color: "red",
        });
      }
    }
  },
};
</script>
<style scoped>
.my-input input{
  text-transform: uppercase
}
</style>