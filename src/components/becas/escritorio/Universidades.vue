<template>
  <v-row>
    <v-col cols="12" md="9">
      <v-card>
        <v-card-title>
          <v-text-field
            class="mt-n5"
            v-model="search"
            append-icon="mdi-magnify"
            label="Buscar por Universidad"
            single-line
            hide-details
            color="secondary"
          ></v-text-field>
          <v-spacer></v-spacer>
          <p class="caption">
            (FB) Falta registrar Becas, (VA) Validado, (RE) Rechazado,
            <br />(PR) En proceso, (CA) Cancelado, (Σ) Total
          </p>
        </v-card-title>
        <v-menu>
          <template #activator="{ on: onMenu }">
            <v-tooltip bottom>
              <template #activator="{ on: onTooltip }">
                <v-btn
                  fab
                  absolute
                  color="secondary"
                  small
                  right
                  dark
                  class="mt-n9"
                  v-on="{ ...onMenu, ...onTooltip }"
                >
                  <v-icon>mdi-file-pdf</v-icon>
                </v-btn>
              </template>

              <span>Descargar Todas las Solicitudes</span>
            </v-tooltip>
          </template>
          <v-list dense>
            <v-list-item v-for="estado of estados" :key="estado.id" @click="pdf(0,estado)">
              <v-list-item-subtitle>{{ estado + 's' }}</v-list-item-subtitle>
            </v-list-item>

             <v-list-item @click="pdf(0, 'Todo')">
              <v-list-item-subtitle>Todo</v-list-item-subtitle>
            </v-list-item>
          </v-list>
        </v-menu>

        <v-data-table
          :headers="headers"
          :items="desserts"
          :items-per-page="5"
          :options.sync="options"
          :server-items-length="totalDesserts"
          :loading="loading"
          class="elevation-1 caption"
          :footer-props="{
            'items-per-page-text': 'Por página',
            'items-per-page-options': [5, 10, 15, 20],
          }"
          no-data-text="No hay datos disponibles"
        >
          <template v-slot:[`item.falta_registrar`]="{ item }">
            <v-chip
              v-if="item.falta_registrar != 0"
              small
              :color="
                getColor(item.cantidad_becas, item.falta_registrar)
              "
              dark
            >
              {{ item.falta_registrar }}
            </v-chip>
            <v-icon v-else color="green">mdi-check-all</v-icon>
          </template>
          <template v-slot:[`item.actions`]="{ item }">
            <v-menu>
              <template #activator="{ on: onMenu }">
                <v-tooltip bottom>
                  <template #activator="{ on: onTooltip }">
                    <v-btn icon v-on="{ ...onMenu, ...onTooltip }">
                      <v-icon>mdi-file-pdf-outline</v-icon>
                    </v-btn>
                  </template>

                  <span>Descargar Solicitudes</span>
                </v-tooltip>
              </template>
              <v-list dense>
                <v-list-item v-for="estado of estados" :key="estado.id" @click="pdf(item,estado)">
                  <v-list-item-subtitle>{{ estado + 's' }}</v-list-item-subtitle>
                </v-list-item>

                <v-list-item @click="pdf(item, 'Todo')">
                  <v-list-item-subtitle>Todo</v-list-item-subtitle>
                </v-list-item>
              </v-list>
            </v-menu>
          </template>
        </v-data-table>
      </v-card>
    </v-col>
    <v-col cols="12" md="3">
      <v-card>
        <highcharts :options="chartOptions"></highcharts>
      </v-card>
    </v-col>
    <ReporteSolicitudes :descargar="descargar" :datosPdf="datosPdf"/>
  </v-row>
</template>
<script>

import ReporteSolicitudes from "@/components/becas/escritorio/ReporteSolicitudes";
import { Chart } from "highcharts-vue";
import _ from "lodash";
import { mapActions } from "vuex";
import becasService from "@/services/becasService";
export default {
  name: "Beca-escritorio-universidades",
  props: ["gestion_tipo_id", "version","estados"],
  components: {
    highcharts: Chart,
    ReporteSolicitudes
  },
  mounted() {
    this.cargarDatos();
  },
  data() {
    return {
      totalDesserts: 10,
      desserts: [],
      loading: true,
      descargar: false,
      datosPdf:[],
      search: "",
      options: {},
      headers: [
        {
          text: "Universidad",
          class: "deep-purple lighten-5",
          value: "institucioneducativa",
        },
        {
          text: "Becas",
          class: "deep-purple lighten-5",
          value: "cantidad_becas",
          align: "center",
        },
        {
          text: "FB",
          class: "deep-purple lighten-5",
          value: "falta_registrar",
          align: "center",
        },
        {
          text: "VA",
          class: "deep-purple lighten-5",
          value: "validado",
          align: "center",
        },
        {
          text: "RE",
          class: "deep-purple lighten-5",
          value: "rechazado",
          align: "center",
        },
        {
          text: "PR",
          class: "deep-purple lighten-5",
          value: "enproceso",
          align: "center",
        },
        {
          text: "CA",
          class: "deep-purple lighten-5",
          value: "cancelado",
          align: "center",
        },
        {
          text: "Σ",
          class: "body-1 deep-purple lighten-5",
          value: "total",
          align: "center",
        },
        {
          text: "PDF",
          value: "actions",
          sortable: false,
          align: "center",
          class: "deep-purple lighten-5",
        },
      ],
      chartOptions: {
        chart: {
          type: "pie",
          plotBackgroundColor: null,
          plotBorderWidth: null,
          plotShadow: false,
          height: 365,
        },
        credits: {
          enabled: false,
        },
        title: {
          text: "Becas Por Universidad",
        },
        tooltip: {
          pointFormat: "{series.name}: <b>{point.percentage:.1f}%</b>",
        },
        accessibility: {
          point: {
            valueSuffix: "%",
          },
        },
        plotOptions: {
          pie: {
            allowPointSelect: true,
            cursor: "pointer",
            dataLabels: {
              enabled: false,
            },
            showInLegend: true,
          },
        },
        series: [
          {
            name: "Brands",
            colorByPoint: true,
            data: [],
          },
        ],
      },
    };
  },
  watch: {
    options: {
      handler() {
        this.cargarDatos();
      },
      deep: true,
    },
    search: _.debounce(function () {
      this.changeSearch(this.search);
    }, 1000),
  },
  methods: {
    ...mapActions(["alert"]),
    async cargarDatos() {
      try {
        this.loading = true;
        let resp = await becasService.getUniversidadesByCantidadEstado({
          gestion_tipo_id: this.gestion_tipo_id,
          version: this.version,
          page: this.options.page,
          itemsPerPage: this.options.itemsPerPage,
          sortBy: this.options.sortBy[0],
          sortDesc: this.options.sortDesc[0],
          search: this.search,
        });
        this.desserts = resp.data.data;
        this.chartOptions.series[0].data = [];
        for (let dessert of this.desserts) {
          this.chartOptions.series[0].data.push({
            name: dessert.institucioneducativa,
            y: dessert.cantidad_becas,
          });
        }
        this.totalDesserts = +resp.data.options.rowsTotal;
      } catch (error) {
        let text = error;
        if (error.response) text = error.response.data;
        this.alert({
          text: text,
          color: "red",
        });
      } finally {
        this.loading = false;
      }
    },
    changeSearch() {
      this.cargarDatos();
    },
    getColor(cantidad_total, falta_registrar) {
      let porcentaje = (falta_registrar * 100) / cantidad_total;
      return porcentaje > 60 ? "red" : "orange";
    },
    pdf(item, opcion) {
     this.datosPdf={
       universidad: item,
       opcion: opcion,
       gestion_tipo_id: this.gestion_tipo_id,
       version: this.version,
     }
     this.descargar = !this.descargar;
    },
  },
};
</script>