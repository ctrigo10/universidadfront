<template>
  <div>
    <v-card>
      <v-card-title>
        Universidad {{ idUniversidad }}
      </v-card-title>
      <v-card-text>
        <v-row>
          <v-col cols="12" sm="6">
            <v-select
              v-model="universidadSeleccionada"
              :items="universidades"
              :item-text="item => item.id + ' - ' + item.institucioneducativa +' ('+ item.sede + ')'"
              item-value="id"
              label="Universidad"
              placeholder="Seleccionar Universidad"
              @change="seleccionarUniversidad"
              append-icon="mdi-magnify"
            ></v-select>
          </v-col>
          <!-- <v-col cols="12" sm="6">
            <v-btn color="primary"> <v-icon>mdi-magnify</v-icon> Buscar</v-btn>
          </v-col> -->
        </v-row>

      </v-card-text>
    </v-card>

    <v-card v-if="universidadSeleccionada != ''">
      <v-card-text>
        <v-btn-toggle
          v-model="text"
          tile
          color="deep-purple accent-3"
          group
        >
          <v-btn value="carreras" @click="currentPage = 'Carreras'">
            Carreras
          </v-btn>
          <v-btn value="docentes" @click="currentPage = 'Docentes'">
            Docentes
          </v-btn>
          <v-btn value="estudiantes" @click="currentPage = 'Estudiantes'">
            Estudiantes
          </v-btn>
        </v-btn-toggle>

        <component :is="currentPage" v-bind="{ idUniversidad: universidadSeleccionada }"></component>

      </v-card-text>
    </v-card>
  </div>
</template>

<script>
import Servicio from '../../services/general'
import axios from 'axios'
import { mapGetters} from 'vuex'
import Carreras from '@/components/universidades/academico/Carreras'
import Docentes from '@/components/universidades/academico/Docentes'
import Estudiantes from '@/components/universidades/academico/Estudiantes'
export default {
  name: 'academico',
  components: {
    Carreras,
    Docentes,
    Estudiantes
  },
  data: () => ({
    currentPage: 'Carreras',
    text: 'carreras',
    universidades: [],
    universidadSeleccionada: ''
  }),
  mounted(){
    this.getUniversidades();
  },
  computed: {
    ...mapGetters(['idUniversidad'])
  },
  methods: {
    // ...mapMutations(['seleccionarUniversidad']),
    async getUniversidades(){
      try {
        let response = await axios.get(Servicio.getServe() + 'informe/listaUniversidad');
        let data = await response.data; 
        this.universidades = data.data;
      } catch (error) {
        console.log(error)
      }
    },
    seleccionarUniversidad(){
      console.log(this.universidadSeleccionada)
    }
  }
}
</script>

<style>

</style>