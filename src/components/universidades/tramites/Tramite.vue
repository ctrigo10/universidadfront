<template>
  <div>
    <h3>Trámites</h3>

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
      <v-tab @click="seleccionarSeguimiento()">
        Seguimiento
      </v-tab>
    </v-tabs>

    <Nuevo v-if="componente == 'Nuevo' && usuario.roles[0].rol_tipo_id == 51" :idUniversidad="idUniversidad"/>

    <ListaTramites v-if="componente == 'Lista'" :tipoLista="tipoLista" :idUniversidad="idUniversidad"/>

    <Seguimiento  v-if="componente == 'Seguimiento'" />

  </div>
</template>

<script>
import Service from '@/services/general'
import Nuevo from '@/components/universidades/tramites/Nuevo'
import ListaTramites from '@/components/universidades/tramites/ListaTramites'
import Seguimiento from '@/components/universidades/tramites/Seguimiento'
export default {
  name: 'tramite',
  components: {
    Nuevo,
    ListaTramites,
    Seguimiento
  },
  props: ['idUniversidad'],
  data: () => ({
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
    seleccionarNuevo() {
      this.componente = 'Nuevo'
      this.tipoLista = ''
    },
    seleccionarLista(tipoLista) {
      this.componente = 'Lista'
      this.tipoLista = tipoLista
    },
    seleccionarSeguimiento() {
      this.componente = 'Seguimiento'
      this.tipoLista = ''
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