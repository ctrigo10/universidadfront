<script>
import { Bar } from 'vue-chartjs'

export default {
  extends: Bar,
  props: ['datos', 'options'],
  data: () => ({
    
  }),
  mounted () {
    this.getDatos() 
  },
  watch: {
    datos: function() {
      this.getDatos()
    }
  },
  methods: {
    getDatos(){
      //  let datos = [
      //         {
      //           departamento: 'La Paz',
      //           universidades: [
      //             {
      //               tipo: 'Público',
      //               cantidad: 2
      //             },
      //             {
      //               tipo: 'Regimen especial',
      //               cantidad: 4
      //             },
      //             {
      //               tipo: 'Indígena',
      //               cantidad: 1
      //             },
      //           ]
      //         },
      //         {
      //           departamento: 'Oruro',
      //           universidades: [
      //             {
      //               tipo: 'Público',
      //               cantidad: 1
      //             },
      //             {
      //               tipo: 'Regimen especial',
      //               cantidad: 0
      //             },
      //             {
      //               tipo: 'Indígena',
      //               cantidad: 2
      //             },
      //           ]
      //         },{
      //           departamento: 'cochabamba',
      //           universidades: [
      //             {
      //               tipo: 'Público',
      //               cantidad: 0
      //             },
      //             {
      //               tipo: 'Regimen especial',
      //               cantidad: 0
      //             },
      //             {
      //               tipo: 'Indígena',
      //               cantidad: 1
      //             },
      //           ]
      //         },
      //         {
      //           departamento: 'Sucre',
      //           universidades: [
      //             {
      //               tipo: 'Público',
      //               cantidad: 3
      //             },
      //             {
      //               tipo: 'Regimen especial',
      //               cantidad: 0
      //             },
      //             {
      //               tipo: 'Indígena',
      //               cantidad: 2
      //             },
      //           ]
      //         },{
      //           departamento: 'Tarija',
      //           universidades: [
      //             {
      //               tipo: 'Público',
      //               cantidad: 2
      //             },
      //             {
      //               tipo: 'Regimen especial',
      //               cantidad: 1
      //             },
      //             {
      //               tipo: 'Indígena',
      //               cantidad: 2
      //             },
      //           ]
      //         },
      //         {
      //           departamento: 'Pando',
      //           universidades: [
      //             {
      //               tipo: 'Público',
      //               cantidad: 3
      //             },
      //             {
      //               tipo: 'Regimen especial',
      //               cantidad: 0
      //             },
      //             {
      //               tipo: 'Indígena',
      //               cantidad: 0
      //             },
      //           ]
      //         }, {
      //           departamento: 'Sucre',
      //           universidades: [
      //             {
      //               tipo: 'Público',
      //               cantidad: 1
      //             },
      //             {
      //               tipo: 'Regimen especial',
      //               cantidad: 2
      //             },
      //             {
      //               tipo: 'Indígena',
      //               cantidad: 3
      //             },
      //           ]
      //         },{
      //           departamento: 'Tarija',
      //           universidades: [
      //             {
      //               tipo: 'Público',
      //               cantidad: 0
      //             },
      //             {
      //               tipo: 'Regimen especial',
      //               cantidad: 0
      //             },
      //             {
      //               tipo: 'Indígena',
      //               cantidad: 0
      //             },
      //           ]
      //         },
      //         {
      //           departamento: 'Pando',
      //           universidades: [
      //             {
      //               tipo: 'Público',
      //               cantidad: 1
      //             },
      //             {
      //               tipo: 'Regimen especial',
      //               cantidad: 2
      //             },
      //             {
      //               tipo: 'Indígena',
      //               cantidad: 1
      //             },
      //           ]
      //         },

      //       ];
        
        this.renderChart(this.datos, this.options)
    }
  }
}
</script>

<style>
</style>