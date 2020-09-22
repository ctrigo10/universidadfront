<template>
  <div>
    <v-card class="tarjeta" v-if="vista == 'lista'">
      <v-card-title>
        Universidades
      </v-card-title>
      <v-card-text>
        <v-row>
          <v-col
            v-for="(universidad, key) in universidades"
            :key="key"
            cols="12"
            lg="3"
            md="4"
            sm="6"
            xs="6"
          >
            <v-card class="card-universidad" @click="seleccionar(universidad.id)" elevation="10">
              <v-img
                class="imagen-universidad"
                height="150px"
                :src="'http://localhost:3000/' + universidad.imagen"
                aspect-ratio="1"
                contain
              ></v-img>
              <v-card-title class="pb-0">{{universidad.institucioneducativa}}</v-card-title>
            </v-card>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
    <div v-else>
      <v-btn @click="vista = 'lista'" text> Universidades</v-btn>
      <DatosUniversidad :idUniversidad="universidadSeleccionada"/>
      <v-card class="tarjeta">
        <v-card-title>
          Carreras
          <v-spacer></v-spacer>
        </v-card-title>
        <v-card-text>
          <v-data-table
            :headers="headers"
            :items="carreras"
            class="elevation-1"
          >
          </v-data-table>
        </v-card-text>
      </v-card>
    </div>
  </div>
</template>
<script>
import axios from 'axios'
import DatosUniversidad from '../../components/universidades/DatosUniversidad'
export default {
  name: 'publico',
  components: {
    DatosUniversidad
  },
  data: () => ({
    vista: 'lista',
    universidades: [],
    universidadSeleccionada: '',
    carreras: [],
    headers: [
      { text: 'Carrera o Especialidad Académica', sortable: false, value: 'nombre'},
      // { text: 'Grado Académico', value: 'gradoAcademico'},
      // { text: 'Duración', value: 'duracion'},
      // { text: 'Nro. Resolución', value: 'nroResolucion'},
      // { text: 'Fecha', value: 'fecha'},
      // { text: 'Acciones', value: 'acciones', sortable: false, align: 'end'}
    ],
  }),
  mounted(){
    this.getUniversidades();
  },
  methods: {
    getUniversidades(){
      axios.get('http://localhost:3000/universidad').then(response => {
        console.log(response);
        this.universidades = response.data.data;
      })
    },
    seleccionar(id){
      this.universidadSeleccionada = id;
      this.vista = id;

      axios.get(`http://localhost:3000/carreraUni/carreraUniversidad/${this.universidadSeleccionada}`).then(response => {
        this.carreras = response.data.data;
      })
    }
  }
}
</script>
<style scope>
  .imagen-universidad {
    /* background-color: rgb(128, 0, 128, 0.05); */
    width: auto !important;

  }
  .card-universidad > .v-card__title{
    color: purple;
    font-size: 1em;
  }
</style>