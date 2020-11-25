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
    <br>
    <h4>Estadísticas</h4>
    <v-row>
      <v-col cols="12" lg="4" md="4" sm="4" xs="12">
        <Barra :datos="universidadesDepartamento.data" :options="universidadesDepartamento.options"/>
      </v-col>
      <v-col cols="12" lg="4" md="4" sm="4" xs="12">
        <Torta />
      </v-col>
    </v-row>
  </div>
</template>

<script>
import UniversidadesService from '@/services/universidadesService'
import Barra from '@/components/universidades/graficos/Barra'
import Torta from '@/components/universidades/graficos/Torta'
export default {
  name: 'dashboard',
  components: {
    Barra,
    Torta
  },
  data: () => ({
    tipos: [],
    chartdata: '',
    options: '',
    universidadesDepartamento: {
      data: '',
      options: ''
    }
  }),
  computed: {
    
  },
  mounted(){
    this.getTipos()
    this.getCantidadUniversidadesPorDepartamento()
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
      } catch (error) {
        console.log(error)
      }
    },
    async getCantidadUniversidadesPorDepartamento(){
      try {
        
        let response = await UniversidadesService.getCantidadUniversidadesDepartamentoTipo();  
        let data = response.data;
        let datos = data.data;
        console.log('depa', datos)

        let labels = []
        let datasets = []
        datos.forEach(item => {
          if (item.universidades.length == 0) {
            item.universidades = [
              {id: 7, dependencia: "Regimen Especial", total: 2},
              {id: 3, dependencia: "Privada", total: 9},
              {id: 6, dependencia: "Indigena", total: 8}
            ]
          }
          
          labels.push(item.departamento)
          item.universidades.forEach(universidadTipo => {
            let index = datasets.findIndex(elemento => elemento.label == universidadTipo.dependencia)
            if (index < 0) {
              datasets.push({
                label: universidadTipo.dependencia,
                backgroundColor: ['#3e95cd'],
                data: [universidadTipo.total]
              })
            }else{
              datasets[index].backgroundColor.push('#3e95cd')
              datasets[index].data.push(universidadTipo.total)
            }
          })
        })

        console.log('labels', labels)
        console.log('datasets', datasets)

        this.universidadesDepartamento.data = {
          labels: labels,
          datasets: datasets
        }

        this.universidadesDepartamento.options = {
          legend: { display: false },
          title: {
            display: true,
            text: 'Cantidad de universidades por departamento'
          }
        }
        console.log('chartdata', this.chartdata)
      } catch (error) {
        console.log(error)
      }
    },
    getColorBarra(tipo){
      let color = '#3e95cd'
      switch (tipo) {
        case 'Público':
            color = '#3e95cd'
            break;
        case 'Regimen especial':
            color = '#c45850'
            break;
        case 'Indígena':
            color = '#e8c3b9'
            break;
      }
      return color
    }
  }
}
</script>

<style>
  .prueba {
    color: #d4b609;
  }
  .small {
    max-width: 500px;
    /* max-height: 200px;
    margin:  150px auto; */
  }
</style>