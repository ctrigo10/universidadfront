<template>
  <div>
    <v-container grid-list-xl fluid>
      <header-title title="Resultado de la prueba"></header-title>
      <v-row class="mb-6">
        <v-col cols="12" sm="12">
          <v-card>
            <v-card-text>
              Ingrese código RUDE o CI.
              <v-form ref="sform">
                <v-row>
                  <v-col cols="12" sm="8" class="py-0">
                    <v-text-field
                      label="Código RUDE/CI"
                      v-model="estudiante.codigo_rude"
                      :rules="[(v) => !!v || 'Campo requerido']"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="4">
                    <v-btn
                      :loading="btn_loading"
                      color="primary"
                      @click="searchStudent"
                    >
                      <v-icon>mdi-magnify</v-icon>Buscar
                    </v-btn>
                  </v-col>
                </v-row>
              </v-form>
              <v-row>
                <v-col cols="12" sm="6" md="4">
                  <v-text-field
                    v-model="estudiante.nombre"
                    label="Nombres"
                    filled
                    disabled
                    hide-details
                  ></v-text-field>
                </v-col>
                <v-col cols="12" sm="6" md="4">
                  <v-text-field
                    v-model="estudiante.paterno"
                    label="Apellido paterno"
                    filled
                    disabled
                    hide-details
                  ></v-text-field>
                </v-col>
                <v-col cols="12" sm="6" md="4">
                  <v-text-field
                    v-model="estudiante.materno"
                    label="Apellido materno"
                    filled
                    disabled
                    hide-details
                  ></v-text-field>
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="12" v-if="estudiante.aptitudes > 0">
                  <highcharts
                    class="chart"
                    :options="chartAptitudes"
                  ></highcharts>
                </v-col>
                <v-col cols="12" v-if="estudiante.intereses > 0">
                  <highcharts
                    class="chart"
                    :options="chartIntereses"
                  ></highcharts>
                </v-col>
              </v-row>
              <v-row v-if="estudiante.estilos > 0">
                <v-col cols="12" sm="6">
                  <highcharts
                    class="chart"
                    :options="chartEstilos"
                  ></highcharts>
                </v-col>
                <v-col cols="12" sm="6" class="text-center mt-3">
                  <v-container fill-height fluid>
                    <v-row align="center">
                      <v-col>
                        <ul class="text-left">
                          <li v-for="(_, il) in estilos.labels" :key="il">
                            {{ estilos.labels[il] }}
                            <b>{{ estilos.values[il] }}</b>
                          </li>
                        </ul>
                      </v-col>
                    </v-row>
                  </v-container>
                  <!--  -->
                </v-col>
              </v-row>
              <div v-if="data_loading" class="text-center">
                <v-progress-circular indeterminate></v-progress-circular>
              </div>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
    <v-snackbar
      v-model="snack.state"
      top="top"
      right="right"
      rounded="pill"
      :color="snack.color"
      timeout="2500"
      >{{ snack.text }}</v-snackbar
    >
  </div>
</template>

<script>
import Highcharts from "highcharts";
import highchartsMore from "highcharts/highcharts-more";
import exportingInit from "highcharts/modules/exporting";
import HeaderTitle from "@/components/HeaderTitle";
import Service from "../../services/general";
import axios from "axios";
exportingInit(Highcharts);
highchartsMore(Highcharts);
export default {
  name: "universidad",
  components: {
    HeaderTitle,
  },
  data: () => ({
    loading: false,
    question_loading: false,
    data_loading: false,
    send_loading: false,
    btn_loading: false,
    respuestas: [],
    estudiante: {
      id: "",
      codigo_rude: "819813412008154",
      nombre: "",
      paterno: "",
      materno: "",
      aptitudes: 0,
      intereses: 0,
      estilos: 0,
    },
    estilos: {
      labels: [],
      values: [],
    },
    chartAptitudes: {},
    chartIntereses: {},
    chartEstilos: {},
    cateory_init: 1,
    cateory_end: 5,
    cateory_id: 6,
    cateory_ea: 7,
    serve: "",
    snack: {
      state: false,
      color: "success",
      text: "",
    },
  }),
  mounted() {
    this.serve = Service.getServe();
  },
  computed: {},
  methods: {
    searchStudent() {
      if (this.$refs.sform.validate()) {
        this.btn_loading = true;
        this.estado = "";
        this.estudiante.aptitudes = 0;
        this.estudiante.intereses = 0;
        axios
          .post(
            Service.getBasePre() + "busca/estudiante",
            { codigo_rude: this.estudiante.codigo_rude },
            Service.getHeader()
          )
          .then((response) => {
            this.btn_loading = false;
            if (response.data.id > 0) {
              this.estudiante.id = response.data.id;
              this.estudiante.nombre = response.data.nombre;
              this.estudiante.paterno = response.data.paterno;
              this.estudiante.materno = response.data.materno;
              this.getReportAptitudes(
                this.codigo_rude,
                this.cateory_init,
                this.cateory_end
              );
              this.getReportInteres(
                this.estudiante.codigo_rude,
                this.cateory_id
              );
              this.getReportEstilos(
                this.estudiante.codigo_rude,
                this.cateory_ea
              );
            } else {
              this.toast("info", "Registro no encontrado");
            }
          })
          .catch((error) => {
            this.btn_loading = false;
            console.error("Error al cargar registros", error);
          });
      }
    },

    getReportAptitudes(codigo_rude, cateory_init, cateory_end) {
      this.data_loading = true;
      axios
        .post(
          Service.getBasePre() + "reporte/aptitud",
          {
            codigo_rude: this.estudiante.codigo_rude,
            categoria_inicio: cateory_init,
            categoria_fin: cateory_end,
          },
          Service.getHeader()
        )
        .then((response) => {
          this.data_loading = false;
          this.estudiante.aptitudes = response.data.length;
          let labels = [],
            values = [];
          for (const key in response.data) {
            labels.push(response.data[key].categoria);
            values.push(response.data[key].porcentaje);
          }
          this.chartAptitudes = {
            chart: {
              type: "bar",
              // width: 800,
              height: 300,
            },
            title: {
              text: "REPORTE DE APTITUDES",
            },
            subtitle: {
              text: "El valor porcentaje elevada es la tentativa.",
            },
            xAxis: {
              categories: labels,
              title: {
                text: null,
              },
            },
            yAxis: {
              min: 0,
              title: {
                text: "Respuesta (%)",
                align: "high",
              },
              labels: {
                overflow: "justify",
              },
            },
            tooltip: {
              enabled: true,
              valueSuffix: "%",
            },
            plotOptions: {
              bar: {
                dataLabels: {
                  enabled: true,
                  format: "{point.y}%",
                },
              },
            },
            legend: {
              enabled: false,
              layout: "vertical",
              align: "right",
              verticalAlign: "top",
              x: -40,
              y: 80,
              floating: true,
              borderWidth: 0,
              backgroundColor: "#FFFFFF",
              shadow: true,
            },
            credits: {
              enabled: false,
            },
            series: [
              {
                name: "Respuesta",
                data: values,
                color: "#80CBC4",
              },
            ],
            exporting: {
              buttons: {
                contextButton: {
                  menuItems: [
                    {
                      text: "Imprimir",
                      textKey: "printChart",
                      onclick: function () {
                        this.print();
                      },
                    },
                    {
                      separator: true,
                    },
                    {
                      text: "Descargar PNG",
                      textKey: "downloadPNG",
                      onclick: function () {
                        this.exportChart();
                      },
                    },
                    {
                      text: "Descargar JPG",
                      textKey: "downloadJPEG",
                      onclick: function () {
                        this.exportChart({
                          type: "image/jpeg",
                        });
                      },
                    },
                  ],
                },
              },
            },
          };
        })
        .catch((error) => {
          this.data_loading = false;
          console.error("Error al cargar registros", error);
        });
    },

    getReportInteres(codigo_rude, cateory_id) {
      this.data_loading = true;
      axios
        .post(
          Service.getBasePre() + "reporte/interes/ocupacional",
          {
            codigo_rude: this.estudiante.codigo_rude,
            categoria_id: cateory_id,
          },
          Service.getHeader()
        )
        .then((response) => {
          this.data_loading = false;
          this.estudiante.intereses = response.data.length;
          let labels = [],
            values = [];
          for (const key in response.data) {
            labels.push(response.data[key].respuesta);
            values.push(response.data[key].porcentaje);
          }
          this.chartIntereses = {
            chart: {
              type: "bar",
              // width: 800,
              height: 800,
            },
            title: {
              text: "REPORTE DE INTERESES OCUPACIONALES",
            },
            subtitle: {
              text:
                "El valor porcentaje con mayor valor es la(s) carrera(s) tentativa(s)",
            },
            xAxis: {
              categories: labels,
              title: {
                text: null,
              },
            },
            yAxis: {
              min: 0,
              title: {
                text: "Respuesta (%)",
                align: "high",
              },
              labels: {
                overflow: "justify",
              },
            },
            tooltip: {
              enabled: true,
              valueSuffix: "%",
            },
            plotOptions: {
              bar: {
                dataLabels: {
                  enabled: true,
                  format: "{point.y}%",
                },
              },
            },
            legend: {
              enabled: false,
              layout: "vertical",
              align: "right",
              verticalAlign: "top",
              x: -40,
              y: 80,
              floating: true,
              borderWidth: 0,
              backgroundColor: "#FFFFFF",
              shadow: true,
            },
            credits: {
              enabled: false,
            },
            series: [
              {
                name: "Respuesta",
                data: values,
                color: "#CE93D8",
              },
            ],
            exporting: {
              buttons: {
                contextButton: {
                  menuItems: [
                    {
                      text: "Imprimir",
                      textKey: "printChart",
                      onclick: function () {
                        this.print();
                      },
                    },
                    {
                      separator: true,
                    },
                    {
                      text: "Descargar PNG",
                      textKey: "downloadPNG",
                      onclick: function () {
                        this.exportChart();
                      },
                    },
                    {
                      text: "Descargar JPG",
                      textKey: "downloadJPEG",
                      onclick: function () {
                        this.exportChart({
                          type: "image/jpeg",
                        });
                      },
                    },
                  ],
                },
              },
            },
          };
        })
        .catch((error) => {
          this.data_loading = false;
          console.error("Error al cargar registros", error);
        });
    },

    getReportEstilos(codigo_rude, cateory_id) {
      this.data_loading = true;
      axios
        .post(
          Service.getBasePre() + "reporte/estilo/aprendizaje",
          {
            codigo_rude: this.estudiante.codigo_rude,
            categoria_id: cateory_id,
          },
          Service.getHeader()
        )
        .then((response) => {
          this.data_loading = false;
          this.estudiante.estilos = response.data.length;
          for (const key in response.data) {
            this.estilos.labels.push(response.data[key].respuesta);
            this.estilos.values.push(response.data[key].porcentaje);
          }
          this.chartEstilos = {
            chart: {
              type: "line", //line, area
              polar: true,
            },
            title: {
              text: "REPORTE DE ESTILOS DE APRENDIZAJE",
            },
            subtitle: {
              text: "El valor más alto es la tentativa",
            },
            pane: {
              startAngle: 0,
              endAngle: 360,
            },
            xAxis: {
              tickInterval: 90,
              min: 0,
              max: 360,
              labels: {
                formatter: function () {
                  let label;
                  switch (this.value) {
                    case 0:
                      label = "E.C.";
                      break;
                    case 90:
                      label = "O.R.";
                      break;
                    case 180:
                      label = "C.A.";
                      break;
                    default:
                      label = "E.A.";
                      break;
                  }
                  return label;
                },
              },
            },
            yAxis: {
              min: 0,
            },
            credits: {
              enabled: false,
            },
            legend: {
              enabled: false,
            },
            plotOptions: {
              series: {
                pointStart: 0,
                pointInterval: 90,
              },
              column: {
                pointPadding: 0,
                groupPadding: 0,
              },
            },
            series: [
              {
                name: "Tendencia",
                data: this.estilos.values,
                color: "#9C27B0",
              },
            ],
            exporting: {
              buttons: {
                contextButton: {
                  menuItems: [
                    {
                      text: "Imprimir",
                      textKey: "printChart",
                      onclick: function () {
                        this.print();
                      },
                    },
                    {
                      separator: true,
                    },
                    {
                      text: "Descargar PNG",
                      textKey: "downloadPNG",
                      onclick: function () {
                        this.exportChart();
                      },
                    },
                    {
                      text: "Descargar JPG",
                      textKey: "downloadJPEG",
                      onclick: function () {
                        this.exportChart({
                          type: "image/jpeg",
                        });
                      },
                    },
                  ],
                },
              },
            },
          };
        })
        .catch((error) => {
          this.data_loading = false;
          console.error("Error al cargar registros", error);
        });
    },

    toast(mcolor, mtext) {
      this.snack.color = mcolor;
      this.snack.text = mtext;
      this.snack.state = true;
    },
  },
};
</script>