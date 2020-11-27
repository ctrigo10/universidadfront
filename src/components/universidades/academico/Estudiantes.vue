<template>
  <div>
    <h3>Estudiantes</h3>
    <v-row>
      <v-col cols="12" sm="4" xs="12">
        <v-select
          :items="gestiones"
          item-text="gestion"
          item-value="id"
          v-model="gestion"
          label="Gestión"
          @change="getEstudiantes()"
        ></v-select>
      </v-col>
      <v-col cols="12" sm="4" xs="12">
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
      <v-col cols="12" sm="4" xs="12">
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
          <v-card-title primary-title>
            <h5>Estudiantes registrados</h5>
            <v-spacer></v-spacer>
          </v-card-title>
          <v-card-text>
            <v-text-field
              v-model="search"
              label="Buscar estudiante"
            ></v-text-field>
            <!-- <v-list>
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
                    <v-list-item-subtitle>C.I.: {{item.carnet_identidad}} {{item.complemento}}</v-list-item-subtitle>
                  </v-list-item-content>
                </v-list-item>
              </v-list-item-group>
            </v-list>
            <div v-if="estudiantes.length == 0">Sin resultados</div> -->

            <v-data-table
              :headers="headers"
              :items="estudiantes"
              :search="search"
              locales="es"
            >
              <template v-slot:[`item.acciones`]="{ item }">
                <v-btn @click="getRecordAcademico(item)" x-small color="secondary">
                  <v-icon x-small>mdi-file</v-icon> Record Académico
                </v-btn>
              </template>
            </v-data-table>
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
    
      <RecordAcademico :records="recordAcademico" :estudiante="estudianteSeleccionado"/>
    </v-dialog>
  </div>
</template>

<script>
import axios from 'axios'
import Servicio from '@/services/general'
import UniversidadesServicio from '@/services/universidadesService'
import RecordAcademico from '../../../components/universidades/academico/RecordAcademico'
import { mapMutations } from 'vuex'
export default {
  name: 'estudiantes',
  components: {
    RecordAcademico
  },
  props: ['idUniversidad'],
  data: () => ({
    headers: [
      { text: 'Nro. Carnet', value: 'carnet_identidad'},
      { text: 'Complemento', value: 'complemento'},
      { text: 'Nombre', value: 'nombre'},
      { text: 'Paterno', value: 'paterno'},
      { text: 'Materno', value: 'materno'},
      { text: 'Acciones', value: 'acciones'},
    ],
    search: '',
    dialogRecord: false,
    itemSeleccionado: '',
    gestion: new Date().getFullYear(),
    periodo: 0,
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
  // watch: {
  //   idUniversidad: function() {
  //     this.getEstudiantes();
  //   }
  // },
  methods: {
    ...mapMutations(['uniAlert']),
    async getEstudiantes(){
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
        this.estudianteSeleccionado = estudiante;
        let datos = await UniversidadesServicio.getRecordAcademico(estudiante.id, this.carrera)
        // console.log('datos',datos);
        if (datos.length == 0) {
          this.uniAlert({color: 'warning', text: 'El estudiante no cuenta con un record académico'})
          return;
        }
        this.recordAcademico = datos;
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