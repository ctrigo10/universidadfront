<template>
  <div>
    <v-card-title class="mt-n5">
      <v-text-field
        v-model="search"
        append-icon="mdi-magnify"
        label="Buscar"
        single-line
        hide-details
        color="secondary"
      ></v-text-field>
      <v-spacer></v-spacer>
    </v-card-title>
    <v-data-table
      :headers="headers"
      :items="items"
      :search="search"
      :expanded.sync="expanded"
      item-key="usuario_id"
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
          <span>Editar</span>
        </v-tooltip>
      </template>
      <template v-slot:expanded-item="{ headers, item }">
        <td :colspan="headers.length">
            <p v-if="item.universidades.length == 0">Ninguna universidad a cargo</p>
            <p v-else>Universidades a cargo:</p>
          <ul>
            <li v-for="universidad in item.universidades" :key="universidad.id">{{ universidad.institucioneducativa }}</li>
          </ul>
        </td>
      </template>
      <template v-slot:no-data>No hay registros</template>
    </v-data-table>
  </div>
</template>

<script>
export default {
  name: "becas-listOpen",
  props: ["headers", "items", "acciones", "sortby"],
  data() {
    return {
      expanded: [],
      search: "",
    };
  },
  methods: {
    editItem(item) {
      this.$emit("editItem", item);
    },
  },
};
</script>
