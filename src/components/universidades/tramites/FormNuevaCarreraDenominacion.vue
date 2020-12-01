<template>
  <div>
    <v-card>
      <v-form ref="form">
        <v-card-text>
          <h2 class="form-title">Formulario de Solicitud</h2>
          <h3 class="form-title" v-text="idTramiteTipo == 56 ? 'Nueva Carrera' : 'Nueva Denominación'"></h3>
          <v-row>
            <v-col cols="12" sm="6">
              <v-select
                :items="universidades"
                item-value="id"
                item-text="institucioneducativa"
                v-model="universidad"
                label="Universidad"
                :rules="[v => !!v || 'El campo es requerido']"
                @change="cargarSedeSubsede"
              ></v-select>
            </v-col>
            <v-col cols="12" sm="6">
              <v-select
                :items="sedesSubsedes"
                item-value="id"
                item-text="nombre_sede_subsede"
                v-model="datos.universidad_id"
                label="Sede/Subsede"
                :rules="[v => !!v || 'El campo es requerido']"
                @change="getCarreras"
              ></v-select>
            </v-col>
          </v-row>

          <!-- Nueva carrera -->
          <v-row v-if="idTramiteTipo == 56">
            <v-col cols="12" sm="6">
              <v-text-field
                v-model="datos.nombre"
                label="Carrera"
                :rules="[v => !!v || 'El campo es requerido']"
              ></v-text-field>
            </v-col>
            <v-col cols="12" sm="6">
              <v-text-field
                v-model="datos.cod_carrera"
                label="Código de carrera"
                :rules="[v => !!v || 'El campo es requerido']"
              ></v-text-field>
            </v-col>
          </v-row>
          
          <!-- Nueva denominacion -->
          <v-row v-if="idTramiteTipo == 57">
            <v-col cols="12" sm="6">
              <v-select
                :items="carreras"
                item-value="carreraautorizada_id"
                item-text="nombre"
                v-model="datos.carreraAutorizada_id"
                label="Carrera"
                :rules="[v => !!v || 'El campo es requerido']"
                @change="seleccionarCarrera"
              ></v-select>
            </v-col>
          </v-row>

          <!-- /////////////////////////// -->
          
          <v-row>
            <v-col cols="12" sm="4">
              <v-text-field
                v-model="datos.denominacion"
                label="Denominación del Título Profesional"
                :rules="[v => !!v || 'El campo es requerido']"
              ></v-text-field>
            </v-col>
            <v-col cols="12" sm="4">
              <v-text-field
                v-model="datos.mencion"
                label="Mension"
                :rules="[v => !!v || 'El campo es requerido']"
              ></v-text-field>
            </v-col>
            <v-col cols="12" sm="4">
              <v-select
                :items="niveles"
                item-value="id"
                item-text="nivel"
                v-model="datos.nivel_tipo_id"
                label="Grado Académico"
                :rules="[v => !!v || 'El campo es requerido']"
              ></v-select>
            </v-col>
            <v-col cols="12" sm="4">
              <v-text-field
                v-model="datos.resolucion_administrativa"
                label="Resolución Administrativa"
                :rules="[v => !!v || 'El campo es requerido']"
              ></v-text-field>
            </v-col>
            <v-col cols="12" sm="4">
              <v-text-field
                v-model="datos.tiempo_estudio"
                label="Tiempo de estudio"
                :rules="[v => !!v || 'El campo es requerido']"
              ></v-text-field>
            </v-col>
            <v-col cols="12" sm="4">
              <v-select
                :items="regimenes"
                item-value="id"
                item-text="regimen_estudio"
                v-model="datos.ttec_regimen_estudio_tipo_id"
                label="Régimen de estudio"
                :rules="[v => !!v || 'El campo es requerido']"
              ></v-select>
            </v-col>
          </v-row>
          <h4>Materias </h4>
          <v-simple-table v-if="datos.materias.length > 0">
            <thead>
              <tr>
                <th>Semestre/Año</th>
                <th>Materia</th>
                <th>Código</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(materia, i) in datos.materias" :key="i">
                <td class="control-periodo-materia">
                  <v-select
                    :items="periodosMateria"
                    item-value="id"
                    item-text="periodo"
                    v-model="datos.materias[i].ttec_periodo_tipo_id"
                    label="Semestre"
                    :rules="[v => !!v || 'El campo es requerido']"
                  ></v-select>
                </td>
                <td>
                  <v-text-field
                    v-model="datos.materias[i].materia"
                    label="Materia"
                    :rules="[v => !!v || 'El campo es requerido']"
                  ></v-text-field>
                </td>
                <td>
                  <v-text-field
                    v-model="datos.materias[i].codigo"
                    label="Código"
                    :rules="[v => !!v || 'El campo es requerido']"
                  ></v-text-field>
                </td>
                <td>
                  <v-tooltip top>
                    <template v-slot:activator="{ on, attrs }">
                      <v-btn color="grey" dark x-small v-bind="attrs" v-on="on" @click="eliminarMateria(i)">
                        <v-icon x-small class="mr-1">mdi-delete-outline</v-icon> Quitar 
                      </v-btn>
                    </template>
                    <span>Quitar materia</span>
                  </v-tooltip>
                </td>
              </tr>
            </tbody>
          </v-simple-table>
          <v-btn color="info" @click="agregarMateria" small> <v-icon small class="mr-1">mdi-file-plus</v-icon> Agregar materia</v-btn>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="secondary" @click="cancelar">Cancelar</v-btn>
          <v-btn color="primary" @click="enviarSolicitud">Enviar solicitud</v-btn>
        </v-card-actions>
      </v-form>
    </v-card>
  </div>
</template>

<script>
import Service from '@/services/general'
import UniversidadesService from '@/services/universidadesService'
import { mapMutations } from 'vuex'
export default {
  name: 'tramite-form-nueva-carrera-denominacion',
  props: ['idTramiteTipo'],
  data: () => ({
    datos: {
      carreraAutorizada_id:'',
      universidad_id:'',
      nombre:'',
      cod_carrera:'',
      denominacion:'',
      mencion:'',
      nivel_tipo_id:'',
      pensum_nombre:'',
      resolucion_administrativa:'',
      tiempo_estudio:'',
      ttec_regimen_estudio_tipo_id:'',
      materias:[]
    },
    universidad: '',
    universidades: [],
    sedesSubsedes: [],
    carreras: [],
    niveles: [],
    regimenes: [],
    periodosMateria: [],
    usuarioLogueado: ''
  }),
  mounted() {
    this.datos.carrera_id = '';
    this.getUniversidades();
    this.usuarioLogueado = Service.getUser();
    console.log('montando')
  },
  methods: {
    ...mapMutations(['uniAlert']),
    async getUniversidades() {
      try {
        let response = await UniversidadesService.getUniversidades()
        let data = response.data.data
        this.universidades = data;
        console.log('data', data)
        this.getNiveles();
        this.getRegimenes();
        this.getPeriodosMateria();
      } catch (error) {
        console.log(error)
      }
    },
    async cargarSedeSubsede() {
      try {
        let response = await UniversidadesService.getSedesSubsedesUniversidad(this.universidad)
        let data = await response.data.data
        this.sedesSubsedes = data;
      } catch (error) {
        console.log(error)
      }
    },
    async getCarreras() {
      try {
        let response = await UniversidadesService.getCarrerasUniversidad(this.datos.universidad_id)
        let data = await response.data.data
        this.carreras = data;
        console.log(this.carreras)
      } catch (error) {
        console.log(error)
      }
    },
    async getNiveles() {
      try {
        let response = await UniversidadesService.getNiveles()
        let data = await response.data.data
        this.niveles = data;
      } catch (error) {
        console.log(error)
      }
    },
    async getRegimenes() {
      try {
        let response = await UniversidadesService.getRegimenes()
        let data = await response.data.data
        this.regimenes = data;
      } catch (error) {
        console.log(error)
      }
    },
    async getPeriodosMateria() {
      try {
        let response = await UniversidadesService.getPeriodosMateria()
        let data = await response.data.data
        this.periodosMateria = data;
      } catch (error) {
        console.log(error)
      }
    },
    seleccionarCarrera(idCarrera) {
      console.log(idCarrera)
      // let index = this.carreras.indexOf(elemento => elemento.carrera_id == idCarrera)
      this.datos.cod_carrera = idCarrera
      // this.datos.cod_carrera = this.carreras[index].carrera_id
    },
    agregarMateria(){
      this.datos.materias.push({
        materia:'',
        codigo:'',
        ttec_periodo_tipo_id:''
      })
    },
    eliminarMateria(index){
      this.datos.materias.splice(index, 1)
    },
    async enviarSolicitud() {
      try {
        if (this.$refs.form.validate()) {
          if (this.datos.materias.length > 0) {
            // console.log('asdf')
            let datos = {
              tipotramite_id: this.idTramiteTipo,
              universidad_id: this.datos.universidad_id,
              tramite_id: '',
              valor_evaluacion: '',
              observacion: '',
              datos: this.datos
            }
            let response = await UniversidadesService.enviarFormularioInicioTramite(datos)
            let data = await response.data
            if (data.status == 'success') {
              this.uniAlert({color: 'success', text: 'Solicitud enviada correctamente'})
              this.$emit('solicitud_enviada', true);
            }
          }else{
            this.uniAlert({color: 'warning', text: 'Debe agregar materias'})
          }
        }
      } catch (error) {
        console.log(error)
        this.uniAlert({color: 'error', text: 'Ocurrio un error al enviar la solicitud'})
      }
    },
    cancelar() {
      this.$emit('cancelar', true);
    }
  }
}
</script>

<style>
  .control-periodo-materia {
    max-width: 200px;
  }
  .form-title {
    text-align: center !important;
    font-weight: 400;
  }
</style>