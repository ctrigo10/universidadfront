<template>
  <div>
    <v-card>
      <v-card-title primary-title>
        Administración
        <v-spacer></v-spacer>
      </v-card-title>
      <v-card-text>
        <v-text-field
          v-model="search"
          label="Buscar universidad"
          append-icon="mdi-magnify"
          @keyup="searchUniversity"
        ></v-text-field>
        <UniversidadCardList :universidades="universidades" @seleccionar="seleccionar"/>
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
import Service from '@/services/general'
import UniversidadesService from '@/services/universidadesService'
import UniversidadCardList from '@/components/universidades/universidad/UniversidadCardList'
import { mapMutations } from 'vuex';
export default {
  name: 'admin-home',
  components: {
    UniversidadCardList
  },
  data: () => ({
    usuario: '',
    universidades: [],
    universidadId: '',
    dialogUniversidad: false,
    search: ''
  }),
  mounted(){
    this.usuario = Service.getUser();
    this.obtenerUniversidades();
  },
  methods: {
    ...mapMutations(['uniAlert']),
    async obtenerUniversidades(){
      try {
        let response = await UniversidadesService.getUniversidades();
        let data = await response.data;
        this.universidades = data.data;
        // console.log('us usuario', this.universidades)
      } catch (error) {
        console.log(error);
      }
    },
    seleccionar(universidadId){
      this.universidadId = universidadId;
      this.$router.push({name: 'universidades-admin-information', params: { sie: universidadId }})
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