<template>
  <div v-cloak>
    <h3>Información general</h3>
    <v-row>
      <v-col cols="12" lg="9" md="9" sm="8" xs="12">
        <v-card v-if="Object.keys(universidad).length">
          <v-card-text>
            <h4>1.- Datos Generales</h4>
            <v-row>
              <v-col cols="12" lg="3" md="4" sm="6" xs="12">
                <Dato label="Código SIE" :value="universidad.id" />
              </v-col>
              <v-col cols="12" lg="5" md="8" sm="12" xs="12">
                <Dato label="Nombre Universidad" :value="universidad.institucioneducativa" />
              </v-col>
              <v-col cols="12" lg="4" md="8" sm="12" xs="12">
                <Dato label="SEDE/SUBSEDE" :value="universidad.nombre_sede_subsede" />
              </v-col>
              <v-col cols="12" lg="3" md="4" sm="6" xs="12">
                <Dato label="Dependencia" :value="universidad.dependencia" />
              </v-col>
              <v-col cols="12" lg="3" md="4" sm="6" xs="12">
                <Dato label="Estado" :value="universidad.estadoinstitucion" :chip="universidad.estadoinstitucion == 'Abierta' ? { color: 'success', icon: 'mdi-check' } : { color: 'gray', icon: 'mdi-cancel' }"/>
              </v-col>
              <v-col cols="12" lg="3" md="4" sm="6" xs="12">
                <Dato label="Teléfonos" :value="universidad.telefonos" />
              </v-col>
              <v-col cols="12" lg="3" md="4" sm="6" xs="12">
                <Dato label="Fax" :value="universidad.fax" />
              </v-col>
              <v-col cols="12" lg="3" md="4" sm="6" xs="12">
                <Dato label="Correo electrónico" :value="universidad.email" />
              </v-col>
              <v-col cols="12" lg="3" md="4" sm="6" xs="12">
                <Dato label="Sitio web" :value="universidad.sitio_web" />
              </v-col>
              <v-col cols="12" lg="3" md="4" sm="6" xs="12" v-if="universidad.id == universidad.sede">
                <Dato label="Rector" :value="universidad.rector? universidad.rector : ''" />
              </v-col>
              <v-col cols="12" lg="3" md="4" sm="6" xs="12">
                <Dato label="Vice Rector" :value="universidad.vicerector? universidad.vicerector : ''" />
              </v-col>
              <v-col cols="12" lg="3" md="4" sm="6" xs="12">
                <Dato label="Fecha de Creación" :value="universidad.fecha_creacion | formatearFecha" />
              </v-col>
            </v-row>
            <br>
            <h4>2.- Datos legales</h4>
            <v-row>
              <v-col cols="12" sm="3" xs="6" v-if="universidad.id == universidad.sede">
                <Dato label="Decreto Supremo" :value="universidad.decreto_supremo" />
              </v-col>
              <v-col cols="12" sm="3" xs="6" v-if="universidad.id == universidad.sede">
                <Dato label="Fecha Decreto Supremo" :value="universidad.fecha_decreto_supremo | formatearFecha" />
              </v-col>
              <v-col cols="12" sm="3" xs="6">
                <Dato label="Resolución Ministerial" :value="universidad.nro_resolucion" />
              </v-col>
              <v-col cols="12" sm="3" xs="6">
                <Dato label="Fecha Resolución" :value="universidad.fecha_resolucion | formatearFecha" />
              </v-col>
            </v-row>
            <br>
            <h4>3.- Localización del Edificio Educativo</h4>
            <v-row>
              <v-col cols="12" sm="3" xs="6">
                <Dato label="Código LE" :value="universidad.id" />
              </v-col>
              <v-col cols="12" sm="3" xs="6">
                <Dato label="Departamento" :value="universidad.deparmento? universidad.deparmento : ''" />
              </v-col>
              <v-col cols="12" sm="3" xs="6">
                <Dato label="Provincia" :value="universidad.provincia? universidad.provincia : ''" />
              </v-col>
              <v-col cols="12" sm="3" xs="6">
                <Dato label="Sección" :value="universidad.seccion? universidad.seccion : ''" />
              </v-col>
              <v-col cols="12" sm="3" xs="6">
                <Dato label="Distrito" :value="universidad.distrito ? universidad.distrito.dist : ''" />
              </v-col>
              <v-col cols="12" sm="3" xs="6">
                <Dato label="Zona" :value="universidad.zona" />
              </v-col>
              <v-col cols="12" sm="3" xs="6">
                <Dato label="Dirección" :value="universidad.direccion" />
              </v-col>
            </v-row>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <EditFormFull :datosUniversidad="universidad"  @actualizar="obtenerDatosUniversidad"/>
          </v-card-actions>
        </v-card>
      </v-col>
      <v-col cols="12" lg="3" md="3" sm="4" xs="12">
        <v-card>
          <v-card-text>
            <h4>Logo</h4>
            <div class="div-logo">
            <Logo :idUniversidad="universidad.id" :logo="'http://localhost:3000/'+universidad.imagen"/>
            </div>
          </v-card-text>
          <!-- <v-card-actions>
            <v-spacer></v-spacer>
            <v-tooltip left>
              <template v-slot:activator="{ on, attrs }">
                <v-btn color="primary" v-bind="attrs" v-on="on">  <v-icon>mdi-pencil</v-icon></v-btn>
              </template>
              <span>Actualizar logo</span>
            </v-tooltip>
          </v-card-actions> -->
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import Servicio from '@/services/general'
import UniversidadesService from '@/services/universidadesService'
import Dato from '@/components/universidades/universidad/Dato'
import EditFormFull from '@/components/universidades/universidad/EditFormFull'
import Logo from '@/components/universidades/Logo'
export default {
  name: 'datos-generales',
  props: ['idUniversidad'],
  components: {
    Dato,
    EditFormFull,
    Logo
  },
  data: () => ({
    universidad: {},
    host: Servicio.getServe(),
    usuarioLogueado: ''
  }),
  filters: {
    formatearFecha(fecha) {
      if (fecha != null && fecha != '') {
        let datos = fecha.split('-')
        if (datos.length == 3) {
          return datos[2]+'-'+datos[1]+'-'+datos[0]
        }
      }
      return fecha
    }
  },
  watch: {
    idUniversidad: function(){
      if (typeof this.idUniversidad !== 'undefined') {
        this.obtenerDatosUniversidad()  
      }
    }
  },
  mounted() {
    this.usuarioLogueado = Servicio.getUser()
    console.log('this', this.usuarioLogueado)
    if (typeof this.idUniversidad !== 'undefined') {
      this.obtenerDatosUniversidad()
    }
  },
  methods: {
    async obtenerDatosUniversidad(){
      try {
        let response = await UniversidadesService.getDatosUniversidad(this.idUniversidad);
        let data = await response.data.data;
        this.universidad = data;
      } catch (error) {
        console.log(error)
      }
    },
  }
}
</script>

<style>
  .v-cloak {
    display: none;
  }
</style>