<template>
  <div>
    <v-card elevation="0">
      <v-toolbar
        dark
        color="secondary"
      >
        <v-toolbar-title>Procesar Trámite</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-toolbar-items>
          <!-- <v-btn
            dark
            text
            @click="dialog = false"
          >
            Save
          </v-btn> -->
        </v-toolbar-items>
      </v-toolbar>
      <v-card-title primary-title class="titulo-procesar">
        <h4>Trámite Nro: {{tramite.tramite_id}} <br> <small>{{tramite.tramite.tramiteTipo.tramite_tipo}} </small> </h4>
      </v-card-title>
      <v-card-text>
        <v-simple-table class="tabla-procesar">
          <tr><th>Universidad:</th><td> {{universidad.institucioneducativa}}</td></tr>
          <tr><th>Sede / Subsede:</th><td> {{universidad.nombre_sede_subsede}}</td></tr>
          <tr><th>Fecha de solicitud:</th><td> {{tramite.tramite.fecha_tramite}}</td></tr>
        </v-simple-table>
        


        <DetalleTramite :tramite="tramite" :datos="datos"/>
        
        <FormProcesarTecnico v-if="verificarPermiso('tecnico')" :tramite="tramite" :datos="datos" @recargarLista="recargarLista"/>

        <v-card v-if="verificarPermiso('universidad')">
          <v-card-title primary-title>
            <h5>Observación del Técnico</h5>
          </v-card-title>
          <v-card-text>
            Observación
            <v-btn color="success">Corregir</v-btn>
          </v-card-text>
        </v-card>
        <!-- <FormEditarCarreraDenominacion :tramite="tramite" :datos="datos"/> -->
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
import ServicioUniversidades from '@/services/universidadesService'
import DetalleTramite from '@/components/universidades/tramites/DetalleTramite'
import FormProcesarTecnico from '@/components/universidades/tramites/FormProcesarTecnico'
// import FormEditarCarreraDenominacion from '@/components/universidades/tramites/FormEditarCarreraDenominacion'
export default {
  name: 'tramite-procesar',
  components: {
    // FormEditarCarreraDenominacion,
    DetalleTramite,
    FormProcesarTecnico
  },
  props: ['tramite'],
  data: () => ({
    bitacora: '',
    datos: '',
    universidad: ''
  }),
  mounted() {
    this.getBitacora()
    this.getDatosUniversidad()
  },
  methods: {
    verificarPermiso(rol) {
      return ServicioUniversidades.verificarPermisoRol(rol)
    },
    async getBitacora() {
      try {
        let response = await ServicioUniversidades.getBitacoraTramite(this.tramite.tramite.id)
        let data = response.data
        if (data.status == 'success') {
          this.bitacora = data.data
          this.bitacora.map(item => {
            if (item.datos != '') {
              this.datos = item.datos
            }
          })
        }
      } catch (error) {
        console.log(error)
      }
    },
    async getDatosUniversidad() {
      try {
        let response = await ServicioUniversidades.getDatosUniversidad(this.tramite.tramite.institucioneducativa_id)
        let data = response.data
        if (data.status == 'success') {
          this.universidad = data.data
        }
      } catch (error) {
        console.log(error)
      }
    },
    // FUNCION PARA RECARGAR LA SIGUIENTE LISTA
    recargarLista(tipoLista) {
      this.$emit('seleccionar', tipoLista)
    }
  }
}
</script>

<style>
  .titulo-procesar {
    color: #03558b;
    justify-content: center;
  }
  .titulo-procesar h4{
    margin: 0 !important;
    padding: 0 !important;
  }
  .tabla-procesar th {
    width: 200px;
    border-right: none !important;
  }
  .tabla-procesar th, .tabla-procesar td {
    text-align: left;
    border: 1px solid #e6e6e6;
    padding: 4px 7px;
  }

  @media only screen and (max-width: 600px) {
    .tabla-procesar th {
      width: 100px;
    }
  }
</style>