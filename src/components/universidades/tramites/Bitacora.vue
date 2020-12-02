<template>
  <div class="bitacora">
    <v-card>
      <v-card-text>
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
                
              >
                <v-card-title class="title">
                  <!-- {{ item.tramite_estado }} -->
                  {{ item.flujo_proceso }}
                  <v-spacer></v-spacer>
                </v-card-title>
                <v-card-text class="white text--primary">
                  <v-chip
                    class="ma-0 mb-2"
                    color="primary"
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
                      <div class="list-item-text">{{item.usuario_remitente_rol}}</div>
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
                      <div class="list-item-text"> {{item.usuario_destinatario_rol ? item.usuario_destinatario_rol : ''}}</div>
                    </div>
                  </div>
                  
                  <!-- <p>Flujo proceso: {{ item.flujo_proceso }}</p>
                  
                  <p>Fecha registro: {{ item.fecha_registro | fecha }}</p>
                  <p>Fecha envio: {{item.fecha_envio | fecha }}</p>
                  <p>Fecha recepcion: {{item.fecha_recepcion | fecha }}</p> -->
                  <v-btn
                    color="secondary"
                    class="mx-0"
                    outlined
                  >
                    Ver detalle
                  </v-btn>
                </v-card-text>
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
export default {
  props: ['idTramite'],
  data: () => ({
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
    cargando: false
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
    this.obtenerBitacora()
  },
  watch: {
    idTramite: function() {
      console.log(this.idTramite)
      this.obtenerBitacora()
    }
  },
  methods: {
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
    color: grey;
    /* min-width: 100px; */
  }
  .list-item-text {

  }
</style>