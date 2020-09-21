<template>
  <v-row justify="center">
    <v-tooltip v-model="showDatos" top v-if="getUniversidad.datos.cantidad_becas - getCantidadBecasSuma > 0 && getEsFechaRegistro">
      <template v-slot:activator="{ on, attrs }">
        <v-btn
          fab
          right
          absolute
          dark
          small
          color="secondary"
          @click="activar()"
          v-bind="attrs"
          v-on="on"
        >
          <v-icon color>mdi-plus</v-icon>
        </v-btn>
      </template>
      <span>Nueva Carrerea para Beca</span>
    </v-tooltip>

    <v-dialog v-model="dialog" max-width="550px">
      <v-card>
        <v-card-title class="headline">{{formTitle}}</v-card-title>
        <v-form ref="form" lazy-validation>
          <v-card-text>
            <v-container>
              <v-row>
                <v-col cols="12" sm="8" md="8">
                  <v-select
                    :items="getCarreras"
                    :rules="[rules.required]"
                    prepend-icon="mdi-handshake"
                    color="secondary"
                    label="Carrera"
                    :item-text="text"
                    item-value="ttec_denominacion_titulo_profesional_tipo_id"
                    @keyup.enter="save"
                    v-model="carrereaSeleccionada"
                  ></v-select>
                </v-col>
                <v-col cols="12" sm="4" md="4">
                  <v-text-field
                    prepend-icon="mdi-handshake"
                    type="text"
                    v-model="cantidad_becas"
                    label="Becas"
                    :rules="[rules.required, rules.numberRule]"
                    @keyup.enter="save"
                    required
                    maxlength="2"
                    color="secondary"
                    onkeypress="if (event.keyCode < 45 || event.keyCode > 57) event.returnValue = false;"
                  ></v-text-field>
                </v-col>
              </v-row>
            </v-container>
          </v-card-text>
        </v-form>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" dark @click="close">Cancelar</v-btn>
          <v-btn
            color="secondary"
            class="white--text"
            @click="save"
            :loading="loading"
            :disabled="loading"
          >{{ registar_editar }}</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
export default {
  props: {
    dialogF: {
      default: false,
    },
    edited_index_enviar: {
      default: -1,
    },
    edited_item_enviar: {},
  },
  data() {
    return {
      loader: null,
      dialog: false,
      loading: false,
      registar_editar: "",
      edited_index: -1,
      cantidad_becas_falta: 0,
      showDatos: false,
      edited_item: {},
      carrereaSeleccionada: "",
      cantidad_becas: 0,
      rules: {
        required: (value) => !!value || "Requerido",
        numberRule: (value) => {
          if (!isNaN(parseFloat(value)) && value >= 1 && value <= this.cantidad_becas_falta)
            return true;
          return `Número entre 1 y ${this.cantidad_becas_falta} becas disponibles`;
        },
      },
    };
  },

  computed: {
    ...mapGetters(["getUniversidadId", "getCarreras","getUniversidad", "getUniversidadBecaId", "getCarrerasBecas", "getCantidadBecasSuma", "getEsFechaRegistro"]),
    formTitle() {
      return this.edited_index === -1 ? "Nuevo Registro" : "Editar Registro";
    },
  },

  watch:{
      loader() {
      const l = this.loader;
      this[l] = !this[l];

      setTimeout(() => (this[l] = false), 2000);

      this.loader = null;
    },
    async dialogF(){
      this.registar_editar = "Editar";
      this.edited_index = this.edited_index_enviar;
      this.edited_item = Object.assign({}, this.edited_item_enviar);
      this.cantidad_becas = this.edited_item.cantidad_becas;
      this.cantidad_becas_falta = this.getUniversidad.datos.cantidad_becas - this.getCantidadBecasSuma
      this.cantidad_becas_falta += this.edited_item.cantidad_becas;
      await this.cargarCarreras(this.getUniversidadId);
      await this.cargarCarrera(this.edited_item);
      this.carrereaSeleccionada = this.edited_item.ttec_denominacion_titulo_profesional_tipo_id;
      this.dialog = true;
    }
  },

  methods: {
    ...mapActions(["cargarCarreras","alert", "agregarBecaCarrera", "cargarCarrera", "editarBecaCarrera"]),
    text: item => item.nombre + ' — ' + item.titulo,
    activar() {
      this.cantidad_becas_falta = this.getUniversidad.datos.cantidad_becas - this.getCantidadBecasSuma;
      this.registar_editar = "Guardar";
      this.edited_index = -1;
      //Cantidad de becas disponibles
      this.dialog = true;
      this.cargarCarreras(this.getUniversidadId);
      if (this.$refs.form) this.$refs.form.resetValidation();
      if (this.$refs.form) this.$refs.form.reset();
    },
    close() {
      this.dialog = false;
    },
    async save() {
      try{
        if (this.$refs.form.validate() == true) {
        this.loader = "loading";
        //ver si es nuevo o si editará
        if(this.edited_index > -1){
          //Editar

          let item = {
            universidad_beca_carrera_id: this.edited_item.universidad_beca_carrera_id,
            ttec_denominacion_titulo_profesional_tipo_id : this.carrereaSeleccionada,
            cantidad_becas : this.cantidad_becas,
            modalidad: this.edited_item.modalidad,
            nombre: this.edited_item.nombre,
            tiempo: this.edited_item.tiempo,
            titulo: this.edited_item.titulo
          };
          await this.editarBecaCarrera({
             item: item,
             index: this.edited_index,
          })
          this.alert({
              text: "Registro editado",
              color: "primary",
            });
        }else{
          //Nuevo
          await this.agregarBecaCarrera({
            universidad_beca_universidad_id : this.getUniversidadBecaId,
            ttec_denominacion_titulo_profesional_tipo_id : this.carrereaSeleccionada,
            cantidad_becas : this.cantidad_becas,
          });
          this.alert({
            text: "Registro guardado",
            color: "primary",
          });
        }
        this.close();
      }
      }catch(error){
        let texto = error;
        if(error.response)texto = error.response.data
        this.alert({
          text: texto,
          color: "red",
        });
      }
    },
  },
};
</script>
