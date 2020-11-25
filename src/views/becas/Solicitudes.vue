<template>
  <v-container fluid cols="12">
    <v-card>
      <!--<Header :titulo="getUniversidad.datos.nombre.toUpperCase()" :subTituloUno="fechasRegistro" :subTituloDos="fechasSolicitud" />-->
      <Header
        :titulo="carrera"
        :subTituloUno="fechasRegistro"
        :subTituloDos="fechasSolicitud"
      />
      <InfC v-if="getUniversidad.datos" />
    </v-card>
    <v-card class="mt-2">
      <Header
        :titulo="tiuloHeader2"
        :subTituloUno="convocatoriaFinalizada"
        :subTituloDos="becasdisponibles"
      />
      <v-card>
        <VerSolicitud
          :dialogE="dialogE"
          :edited_item_enviar="edited_item_enviar"
        />
        <EditarEstado
          :dialogF="dialogF"
          :cantidad_becas_disponible="cantidad_becas_disponible"
          :edited_index_enviar="edited_index_enviar"
          :edited_item_enviar="edited_item_enviar"
          v-on:RefrescarContador="RefrescarContador($event)"
        />
      </v-card>
      <v-tabs color="secondary">
        <!--<v-tab @click="buscarEstado(0)">
          <v-badge color="secondary" :content="cantidad_total"> Todos </v-badge>
        </v-tab>-->
        <v-tab
          v-for="estado of estados"
          :key="estado.id"
          @click="buscarEstado(estado.nombre)"
        >
          <v-badge color="secondary" :content="estado.cantidad">
            {{ estado.nombre }}
          </v-badge>
        </v-tab>
      </v-tabs>
      <v-card-title class="mt-n5">
        <v-col cols="6" sm="3">
          <v-text-field
            v-model="searchNombre"
            append-icon="mdi-magnify"
            label="Nombre"
            single-line
            hide-details
            color="secondary"
          ></v-text-field>
        </v-col>
        <v-col cols="6" sm="3">
          <v-text-field
            v-model="searchApellido1"
            append-icon="mdi-magnify"
            label="Primer Apellido"
            single-line
            hide-details
            color="secondary"
          ></v-text-field>
        </v-col>
        <v-col cols="6" sm="3">
          <v-text-field
            v-model="searchApellido2"
            append-icon="mdi-magnify"
            label="Segundo Apellido"
            single-line
            hide-details
            color="secondary"
          ></v-text-field>
        </v-col>
        <v-col cols="6" sm="3">
          <v-text-field
            v-model="searchCI"
            append-icon="mdi-magnify"
            label="C.I."
            single-line
            hide-details
            color="secondary"
          ></v-text-field>
        </v-col>
      </v-card-title>
      <ListApi
        :items="getSolicitudes"
        :headers="headers"
        :acciones="acciones"
        :itemsTotal="getSolicitudesTotal"
        :loading="loading"
        v-on:editItem="editItem($event)"
        v-on:viewItem="viewItem($event)"
        v-on:pdf="pdf($event)"
        v-on:changeOptions="changeOptions($event)"
      />
      <SolicitudPdf :descargar="descargar" :solicitud_id="solicitud_id" />
    </v-card>
  </v-container>
</template>

<script>
import general from "@/services/general";
import becasService from "@/services/becasService";
import { mapActions, mapGetters } from "vuex";
import Header from "@/components/becas/shared/Header";
import ListApi from "@/components/becas/shared/ListApi";
import SolicitudPdf from "@/components/becas/shared/SolicitudPdf";
import InfC from "@/components/becas/solicitudes/InfC";
import EditarEstado from "@/components/becas/solicitudes/EditarEstado";
import VerSolicitud from "@/components/becas/solicitudes/VerSolicitud";
import _ from "lodash";
export default {
  name: "Beca-universidades-solicitudes",
  components: {
    Header,
    InfC,
    VerSolicitud,
    EditarEstado,
    ListApi,
    SolicitudPdf,
  },

  created() {
    if (!this.getCarreraSolicitudes.nombre) {
      this.$router.push({ name: "becas-seguimiento" });
    }
  },

  async mounted() {
    if (this.getCarreraSolicitudes.nombre) {
      this.loading = true;
      try {
        //verificamos si puede cambiar el estado como Universidad Tecnico Becas Naciona'
        let op = false;
        for (let rol of general.getUser().roles) {
          if (rol.rol_tipo.rol == "Universidad Tecnico Becas Nacional")
            op = true;
        }
        op == true && this.getConvocatoriaLast.seleccionar_becados == false
          ? (this.acciones.editar = true)
          : (this.acciones.editar = false);
        //cargamos estados
        this.estados = await this.obtenerCantidadEstados();
        this.cantidad_total = await this.estados.reduce((prev, cur) => {
          return prev + +cur.cantidad;
        }, 0);
        //cantidad becas disponibles restamos los validados
      } catch (error) {
        let texto = error;
        if (error.response) texto = error.response.data;
        this.alert({
          text: texto,
          color: "red",
        });
      } finally {
        this.loading = false;
      }
    }
  },

  data: () => ({
    loading: false,
    edited_index_enviar: "",
    edited_item_enviar: "",
    estado: "Validado",
    model: true,
    descargar: false,
    cantidad_total: 0,
    cantidad_becas_disponible: 0,
    dialogF: false,
    options: {},
    searchNombre: "",
    searchApellido1: "",
    searchApellido2: "",
    searchCI: "",
    solicitud_id: 0,
    dialogE: false,
    estados: [],
    headers: [
      {
        text: "Estudiante Solicitante",
        value: "estudiante",
        sortable: false,
        class: "subtitle-2 deep-purple lighten-5",
      },
      {
        text: "C.I.",
        value: "carnet_identidad",
        class: "subtitle-2 deep-purple lighten-5",
        sortable: false,
        align: "center",
      },
      {
        text: "Celular",
        value: "celular",
        class: "subtitle-2 deep-purple lighten-5",
        sortable: false,
        align: "center",
      },
      {
        text: "Correo",
        value: "correo",
        class: "subtitle-2 deep-purple lighten-5",
        sortable: false,
        align: "center",
      },
      {
        text: "Fecha Solicitud",
        value: "fecha_registro",
        class: "subtitle-2 deep-purple lighten-5",
        sortable: false,
        align: "center",
      },
      {
        text: "Puntaje",
        value: "puntaje",
        class: "subtitle-2 deep-purple lighten-5",
        sortable: false,
        align: "center",
      },
      {
        text: "Acciones",
        value: "actions",
        sortable: false,
        align: "center",
        class: "subtitle-2 deep-purple lighten-5",
      },
    ],
    acciones: {
      editar: false,
      ver: true,
      pdf: true,
    },
  }),

  watch: {
    searchCI: _.debounce(function () {
      this.buscarEstado(this.estado);
    }, 1000),
    searchNombre: _.debounce(function () {
      this.buscarEstado(this.estado);
    }, 1000),
    searchApellido1: _.debounce(function () {
      this.buscarEstado(this.estado);
    }, 1000),
    searchApellido2: _.debounce(function () {
      this.buscarEstado(this.estado);
    }, 1000),
  },

  computed: {
    ...mapGetters([
      "getCarreraSolicitudes",
      "getSolicitudes",
      "getUniversidad",
      "getSolicitudesIndex",
      "isAuthenticated",
      "getConvocatoriaLast",
      "getSolicitudesTotal"
    ]),
    tiuloHeader2(){
      return `SOLICITUDES DE BECA (${this.estado.toUpperCase()})`
    },
    carrera() {
      return this.getCarreraSolicitudes.nombre
        ? `${this.getCarreraSolicitudes.nombre.toUpperCase()} - ${
            this.getCarreraSolicitudes.universidad
          }`
        : "";
    },
    fechasRegistro() {
      if (this.getConvocatoriaLast.seleccionar_becados == false)
        return this.isAuthenticated
          ? `Fecha Registro: ${this.getConvocatoriaLast.fecha_registro_convocatoria}`
          : `Fecha Convocatoria: ${this.getConvocatoriaLast.fecha_solicitud_convocatoria}`;
      else return "Convocatoria Finalizada";
    },
    fechasSolicitud() {
      if (this.getConvocatoriaLast.seleccionar_becados == false)
        return this.isAuthenticated
          ? `Fecha Convocatoria: ${this.getConvocatoriaLast.fecha_solicitud_convocatoria}`
          : "";
      else return "";
    },
    convocatoriaFinalizada() {
      return this.getConvocatoriaLast.seleccionar_becados_text == "Si"
        ? `Convocatoria Finalizada`
        : `Convocatoria no finalizada `;
    },
    becasdisponibles() {
      return `Becas disponibles: ${this.cantidad_becas_disponible}`;
    },
  },

  methods: {
    ...mapActions(["alert", "cargarCarreraSolicitudesBecas"]),
    async buscarEstado(estado) {
      try {
        this.estado = estado;
        this.loading = true;
        await this.cargarCarreraSolicitudesBecas({
          carrera: this.getCarreraSolicitudes.universidad_beca_carrera_id,
          estado: estado,
          page: this.options.page,
          itemsPerPage: this.options.itemsPerPage,
          sortBy: this.options.sortBy[0],
          sortDesc: this.options.sortDesc[0],
          searchNombre: this.searchNombre,
          searchApellido1: this.searchApellido1,
          searchApellido2: this.searchApellido2,
          searchCI: this.searchCI,
        });
      } catch (error) {
        let texto = error;
        if (error.response) texto = error.response.data.msg;
        this.alert({
          text: texto,
          color: "red",
        });
      } finally {
        this.loading = false;
      }
    },
    editItem(item) {
      this.edited_index_enviar = this.getSolicitudesIndex(item);
      this.edited_item_enviar = Object.assign({}, item);
      this.dialogF = !this.dialogF;
    },
    async viewItem(item) {
      this.edited_item_enviar = await Object.assign({}, item);
      this.dialogE = !this.dialogE;
    },
    async obtenerCantidadEstados() {
      //becas disponibles
      this.cantidad_becas_disponible = this.getCarreraSolicitudes.cantidad_becas;
      let estados = await becasService.getEstadosListContador(
        this.getCarreraSolicitudes.universidad_beca_carrera_id
      );
      estados = estados.data.data;
      let validado = await estados.find((dato) => dato.nombre == "Validado");
      this.cantidad_becas_disponible -= validado.cantidad;
      return estados;
    },
    async RefrescarContador() {
      this.estados = await this.obtenerCantidadEstados();
    },
    pdf(item) {
      this.solicitud_id = Buffer.from(
        `Solicitud ${item.universidad_beca_solicitud_id}`
      ).toString("hex");
      this.descargar = !this.descargar;
    },
    changeOptions(item) {
      this.options = item.options;
      this.buscarEstado(this.estado);
    },
  },
};
</script>