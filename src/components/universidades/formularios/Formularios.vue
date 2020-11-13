<template>
  <div>
    <v-btn color="success" @click="currentComponent = 'Form1'">Formulario 1</v-btn>
    <v-btn color="success" @click="currentComponent = 'Form3'">Formulario 3</v-btn>
    <v-btn color="success" @click="currentComponent = 'Form5'">Formulario 5</v-btn>
    <component v-bind:is="currentComponent" :idUniversidad="idUniversidad" :universidad="universidad"></component>
  </div>
</template>

<script>
import UniversidadesService from '@/services/universidadesService'
import Form1 from '@/components/universidades/formularios/Form1'
import Form3 from '@/components/universidades/formularios/Form3'
import Form5 from '@/components/universidades/formularios/Form5'
export default {
  name: 'universidad-formularios',
  props: ['idUniversidad'],
  components: {
    Form1,
    Form3,
    Form5,
  },
  data: () => ({
    currentComponent: '',
    universidad: ''
  }),
  mounted(){
    this.currentComponent = 'Form1'
    this.verDatosUniversidad()
  },
  watch: {
    idUniversidad: function() {
      this.verDatosUniversidad()
    }
  },
  methods: {
    async verDatosUniversidad(){
      try {
        let response = await UniversidadesService.getDatosUniversidad(this.idUniversidad);
        let data = response.data;
        this.universidad = data.data;
      } catch (error) {
        console.log(error)
      }
    },
  }
}
</script>

<style>

</style>