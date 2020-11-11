<template>
  <v-row justify="center">
    <v-tooltip top>
      <template v-slot:activator="{ on, attrs }">
        <v-btn
          class="mt-10"
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
      <span>Nueva Condición y/o Término</span>
    </v-tooltip>

    <v-dialog v-model="dialog" max-width="670px">
      <v-card>
        <v-card-title class="headline">{{formTitle}}</v-card-title>
        <v-form ref="form" lazy-validation>
          <v-card-text>
            <v-container>
              <v-row>
                <v-col cols="12" sm="12" md="12">
                   <v-textarea
                    clearable
                    clear-icon="mdi-close-circle"
                    label="Condición y/o Término"
                    counter
                    auto-grow
                    prepend-icon="mdi-library"
                    v-model="edited_item.mensaje"
                    :rules="[rules.required]"
                    required
                    color="secondary"
                  ></v-textarea>
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="12" sm="7" md="7">
                  <v-file-input
                    :rules="[rules.archivo]"
                    :placeholder="edited_item.archivo"
                    accept=".pdf"
                    prepend-icon="mdi-file-pdf"
                    label="Adjuntar archivo (Pdf)"
                    color="secondary"
                    @change="onFileChange"
                    >
                  </v-file-input>
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
    dialogCondicion: {
      default: false,
    },
    edited_index_enviar: {
      default: -1,
    },
    edited_item_enviar: {},
    universidad_beca_convocatoria_id:{},
  },
  data() {
    return {
      loader: null,
      archivoSelected: '',
      dialog: false,
      loading: false,
      registar_editar: "",
      edited_index: -1,
      edited_item: {
          mensaje: "",
          archivo: "",
          universidad_beca_convocatoria_id:0,
      },
      rules: {
        required: (value) => !!value || "Requerido",
        archivo: (value) => !value || value.size < 2000000 || 'Tamaño debe ser menor de 2 MB!',
        numberRule: (value) => {
          if (!isNaN(parseFloat(value)) && value >= 1 && value <= 100)
            return true;
          return `Número entre 1 y 100`;
        },
      },
    };
  },

  computed: {
    ...mapGetters([""]),
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
    async dialogCondicion(){
      this.registar_editar = "Editar";
      this.edited_index = this.edited_index_enviar;
      this.edited_item = Object.assign({}, this.edited_item_enviar);
      this.dialog = true;
    }
  },

  methods: {
    ...mapActions(["alert","agregarCondicion","editarCondicion"]),
    onFileChange(event) {
      this.archivoSelected = event;
    },
    activar() {
      this.registar_editar = "Guardar";
      this.edited_index = -1;
      this.edited_item.universidad_beca_convocatoria_id = this.universidad_beca_convocatoria_id;
      this.dialog = true;
      this.edited_item.archivo = null;
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
        let data = new FormData();
        data.append('universidad_beca_convocatoria_id', this.edited_item.universidad_beca_convocatoria_id);
        data.append('mensaje', this.edited_item.mensaje);
        data.append('archivo', this.archivoSelected);
        //ver si es nuevo o si editará
        if(this.edited_index > -1){
          //Editar
          await this.editarCondicion({
             item: data,
             id: this.edited_item.id,
             index: this.edited_index,
             universidad_beca_convocatoria_id: this.edited_item.universidad_beca_convocatoria_id,
          })
          this.alert({
              text: "Registro editado",
              color: "primary",
            });
        }else{
          //Nuevo
          await this.agregarCondicion(data);
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
