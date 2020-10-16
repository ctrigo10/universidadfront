<script>
import { Bar } from 'vue-chartjs'

export default {
  extends: Bar,
  // props: ['chartdata', 'options'],
  data: () => ({
    chartdata: '',
    options: ''
  }),
  mounted () {
    this.getDatos() 
  },
  methods: {
    getDatos(){
       let datos = [
              {
                departamento: 'La Paz',
                universidades: [
                  {
                    id: 1,
                    tipo: 'Público',
                    cantidad: 4
                  },
                  {
                    id: 2,
                    tipo: 'Regimen especial',
                    cantidad: 6
                  },
                  {
                    id: 3,
                    tipo: 'Indígena',
                    cantidad: 10
                  },
                ]
              },
              {
                departamento: 'Oruro',
                universidades: [
                  {
                    id: 1,
                    tipo: 'Público',
                    cantidad: 9
                  },
                  {
                    id: 2,
                    tipo: 'Regimen especial',
                    cantidad: 0
                  },
                  {
                    id: 3,
                    tipo: 'Indígena',
                    cantidad: 15
                  },
                ]
              },{
                departamento: 'cochabamba',
                universidades: [
                  {
                    id: 1,
                    tipo: 'Público',
                    cantidad: 4
                  },
                  {
                    id: 2,
                    tipo: 'Regimen especial',
                    cantidad: 6
                  },
                  {
                    id: 3,
                    tipo: 'Indígena',
                    cantidad: 10
                  },
                ]
              },
              {
                departamento: 'Sucre',
                universidades: [
                  {
                    id: 1,
                    tipo: 'Público',
                    cantidad: 9
                  },
                  {
                    id: 2,
                    tipo: 'Regimen especial',
                    cantidad: 0
                  },
                  {
                    id: 3,
                    tipo: 'Indígena',
                    cantidad: 15
                  },
                ]
              },{
                departamento: 'Tarija',
                universidades: [
                  {
                    id: 1,
                    tipo: 'Público',
                    cantidad: 4
                  },
                  {
                    id: 2,
                    tipo: 'Regimen especial',
                    cantidad: 6
                  },
                  {
                    id: 3,
                    tipo: 'Indígena',
                    cantidad: 10
                  },
                ]
              },
              {
                departamento: 'Pando',
                universidades: [
                  {
                    id: 1,
                    tipo: 'Público',
                    cantidad: 9
                  },
                  {
                    id: 2,
                    tipo: 'Regimen especial',
                    cantidad: 0
                  },
                  {
                    id: 3,
                    tipo: 'Indígena',
                    cantidad: 15
                  },
                ]
              }, {
                departamento: 'Sucre',
                universidades: [
                  {
                    id: 1,
                    tipo: 'Público',
                    cantidad: 9
                  },
                  {
                    id: 2,
                    tipo: 'Regimen especial',
                    cantidad: 0
                  },
                  {
                    id: 3,
                    tipo: 'Indígena',
                    cantidad: 15
                  },
                ]
              },{
                departamento: 'Tarija',
                universidades: [
                  {
                    id: 1,
                    tipo: 'Público',
                    cantidad: 4
                  },
                  {
                    id: 2,
                    tipo: 'Regimen especial',
                    cantidad: 6
                  },
                  {
                    id: 3,
                    tipo: 'Indígena',
                    cantidad: 10
                  },
                ]
              },
              {
                departamento: 'Pando',
                universidades: [
                  {
                    id: 1,
                    tipo: 'Público',
                    cantidad: 9
                  },
                  {
                    id: 2,
                    tipo: 'Regimen especial',
                    cantidad: 0
                  },
                  {
                    id: 3,
                    tipo: 'Indígena',
                    cantidad: 15
                  },
                ]
              },

            ];
        
        let labels = []
        let datasets = []
        datos.forEach(item => {
          labels.push(item.departamento)
          item.universidades.forEach(universidadTipo => {
            let index = datasets.findIndex(elemento => elemento.label == universidadTipo.tipo)
            console.log(index)
            if (index < 0) {
              datasets.push({
                label: universidadTipo.tipo,
                backgroundColor: ['#3e95cd'],
                data: [universidadTipo.cantidad]
              })
            }else{
              datasets[index].backgroundColor.push('#3e95cd')
              datasets[index].data.push(universidadTipo.cantidad)
            }
          })
        })

        this.chartdata = {
          labels: labels,
          datasets: datasets
        }

        console.log('datacreado', this.chartdata)

        // this.chartdata = {
        //   labels: ["Africa", "Asia", "Europe", "Latin America", "North America"],
        //   datasets: [
        //     {
        //       label: "Population (millions)",
        //       backgroundColor: ["#3e95cd", "#8e5ea2","#3cba9f","#e8c3b9","#c45850"],
        //       data: [2478,5267,734,784,433]
        //     }
        //   ]
        // }
        this.options = {
          legend: { display: false },
          title: {
            display: true,
            text: 'Cantidad de universidades por departamento'
          }
        }
        this.renderChart(this.chartdata, this.options)
    }
  }
}
</script>

<style>
</style>