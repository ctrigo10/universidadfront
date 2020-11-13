<template>
  <v-card>
    <v-card-text>
      <div v-for="(record,index) in records" :key="index">
        <div class="title-record">
          <h2>{{ record.universidad }}</h2>
          <h3>RECORD ACADÉMICO</h3>
        </div>
        <table class="datosEstudiante">
          <tr>
            <th align="left">Carnet</th><td>{{record.carnet }}</td>
          </tr>
          <tr>
            <th align="left">Estudiante</th><td>{{ record.estudiante }}</td>
          </tr>
          <tr>
            <th align="left">Carrera</th><td>{{ record.carrera }}</td>
          </tr>
        </table>

        <br>

        <v-divider></v-divider>
        <v-data-table
          :headers="headers"
          :items="record.materias"
          class="elevation-0"
          dense
          hide-default-footer
        >
        </v-data-table>
      </div>
    </v-card-text>
  </v-card>
</template>

<script>
export default {
  name: 'record-academico',
  props: ['records','estudiante'],
  data: () => ({
    headers: [
      { text: 'Código', value: 'codigo'},
      { text: 'Materia', value: 'materia'},
      { text: 'Nota', value: 'nota_cuantitativa'},
    ],
  })
}
</script>

<style>
  .title-record {
    text-align: center;
    padding: 20px;
  }
  .datosEstudiante > tr > td{
      padding-left: 20px;
  }
</style>