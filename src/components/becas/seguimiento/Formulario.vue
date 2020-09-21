<template>
  <v-form ref="form" lazy-validation>
    <v-container>
      <v-row>
        <v-col cols="6">
          <v-text-field
            prepend-icon="mdi-card-account-details-outline"
            v-model="consulta.ci"
            :rules="[rules.required, rules.numberRule]"
            label="Número de identidad"
            @keyup.enter="consultar"
            required
            color="secondary"
            maxlength="9"
            onkeypress="if (event.keyCode < 45 || event.keyCode > 57) event.returnValue = false;"
          ></v-text-field>
        </v-col>
        <v-col cols="6">
          <v-text-field
            prepend-icon="mdi-alphabet-latin"
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
        <v-col>
          <v-text-field
            prepend-icon="mdi-account-tie"
            v-model="consulta.rude"
            :rules="[rules.required, rules.numberRule1]"
            label="Registro Rude"
            required
            color="secondary"
            @keyup.enter="consultar"
            maxlength="15"
            onkeypress="if (event.keyCode < 45 || event.keyCode > 57) event.returnValue = false;"
          ></v-text-field>
        </v-col>
        <v-col>
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
                v-model="fecha_nac"
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
              v-model="consulta.fecha_nac"
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
            @click="consultar"
            :loading="loading"
            :disabled="loading"
          >Consultar</v-btn>
        </v-col>
      </v-row>
    </v-container>
  </v-form>
</template>

<script>
import VueRecaptcha from "vue-recaptcha";
export default {
  components: { VueRecaptcha },
  data() {
    return {
      consulta: {
        ci: "",
        complemento: "",
        rude: "",
        fecha_nac: "",
      },
      buscar: false,
      menu: false,
      loader: null,
      loading: false,
      rules: {
        required: (value) => !!value || "Requerido",
        numberRule: (value) => {
          if (
            !isNaN(parseFloat(value)) &&
            value >= 1000000 &&
            value <= 999999999
          )
            return true;
          return "Número entre 10000000 y 999999999";
        },
        numberRule1: (value) => {
          if (
            !isNaN(parseFloat(value)) &&
            value >= 1000000 &&
            value <= 99999999999999
          )
            return true;
          return "Número entre 1000000 y 99999999999999";
        },
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
    fecha_nac() {
      if (this.consulta.fecha_nac != "") {
        let [year, month, day] = this.consulta.fecha_nac.split("-");
        return `${day}/${month}/${year}`;
      }
      return "";
    },
  },
  methods: {
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
      this.consulta.fecha_nac = this.consulta.ci = this.consulta.complemento = this.consulta.rude =
        "";
      //if (this.$refs.form) this.$refs.form.reset();
    },
    consultar() {
      if (this.$refs.form.validate() == true) {
        this.loader = "loading";
        this.$refs.recaptcha.reset();
        this.buscar = false;
      }
    },
  },
};
</script>