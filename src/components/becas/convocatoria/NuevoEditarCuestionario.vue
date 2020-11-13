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
      <span>Nueva Pregunta</span>
    </v-tooltip>

    <v-dialog v-model="dialog" max-width="670px">
      <v-card>
        <v-card-title class="headline">{{formTitle}}</v-card-title>
        <v-form ref="form" lazy-validation>
          <v-card-text>
            <v-container>
              <v-row>
                <v-col cols="12" sm="12" md="12">
                  <v-text-field
                    label="Pregunta"
                    v-model.trim="edited_item.pregunta"
                    :rules="[rules.required]"
                    @keyup.enter="save"
                    required
                    color="secondary"
                    prepend-icon="mdi-comment-question-outline"
                    maxlength="50"
                  >
                  </v-text-field>
                </v-col>
              </v-row>
              <v-row>
                  <v-col cols="12" sm="7" md="7">
                    <v-text-field
                        label="Aclaración de Pregunta"
                        v-model.trim="edited_item.comentario"
                        @keyup.enter="save"
                        required
                        color="secondary"
                        prepend-icon="mdi-message-text-outline"
                        maxlength="50"
                    >
                    </v-text-field>
                </v-col>
                <v-col cols="12" sm="5" md="5">
                    <v-switch color="secondary" v-model="edited_item.seleccion_multiple" class="ma-2" label="Selección Múltiple" prepend-icon="mdi-checkbox-multiple-marked-outline"></v-switch>
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
    dialogCuestionario: {
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
      dialog: false,
      loading: false,
      registar_editar: "",
      edited_index: -1,
      edited_item: {
          pregunta: "",
          comentario: "",
          seleccion_multiple: false,
          universidad_beca_convocatoria_id:0,
      },
      rules: {
        required: (value) => !!value || "Requerido",
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
    async dialogCuestionario(){
      this.registar_editar = "Editar";
      this.edited_index = this.edited_index_enviar;
      this.edited_item = Object.assign({}, this.edited_item_enviar);
      this.dialog = true;
    }
  },

  methods: {
    ...mapActions(["alert","agregarPregunta","editarPregunta"]),
    activar() {
      this.registar_editar = "Guardar";
      this.edited_index = -1;
      this.edited_item.universidad_beca_convocatoria_id = this.universidad_beca_convocatoria_id;
      this.dialog = true;
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
          await this.editarPregunta({
             item: this.edited_item,
             index: this.edited_index,
          })
          this.alert({
              text: "Registro editado",
              color: "primary",
            });
        }else{
          //Nuevo
          await this.agregarPregunta(this.edited_item);
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
