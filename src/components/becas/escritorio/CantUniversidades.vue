<template>
  <v-row>
    <v-col cols="12" md="3">
      <v-card>
        <v-card-title>Datos</v-card-title>
        <v-simple-table dense class="caption">
          <template v-slot:default>
            <tbody>
              <tr v-for="dato of datos.cantidadesGenerales" :key="dato.id">
                <td>{{ dato.nombre }}</td>
                <td>{{ dato.cantidad }}</td>
              </tr>
              <tr>
                <td>&nbsp;</td>
              </tr>
            </tbody>
          </template>
        </v-simple-table>
      </v-card>
    </v-col>
    <v-col cols="12" md="4">
      <v-card>
        <v-simple-table dense class="caption">
          <template v-slot:default>
            <thead>
              <tr>
                <th class="text-left">Estado</th>
                <th class="text-center"><v-icon>mdi-face-woman</v-icon></th>
                <th class="text-center"><v-icon>mdi-face</v-icon></th>
                <th class="text-center">
                  <v-icon>mdi-face-woman</v-icon><v-icon>mdi-face</v-icon>
                </th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="dato of datos.cantidadesEstados" :key="dato.id">
                <td>{{ dato.estado }}</td>
                <td align="center">{{ dato.femenino }}</td>
                <td align="center">{{ dato.masculino }}</td>
                <td align="center">{{ dato.total }}</td>
              </tr>
            </tbody>
          </template>
        </v-simple-table>
      </v-card>
    </v-col>
    <v-col cols="12" md="5">
      <v-card>
        <highcharts :options="chartOptions"></highcharts>
      </v-card>
    </v-col>
  </v-row>
</template>
<script>
import { Chart } from "highcharts-vue";
export default {
  name: "Beca-escritorio-cantUniversidades",
  props: ["datos", "estados"],
  components: {
    highcharts: Chart,
  },
  data() {
    return {
      chartOptions: {
        colors: ["PINK", "#4572A7"],
        chart: {
          type: "column",
          height: 192,
        },
        plotOptions: {
          column: {
            stacking: "normal",
            dataLabels: {
              enabled: true,
            },
          },
        },
        credits: {
          enabled: false,
        },
        legend: {
          align: "left",
          x: 0,
          verticalAlign: "bottom",
          y: 17,
          floating: true,
          borderColor: "#CCC",
          borderWidth: 0,
          shadow: false,
        },
        tooltip: {
          headerFormat: "<b>{point.x}</b><br/>",
          pointFormat: "{series.name}: {point.y}<br/>Total: {point.stackTotal}",
        },
        series: [
          {
            name: "Femenino",
            data: this.estados.femenino,
          },
          {
            name: "Masculino",
            data: this.estados.masculino, // sample data
          },
        ],
        title: {
          text: null,
        },
        xAxis: {
          categories: this.estados.nombre,
        },
        yAxis: {
          min: 0,
          title: {
            text: "Solicitudes",
          },
          stackLabels: {
              enabled: true,
              style:{
                 fontWeight: 'bold',
              }
            },
        },
      },
    };
  },
};
</script>