<template>
  <v-dialog v-model="dialog" max-width="500px">
    <v-card>
      <v-card-title
        >{{ edited_item.estudiante }} CI:
        {{ edited_item.carnet_identidad }}</v-card-title
      >
      <v-container fluid>
        <v-form ref="form" lazy-validation>
          <v-card-text>
            <v-col cols="12">
              <v-select
                :items="estados"
                :item-text="text"
                prepend-icon="mdi-handshake"
                :rules="[rules.required]"
                item-value="id"
                v-model="edited_item.universidad_beca_solicitud_estado_id"
                @keyup.enter="save"
                color="secondary"
                label="Estado de la solicitud de beca"
              >
              </v-select>
            </v-col>
            <v-col cols="12">
              <v-textarea
                clearable
                clear-icon="mdi-close-circle"
                v-model="edited_item.observacion"
                label="Motivos del cambio del estado de la solicitud de beca"
                :rules="[rules.required]"
                auto-grow
                required
                color="secondary"
              >
              </v-textarea>
            </v-col>
            Sus datos son registrados por motivos de seguridad.
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="primary" dark @click="close">Cancelar</v-btn>
            <v-btn
              color="secondary"
              class="white--text"
              @click="save"
              :loading="loading"
              @keyup.enter="save"
              :disabled="loading"
              >Guardar</v-btn
            >
          </v-card-actions>
        </v-form>
      </v-container>
    </v-card>
  </v-dialog>
</template>
<script>
import becasService from "@/services/becasService";
import { mapActions, mapGetters } from "vuex";
export default {
  props: {
    dialogF: {
      default: false,
    },
    items: {},
    edited_index_enviar: {
      default: -1,
    },
    edited_item_enviar: {},
    cantidad_becas_disponible: {},
  },

  data: () => ({
    loader: null,
    loading: false,
    dialog: false,
    edited_item: [],
    edited_index: -1,
    estados:[],
    rules: {
      required: (value) => !!value || "Requerido",
    },
  }),
  watch: {
    loader() {
      const l = this.loader;
      this[l] = !this[l];
      setTimeout(() => (this[l] = false), 2000);
      this.loader = null;
    },
    async dialogF() {
      if (this.$refs.form) this.$refs.form.resetValidation();
      this.edited_index = this.edited_index_enviar;
      this.edited_item = Object.assign({}, this.edited_item_enviar);
      //si cantidad de becas disponibles es 0 quitar dela lista para mostrar
      let destados = await becasService.getEstadosListContador(this.getCarreraSolicitudes.universidad_beca_carrera_id);
      this.estados = destados.data.data;
      if(this.cantidad_becas_disponible <= 0 && this.edited_item.universidad_beca_solicitud_estado != 'Validado'){
        let validado_index = await this.estados.findIndex(dato=>dato.nombre=='Validado');
        if(validado_index >= 0){
          this.estados.splice(validado_index, 1);
        }
      }
      this.dialog = true;
    },
  },
  computed:{
    ...mapGetters(["getCarreraSolicitudes"])
  },
  methods: {
    ...mapActions(["alert", "editarSolicitud"]),
    text: (item) => item.nombre,
    async save() {
      if (this.$refs.form.validate() == true) {
        try {
          let estado = this.estados.find(
            (dato) =>
              dato.id == this.edited_item.universidad_beca_solicitud_estado_id
          );
          this.edited_item.universidad_beca_solicitud_estado = estado.nombre;
          await this.editarSolicitud({
            item: this.edited_item,
            index: this.edited_index,
          });
          this.$emit("RefrescarContador");
          this.alert({
            text: "Estado de solicitud modificado correctamente",
            color: "primary",
          });
        } catch (error) {
          let texto = error;
          if (error.response) texto = error.response.data;
          this.alert({
            text: texto,
            color: "red",
          });
        }
        this.close();
      }
    },

    close() {
      this.dialog = false;
    },
  },
};
</script>