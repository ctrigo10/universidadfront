<template>
  <div>
    <v-container grid-list-xl fluid>
      <header-title title="Reporte de pruebas"></header-title>
      <v-row class="mb-6">
        <v-col cols="12" sm="12">
          <v-card>
            <v-card-text>
              <h3 class="teal--text my-2">Cantidades por prueba</h3>
              <v-row>
                <v-col cols="12">
                  <v-simple-table>
                    <template v-slot:default>
                      <thead>
                        <tr>
                          <th class="text-left">Tipo de prueba</th>
                          <th class="text-left">Cantidad</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr v-for="item in tipos_prueba" :key="item.name">
                          <td>{{ item.prueba }}</td>
                          <td>{{ item.total }}</td>
                        </tr>
                      </tbody>
                    </template>
                  </v-simple-table>
                </v-col>
                <v-col cols="12" class="mb-5" v-if="tipos_prueba.length > 0">
                  <h3 class="teal--text my-5">
                    Gráfica de cantidades por prueba
                  </h3>
                  <highcharts
                    class="chart"
                    :options="chartGeneral"
                  ></highcharts>
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
    tipos_prueba: [],
    chartGeneral: {},
    snack: {
      state: false,
      color: "success",
      text: "",
    },
  }),
  mounted() {
    this.getReportPruebas();
  },
  computed: {},
  methods: {
    getReportPruebas() {
      this.data_loading = true;
      axios
        .get(Service.getBasePre() + "reporte/general", Service.getHeader())
        .then((response) => {
          this.data_loading = false;
          this.tipos_prueba = response.data;
          let labels = [],
            values = [];
          for (const key in this.tipos_prueba) {
            labels.push(this.tipos_prueba[key].prueba);
            values.push(this.tipos_prueba[key].total * 1);
          }
          this.chartGeneral = {
            chart: {
              type: "bar",
            },
            title: {
              text: "REPORTE POR TIPOS DE PRUEBA",
            },
            subtitle: {
              text: "Cantidad de pruebas realizadas por estudiantes",
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
                text: "Total (#)",
                align: "high",
              },
              labels: {
                overflow: "justify",
              },
            },
            tooltip: {
              enabled: true,
            },
            plotOptions: {
              bar: {
                dataLabels: {
                  enabled: true,
                  format: "{point.y}",
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
                name: "Total",
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

    toast(mcolor, mtext) {
      this.snack.color = mcolor;
      this.snack.text = mtext;
      this.snack.state = true;
    },
  },
};
</script>
<style lang="css" scoped>
.custom-table {
  border-collapse: collapse;
}

.custom-table,
.custom-table th,
.custom-table td {
  border: 1px solid #e0e0e0;
  padding: 2px 10px;
}
</style>