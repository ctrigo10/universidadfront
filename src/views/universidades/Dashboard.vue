<template>
  <div>
    <v-row>
      <v-col
        cols="12"
        lg="4"
        md="4"
        sm="6"
        xs="6"
        v-for="(item, index) in tipos" :key="index"
      >
        <v-card
          :color="getColor(item)"
          dark
        >
          <v-card-title class="headline">{{item.count}}</v-card-title>

          <v-card-subtitle>{{item.dependencia}}</v-card-subtitle>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import UniversidadesService from '@/services/universidadesService'
export default {
  name: 'dashboard',
  data: () => ({
    // tipos: [
    //   {
    //     tipo: 'Privada',
    //     cantidad: 12
    //   },{
    //     tipo: 'Indigena',
    //     cantidad: 4
    //   },{
    //     tipo: 'Regimen Especial',
    //     cantidad: 2
    //   },
    // ]
    tipos: []
  }),
  computed: {
    
  },
  mounted(){
    this.getTipos();
  },
  methods: {
    getColor(item){
      let color = '#red';
      if (item.dependencia == 'Privada') {
        color = "#9d14af";
      }else{
        if (item.dependencia == 'Indigena') {
          color = "#d4b609";
        }else{
          color = "#1a65ac";
        }
      }
      return color;
    },
    async getTipos(){
      try {
        let response = await UniversidadesService.getTotalesTiposUniversidades();  
        let data = await response.data;
        this.tipos = data.data;
        console.log('data', data)
      } catch (error) {
        console.log(error)
      }
    }
  }
}
</script>

<style>
  .prueba {
    color: #d4b609;
  }
</style>