<template>
  <div>
    <Breadcrumbs :items="breadItems"/>
    <v-card>
      <v-card-title primary-title>
        Administración de Universidades
        <v-spacer></v-spacer>
      </v-card-title>
      <v-card-text>
        <div class="text-right">
          <CreateForm v-if="verificarPermiso('tecnico')">
            Crear Sede
          </CreateForm>
        </div>
        <v-text-field
          v-model="search"
          label="Buscar universidad por nombre"
          append-icon="mdi-magnify"
          @keyup="searchUniversity"
        ></v-text-field>
        <v-progress-circular
          indeterminate
          color="primary"
          v-if="cargando"
        ></v-progress-circular>
        <UniversidadCardList v-if="!cargando" :universidades="universidades" @seleccionar="seleccionar"/>
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
import Service from '@/services/general'
import UniversidadesService from '@/services/universidadesService'
import Breadcrumbs from '@/components/universidades/utils/Breadcrumbs'
import UniversidadCardList from '@/components/universidades/universidad/UniversidadCardList'
import CreateForm from '@/components/universidades/universidad/CreateForm'
import { mapMutations } from 'vuex';
export default {
  name: 'admin-home',
  components: {
    Breadcrumbs,
    UniversidadCardList,
    CreateForm
  },
  data: () => ({
    breadItems: [
      { text: 'Universidades', disabled: true }
    ],
    usuario: '',
    universidades: [],
    universidadId: '',
    dialogUniversidad: false,
    search: '',
    cargando: false
  }),
  mounted(){
    this.usuario = Service.getUser();
    this.obtenerUniversidades();
  },
  methods: {
    ...mapMutations(['uniAlert']),
    verificarPermiso(rol) {
      return UniversidadesService.verificarPermisoRol(rol)
    },
    async obtenerUniversidades(){
      try {
        this.cargando = true
        let response = await UniversidadesService.getUniversidades();
        let data = await response.data;
        this.universidades = data.data;
        this.cargando = false
      } catch (error) {
        console.log(error);
      }
    },
    seleccionar(universidadId){
      this.universidadId = universidadId;
      sessionStorage.setItem('ids', this.universidadId)
      this.$router.push({name: 'universidades-admin-sedes-subsedes'})
    },
    async searchUniversity(){
      try {
        if (this.search == '' || this.search.length == 0) {
          this.obtenerUniversidades();
        }
        let response = await UniversidadesService.buscarUniversidadNombre(this.search);
        let data = await response.data;
        this.universidades = data.data;
      } catch (error) {
        console.log(error);
      }
    }
  }
}
</script>

<style>
  

</style>