<template>
  <v-form ref="form" lazy-validation>
    <v-container>
      <v-row>
        <v-col cols="12" sm="3" md="3">
          <v-text-field
            prepend-icon="mdi-card-account-details-outline"
            v-model="consulta.carnet_identidad"
            :rules="[rules.required, rules.numberRule]"
            label="Número de C.I."
            @keyup.enter="consultar"
            required
            clearable
            color="secondary"
            maxlength="9"
            onkeypress="if (event.keyCode < 45 || event.keyCode > 57) event.returnValue = false;"
          ></v-text-field>
        </v-col>
        <v-col cols="12" sm="2" md="2">
          <v-text-field
            prepend-icon="mdi-alphabet-latin"
            v-model="consulta.complemento"
            onkeyup="javascript:this.value=this.value.toUpperCase();"
            style="text-transform:uppercase;"
            label="Complemento"
            @keyup.enter="consultar"
            clearable
            color="secondary"
            maxlength="2"
          ></v-text-field>
        </v-col>
        <v-col cols="12" sm="3" md="3">
          <v-text-field
            prepend-icon="mdi-account-tie"
            v-model="consulta.codigo_rude"
            :rules="[rules.required, rules.rude, rules.alphanumerics]"
            onkeyup="this.value = this.value.toUpperCase();"
            label="Registro Rude"
            required
            clearable
            color="secondary"
            @keyup.enter="consultar"
            maxlength="16"
          ></v-text-field>
        </v-col>
        <v-col cols="12" sm="3" md="3">
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
        <v-col cols="12" sm="1" md="1">
          <v-tooltip top>
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                fab
                color="secondary"
                class="white--text"
                @click="consultar"
                :loading="loading"
                :disabled="loading"
                v-bind="attrs"
                v-on="on"
              >
                <v-icon>mdi-account-search</v-icon>
              </v-btn>
            </template>
            <span>Verificar Estudiante</span>
          </v-tooltip>
        </v-col>
      </v-row>
    </v-container>
  </v-form>
</template>

<script>
export default {
  data() {
    return {
      consulta: {
        carnet_identidad: "",
        complemento: "",
        codigo_rude: "",
        fecha_nacimiento: "",
      },
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
          if(value != null){
            if (value.length >= 8 && value.length <= 16)
              return true;
            return "Debe tener entre 8 a 16 caracteres";
          }else
          return "Requerido"
        },
         alphanumerics: (value) => {
          var re = /^[a-zA-Z0-9-_]+$/;
          if(re.test(value))return true;
          return 'Caracter no válido'
        }
      },
    };
  },
  watch:{
    menu(val) {
      val && setTimeout(() => (this.$refs.picker.activePicker = "YEAR"));
    },
    loader() {
      const l = this.loader;
      this[l] = !this[l];

      setTimeout(() => (this[l] = false), 3000);

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
    save(date) {
      this.$refs.menu.save(date);
    },
    async consultar(){
      this.consulta.codigo_rude = this.consulta.codigo_rude.toUpperCase();
      if (this.$refs.form.validate() == true) {
        this.loader = "loading";
        if(this.consulta.complemento == null)this.consulta.complemento='';
        await this.$emit("consulta",this.consulta)
        this.consulta.carnet_identidad=this.consulta.complemento=this.consulta.codigo_rude=this.consulta.fecha_nacimiento="";
        if (this.$refs.form) this.$refs.form.resetValidation();
      }
    }
  },
};
</script>