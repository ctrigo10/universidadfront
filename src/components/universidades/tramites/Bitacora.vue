<template>
  <div class="bitacora">
    <v-card>
      <v-card-text>
         <v-simple-table class="tabla-procesar">
          <tr><th>Universidad:</th><td> {{tramite.institucioneducativa ? tramite.institucioneducativa.institucioneducativa : ''}}</td></tr>
          <tr><th>Sede / Subsede:</th><td> {{tramite.institucioneducativa ? tramite.institucioneducativa.rue_ue.nombre_sede_subsede : ''}}</td></tr>
          <tr><th>Fecha de solicitud:</th><td> {{tramite.fecha_tramite}}</td></tr>
        </v-simple-table>

        <v-progress-circular
          indeterminate
          color="info"
          v-if="cargando"
        ></v-progress-circular>

        <template v-if="!cargando">
          <v-timeline
            align-top
            :reverse="true"
            :dense="$vuetify.breakpoint.smAndDown"
          >
            <v-timeline-item
              v-for="(item, i) in bitacora"
              :key="i"
              :icon="i % 2 == 0 ? 'mdi-file-edit-outline': 'mdi-check'"
              full-dot
            >
              <v-card
                class="card-animated"
              >
                <v-card-title class="title title-card-popup">
                  <!-- {{ item.tramite_estado }} -->
                  {{ item.flujo_proceso }}
                  <v-spacer></v-spacer>
                </v-card-title>
                <v-card-text class="white text--primary">
                  <v-chip
                    class="ma-0 mb-2"
                    color="secondary"
                    dark
                  >
                    {{ item.fecha_registro | fecha }}
                  </v-chip>
                  <div v-if="item.tramite_estado_id == 15">
                    <!-- remitente -->
                    <div class="list-item">
                      <div class="list-item-label">Usuario</div>
                      <div class="list-item-text">{{item.usuario_remitente.persona.nombre}}</div>
                    </div>
                    <div class="list-item">
                      <div class="list-item-label">Rol</div>
                      <!-- <div class="list-item-text">{{item.usuario_remitente_rol}}</div> -->
                      <div class="list-item-text">{{item.usuario_remitente_rol_id == 51 ? 'Responsable Universidad': 'Técnico Nacional'}}</div>
                    </div>
                  </div>
                  <!-- destinatario -->
                  <div v-if="item.tramite_estado_id == 3">
                    <div class="list-item">
                      <div class="list-item-label">Usuario</div>
                      <div class="list-item-text">{{item.usuario_destinatario ? item.usuario_destinatario.persona.nombre : ''}}</div>
                    </div>
                    <div class="list-item">
                      <div class="list-item-label">Rol</div>
                      <!-- <div class="list-item-text"> {{item.usuario_destinatario_rol ? item.usuario_destinatario_rol : ''}}</div> -->
                      <div class="list-item-text">{{item.usuario_destinatario_rol_id == 51 ? 'Responsable Universidad': 'Técnico Nacional'}}</div>
                    </div>
                  </div>
                  
                  <div class="list-items" v-if="item.obs != ''">
                    <div class="list-item-label">Observación</div>
                    <div class="list-item-text"> {{item.obs}}</div>
                  </div>
                  <!-- <p>Flujo proceso: {{ item.flujo_proceso }}</p>
                  
                  <p>Fecha registro: {{ item.fecha_registro | fecha }}</p>
                  <p>Fecha envio: {{item.fecha_envio | fecha }}</p>
                  <p>Fecha recepcion: {{item.fecha_recepcion | fecha }}</p> -->

                </v-card-text>
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-menu
                    v-if="item.datos != '' && item.flujo_proceso_id == 157"
                    :v-model="menu[i]"
                    :close-on-content-click="false"
                    :nudge-width="200"
                    offset-x
                  >
                    <template v-slot:activator="{ on, attrs }">
                      <v-btn
                        color="primary"
                        v-bind="attrs"
                        v-on="on"
                      >
                        Ver Datos
                      </v-btn>
                    </template>
                    <v-card>
                      <v-card-text>
                        <v-card class="tramite-detalle-pophover" elevation="0">
                          <v-card-title primary-title>
                            <h5>Datos de la solicitud</h5>
                          </v-card-title>

                          <!-- DETALLE DE NUEVA CARRERA Y NUEVA DENOMINACION -->
                          <v-card-text v-if="item.tramite_tipo != 'Solicitud de actualizacón de token'">
                            <v-row v-if="item.tramite_tipo == 'Solicitud de nueva carrera'">
                              <v-col cols="12" lg="5">
                                <Dato label="Carrera" :value="item.datos.nombre" />
                              </v-col>
                              <v-col cols="12" lg="5">
                                <Dato label="Código" :value="item.datos.cod_carrera" />
                              </v-col>
                            </v-row>
                            <v-row>
                              <v-col cols="12" lg="4">
                                <Dato label="Denominación del título profesional" :value="item.datos.denominacion" />
                              </v-col>
                              <v-col cols="12" lg="4">
                                <Dato label="Mensión" :value="item.datos.mencion" />
                              </v-col>
                              <v-col cols="12" lg="4">
                                <Dato label="Grado académico" :value="item.datos.denominacion" />
                              </v-col>
                            </v-row>
                            <v-row>
                              <v-col cols="12" lg="4">
                                <Dato label="Resolución administrativa" :value="item.datos.resolucion_administrativa" />
                              </v-col>
                              <v-col cols="12" lg="4">
                                <Dato label="Tiempo de estudio" :value="item.datos.tiempo_estudio" />
                              </v-col>
                            </v-row>

                            <br>
                            <Dato label="Materias" value=""/>

                            <v-data-table
                              :headers="headers"
                              :items="item.datos.materias"
                              class="elevation-0"
                              dense
                              hide-default-footer
                            >
                              
                            </v-data-table>

                          </v-card-text>

                          <!-- DETALLE DE TOKEN -->
                          <v-card-text v-if="item.tramite_tipo == 'Solicitud de actualizacón de token'">
                            <v-row>
                              <v-col cols="12" lg="12">
                                <Dato label="Justificación" :value="item.datos.observacion" />
                              </v-col>
                            </v-row>
                          </v-card-text>
                        </v-card>
                      </v-card-text>
                    </v-card>
                  </v-menu>
                </v-card-actions>
              </v-card>
            </v-timeline-item>
          </v-timeline>
        </template>
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
import UniversidadesService from '@/services/universidadesService'
// import DetalleTramite from '@/components/universidades/tramites/DetalleTramite'
import Dato from '@/components/universidades/universidad/Dato'
export default {
  props: ['idTramite'],
  components: {
    // DetalleTramite,
    Dato
  },
  data: () => ({
    menu: [],
    tramite: '',
    items: [
        {
          color: 'red lighten-2',
          icon: 'mdi-star',
        },
        {
          color: 'purple darken-1',
          icon: 'mdi-book-variant',
        },
        {
          color: 'green lighten-1',
          icon: 'mdi-airballoon',
        },
        {
          color: 'indigo',
          icon: 'mdi-buffer',
        },
    ],
    bitacora: '',
    cargando: false,
    headers: [
      { text: 'Periodo', value: 'ttec_periodo_tipo_id', sortable: false, },
      { text: 'Materia', value: 'materia', sortable: false, },
      { text: 'Código', value: 'codigo', sortable: false, },
    ]
  }),
  filters: {
    fecha(fecha) {
      if (fecha !== null) {
        let datos = fecha.split('-')
        if (datos.length == 3) {
          let nuevaFecha = `${datos[2]}-${datos[1]}-${datos[0]}`
          return nuevaFecha
        }
      }
      return fecha
    }
  },
  mounted(){
    this.getTramite()
    this.obtenerBitacora()
  },
  watch: {
    idTramite: function() {
      console.log(this.idTramite)
      this.getTramite()
      this.obtenerBitacora()
    }
  },
  methods: {
    async getTramite() {
      try {
        this.tramite = ''
        let response = await UniversidadesService.getTramite(this.idTramite)
        let data = await response.data
        if (data.status == 'success') {
          this.tramite = data.data
        }
      } catch (error) {
        console.log(error)
      }
    },
    async obtenerBitacora() {
      try {
        this.bitacora = ''
        this.cargando = true
        let response = await UniversidadesService.getBitacoraTramite(this.idTramite)
        let data = await response.data
        if (data.status == 'success') {

          let filtrado = data.data.filter(item => {
            return (item.flujo_proceso_id != 159)
          })

          console.log('filtrado', filtrado)

          this.bitacora = filtrado.sort((a,b) =>  a.id-b.id );

          this.bitacora.map((item, index) => {
            this.menu.push(index)
          })
        }
        this.cargando = false
      } catch (error) {
        console.log(error)
      }
    },
    cerrar() {
      this.$emit('cerrarDialog');
    }
  }
}
</script>

<style>
  .bitacora {
    margin-top: 20px;
  }
  .list-item { 
    display: flex;
    justify-content: space-between;
    padding: 5px 0;
  }
  .list-item-label {
    font-weight: 500;
    color: rgb(46, 116, 173);
    /* min-width: 100px; */
  }
  .list-item-text {

  }
  .tramite-detalle-pophover {
    background-color: #eef8fd !important;
  }

  .card-animated {
    box-shadow: 0 4px 8px 0 rgba(0,0,0,0.2) !important;
    transition: 0.3s;
    width: 100%;
  }

  .card-animated:hover {
      box-shadow: 0 10px 20px 0 rgba(0,0,0,0.2) !important;
  }

  .title-card-popup {
    /* color: #1a578d; */
    color: #019cde;
  }
</style>