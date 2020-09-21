<template>
  <v-container fluid cols="12">
    <v-card>
      <Header titulo="Universidades" subTitulo="Todas las universidades" />
      <v-card-title>
        Nutrition
        <v-spacer></v-spacer>
        <v-text-field
          v-model="search"
          append-icon="mdi-magnify"
          label="Search"
          single-line
          hide-details
        ></v-text-field>
      </v-card-title>
      <ListOpen
        v-if="!loading"
        :expanded.sync="expanded"
        :headers="headers"
        :items="getUniversidades"
        :acciones="acciones"
        v-on:deleteItem="deleteItem($event)"
        v-on:editItem="editItem($event)"
        @updateOptions="updateOptions"
      />
      <Loading v-else />
    </v-card>
    <Edit
      :dialogF="dialogF"
      :edited_index_enviar="edited_index_enviar"
      :edited_item_enviar="edited_item_enviar"
    />
  </v-container>
</template>

<script>
import Loading from "@/components/becas/shared/Loading";
import Header from "@/components/becas/shared/Header";
import ListOpen from "@/components/becas/universidad/ListOpen";
import Edit from "@/components/becas/universidad/Edit";
import { mapActions, mapGetters } from "vuex";
export default {
  name: "Beca-universidad",
  components: {
    Loading,
    Header,
    ListOpen,
    Edit,
  },

  mounted() {
    this.cargarLista();
  },
  data: () => ({
    loading: false,
    expanded: [],
    singleExpand: false,
    dialogF: false,
    edited_item_enviar:[],
    edited_index_enviar: -1,
    search: "",
    headers: [
      {
        text: "Universidad",
        value: "nombre",
        align: "left",
        class: "subtitle-2 deep-purple lighten-4",
      },
      {
        text: "Departamento",
        value: "departamento",
        align: "center",
        class: "subtitle-2 deep-purple lighten-4",
      },
      {
        text: "Estudiantes",
        value: "cantidad_estudiantes",
        align: "center",
        class: "subtitle-2 deep-purple lighten-4",
      },
      {
        text: "Becas",
        value: "cantidad_becas",
        align: "center",
        class: "subtitle-2 deep-purple lighten-4",
      },
      {
        text: "Acciones",
        value: "actions",
        sortable: false,
        align: "center",
        class: "subtitle-2 deep-purple lighten-4",
      },
      {
        text: "",
        value: "data-table-expand",
        class: "subtitle-2 deep-purple lighten-4",
      },
    ],
    acciones: {
      editar: true,
      ingresar: true,
    },
  }),

  computed: {
    ...mapGetters(["getUniversidades", "getUniversidadIndex", "getOptions"]),
  },

  methods: {
    ...mapActions(["cargarUniversidades","editarOptions"]),

    async cargarLista(){
        this.loading = true;
      try {
        let item = [];
        item.opcion = "uTodos";
        item.options = this.getOptions;
        await this.cargarUniversidades(item);
      } catch (error) {
        this.alert({
          text: error.response.data,
          color: "red",
        });
      } finally {
        this.loading = false;
      }
    },

    updateOptions(options){
      console.log("recargando")
        let optionsNew = options;
        optionsNew.search = this.getOptions.search;
        optionsNew.buscarU = this.getOptions.buscarU;
        this.editarOptions(optionsNew)
        this.optionsNew = this.getOptions
        this.cargarLista();
    },

    editItem(item) {
        this.edited_index_enviar = this.getUniversidadIndex(item);
        this.edited_item_enviar = Object.assign({}, item);
        this.dialogF = !this.dialogF;
    },
  },
};
</script>
