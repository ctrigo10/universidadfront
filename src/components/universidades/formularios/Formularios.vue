<template>
  <div>
    <v-tabs
      v-model="tab"
      background-color="secondary"
      dark
    >
      <v-tab @click="currentComponent = 'Form1'">
        Formulario 1
      </v-tab>
      <v-tab @click="currentComponent = 'Form3'">
        Formulario 3
      </v-tab>
      <v-tab @click="currentComponent = 'Form5'">
        Formulario 5
      </v-tab>
    </v-tabs>
    <component v-bind:is="currentComponent" :idUniversidad="id" :universidad="universidad"></component>
  </div>
</template>

<script>
import UniversidadesService from '@/services/universidadesService'
import Form1 from '@/components/universidades/formularios/Form1'
import Form3 from '@/components/universidades/formularios/Form3'
import Form5 from '@/components/universidades/formularios/Form5'
export default {
  name: 'universidad-formularios',
  props: {
    idUniversidad: {
      type: String,
      default: 'ninguno'
    }
  },
  components: {
    Form1,
    Form3,
    Form5,
  },
  data: () => ({
    currentComponent: '',
    universidad: '',
    id: '',
    tab: 'Form1'
  }),
  mounted(){
    this.currentComponent = 'Form1'
    this.id = 'ninguno'
    this.universidad = ''
    if (this.idUniversidad != 'ninguno') {
      this.id = this.idUniversidad
      this.verDatosUniversidad()
    }
  },
  watch: {
    idUniversidad: function() {
      if (this.idUniversidad != 'ninguno') {
        this.verDatosUniversidad()
      }
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