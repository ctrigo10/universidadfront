<template>
  <div>
    <v-card class="tarjeta">
      <v-card-title>
        Universidades
      </v-card-title>
      <v-card-text>
        
        <v-row>
          <v-col
            cols="12"
            sm="6"
          >
            <v-text-field
              name="buscar"
              label="Buscar universidad"
              id="id"
              v-model="buscar"
              @keyup="buscarUniversidad"
              append-icon="mdi-magnify"
            ></v-text-field>
          </v-col>
          <v-col>
            <!-- <v-btn color="primary" @click="buscarUniversidad"> <v-icon>mdi-magnify</v-icon> Buscar</v-btn> -->
          </v-col>
        </v-row>

        <v-row>
          <v-col
            v-for="(universidad, key) in universidades"
            :key="key"
            cols="12"
            lg="3"
            md="4"
            sm="6"
            xs="6"
          >
            <v-card class="card-universidad" @click="seleccionar(universidad.id)" elevation="10">
              <v-card-text>  
                <v-img
                  class="imagen-universidad"
                  height="110px"
                  :src=" universidad.imagen !== 'universidades/imagen/null' ? 'http://localhost:3000/' + universidad.imagen : '../../assets/not-image.jpg'"
                  aspect-ratio="1"
                  contain
                ></v-img>
              </v-card-text>
              <v-card-title class="pb-3 nombre-universidad">{{ formatearNombre(universidad.institucioneducativa) }}</v-card-title>
            </v-card>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
  </div>
</template>
<script>
import UniversidadesService from '@/services/universidadesService'
export default {
  name: 'publico',
  data: () => ({
    buscar: '',
    universidades: [],
  }),
  mounted(){
    this.getUniversidades();
  },
  methods: {
    formatearNombre(nombre){
      // if (nombre.length > 30) {
      //   return nombre.substr(0, 30) + '...';
      // }
      return nombre;
    },
    async getUniversidades(){
      try {
        let response = await UniversidadesService.getUniversidadesActivas();
        let data = await response.data;
        this.universidades = data.data;
      } catch (error) {
        console.log(error);
      }
    },
    async buscarUniversidad(){
      try {
        if (this.buscar.length == 0) {
          this.getUniversidades();
        }else{
          let response = await UniversidadesService.buscarUniversidadNombre(this.buscar);
          let data = await response.data;
          this.universidades = data.data;
        }
      } catch (error) {
        console.log(error);
      }
    },
    seleccionar(id){
      // this.$router.push({ name: 'universidades-publico-datos', query: { sie: id } });
      // this.$router.push({ name: 'universidades-publico-informacion', query: {sie: id} })
      this.$router.push({ name: 'universidades-publico-informacion', params: { sie: id } })
      // this.$router.push(`informacion/${id}`);
    },
  }
}
</script>
<style scope>
  .imagen-universidad {
    /* background-color: rgb(128, 0, 128, 0.05); */
    width: auto !important;
    padding: 10px;
  }
  .card-universidad > .v-card__title{
    color: purple;
    font-size: 1em;
  }
  .nombre-universidad {
    justify-content: center;
  }
</style>