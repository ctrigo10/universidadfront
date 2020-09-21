<template>
  <v-container fluid cols="12">
    <v-card>
      <Header titulo="Universidades" :subTituloUno="fechasRegistro" :subTituloDos="fechasSolicitud" />
      <v-card-title>
        <v-text-field
          v-model="search"
          append-icon="mdi-magnify"
          label="Buscar..."
          single-line
          hide-details
          class="pl-3 pb-5"
          color="secondary"
        ></v-text-field>
        <v-spacer></v-spacer>
        <v-radio-group color="secondary" @change="changeSearchBy" v-model="getOptions.searchBy" row>
          <v-radio color="secondary" label="Universidad" value="universidad"></v-radio>
          <v-radio color="secondary" label="Carrera" value="carrera"></v-radio>
        </v-radio-group>
        <v-spacer></v-spacer>
        <v-select
          color="secondary"
          :items="itemsDepartamento"
          label="Departamento"
          v-model="getOptions.departamento"
          @change="changeDepartamento"
          class="pr-3 pb-1"
        ></v-select>
      </v-card-title>
      <v-row class="ma-0" v-if="!loading">
      <template v-if="getUniversidades.length > 0">
        <v-col
          v-for="universidad in getUniversidades"
          :key="universidad.institucioneducativa_id"
          class="d-flex child-flex"
          cols="12"
          sm="6"
          md="4"
          lg="3"
        >
          <v-card flat tile class="d-flex">
            <Card v-on:editItem="editItem($event)" v-on:ingresarUniversidad="ingresarUniversidad($event)" :universidad="universidad" />
          </v-card>
        </v-col>
      </template>
      <template v-else>
        <v-col>
        <div class="text--secondary subtitle-1 text-center">No existen registros, intente de nuevo.</div>
        </v-col>
      </template>
      </v-row>
      <Loading v-else />
      <v-row class="pa-2">
        <v-col cols="2">&nbsp;</v-col>
        <v-col cols="2" class="text-center counter">
          <v-select
            :items="itemsPerPage"
            label="Por Página"
            v-model="getOptions.itemsPerPage"
            @change="changeItemsPerPage"
            color="secondary"
            class="pa-1"
          ></v-select>
        </v-col>
        <v-col cols="4" class="text-center">
          <v-pagination
            @input="changePage"
            color="secondary"
            v-model="getOptions.page"
            :length="pageTotal"
            :total-visible="6"
          ></v-pagination>
        </v-col>
        <v-col
          cols="3"
          class="text-center pa-5 p counter"
        >Cantidad Total: {{ getOptions.itemsTotal }}</v-col>
      </v-row>
    </v-card>
    <Edit
      :dialogF="dialogF"
      :edited_index_enviar="edited_index_enviar"
      :edited_item_enviar="edited_item_enviar"
    />
  </v-container>
</template>

<script>
import _ from "lodash";
import Loading from "@/components/becas/shared/Loading";
import Header from "@/components/becas/shared/Header";
import Edit from "@/components/becas/universidad/Edit";
import Card from "@/components/becas/universidad/Card";
import { mapActions, mapGetters } from "vuex";
export default {
  name: "Beca-universidades",
  components: {
    Loading,
    Header,
    Edit,
    Card,
  },

  mounted() {
    this.resetOptions();
    this.cargarConvocatoriasActual();
    this.cargarLista();
  },
  data: () => ({
    loading: false,
    itemsPerPage: [8, 12, 16],
    itemsDepartamento: [
      "Todos",
      "Chuquisaca",
      "La Paz",
      "Cochabamba",
      "Oruro",
      "Potosi",
      "Tarija",
      "Santa Cruz",
      "Beni",
      "Pando",
    ],
    dialogF: false,
    search: "",
    edited_item_enviar: [],
    edited_index_enviar: -1,
    selecteDefault: 8,
  }),

  computed: {
    ...mapGetters(["getUniversidades", "getUniversidadIndex", "getOptions","getConvocatoriaLast", "getEsFechaRegistro"]),
    pageTotal() {
      return (
        Math.floor(this.getOptions.itemsTotal / this.getOptions.itemsPerPage) +
        1
      );
    },
    fechasRegistro(){
      return `Fechas Registro: ${this.getConvocatoriaLast.fecha_registro_convocatoria}`
    },
    fechasSolicitud(){
      return `Fecha Convocatoria: ${this.getConvocatoriaLast.fecha_solicitud_convocatoria}`
    }
  },

  watch: {
    search: _.debounce(function () {
      this.changeSearch(this.search);
    }, 1000),
  },

  methods: {
    ...mapActions([
      "cargarUniversidades",
      "editarOptions",
      "alert",
      "resetOptions",
      "cargarConvocatoriasActual",
      "cargarUniversidadConBecas"
    ]),

    async cargarLista() {
      this.loading = true;
      try {
        let item = [];
        item.opcion = "uTodos";
        item.options = this.getOptions;
        await this.cargarUniversidades(item);
      } catch (error) {
        console.log(error);
        this.alert({
          text: error,
          color: "red",
        });
      } finally {
        this.loading = false;
      }
    },

    changePage(page) {
      let optionsNew = this.getOptions;
      optionsNew.page = page;
      this.editarOptions(optionsNew);
      this.cargarLista();
    },

    changeItemsPerPage(itemPerPage) {
      let optionsNew = this.getOptions;
      optionsNew.itemPerPage = itemPerPage;
      this.editarOptions(optionsNew);
      this.cargarLista();
    },

    changeSearchBy(searchBy) {
      let optionsNew = this.getOptions;
      optionsNew.page = 1;
      optionsNew.search = "";
      optionsNew.searchBy = searchBy;
      this.editarOptions(optionsNew);
      this.search = "";
      this.cargarLista();
    },

    changeDepartamento(departamento) {
      let optionsNew = this.getOptions;
      optionsNew.page = 1;
      optionsNew.departamento = departamento;
      this.editarOptions(optionsNew);
      this.cargarLista();
    },

    changeSearch(search) {
      let optionsNew = this.getOptions;
      optionsNew.page = 1;
      optionsNew.search = search;
      this.editarOptions(optionsNew);
      this.cargarLista();
    },

    editItem(item) {
      if(this.getEsFechaRegistro){
         this.edited_index_enviar = this.getUniversidadIndex(item);
         this.edited_item_enviar = Object.assign({}, item);
         this.dialogF = !this.dialogF;
      }
      else
          this.alert({
          text: "No está disponible, no está en los plazos de fecha de registro",
          color: "primary",
        });
    },

    async ingresarUniversidad(item){
      //ver si tiene 0 becas y si no registro la universidad
      if(item.id == 0 || item.cantidad_becas == 0)
        this.alert({
          text: "No existen becas disponibles",
          color: "primary",
        });
      else{
        //cargar datos
        await this.cargarUniversidadConBecas(item)
        //enviar a la pagina
        this.$router.push({ name: 'becas-carreras' })
      }
    }
  },
};
</script>
