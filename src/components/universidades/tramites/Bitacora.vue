<template>
  <div class="bitacora">
    <v-card>
      <v-card-text>
        <h3>Trámite Nro: {{idTramite}}</h3>
        <template>
          <v-timeline
            align-top
            :dense="$vuetify.breakpoint.smAndDown"
          >
            <v-timeline-item
              v-for="(item, i) in items"
              :key="i"
              :color="item.color"
              :icon="item.icon"
              fill-dot
            >
              <v-card
                :color="item.color"
                dark
              >
                <v-card-title class="title">
                  Lorem Ipsum Dolor
                </v-card-title>
                <v-card-text class="white text--primary">
                  <p>Lorem ipsum dolor sit amet, no nam oblique veritus. Commune scaevola imperdiet nec ut, sed euismod convenire principes at. Est et nobis iisque percipit, an vim zril disputando voluptatibus, vix an salutandi sententiae.</p>
                  <v-btn
                    :color="item.color"
                    class="mx-0"
                    outlined
                  >
                    Button
                  </v-btn>
                </v-card-text>
              </v-card>
            </v-timeline-item>
          </v-timeline>
        </template>
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
// import UniversidadesService from '@/services/universidadesService'
export default {
  props: ['idTramite'],
  data: () => ({
    tramite: '',
    items: [
        {
          color: 'red lighten-2',
          icon: 'mdi-star',
        },
        {
          color: 'purple darken-1',
          icon: 'mdi-book-variant',
        },
        {
          color: 'green lighten-1',
          icon: 'mdi-airballoon',
        },
        {
          color: 'indigo',
          icon: 'mdi-buffer',
        },
    ],
  }),
  mounted(){
    // this.obtenerBitacora()
  },
  // watch: {
  //   idTramite: function() {
  //     console.log(this.idTramite)
  //     this.obtenerBitacora()
  //   }
  // },
  methods: {
    // async obtenerBitacora() {
    //   try {
    //     let response = await UniversidadesService.getBitacoraTramite(1671530)
    //     let data = await response.data
    //     console.log('bitacora', data)
    //   } catch (error) {
    //     console.log(error)
    //   }
    // },
    cerrar() {
      this.$emit('cerrarDialog');
    }
  }
}
</script>

<style>
  .bitacora {
    margin-top: 20px;
  }
</style>