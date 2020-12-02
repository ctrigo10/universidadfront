<template>
  <div>
    <v-card>
      <v-card-title>
        <h4>{{ tipoLista }}</h4>
        <v-spacer></v-spacer>
        <v-text-field
          v-model="search"
          append-icon="mdi-magnify"
          label="Buscar"
          single-line
          hide-details
        ></v-text-field>
      </v-card-title>
      <v-card-text>
        <v-data-table
          item-key="name"
          class="elevation-1"
          loading
          loading-text="Cargando... Espere por favor"
          v-if="buscando"
        ></v-data-table>
        <v-data-table
          :headers="headers"
          :items="tramites"
          :search="search"
          v-if="!buscando"
        >
          <template v-slot:[`item.tramite.id`]="{ item }">
            <v-chip
              class="ma-0 pa-2 font-weight-bold"
              color="white"
              text-color="green"
            >
              {{item.tramite.id}}
            </v-chip>
          </template>
          <template v-slot:[`item.acciones`]="{ item }">
            <v-btn v-if="tipoLista == 'RECIBIDOS'" color="primary" x-small @click="recepcionarTramite(item.tramite_id)">Recepcionar</v-btn>
            <v-btn v-if="tipoLista == 'ENVIADOS' || tipoLista == 'CONCLUIDOS'" color="secondary" x-small @click="verTramite(item.tramite_id)">Ver</v-btn>
            <v-btn v-if="tipoLista == 'PENDIENTES'" color="secondary" x-small @click="procesarTramite(item)">Procesar</v-btn>
          </template>
        </v-data-table>
      </v-card-text>
    </v-card>

    <v-dialog
      v-model="dialogVer"
      scrollable 
      max-width="900px"
      transition="dialog-transition"
    >
      <v-card>
        <v-toolbar
        dark
        color="primary"
      >
        <v-toolbar-title>Datos del Trámite</v-toolbar-title>
          <v-spacer></v-spacer>
            <v-btn
            icon
            dark
            @click="cerrar()"
          >
            <v-icon>mdi-close</v-icon>
          </v-btn>
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
        <Bitacora v-if="dialogVer" :idTramite="idTramite" @cerrarDialog="cerrarDialogVer"/>
      </v-card>
    </v-dialog>
    
    <v-dialog
      v-model="dialogProcesar"
      scrollable
      max-width="800px"
      transition="dialog-transition"
    >
      <v-card>
        <Procesar v-if="dialogProcesar" :tramite="tramite"/>
      </v-card>
    </v-dialog>

  </div>
</template>

<script>
// import Service from '@/services/general'
import UniversidadesService from '@/services/universidadesService'
import Bitacora from '@/components/universidades/tramites/Bitacora'
import Procesar from '@/components/universidades/tramites/Procesar'
export default {
  props: ['tipoLista'],
  components: {
    Bitacora,
    Procesar
  },
  data: () => ({
    // headers: [
    //   { text: 'Nro. Trámite', value: 'tramite.id' },
    //   { text: 'Tipo', value: 'tramite.tramiteTipo.tramite_tipo' },
    //   { text: 'Universidad', value: 'tramite.institucioneducativa.institucioneducativa' },
    //   { text: 'Fecha de envio', value: 'fecha_envio' },
    //   { text: 'Acciones', value: 'acciones' },
    // ],
    headers: [
      { text: 'Nro. Trámite', value: 'tramite_id' },
      { text: 'Tipo', value: 'tramite.tramiteTipo.tramite_tipo' },
      { text: 'Universidad', value: 'tramite.institucioneducativa.institucioneducativa' },
      { text: 'Fecha de envio', value: 'fecha_envio' },
      { text: 'Acciones', value: 'acciones' },
    ],
    buscando: false,
    tramites:[],
    search: '',
    idTramite: '',
    tramite: '',
    dialogVer:false,
    dialogProcesar: false,
    procesarTramiteTipo: ''
  }),
  computed: {
    validarOpcion() {
      // let rol = Service.getUser() ? Service.getUser().roles[0].rol_tipo_id : null
      // console.log(roles)
      if (this.tipoLista == 'RECIBIDOS') {
        return true
      }
      return false
    }
  },
  mounted(){
    this.obtenerTramites()
  },
  watch: {
    tipoLista: function() {
      this.obtenerTramites()
    }
  },
  methods: {
    async obtenerTramites(){
      try {
        this.tramites = []
        this.buscando = true
        let response = await UniversidadesService.getListaTramites(this.tipoLista, this.idUniversidad)
        let data = response.data.data
        // if (this.tipoLista == 'CONCLUIDOS') {
        //   this.tramites = data[0];
        // }else{
          this.tramites = data;
          this.buscando = false
        // }
        console.log(data)
      } catch (error) {
        console.log(error)
      }
    },
    async recepcionarTramite(idTramite) {
      try {
        let datos = {
          tipotramite_id: '',
          universidad_id: this.idUniversidad,
          tramite_id: idTramite,
          valor_evaluacion: '',
          observacion: '',
          datos: ''
        }
        let response = await UniversidadesService.recepcionarTramite(datos)
        let data = response.data
        this.obtenerTramites()
        console.log(data)
      } catch (error) {
        console.log(error)
      }
    },
    verTramite(idTramite) {
      this.idTramite = idTramite
      this.dialogVer = true
    },
    procesarTramite(tramite) {
      this.tramite = tramite
      this.dialogProcesar = true
    },
    cerrarDialogVer() {
      this.dialogVer = false
    },
    cerrar() {
      this.dialogVer = false
    }
  }
}
</script>

<style>

</style>