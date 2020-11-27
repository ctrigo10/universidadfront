<template>
  <v-dialog v-model="dialog" max-width="550px">
    <v-card>
      <v-card-title>Universidades</v-card-title>
      <v-card-subtitle><strong>USUARIO: </strong>{{ edited_item.nombre}}<br> <strong>C.I.:</strong> {{ edited_item.carnet}}</v-card-subtitle>
      <v-container fluid>
        <v-row align="center">
          <v-col cols="12">
            <v-autocomplete
              v-model="values"
              :items="items"
              dense
              chips
              small-chips
              :item-text="text"
              item-value="id"
              label="Universidades (escriba para filtrar)"
              multiple
              color="secondary"
              outlined
            ></v-autocomplete>
          </v-col>
        </v-row>
      </v-container>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="primary" dark @click="close">Cancelar</v-btn>
        <v-btn
          color="secondary"
          class="white--text"
          @click="save"
          :loading="loading"
          :disabled="loading"
        >Guardar</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>


<script>
import { mapActions } from 'vuex';
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
  },
  data: () => ({
    values: [],
    value: null,
    loader: null,
    dialog: false,
    edited_index:-1,
    loading: false,
    edited_item: [],
  }),

  watch: {
    loader() {
      const l = this.loader;
      this[l] = !this[l];
      setTimeout(() => (this[l] = false), 2000);
      this.loader = null;
    },
    dialogF() {
      this.values = [];
      this.edited_item = Object.assign({}, this.edited_item_enviar);
      this.edited_index = this.edited_index_enviar;
      for (let dato of this.edited_item.universidades) {
        this.values.push(dato.id);
      }
      this.dialog = true;
    },
  },

  methods: {
    ...mapActions(["agregarUniversidadesUsuario", "alert"]),
    text: item => (item.institucioneducativa_dato)? item.institucioneducativa + ' — ' + item.institucioneducativa_dato.nombre_sede_subsede: item.institucioneducativa,
    close() {
      this.dialog = false;
    },
    async save() {
      try {
        this.loader = "loading";
        await this.agregarUniversidadesUsuario({
          usuario_rol_id : this.edited_item.usuario_rol_id,
          universidades : this.values,
          index: this.edited_index,
        });
        this.alert({
          text: "Registros guardados",
          color: "primary",
        });
      } catch (error) {
        let texto = error;
        if(error.response)texto = error.response.data
        this.alert({
          text: texto,
          color: "red",
        });
      }
      this.close();
    },
  },
};
</script>