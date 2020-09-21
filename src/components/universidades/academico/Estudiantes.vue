<template>
  <div>
    <v-row>
      <v-col sm="4" xs="12">
        <v-select
          :items="carreras"
          item-text="carrera"
          item-value="carrera_autorizada_id"
          v-model="carrera"
          label="Carrera"
          @change="getEstudiantes()"
        ></v-select>
      </v-col>
      <v-col sm="4" xs="12">
        <v-select
          :items="gestiones"
          item-text="gestion"
          item-value="id"
          v-model="gestion"
          label="Gestión"
          @change="getEstudiantes()"
        ></v-select>
      </v-col>
      <v-col sm="4" xs="12">
        <v-select
          :items="periodos"
          item-text="periodo"
          item-value="id"
          v-model="periodo"
          label="Periodo"
          @change="getEstudiantes()"
        ></v-select>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-card>
          <v-card-text>
            <h4>Estudiantes</h4>
            <v-list disabled="disabled">
              <v-list-item-group v-model="itemSeleccionado" color="primary">
                <v-list-item
                  v-for="(item, i) in estudiantes"
                  :key="i"
                  @click="getMaterias(99)"
                >
                  <v-list-item-avatar>
                    <v-img src="../../../assets/user.svg"></v-img>
                  </v-list-item-avatar>
                  <v-list-item-content>
                    <v-list-item-title>{{item.nombre}} {{item.paterno}} {{item.materno}}</v-list-item-title>
                    <v-list-item-subtitle>C.I.: {{item.carnet}} {{item.complemento}}</v-list-item-subtitle>
                  </v-list-item-content>
                </v-list-item>
              </v-list-item-group>
            </v-list>
            <div v-if="estudiantes.length == 0">Sin resultados</div>
          </v-card-text>
        </v-card>
        <input type="hidden" :value="idUniversidad">
      </v-col>
    </v-row>
  </div>
</template>

<script>
import axios from 'axios'
import Servicio from '@/services/general'
export default {
  name: 'estudiantes',
  props: ['idUniversidad'],
  data: () => ({
    headers: [
      { text: 'Nombre', value: 'nombre'},
      { text: 'Paterno', value: 'paterno'},
      { text: 'Materno', value: 'materno'},
    ],
    itemSeleccionado: '',
    gestion: new Date().getFullYear(),
    periodo: 1,
    carrera: '',
    estudiantes: [],
    carreras: [],
    gestiones: [],
    periodos: [],
    id: ''
  }),
  async mounted(){
    await this.getCarreras();
    await this.getGestiones();
    await this.getPeriodos();
    await this.getEstudiantes();
    console.log('montando estudiantes')
    this.id = this.idUniversidad;
  },
  async updated(){
    if (this.id != this.idUniversidad) {
      await this.getCarreras();
      await this.getEstudiantes();
      this.id = this.idUniversidad
      console.log('actualizando estudiantes')
    }
  },
  methods: {
    async getEstudiantes(){
      this.docenteSeleccionado = '';
      this.materias = [];
      try {
        let response = await axios.get(`${Servicio.getServe()}informe/listaEstudiantePeriodo/${this.idUniversidad}/${this.gestion}/${this.periodo}/${this.carrera}`);
        let data = await response.data;
        this.estudiantes = data.data;
      } catch (error) {
        console.log(error)
      }
    },
    async getCarreras(){
      try {
        let response = await axios.get(Servicio.getServe() + 'informe/listaCarreras/' + this.idUniversidad);
        let data = await response.data;
        this.carreras = data.data;
        if (this.carreras.length > 0) {
          this.carrera = this.carreras[0].carrera_autorizada_id
        }
      } catch (error) {
        console.log(error)
      }
    },
    async getGestiones(){
      try {
        let response = await axios.get(Servicio.getServe() + 'informe/listagestion');
        let data = await response.data;
        this.gestiones = data.data;
        console.log(data)
      } catch (error) {
        console.log(error)
      }
    },
    async getPeriodos(){
      try {
        let response = await axios.get(Servicio.getServe() + 'informe/listaperiodo');
        let data = await response.data;
        this.periodos = data.data;
        console.log(data)
      } catch (error) {
        console.log(error)
      }
    },
    async getMaterias(idDocente){
      try {
        this.docenteSeleccionado = idDocente;
        let response = await axios.get(`${Servicio.getServe()}informe/listaMaterias/${this.idUniversidad}/${this.gestion}/${idDocente}`);
        let data = await response.data;
        this.materias = data.data;
        console.log(data)
      } catch (error) {
        console.log(error)
      }
    },
  }

}
</script>

<style>
  .encabezado {
    display: flex;
    justify-items: center;
  }
</style>