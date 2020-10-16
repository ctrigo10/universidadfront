<script>
import { Pie } from 'vue-chartjs'

export default {
  extends: Pie,
  data: () => ({
    chartdata: '',
    options: ''
  }),
  mounted () {
    this.getDatos() 
  },
  methods: {
    getDatos(){
        this.chartdata = {
          labels: ["Masculino", "Femenino"],
          datasets: [
            {
              label: "Estudiantes a nivel Nacional",
              backgroundColor: ["#3e95cd", "#8e5ea2"],
              data: [2478,5267]
            }
          ]
        }
        this.options = {
          legend: { display: true },
          title: {
            display: true,
            text: 'Estudiantes a nivel Nacional'
          }
        }
        this.renderChart(this.chartdata, this.options)
    }
  }
}
</script>

<style>
</style>