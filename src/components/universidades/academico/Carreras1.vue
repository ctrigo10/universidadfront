<template>
  <div>
    <h3>Carreras</h3>
    <!-- <template v-if="carreras.length > 0">
      <v-expansion-panels focusable>
        <v-expansion-panel
          v-for="(item,i) in carreras"
          :key="i"
        >
          <v-expansion-panel-header> <div> <v-icon>mdi-format-list-bulleted</v-icon> {{item.nombre}} </div> </v-expansion-panel-header>
          <v-expansion-panel-content>
            <br>
            <h4>Grados Académicos</h4>
            <div v-for="(denominacion, index) in item.denominaciones" :key="index">
              <v-row>
                <v-col
                  cols="12" lg="3" md="3" sm="4" xs="12"
                >
                  {{ denominacion.nivel_tipo }}
                </v-col>
                <v-col
                  cols="12" lg="9" md="9" sm="8" xs="12"
                >
                  <v-row>
                    <v-col
                      v-for="(pensum, index2) in denominacion.pensums" :key="index2"
                      cols="12" lg="4" md="6" sm="12" xs="12"
                    >
                      <div
                        class="chip-rm"
                      >
                        <div> <b> {{pensum.resolucion_administrativa}} </b></div>
                        <small>Tiempo de estudio: {{ pensum.tiempo_estudio }} <span v-html="pensum.ttec_regimen_estudio_tipo_id == 1 ? 'años': 'semestres'"></span> </small>
                      </div>
                    </v-col>
                  </v-row>
                </v-col>
              </v-row>
              <v-divider></v-divider>
            </div>
          </v-expansion-panel-content>
        </v-expansion-panel>
      </v-expansion-panels>
    </template>
    <span v-else>Sin resultados</span> -->
    <v-card>
      <v-card-text>
        <v-text-field
          v-model="search"
          label="Buscar carrera"
        ></v-text-field>
        <v-data-table
          :headers="headers"
          :items="formatData"
          :search="search"
          locales="es"
        >
          <template v-slot:[`item.grados_academicos`]="{ item }">
            <!-- {{item.grados_academicos}} -->
            <div v-for="(denominacion, index) in item.grados_academicos" :key="index">
              {{ denominacion.nivel_tipo }}
              <span v-for="(pensum, index2) in denominacion.pensums" :key="index2">
                <v-chip x-small color="info" outlined class="ml-2">{{ pensum.resolucion_administrativa }}</v-chip>
                <v-menu
                    :v-model="menu[i]"
                    :close-on-content-click="false"
                    :nudge-width="200"
                    offset-x
                  >
                    <template v-slot:activator="{ on, attrs }">
                      <v-chip x-small color="info" v-bind="attrs" v-on="on" outlined class="ml-2">{{ pensum.resolucion_administrativa }}</v-chip>
                    </template>
                    <v-card>
                      <v-card-title primary-title>
                        <h5>Contenido curricular</h5>
                      </v-card-title>
                      <v-card-text v-if="pensum.materias.length > 0">
                        <table class="tabla-materias">
                          <tr>
                            <th>Código</th>
                            <th>Materia</th>
                          </tr>
                          <tr v-for="(materia, index3) in pensum.materias" :key="index3">
                            <td>{{materia.codigo}}</td>
                            <td>{{materia.materia}}</td>
                          </tr>
                        </table>
                      </v-card-text>
                      <v-card-text v-if="pensum.materias.length == 0">
                        Sin materias
                      </v-card-text>
                    </v-card>
                  </v-menu>
              </span>
            </div>
            <!-- <table v-for="(denominacion, index) in item.grados_academicos" :key="index">
              <tr>
                <th>GRado</th>
                <th>RM</th>
              </tr>
              <tr>
                <td>adsfasdf</td>
                <td>ad</td>
              </tr>
            </table> -->
          </template>
        </v-data-table>
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
export default {
  name: 'carreras-1',
  props: ['carreras'],
  data: () => ({
    headers: [
      { text: 'Código', value: 'codigo'},
      { text: 'Carrera', value: 'nombre'},
      { text: 'Grado académico', value: 'grados_academicos'},
    ],
    search: '',
    menu: []
  }),
  computed: {
    formatData() {
      let newData = []
      this.carreras.map(carrera => {
        newData.push({
          codigo: carrera.codigo,
          nombre: carrera.nombre,
          grados_academicos: carrera.denominaciones
        })
      })
      return newData
    }
  }
}
</script>

<style>
  .chip-rm {
    color: #53aa50;
    border: 1px solid #53aa50;
    border-radius: 20px;
    padding: 7px 15px;
    cursor: pointer;
  }
  .chip-rm:hover {
    background-color: #f5fdf5;
  }
  .tabla-materias {
    width: 100%;
  }
  .tabla-materias th {
    border-bottom: 1px solid gray;
  }
  /* .tabla-materias td {
    margin: 0;
    border: 1px solid gray;
  } */
</style>