<template>
  <v-card>
    <v-card-text>
      <div class="title-record">
        <h2>Universidad {{ record.universidades.nombre }}</h2>
        <h3>RECORD ACADÉMICO</h3>
      </div>
      <table class="datosEstudiante">
        <tr>
          <th align="left">Carnet</th><td>{{ record.carnet }} {{ record.complemento }}</td>
        </tr>
        <tr>
          <th align="left">Estudiante</th><td>{{ record.nombre }} {{ record.paterno }} {{ record.materno }}</td>
        </tr>
        <tr>
          <th align="left">Carrera</th><td>{{ record.universidades.carreras.nombre }}</td>
        </tr>
      </table>

      <br>

      <v-divider></v-divider>
      <v-data-table
        :headers="headers"
        :items="record.universidades.carreras.materias"
        class="elevation-0"
        loading="true"
        dense
        hide-default-footer
      >
      </v-data-table>
    </v-card-text>
  </v-card>
</template>

<script>
export default {
  name: 'record-academico',
  props: ['record'],
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