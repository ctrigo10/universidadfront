<template>
  <div>
    <h3>Trámites</h3>
    <v-btn-toggle
      v-model="toggle_exclusive"
      rounded
      color="purple"
      class="menu-header"
    >
      <v-btn v-if="usuario.roles[0].rol_tipo_id == 51" @click="seleccionarNuevo()">Nuevo</v-btn>
      <v-btn @click="seleccionarLista('RECIBIDOS')">Recibidos</v-btn>
      <v-btn @click="seleccionarLista('ENVIADOS')">Enviados</v-btn>
      <v-btn @click="seleccionarLista('PENDIENTES')">Pendientes</v-btn>
      <v-btn @click="seleccionarLista('CONCLUIDOS')">Concluidos</v-btn>
      <v-btn @click="seleccionarSeguimiento()">Seguimiento</v-btn>
    </v-btn-toggle>

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
    usuario: Service.getUser()
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
  }
</style>