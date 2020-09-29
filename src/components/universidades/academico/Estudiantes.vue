<template>
  <div>
    <v-row>
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
        >

        </v-select>
      </v-col>
       <v-col sm="4" xs="12">
        <v-select
          :items="carreras"
          item-text="carrera"
          item-value="carrera_autorizada_id"
          v-model="carrera"
          label="Carrera"
          @change="getEstudiantes()"
          no-data-text="Sin resultados"
        ></v-select>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-card>
          <v-card-text>
            <h4>Estudiantes</h4>
            <v-list>
              <v-list-item-group v-model="itemSeleccionado" color="primary">
                <v-list-item
                  v-for="(item, i) in estudiantes"
                  :key="i"
                  @click="getRecordAcademico(item)"
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

    <v-dialog
      v-model="dialogRecord"
      scrollable
      max-width="800px"
      transition="dialog-transition"
    >
    
      <RecordAcademico :record="recordAcademico"/>
    </v-dialog>
  </div>
</template>

<script>
import axios from 'axios'
import Servicio from '@/services/general'
import RecordAcademico from '../../../components/universidades/academico/RecordAcademico'
export default {
  name: 'estudiantes',
  components: {
    RecordAcademico
  },
  props: ['idUniversidad'],
  data: () => ({
    headers: [
      { text: 'Nombre', value: 'nombre'},
      { text: 'Paterno', value: 'paterno'},
      { text: 'Materno', value: 'materno'},
    ],
    dialogRecord: false,
    itemSeleccionado: '',
    gestion: new Date().getFullYear(),
    periodo: 1,
    carrera: '',
    estudianteSeleccionado: '',
    recordAcademico: '',

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
    async getCarreras(){
      try {
        let response = await axios.get(Servicio.getServe() + 'informe/listaCarreras/' + this.idUniversidad);
        let data = await response.data;
        if (data.data.length > 0) {
          // this.carreras = [{ carrera_autorizada_id: 0, carrera: 'Todos' }]
          data.data.map(item => {
            this.carreras.push(item);
          })
          this.carrera = this.carreras[0].carrera_autorizada_id;
        }
        console.log('carrera', data.data)
      } catch (error) {
        console.log(error)
      }
    },
    async getRecordAcademico(estudiante){
      try {
        console.log('asdfasd', estudiante)
        this.estudianteSeleccionado = estudiante.id;
        let response = await axios.get(`${Servicio.getServe()}informe/listaRecordsEstudiante/${this.carrera}/${estudiante.id}`);
        let data = await response.data;
        this.recordAcademico = data.data;
        this.dialogRecord = true;

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