<template>
  <div>
    <v-breadcrumbs :items="breadcrumbs">
      <template v-slot:divider>
        <v-icon>mdi-forward</v-icon>
      </template>
    </v-breadcrumbs>
    <v-card class="tarjeta">
      <v-card-title>
        {{universidad.id}} - {{universidad.institucioneducativa}}
        <v-spacer></v-spacer>
        <div>
          <Logo :idUniversidad="universidad.id" :nombreLogo="universidad.logo"/>
          <!-- <v-btn small @click="universidad.logo = 'img-1597644930474.png'">Cambiar logo</v-btn> -->
          
        </div>
      </v-card-title>
      <v-card-text>
        <v-row>
          <v-col cols="12" sm="4">
            <div class="titulo">Estado</div>
            <h5>{{universidad.estadoText}}</h5>
            <div class="titulo">Dependencia</div>
            <h5>{{universidad.dependenciaText}}</h5>
            <div class="titulo">Zona</div>
            <h5>{{universidad.zona}}</h5>
            <div class="titulo">Dirección</div>
            <h5>{{universidad.direccion}}</h5>
          </v-col>
          <v-col cols="12" sm="4">
            <div class="titulo">Teléfono</div>
            <h5>{{universidad.telefonos}}</h5>
            <div class="titulo">Fax</div>
            <h5>{{universidad.fax}}</h5>
            <div class="titulo">Sitio Web</div>
            <h5>{{universidad.sitio_web}}</h5>
            <div class="titulo">Email</div>
            <h5>{{universidad.email}}</h5>
          </v-col>
          <v-col cols="12" sm="4">
            <div class="titulo">Decreto Supremo</div>
            <h5>{{universidad.decreto_supremo}}</h5>
            <div class="titulo">Fecha Decreto Supremo</div>
            <h5>{{universidad.fecha_decreto_supremo}}</h5>
            <div class="titulo">Fecha de Creación</div>
            <h5>{{universidad.fecha_creacion}}</h5>
            <!-- <v-btn color="success" @click="logo = 'loguito.png'">CAmbiar logo</v-btn> -->
          </v-col>
        </v-row>
        <v-row>
          <v-spacer></v-spacer>
          <RMUniversidad :idUniversidad="universidad.id" :universidad="universidad.institucioneducativa"/>
        </v-row>
      </v-card-text>
    </v-card>
    <v-card class="tarjeta">
      <v-card-title>
        Carreras
        <v-spacer></v-spacer>
        <v-btn outlined color="purple accent-4" dark @click="openDialogCarrera">Nueva carrera</v-btn>
      </v-card-title>
      <v-card-text>
        <v-data-table
          :headers="headers"
          :items="carrerasUniversidad"
          :search="search"
          class="elevation-1"
        >
          <template v-slot:[`item.acciones`]="{ item }">
            <!-- <v-btn @click="edit(item)" class="btn-accion">
              <v-icon>mdi-pencil-outline</v-icon>
            </v-btn> -->
            <RMCarrera :idUniversidadCarrera="item.id" :universidad="item.nombre"/>
            <v-btn class="btn-accion" @click="deletedCarrera(item.id)">
              <v-icon>mdi-delete</v-icon>
            </v-btn>
          </template>
        </v-data-table>
      </v-card-text>
    </v-card>
    <v-dialog
      v-model="dialogCarrera"
      scrollable 
      persistent :overlay="false"
      max-width="500px"
      transition="dialog-transition"
    >
      <v-card>
        <v-card-title primary-title>
          {{mode}} Carrera
        </v-card-title>
        <v-card-text>
          <v-row>
            <v-col cols="12" sm="12">
              <UnidadAcademica
                :idUniversidad="idUniversidad"
                @seleccionarUA="seleccionarUA"
                v-if="universidad.dependencia_tipo_id == 7"
              />
              <v-select
                :items="carreras"
                item-text="nombre"
                item-value="id"
                v-model="carrera.ttec_carrera_tipo_id"
                label="Carrera"
                placeholder="Seleccionar carrera"
                filled
              ></v-select>
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
            <v-btn
              color="purple accent-4"
              text
              @click="addCarrera"
              v-show="mode == 'Crear'"
            >
              Registrar
            </v-btn>
            <v-btn
              color="purple accent-4"
              text
              @click="updateCarrera"
              v-show="mode == 'Editar'"
            >
              Registrar
            </v-btn>
            <v-btn
              color="red"
              text
              @click="dialogCarrera = false"
            >
              Cancelar
            </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>
<script>
import axios from 'axios';
import RMUniversidad from '../../components/universidades/RMUniversidad';
import RMCarrera from '../../components/universidades/RMCarrera';
import UnidadAcademica from '../../components/universidades/UnidadAcademica';
import Logo from '../../components/universidades/Logo';
export default {
  name: 'universidadGestion',
  components: {
    RMUniversidad,
    RMCarrera,
    UnidadAcademica,
    Logo
  },
  data: () => ({
    idUniversidad: '',
    breadcrumbs: [
      {
        text: 'Dashboard',
        disabled: false,
        href: '/universidades/dashboard',
      },
      {
        text: 'Universidades',
        disabled: false,
        href: '/universidades/universidades',
      },
      {
        text: 'Gestión',
        disabled: true,
        href: 'gestion',
      },
    ],
    universidad: {
      id: '',
      codDepartamento: '',
      codProvincia: '',
      codSeccion: '',
      zona: '',
      direccion: '',

      estadoinstitucion_tipo_id: '',
      dependencia_tipo_id: '',
      // institucioneducativa_tipo_id: 1,
      institucioneducativa: '',
      fecha_resolucion: '2020-05-02',
      nro_resolucion: '123213',
      fecha_creacion: '',

      telefonos: '',
      fax: '',
      email: '',
      sitio_web: '',
      decreto_supremo: '',
      fecha_decreto_supremo: '',

      estadoText: '',
      dependenciaText: '',

      logo: ''
      
    },

    carrerasUniversidad: [],
    carreras: [],
    
    search: '',
    headers: [
      { text: 'Carrera o Especialidad Académica', sortable: false, value: 'nombre'},
      // { text: 'Grado Académico', value: 'gradoAcademico'},
      // { text: 'Duración', value: 'duracion'},
      // { text: 'Nro. Resolución', value: 'nroResolucion'},
      // { text: 'Fecha', value: 'fecha'},
      { text: 'Acciones', value: 'acciones', sortable: false, align: 'end'}
    ],

    carrera: {
      institucioneducativa_id: '',
      ttec_carrera_tipo_id: '',
      unidad_academica_id: ''
    },

    mode: '',

    dialogCarrera: false
  }),
  mounted(){
    this.idUniversidad = this.$route.params.sie;
    this.carrera.institucioneducativa_id = this.$route.params.sie;
    this.getDatosUniversidad();
    this.getCarrerasUniversidad();
    this.getCarreras();
  },
  methods: {
    openDialogCarrera(){
      this.mode = 'Crear';
      this.dialogCarrera = true;
    },
    getDatosUniversidad(){
      let idUniversidad = this.$route.params.sie;
      axios.get(`http://localhost:3000/universidad/${idUniversidad}`).then(response => {
        if (response.data.status == 'success') {
          let univData = response.data.data;
          let datos = response.data.datos;

          this.universidad.id = univData.id;
          this.universidad.codDepartamento = '';
          this.universidad.codProvincia = '';
          this.universidad.codSeccion = '';
          this.universidad.zona = univData.jurisdiccion_geografica.zona;
          this.universidad.direccion = univData.jurisdiccion_geografica.direccion;

          this.universidad.estadoinstitucion_tipo_id = univData.estadoinstitucion_tipo_id;
          this.universidad.dependencia_tipo_id = univData.dependencia_tipo_id;
          this.universidad.institucioneducativa = univData.institucioneducativa;
          this.universidad.fecha_resolucion = '2020-05-02',
          this.universidad.nro_resolucion = '123213',
          this.universidad.fecha_creacion = univData.fecha_creacion;

          this.universidad.estadoText = univData.estadoinstitucion_tipo.estadoinstitucion;
          this.universidad.dependenciaText = univData.dependencia_tipo.dependencia;

          if(datos != null){
            this.universidad.telefonos = datos.telefonos;
            this.universidad.fax = datos.fax;
            this.universidad.email = datos.email;
            this.universidad.sitio_web = datos.sitio_web;
            this.universidad.decreto_supremo = datos.decreto_supremo;
            this.universidad.fecha_decreto_supremo = datos.fecha_decreto_supremo;

            this.universidad.logo = datos.imagen;
          }

        }
      }).catch( () => {
        
      });
    },
    getCarrerasUniversidad(){
      axios.get(`http://localhost:3000/carreraUni/carreraUniversidad/${this.idUniversidad}`).then(response => {
        this.carrerasUniversidad = response.data.data;
      })
    },
    getCarreras(){
      axios.get(`http://localhost:3000/carrera`).then(response => {
        console.log(response.data)
        this.carreras = response.data.data;
      })
    },
    addCarrera(){
      axios.post(`http://localhost:3000/carreraUni`, this.carrera).then(response => {
        this.getCarrerasUniversidad();
        this.dialogCarrera = false;
        console.log(response)
        this.$vToastify.success("Carrera agregada correctamente");
      }).catch(() => {
        this.$vToastify.warning("La carrera ya esta asignada");
      })
    },
    deletedCarrera(id){
      this.$swal({
        title: '¿Eliminar?',
        text: "¡No podrás revertir esto!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Si, eliminar!',
        cancelButtonText: 'Cancelar'
      }).then((result) => {
        if (result.value) {
          axios.delete('http://localhost:3000/carreraUni/'+id).then(response => {
            console.log(response);
            this.getCarrerasUniversidad();
            this.$vToastify.success("La carrera fue eliminada correctamente");
          }).catch(() => {
            this.$vToastify.warning("No se pudo eliminar la carrera");
          })
        }
      });
    },
    updateCarrera(){

    },
    seleccionarUA(unidadAcademicaId){
      this.carrera.unidad_academica_id = unidadAcademicaId;
    }
  }
}
</script>
<style scope>
  .titulo {
    /* font-size: 1.2em; */
  }
  h5 {
    font-size: 1.1em;
    min-height: 30px;
    color: purple;
  }
</style>