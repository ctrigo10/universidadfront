<template>
  <div>
    <input type="hidden" :value="idUniversidad">
    <v-row>
      <v-col sm="7">
        <v-card>
          <v-card-text>
            <h4>Carreras</h4>
            <v-list>
              <v-list-item-group v-model="itemSeleccionado" color="primary">
                <v-list-item
                  v-for="(item, i) in carreras"
                  :key="i"
                  @click="getDatosCarrera(item)"
                >
                  <v-list-item-content>
                    <v-list-item-title> <v-icon>mdi-menu-right</v-icon> {{item.carrera}}</v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
              </v-list-item-group>
            </v-list>
            <div v-if="carreras.length == 0">Sin resultados</div>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col sm="5">
        <v-card>
          <v-card-text>
            <h4>Grados académicos</h4>
            <v-list>
              <v-list-item-group v-model="item2Seleccionado" color="primary">
                <v-list-item
                  v-for="(item, i) in denominaciones"
                  :key="i"
                  @click="getPensums(item)"
                >
                  <v-list-item-content>
                    <v-list-item-title> <v-icon>mdi-menu-right</v-icon> {{item.denominacion}}</v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
              </v-list-item-group>
            </v-list>
            <div v-if="denominaciones.length == 0">Sin resultados</div>
          </v-card-text>
        </v-card>
        <br>
        <v-card v-if="gradoSeleccionado != ''">
          <v-card-text>
            <h4>Pensums</h4>
            <v-list disabled="disabled">
              <v-list-item-group>
                <v-list-item
                  v-for="(item, i) in pensums"
                  :key="i"
                >
                  <v-list-item-content>
                    <v-list-item-title> Nro.: {{item.id}}</v-list-item-title>
                    <v-list-item-subtitle>Tiempo de estudio: {{item.tiempo_estudio}} años</v-list-item-subtitle>
                  </v-list-item-content>
                  <v-list-item-action>
                    <v-btn icon>
                      <v-icon color="success">mdi-info</v-icon>
                    </v-btn>
                  </v-list-item-action>
                </v-list-item>
              </v-list-item-group>
            </v-list>
            <div v-if="pensums.length == 0">Sin resultados</div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import Servicio from '@/services/general'
import axios from 'axios'
// import { mapGetters } from 'vuex'
export default {
  name: 'carreras',
  props: ['idUniversidad'],
  data: () => ({
    id: '',
    itemSeleccionado: '',
    item2Seleccionado: '',
    gradoSeleccionado: '',
    carreraSeleccionada: '',
    carreras: [],
    denominaciones: [],
    pensums: []
  }),
  mounted(){
    this.getCarreras();
    console.log('montando carreras')
    this.id = this.idUniversidad;
  },
  updated(){
    if (this.id != this.idUniversidad) {
      this.getCarreras();
      this.id = this.idUniversidad
      console.log('actualizando carreras')
    }
  },
  methods: {
    async getCarreras(){
      try {
        let response = await axios.get(Servicio.getServe() + 'informe/listaCarreras/' + this.idUniversidad);
        let data = await response.data;
        this.carreras = data.data;
      } catch (error) {
        console.log(error)
      }
    },
    async getDatosCarrera(item){
      try {
        this.denominaciones = [];
        this.gradoSeleccionado = '';
        this.pensums = [];
        this.carreraSeleccionada = item.carrera_autorizada_id;
        let response = await axios.get(Servicio.getServe() + 'informe/listaDenominaciones/' + this.carreraSeleccionada);
        let data = await response.data;
        this.denominaciones = data.data;
      } catch (error) {
        console.log(error)
      }
    },
    async getPensums(item){
      try {
        this.gradoSeleccionado = item.id;
        let response = await axios.get(Servicio.getServe() + 'informe/listPensums/' + this.gradoSeleccionado);
        let data = await response.data;
        this.pensums = data.data;
      } catch (error) {
        console.log(error)
      }
    }
  }
}
</script>

<style scope>
  h3 {
    margin-bottom: 10px;
  }
</style>