<template>
  <div>
    <v-card class="tramite-detalle">
      <v-card-title primary-title>
        <h5>Detalle del trámite</h5>
      </v-card-title>

      <!-- DETALLE DE NUEVA CARRERA Y NUEVA DENOMINACION -->
      <v-card-text v-if="tramite.tramite.tramite_tipo == 56 || tramite.tramite.tramite_tipo == 57">
        <v-row v-if="tramite.tramite.tramite_tipo == 56">
          <v-col cols="12" lg="5">
            <Dato label="Carrera" :value="datos.nombre" />
          </v-col>
          <v-col cols="12" lg="5">
            <Dato label="Código" :value="datos.cod_carrera" />
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12" lg="4">
            <Dato label="Denominación del título profesional" :value="datos.denominacion" />
          </v-col>
          <v-col cols="12" lg="4">
            <Dato label="Mensión" :value="datos.mencion" />
          </v-col>
          <v-col cols="12" lg="4">
            <Dato label="Grado académico" :value="datos.denominacion" />
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12" lg="4">
            <Dato label="Resolución administrativa" :value="datos.resolucion_administrativa" />
          </v-col>
          <v-col cols="12" lg="4">
            <Dato label="Tiempo de estudio" :value="datos.tiempo_estudio" />
          </v-col>
        </v-row>

        <br>
        <Dato label="Materias" value=""/>

        <v-data-table
          :headers="headers"
          :items="datos.materias"
          class="elevation-0"
          dense
          hide-default-footer
        >
          
        </v-data-table>

      </v-card-text>

      <!-- DETALLE DE TOKEN -->
      <v-card-text v-if="tramite.tramite.tramite_tipo == 58">
        <v-row>
          <v-col cols="12" lg="12">
            <Dato label="Observación" :value="datos.observacion" />
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
import Dato from '@/components/universidades/universidad/Dato'
export default {
  name: 'detalle-tramite',
  props: ['tramite', 'datos'],
  components: {
    Dato
  },
  data: () => ({
    headers: [
      { text: 'Periodo', value: 'ttec_periodo_tipo_id', sortable: false, },
      { text: 'Materia', value: 'materia', sortable: false, },
      { text: 'Código', value: 'codigo', sortable: false, },
    ]
  })
}
</script>

<style>
  .tramite-detalle {
    /* background-color: #f5f5f5 !important; */
    margin: 20px 0;
  }
</style>