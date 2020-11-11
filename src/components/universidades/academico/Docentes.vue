<template>
  <div>
    <h3>Docentes</h3>
    <v-row>
      <v-col cols="12" lg="6" md="6" sm="4" xs="4">
        <v-select
          :items="gestiones"
          item-text="gestion"
          item-value="id"
          v-model="gestion"
          label="Gestión"
          @change="getDocentes()"
        ></v-select>
      </v-col>
      <v-col cols="12" lg="6" md="6" sm="8" xs="8">
        <v-select
          :items="periodos"
          item-text="periodo"
          item-value="id"
          v-model="periodo"
          label="Periodo"
          @change="getDocentes()"
        ></v-select>
      </v-col>
    </v-row>
    <v-row>
      <v-col :sm="docenteSeleccionado != '' ? 7 : 12">
        <v-card>
          <v-card-text>
            <h4>Docentes</h4>
            <v-list>
              <v-list-item-group v-model="itemSeleccionado" color="primary">
                <v-list-item
                  v-for="(item, i) in docentes"
                  :key="i"
                  @click="getMaterias(item.id)"
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
            <div v-if="docentes.length == 0">Sin resultados</div>
          </v-card-text>
        </v-card>
        <input type="hidden" :value="idUniversidad">
      </v-col>
      <v-col sm="5" v-show="docenteSeleccionado != ''">
        <v-card>
          <v-card-text>
            <h4>Materias</h4>
            <v-list
              disabled="disabled"
            >
              <v-list-item-group>
                <v-list-item
                  v-for="(item, i) in materias"
                  :key="i"
                >
                  <v-list-item-content>
                    <v-list-item-title>{{item.materia}}</v-list-item-title>
                    <v-list-item-subtitle>Código: {{item.codigo}} __ Paralelo: {{item.paralelo}}</v-list-item-subtitle>
                  </v-list-item-content>
                </v-list-item>
              </v-list-item-group>
            </v-list>
            <div v-if="materias.length == 0">Sin resultados</div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import axios from 'axios'
import Servicio from '@/services/general'
export default {
  name: 'docentes',
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
    docenteSeleccionado: '',
    docentes: [],
    gestiones: [],
    periodos: [],
    materias: [],
    id: ''
  }),
  mounted(){
    this.getDocentes();
    this.getPeriodos();
    this.getGestiones();
    console.log('montando docentes')
    this.id = this.idUniversidad;
  },
  updated(){
    if (this.id != this.idUniversidad) {
      this.getDocentes();
      this.id = this.idUniversidad
      console.log('actualizando docentes')
    }
  },
  methods: {
    async getDocentes(){
      this.docenteSeleccionado = '';
      this.materias = [];
      try {
        let response = await axios.get(`${Servicio.getServe()}informe/listaDocentesPeriodo/${this.idUniversidad}/${this.gestion}/${this.periodo}`);
        let data = await response.data;
        this.docentes = data.data;
        console.log(this.docentes)
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
        this.periodos = [{ id: 0, periodo: 'Todos' }]
        data.data.map(item => {
          this.periodos.push(item);
        })
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