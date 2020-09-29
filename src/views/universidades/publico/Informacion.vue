<template>
  <div>
    <DatosUniversidad :idUniversidad="sie"/>
    <v-row>
      <v-col
        cols="12"
        sm="4"
      >
        <v-card>
          <v-card-text>
            <v-list three-line>
              <v-list-item
                @click="seleccionarUniversidad(sede)"
              >
                <v-list-item-avatar>
                  <v-img :src="'http://localhost:3000/' + sede.imagen"></v-img>
                </v-list-item-avatar>

                <v-list-item-content>
                  <v-list-item-title v-html="sede.institucioneducativa" m-0></v-list-item-title>
                  <v-list-item-subtitle v-html="'Sede central'"></v-list-item-subtitle>
                  <v-list-item-subtitle v-html="sede.departamento"></v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
            
              <v-list-item
                v-for="(item, index) in subsedes" :key="index"
                @click="seleccionarUniversidad(item)"
              >
                <v-list-item-avatar>
                  <v-img :src="'http://localhost:3000/' + item.imagen"></v-img>
                </v-list-item-avatar>

                <v-list-item-content>
                  <v-list-item-title v-html="item.institucioneducativa" m-0></v-list-item-title>
                  <v-list-item-subtitle v-html="'Sub sede'"></v-list-item-subtitle>
                  <v-list-item-subtitle v-html="item.departamento.depa"></v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
            </v-list>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col
        cols="12"
        sm="8"
      >
        <v-card v-if="seleccionado != ''">
          <v-card-text>  
            <div class="text-center">
              <h2>{{ seleccionado.institucioneducativa }}</h2>
            </div>
            <h5>Datos de ubicación</h5>
            <v-list>
              <v-list-item class="pt-0 pb-0">
                <v-list-item-icon class="pt-0 pb-0">
                  <v-icon color="indigo">
                    mdi-cellphone-android
                  </v-icon>
                </v-list-item-icon>
                <v-list-item-content class="pt-0 pb-0">
                  <v-list-item-title>{{ seleccionado.telefonos }}</v-list-item-title>
                </v-list-item-content>
              </v-list-item>
              <v-list-item>
                <v-list-item-icon>
                  <v-icon color="indigo">
                    mdi-map-marker
                  </v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title>{{ seleccionado.direccion }}</v-list-item-title>
                </v-list-item-content>
              </v-list-item>
              <v-list-item>
                <v-list-item-icon>
                  <v-icon color="indigo">
                    mdi-email
                  </v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title>{{ seleccionado.email }}</v-list-item-title>
                </v-list-item-content>
              </v-list-item>
              <v-list-item>
                <v-list-item-icon>
                  <v-icon color="indigo">
                    mdi-web
                  </v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title>{{ seleccionado.sitio_web }}</v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </v-list>

            <div v-show="ofertaAcademica.length > 0 ">
              <h5 class="mt-7 mb-3">Oferta académica</h5>
              <v-simple-table>
                <template v-slot:default>
                  <thead>
                    <tr>
                      <th class="text-left">Carrera o Especialidad Académica</th>
                      <th class="text-left">Grado Académico</th>
                      <th class="text-left">Duración</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr
                      v-for="item in ofertaAcademica"
                      :key="item.name"
                    >
                      <td>{{ item.nombre }}</td>
                      <td>{{ item.nivel }}</td>
                      <td>
                        {{ item.tiempo_estudio }}
                        <span v-if="item.regimen_estudio == 'ANUAL'"> años</span>
                        <span v-if="item.regimen_estudio == 'SEMESTRAL'"> semestres</span>
                      </td>
                    </tr>
                  </tbody>
                </template>
              </v-simple-table>
            </div>
            <!-- <div v-show="ofertaAcademica.length == 0">Sin resultados</div> -->

          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import UniversidadesService from '@/services/universidadesService'
import DatosUniversidad from '@/components/universidades/DatosUniversidad'
export default {
  name: 'informacion',
  components: {
    DatosUniversidad
  },
  data: () => ({
    sie: '',
    sede: '',
    subsedes: [],
    seleccionado: {
      id: '',
      institucioneducativa: '',
      telefonos: '',
      direccion: '',
      email: '',
      sitio_web: ''
    },
    ofertaAcademica: []
  }),
  mounted(){
    console.log(this.$route.params.sie)
    this.sie = this.$route.params.sie;
    this.obtenerDatosSede();
    this.obtenerSubsedes();
  },
  methods: {
    async obtenerDatosSede(){
      try {
        let response = await UniversidadesService.getDatosUniversidad(this.sie);
        let data = await response.data;
        this.sede = {
          id: data.data.id,
          institucioneducativa: data.data.institucioneducativa,
          telefonos: data.datos.telefonos,
          direccion: data.data.jurisdiccion_geografica.direccion,
          email: data.datos.email,
          sitio_web: data.datos.sitio_web,
          imagen: data.datos.imagen,
          departamento: data.data.jurisdiccion_geografica.distrito_tipo.departamento_tipo.departa
        };

        // this.seleccionado = this.sede;
        this.seleccionarUniversidad(this.sede);
        console.log('seleccionado', this.seleccionado)
      } catch (error) {
        console.log(error);
      }
    },
    async obtenerSubsedes(){
      try {
        let response = await UniversidadesService.getSubsedes(this.sie);
        let data = await response.data;
        this.subsedes = data.data;
        console.log('subsedes', this.subsedes)
      } catch (error) {
        console.log(error);
      }
    },
    seleccionarUniversidad(universidad){
      this.seleccionado = {
        id: universidad.id,
        institucioneducativa: universidad.institucioneducativa,
        telefonos: universidad.telefonos,
        direccion: universidad.direccion,
        email: universidad.email,
        sitio_web: universidad.sitio_web
      };
      // this.seleccionado = universidad;
      console.log('asdfdasf', this.seleccionado)
      this.verOfertaAcademica();
    },
    async verOfertaAcademica(){
      try {
        let response = await UniversidadesService.getCarrerasUniversidad(this.seleccionado.id);
        let data = await response.data;
        this.ofertaAcademica = data.data;
        console.log('oferta', this.ofertaAcademica)
      } catch (error) {
        console.log(error);
      }
    }
  }
}
</script>

<style>

</style>