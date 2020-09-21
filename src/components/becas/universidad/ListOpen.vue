<template>
  <v-data-table
    :headers="headers"
    :items="items"
    :single-expand="singleExpand"
    :expanded.sync="expanded"
    @item-expanded="loadDetails"
    item-key="institucioneducativa_id"
    show-expand
    class="elevation-1"
    :footer-props="{
           'items-per-page-text':'Por página',
      }"
  >
    <template v-slot:[`item.actions`]='{ item }'>
      <v-tooltip top v-if="acciones.editar && item.seleccionar_becados != true">
        <template v-slot:activator="{ on, attrs }">
          <v-btn icon v-bind="attrs" v-on="on" @click="editItem(item)">
            <v-icon color v-bind="attrs" v-on="on">mdi-pencil</v-icon>
          </v-btn>
        </template>
        <span>Editar Cantidad Estudiantes</span>
      </v-tooltip>
      <v-tooltip top v-if="acciones.eliminar && item.seleccionar_becados != true">
        <template v-slot:activator="{ on, attrs }">
          <v-btn icon v-bind="attrs" v-on="on" @click="deleteItem(item)">
            <v-icon color v-bind="attrs" v-on="on">mdi-delete</v-icon>
          </v-btn>
        </template>
        <span>Eliminar</span>
      </v-tooltip>
    </template>
    <template v-slot:expanded-item="{ headers, item }">
      <td :colspan="headers.length">{{ item.prueba }}</td>
    </template>
    <template v-slot:no-data>No hay registros</template>
  </v-data-table>
</template>


<script>
import { mapGetters } from "vuex";
export default {
  name: "becas-listOpen",
  props: ["headers", "items", "acciones"],
  data() {
    return {
      expanded: [],
      singleExpand: false,
    };
  },
  watch:{
   
  },
  computed: {
    ...mapGetters(["getOptions"]),
  },
  methods: {
    loadDetails({ item }) {
      //this.expanded.push(value)
      if (item.becas == 0) item.prueba = "vacio";
    },
    editItem(item) {
      this.$emit("editItem", item);
    },
  },
};
</script>