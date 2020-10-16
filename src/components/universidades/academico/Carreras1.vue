<template>
  <div>
    <h3>Carreras</h3>
    <template v-if="carreras.length > 0">
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
                  <!-- <h4>Pensums</h4> -->
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
    <span v-else>Sin resultados</span>
  </div>
</template>

<script>
export default {
  name: 'carreras-1',
  props: ['carreras']
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
</style>