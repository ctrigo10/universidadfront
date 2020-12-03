<template>
  <div>
    <Breadcrumbs :items="breadItems"/>

    <v-tabs
      v-model="tab"
      background-color="secondary"
      dark
      next-icon="mdi-arrow-right-bold-box-outline"
      prev-icon="mdi-arrow-left-bold-box-outline"
    >
      <!-- <v-tabs-slider color="lime accent-1"></v-tabs-slider> -->
      <v-tab v-if="usuario.roles[0].rol_tipo_id == 51" @click="seleccionarNuevo()">
        Nuevo
      </v-tab>
      <v-tab @click="seleccionarLista('RECIBIDOS')">
        Recibidos
      </v-tab>
      <v-tab @click="seleccionarLista('ENVIADOS')">
        Enviados
      </v-tab>
      <v-tab @click="seleccionarLista('PENDIENTES')">
        Pendientes
      </v-tab>
      <v-tab @click="seleccionarLista('CONCLUIDOS')">
        Concluidos
      </v-tab>
      <!-- <v-tab @click="seleccionarSeguimiento()">
        Seguimiento
      </v-tab> -->
    </v-tabs>

    <Nuevo v-if="componente == 'Nuevo' && usuario.roles[0].rol_tipo_id == 51" @solicitud_enviada="solicitud_enviada"/>

    <ListaTramites v-if="componente == 'Lista'" :tipoLista="tipoLista" @recargarLista="seleccionarLista"/>

    <Seguimiento  v-if="componente == 'Seguimiento'" />

  </div>
</template>

<script>
import Service from '@/services/general'
import UniversidadesService from '@/services/universidadesService'
import Breadcrumbs from '@/components/universidades/utils/Breadcrumbs'
import Nuevo from '@/components/universidades/tramites/Nuevo'
import ListaTramites from '@/components/universidades/tramites/ListaTramites'
import Seguimiento from '@/components/universidades/tramites/Seguimiento'
export default {
  name: 'tramite',
  components: {
    Breadcrumbs,
    Nuevo,
    ListaTramites,
    Seguimiento
  },
  data: () => ({
    breadItems: [
      { text: 'Trámites', disabled: true }
    ],
    toggle_exclusive: 0,
    componente: '',
    tipoLista: '',
    usuario: Service.getUser(),
    tab: 0
  }),
  mounted() {
    if (this.usuario.roles[0].rol_tipo_id == 48) {
      this.componente = 'Lista'
      this.tipoLista = 'RECIBIDOS'
    }else{
      this.componente = 'Nuevo'
    }
  },
  methods: {
    verificarPermiso(rol) {
      return UniversidadesService.verificarPermisoRol(rol)
    },
    seleccionarNuevo() {
      this.componente = 'Nuevo'
      this.tipoLista = ''
      this.tab = 1
    },
    seleccionarLista(tipoLista) {
      this.componente = 'Lista'
      this.tipoLista = tipoLista
      switch (this.tipoLista) {
        case 'RECIBIDOS': this.tab = this.verificarPermiso('tecnico') == true ? 0: 1; break;
        case 'ENVIADOS': this.tab = this.verificarPermiso('tecnico') == true ? 1: 2; break;
        case 'PENDIENTES': this.tab = this.verificarPermiso('tecnico') == true ? 2: 3; break;
        case 'CONCLUIDOS': this.tab = this.verificarPermiso('tecnico') == true ? 3: 4; break;
      }
    },
    seleccionarSeguimiento() {
      this.componente = 'Seguimiento'
      this.tipoLista = ''
    },
    solicitud_enviada() {
      this.seleccionarLista('ENVIADOS');
      this.tab = this.verificarPermiso('tecnico') == true ? 1: 2
    }
  }
}
</script>

<style>
  .menu-header {
    margin-bottom: 20px;
    /* color: rgb(111, 23, 122); */
  }
</style>