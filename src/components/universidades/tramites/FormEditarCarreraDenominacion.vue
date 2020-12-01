<template>
  <div>
    <v-card v-if="usuarioLogueado && usuarioLogueado.roles[0].rol_tipo_id == 51">
      <v-form>
        <v-card-text>
          <div v-if="idTramiteTipo == 56">
            <h4>Formulario de Solicitud de Nueva Carrera</h4>
            <v-row>
              <v-col cols="12" sm="6">
                <v-text-field
                  v-model="datos.nombre"
                  label="Carrera"
                ></v-text-field>
              </v-col>
              <v-col cols="12" sm="6">
                <v-text-field
                  v-model="datos.cod_carrera"
                  label="Código de carrera"
                ></v-text-field>
              </v-col>
            </v-row>
          </div>
          <div v-if="idTramiteTipo == 57">
            <h4>Formulario de Solicitud de Nueva Denominación</h4>
            <v-row>
              <v-col cols="12" sm="6">
                <v-select
                  :items="carreras"
                  item-value="carreraautorizada_id"
                  item-text="nombre"
                  v-model="datos.carreraAutorizada_id"
                  label="Carrera"
                  @change="seleccionarCarrera"
                ></v-select>
              </v-col>
            </v-row>
          </div>
          <v-row>
            <v-col cols="12" sm="4">
              <v-text-field
                v-model="datos.denominacion"
                label="Denominación del Título Profesional"
              ></v-text-field>
            </v-col>
            <v-col cols="12" sm="4">
              <v-text-field
                v-model="datos.mencion"
                label="Mension"
              ></v-text-field>
            </v-col>
            <v-col cols="12" sm="4">
              <v-select
                :items="niveles"
                item-value="id"
                item-text="nivel"
                v-model="datos.nivel_tipo_id"
                label="Grado Académico"
              ></v-select>
            </v-col>
            <v-col cols="12" sm="4">
              <v-text-field
                v-model="datos.resolucion_administrativa"
                label="Resolución Administrativa"
              ></v-text-field>
            </v-col>
            <v-col cols="12" sm="4">
              <v-text-field
                v-model="datos.tiempo_estudio"
                label="Tiempo de estudio"
              ></v-text-field>
            </v-col>
            <v-col cols="12" sm="4">
              <v-select
                :items="regimenes"
                item-value="id"
                item-text="regimen_estudio"
                v-model="datos.ttec_regimen_estudio_tipo_id"
                label="Régimen de estudio"
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
                  ></v-select>
                </td>
                <td>
                  <v-text-field
                    v-model="datos.materias[i].materia"
                    label="Materia"
                  ></v-text-field>
                </td>
                <td>
                  <v-text-field
                    v-model="datos.materias[i].codigo"
                    label="Código"
                  ></v-text-field>
                </td>
                <td>
                  <v-tooltip top>
                    <template v-slot:activator="{ on, attrs }">
                      <v-btn color="secondary" x-small v-bind="attrs" v-on="on"> <v-icon x-small @click="eliminarMateria(i)">mdi-delete-outline</v-icon> </v-btn>
                    </template>
                    <span>Eliminar</span>
                  </v-tooltip>
                </td>
              </tr>
            </tbody>
          </v-simple-table>
          <v-btn color="success" @click="agregarMateria" x-small> <v-icon x-small>mdi-plus</v-icon> Agregar materia</v-btn>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <!-- <v-btn color="primary" @click="enviarSolicitud">Enviar solicitud</v-btn> -->
          <v-btn color="primary" @click="enviarTramiteUniversidad()">Enviar trámite</v-btn>
        </v-card-actions>
      </v-form>
    </v-card>
    <v-card v-if="usuarioLogueado && usuarioLogueado.roles[0].rol_tipo_id == 48">
      <v-form>
        <v-card-text>
          <v-form>
            Procede
            <v-radio-group
              v-model="procede"
              row
            >
              <v-radio
                label="Si"
                value="SI"
              ></v-radio>
              <v-radio
                label="No"
                value="NO"
              ></v-radio>
            </v-radio-group>

            <div v-if="procede == 'NO'">
              <v-row>
                <v-col cols="12" sm="12">
                  ¿Que desea hacer con el trámite?
                  <v-radio-group
                    v-model="finaliza"
                    row
                  >
                    <v-radio
                      label="Finalizar el Trámite"
                      value="SI"
                    ></v-radio>
                    <v-radio
                      label="Devolver a la Universidad"
                      value="NO"
                    ></v-radio>
                  </v-radio-group>
                </v-col>
                <v-col cols="12" sm="12" v-show="finaliza == 'NO'">
                    <v-textarea
                    outlined
                      label="Registre una observacion"
                      v-model="observacion"
                    ></v-textarea>
                </v-col>
              </v-row>
            </div>
            
            
            <v-btn color="primary" @click="enviarTramiteTecnico()">{{textBotonEnviar}}</v-btn>

          </v-form>
        </v-card-text>
      </v-form>
    </v-card>
  </div>
</template>

<script>
import Service from '@/services/general'
import UniversidadesService from '@/services/universidadesService'
import { mapMutations } from 'vuex'
export default {
  name: 'tramite-form-editar-carrera-denominacion',
  props: ['tramite','datos'],
  data: () => ({
    idTramiteTipo: 56,
    idUniversidad: '',
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
    carreras: [],
    niveles: [],
    regimenes: [],
    periodosMateria: [],
    usuarioLogueado: '',
    procede: 'SI',
    observacion: '',
    finaliza: 'SI',
    datosJson: ''
  }),
  mounted() {
    // this.datos.carrera_id = '';
    // this.datos.universidad_id = this.idUniversidad;
    // this.getCarreras();
    this.idUniversidad = this.tramite.tramite.institucioneducativa_id
    this.idTramiteTipo = this.tramite.tramiteTipo.id
    this.getNiveles();
    this.getRegimenes();
    this.getPeriodosMateria();
    this.obtenerDatosJson();
    this.usuarioLogueado = Service.getUser();
  },
  computed: {
    textBotonEnviar() {
      if (this.procede == 'SI') {
        return 'Aprobar y finalizar'
      }else{
        if (this.finaliza == 'SI') {
          return 'Finalizar'
        }else{
          return 'Devolver a Universidad'
        }
      }
      // return 'Enviar'
    }
  },
  methods: {
    ...mapMutations(['uniAlert']),
    async obtenerDatosJson() {
      try {
        let response = await UniversidadesService.getDatosJson(this.idUniversidad)
        let data = await response.data.data
        this.datosJson = JSON.parse(data.datos);
      } catch (error) {
        console.log(error)
      }
    },
    async getCarreras() {
      try {
        let response = await UniversidadesService.getCarrerasUniversidad(this.idUniversidad)
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
    // METODO PARA INICIALIZAR EL TRAMITE
    async enviarSolicitud() {
      try {
        let datos = {
          tipotramite_id: '',
          universidad_id: '',
          tramite_id: this.tramite.tramite_id,
          valor_evaluacion: '',
          observacion: '',
          datos: this.datos
        }
        let response = await UniversidadesService.enviarTramite(datos)
        let data = await response.data
        if (data.status == 'success') {
          this.uniAlert({color: 'success', text: 'Solicitud enviada correctamente'})
        }
      } catch (error) {
        console.log(error)
        this.uniAlert({color: 'error', text: 'Ocurrio un error al enviar la solicitud'})
      }
    },
    // METODO PARA ENVIAR EL TRAMITE MODIFICADO
    async enviarTramiteUniversidad() {
      try {
        let datos = {
          tipotramite_id: '',
          universidad_id: '',
          tramite_id: this.tramite.tramite_id,
          valor_evaluacion: '',
          observacion: '',
          datos: this.datos
        }
        console.log(datos);
        let response = await UniversidadesService.enviarTramite(datos)
        let data = await response.data
        if (data.status == 'success') {
          this.uniAlert({color: 'success', text: 'Solicitud enviada correctamente'})
        }
      } catch (error) {
        console.log(error)
        this.uniAlert({color: 'error', text: 'Ocurrio un error al enviar la solicitud'})
      }
    },
    // METODO PARA DEVLVER
    async enviarTramiteTecnico() {
      try {
        // ENVIAMOS EL TRAMITE A LA SIGUIENTE TAREA
        let datos = {
          tipotramite_id: '',
          universidad_id: '',
          tramite_id: this.tramite.tramite_id,
          valor_evaluacion: this.procede,
          observacion: '',
          datos: ''
        }
        let response = await UniversidadesService.enviarTramite(datos)
        let data = await response.data
        if (data.status == 'success') {
          // RECEPCIONAMOS EN LA SIGUIENTE TAREA
          let datos1 = {
            tipotramite_id: '',
            universidad_id: '',
            tramite_id: this.tramite.tramite_id,
            valor_evaluacion: '',
            observacion: '',
            datos: ''
          }
          let response1 = await UniversidadesService.enviarTramite(datos1)
          let data1 = await response1.data
          if (data1.status == 'success') {
            // SI PROCEDE ES SI ENTONCES REGISTRAMOS EL JSON
            if (this.procede == 'SI') {
              let tipo = this.idTramiteTipo;
              // corergit
              if (tipo == 56) {
                let response2 = await UniversidadesService.createNuevaCarrera(this.datosJson)
                let data2 = await response2.data
                console.log('response data registrar carrera', data2)
              }
              if (tipo == 57) {
                let response3 = await UniversidadesService.createNuevaDenominacion(this.datosJson)
                let data3 = await response3.data
                console.log('response data registrar carrera', data3)
              }
              if (tipo == 58) {
                let response4 = await UniversidadesService.createNuevaCarrera(this.datosJson)
                let data4 = await response4.data
                console.log('response data registrar carrera', data4)
              }
              // switch (tipo) {
              //   case 56: // REGISTRO DE CARRERA
              //     let response2 = await UniversidadesService.createNuevaCarrera(this.datosJson)
              //     let data2 = await response2.data
              //     console.log('response data registrar carrera', data2)
              //     break;
              //   case 57: // REGISTRO DE DENOMINACION
              //     let response3 = await UniversidadesService.createNuevaDenominacion(this.datosJson)
              //     let data3 = await response3.data
              //     console.log('response data registrar carrera', data3)
              //     break;
              //   case 58: // REGISTRO DE DENOMINACION
              //     let response4 = await UniversidadesService.createNuevaCarrera(this.datosJson)
              //     let data4 = await response4.data
              //     console.log('response data registrar carrera', data4)
              //     break;
              // }
              
              let datos2 = {
                tipotramite_id: '',
                universidad_id: '',
                tramite_id: this.tramite.tramite_id,
                valor_evaluacion: '',
                observacion: '',
                datos: ''
              }
              let response5 = await UniversidadesService.enviarTramite(datos2)
              let data5 = await response5.data
              if (data5.status == 'success') {
                let datos6 = {
                  tipotramite_id: '',
                  universidad_id: '',
                  tramite_id: this.tramite.tramite_id,
                  valor_evaluacion: '',
                  observacion: '',
                  datos: ''
                }
                let response6 = await UniversidadesService.enviarTramite(datos6)
                let data6 = await response6.data
                if (data6.status == 'success') {
                  this.uniAlert({color: 'success', text: 'Registro realizado correctamente'})
                }
              }

            }else{
              // SI EL TRÁMITE NO PROCEDE - ENVIAMOS EL TRAMITE A LA SIGUIENTE TAREA CON LA VARIABLE DE EVALUACION Y CON LA OBSERVACION
              let datos7 = {
                tipotramite_id: '',
                universidad_id: '',
                tramite_id: this.tramite.tramite_id,
                valor_evaluacion: this.finaliza,
                observacion: this.observacion,
                datos: ''
              }
              let response7 = await UniversidadesService.enviarTramite(datos7)
                let data7 = await response7.data
                if (data7.status == 'success') {
                  if (this.finaliza == 'SI') {
                    
                    let datos8 = {
                      tipotramite_id: '',
                      universidad_id: '',
                      tramite_id: this.tramite.tramite_id,
                      valor_evaluacion: this.finaliza,
                      observacion: this.observacion,
                      datos: ''
                    }
                    let response8 = await UniversidadesService.enviarTramite(datos8)
                    let data8 = await response8.data
                    if (data8.status == 'success') {
                      
                      this.uniAlert({color: 'success', text: 'Registro realizado correctamente'})
                    }
                  }else{
                     this.uniAlert({color: 'success', text: 'Registro realizado correctamente'})
                  }
              }
            }
          }
        }
      } catch (error) {
        console.log(error)
        this.uniAlert({color: 'error', text: 'Ocurrio un error al enviar la solicitud'})
      }
    }
  }
}
</script>

<style>
  .control-periodo-materia {
    max-width: 200px;
  }
</style>