<template>
  <div>
    <v-breadcrumbs :items="breadcrumbs">
      <template v-slot:divider>
        <v-icon>mdi-forward</v-icon>
      </template>
    </v-breadcrumbs>
    <v-card class="tarjeta">
      <v-card-title>
        <v-img :src="universidad.logo" :class="['logo-universidad', { 'fondo': universidad.logo == null}]" @click="openDialogLogo"></v-img>
        {{universidad.id}} - {{universidad.institucioneducativa}}
        <v-spacer></v-spacer>
        <div class="tipoSede">
          <span v-if="universidad.tipoSede == 'sede'">Sede</span>
          <span v-if="universidad.tipoSede == 'subsede'">Sub Sede</span>
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
            <div class="titulo">Fecha de Creación</div>
            <h5>{{universidad.fecha_creacion}}</h5>
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
            <div v-show="universidad.tipoSede == 'sede'">
              <div class="titulo">Rector</div>
              <h5>{{universidad.rector}}</h5>
            </div>
          </v-col>
          <v-col cols="12" sm="4">
            <div v-show="universidad.tipoSede == 'sede'">
              <div class="titulo">Decreto Supremo</div>
              <h5>{{universidad.decreto_supremo}}</h5>
              <div class="titulo">Fecha Decreto Supremo</div>
              <h5>{{universidad.fecha_decreto_supremo}}</h5>
            </div>
            <div class="titulo">Nro. Resolución</div>
            <h5>{{universidad.nro_resolucion}}</h5>
            <div class="titulo">Fecha Resolución</div>
            <h5>{{universidad.fecha_resolucion}}</h5>
            <div class="titulo">Vice Rector</div>
            <h5>{{universidad.vicerector}}</h5>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
    <v-card class="tarjeta">
      <v-card-title>
        Carreras
        <v-spacer></v-spacer>
        <v-btn color="primary" dark @click="openDialogCarrera">Nueva carrera</v-btn>
      </v-card-title>
      <v-card-text>
        <v-data-table
          :headers="headers"
          :items="carrerasUniversidad"
          :search="search"
          class="elevation-1"
          v-if="universidad.dependencia_tipo_id != 7"
        >
          <template v-slot:[`item.acciones`]="{ item }">
            <RMCarrera :denominacion_titulo_id="item.denominacion_titulo_id" :universidad="item.nombre"/>
            <v-tooltip top>
              <template v-slot:activator="{ on, attrs }">
                <v-btn class="btn-accion" @click="editCarrera(item)" v-bind="attrs" v-on="on">
                  <v-icon>mdi-square-edit-outline</v-icon>
                </v-btn>
              </template>
              <span>Editar</span>
            </v-tooltip>
            <v-tooltip top>
              <template v-slot:activator="{on, attrs}">
                <v-btn class="btn-accion" @click="deletedCarrera(item.denominacion_titulo_id)" v-bind="attrs" v-on="on">
                  <v-icon>mdi-delete</v-icon>
                </v-btn>
              </template>
              <span>Eliminar</span>
            </v-tooltip>
          </template>
        </v-data-table>
        
        <!-- regimen especial -->
        <v-data-table
          :headers="headers2"
          :items="carrerasUniversidad"
          :search="search"
          class="elevation-1"
          v-if="universidad.dependencia_tipo_id == 7"
        >
          <template v-slot:[`item.acciones`]="{ item }">
            {{item.denominacion_titulo_id}}
            <RMCarrera :denominacion_titulo_id="item.denominacion_titulo_id" :universidad="item.nombre"/>
            <v-tooltip top>
              <template v-slot:activator="{ on, attrs }">
                <v-btn class="btn-accion" @click="editCarrera(item)" v-bind="attrs" v-on="on">
                  <v-icon>mdi-square-edit-outline</v-icon>
                </v-btn>
              </template>
              <span>Editar</span>
            </v-tooltip>
            <v-tooltip top>
              <template v-slot:activator="{on, attrs}">
                <v-btn class="btn-accion" @click="deletedCarrera(item.denominacion_titulo_id)" v-bind="attrs" v-on="on">
                  <v-icon>mdi-delete</v-icon>
                </v-btn>
              </template>
              <span>Eliminar</span>
            </v-tooltip>
          </template>
        </v-data-table>
      </v-card-text>
    </v-card>
    <v-dialog
      v-model="dialogCarrera"
      scrollable 
      persistent :overlay="false"
      max-width="600px"
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
                :unidad_academica_id="carrera.unidad_academica_id"
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
            <v-col cols="12" sm="5">
              <v-select
                :items="niveles"
                item-text="nivel"
                item-value="id"
                v-model="carrera.nivel_tipo_id"
                label="Grado Académico"
                placeholder="Seleccionar grado académico"
                filled
              ></v-select>
            </v-col>
            <v-col cols="12" sm="7">
              <v-text-field
                v-model="carrera.denominacion"
                label="Denominación del título profesional"
                filled
              ></v-text-field>
            </v-col>
            <v-col cols="12" sm="7">
              <v-select
                :items="regimenesEstudio"
                item-text="regimen_estudio"
                item-value="id"
                v-model="carrera.ttec_regimen_estudio_tipo_id"
                label="Régimen de Estudio"
                placeholder="Seleccionar régimen de estudio"
                filled
                @change="cambiarLabelTiempo"
              ></v-select>
            </v-col>
            <v-col cols="12" sm="5">
              <v-text-field
                v-model="carrera.tiempo_estudio"
                :label="labelTiempo"
                placeholder="Ej. 1"
                filled
                type="number"
                min="1"
              ></v-text-field>
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
            <v-btn
              color="secondary"
              @click="dialogCarrera = false"
            >
              Cancelar
            </v-btn>
            <v-btn
              color="primary"
              @click="addCarrera"
              v-show="mode == 'Crear'"
            >
              Registrar
            </v-btn>
            <v-btn
              color="primary"
              @click="updateCarrera"
              v-show="mode == 'Editar'"
            >
              Actualizar
            </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-snackbar
      v-model="snack.state"
      :top="'top'"
      :right="'right'"
      :color="snack.color"
      :multi-line="snack.mode === 'multi-line'"
      :timeout="2500"
      :vertical="snack.mode === 'vertical'"
    >
      <v-icon v-if="snack.color == 'success'">mdi-check</v-icon>
      <v-icon v-if="snack.color == 'info'">mdi-information-outline</v-icon>
      <v-icon v-if="snack.color == 'warning'">mdi-alert-outline</v-icon>
      <v-icon v-if="snack.color == 'error'">mdi-information-outline</v-icon>
      {{ snack.text }}
    </v-snackbar>

    <v-dialog
      v-model="dialogLogo"
      max-width="500px"
    >
      <v-card>
        <v-card-text>
          <Logo :idUniversidad="universidad.id" :logo="universidad.logo" @recargarLogo="recargarLogo"/>
        </v-card-text>
      </v-card>
    </v-dialog>

  </div>
</template>
<script>
import Servicio from '../../services/general'
import axios from 'axios';
import RMCarrera from '../../components/universidades/RMCarrera';
import UnidadAcademica from '../../components/universidades/UnidadAcademica';
import Logo from '../../components/universidades/Logo';
export default {
  name: 'universidadGestion',
  components: {
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

      logo: '',
      rector: '',
      vicerector: ''
      
    },

    carrerasUniversidad: [],
    carreras: [],
    
    search: '',
    headers: [
      { text: 'Carrera o Especialidad Académica', sortable: false, value: 'nombre'},
      { text: 'Grado Académico', value: 'nivel'},
      { text: 'Duración', value: 'tiempo_estudio'},
      { text: 'Régimen de estudio', value: 'regimen_estudio'},
      { text: 'Denominación del título', value: 'denominacion'},
      { text: 'Acciones', value: 'acciones', sortable: false, align: 'end'}
    ],
    headers2: [
      { text: 'Unidad Académica', sortable: false, value: 'unidad_academica'},
      { text: 'Carrera o Especialidad Académica', sortable: false, value: 'nombre'},
      { text: 'Grado Académico', value: 'nivel'},
      { text: 'Duración', value: 'tiempo_estudio'},
      { text: 'Régimen de estudio', value: 'regimen_estudio'},
      { text: 'Denominación del título', value: 'denominacion'},
      { text: 'Acciones', value: 'acciones', sortable: false, align: 'end'}
    ],

    carrera: {
      denominacion_titulo_id: '',
      institucioneducativa_id: '',
      ttec_carrera_tipo_id: '',
      unidad_academica_id: '',
      denominacion: '',
      nivel_tipo_id: '',
      tiempo_estudio: '',
      ttec_regimen_estudio_tipo_id: ''
    },

    niveles: [],
    regimenesEstudio: [],
    labelTiempo: 'Tiempo de estudio',

    mode: '',

    dialogCarrera: false,
    dialogLogo: false,

    snack: {
      state: false,
      color: "success",
      mode: "",
      timeout: 3000,
      text: ""
    }
  }),
  mounted(){
    this.idUniversidad = this.$route.params.sie;
    this.carrera.institucioneducativa_id = this.$route.params.sie;
    this.getDatosUniversidad();
    this.getCarrerasUniversidad();
    this.getCarreras();
    this.getNiveles();
    this.getRegimenesEstudio();
  },
  methods: {
    openDialogCarrera(){
      this.mode = 'Crear';

      this.carrera.denominacion_titulo_id =  '';
      // this.carrera.institucioneducativa_id =  ''
      this.carrera.ttec_carrera_tipo_id =  '';
      this.carrera.unidad_academica_id =  '';
      this.carrera.denominacion =  '';
      this.carrera.nivel_tipo_id =  '';
      this.carrera.tiempo_estudio =  '';
      this.carrera.ttec_regimen_estudio_tipo_id = '';

      this.dialogCarrera = true;
    },
    openDialogLogo(){
      this.dialogLogo = true;
    },
    recargarLogo(valor){
      if (valor) {
        this.getLogo();
      }
    },
    getDatosUniversidad(){
      let idUniversidad = this.$route.params.sie;
      axios.get(Servicio.getServe() + `universidad/${idUniversidad}`).then(response => {
        if (response.data.status == 'success') {
          let univData = response.data.data;
          let datos = response.data.datos;
          let sede = response.data.dataSede.sede;

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

          if (sede == univData.id) {
            this.universidad.tipoSede = 'sede'
            this.universidad.iduniversidadSede = '';
          }else{
            this.universidad.tipoSede = 'subsede';
            this.universidad.iduniversidadSede = sede;
          }

          if(datos != null){
            this.universidad.telefonos = datos.telefonos;
            this.universidad.fax = datos.fax;
            this.universidad.email = datos.email;
            this.universidad.sitio_web = datos.sitio_web;
            this.universidad.decreto_supremo = datos.decreto_supremo;
            this.universidad.fecha_decreto_supremo = datos.fecha_decreto_supremo;

            this.universidad.logo = datos.imagen;

            this.universidad.rector = datos.rector;
            this.universidad.vicerector = datos.vicerector;
          }

          this.getLogo();

        }
      }).catch( () => {
        
      });
    },
    getLogo(){
      axios.get(Servicio.getServe()+`universidad/verRutaImg/${this.idUniversidad}`).then(response => {
        if (response.data.status == 'success') {
          this.universidad.logo = Servicio.getServe() + response.data.data;
        }
      });
    },
    getCarrerasUniversidad(){
      axios.get(Servicio.getServe() + `carreraUni/carreraUniversidad/${this.idUniversidad}`).then(response => {
        this.carrerasUniversidad = response.data.data;
      })
    },
    getCarreras(){
      axios.get(Servicio.getServe() + `carrera`).then(response => {
        console.log(response.data)
        this.carreras = response.data.data;
      })
    },
    getNiveles(){
      axios.get(Servicio.getServe() + `carreraUni/nivelTipo/list`).then(response => {
        console.log(response.data)
        this.niveles = response.data.data;
      })
    },
    getRegimenesEstudio(){
      axios.get(Servicio.getServe() + `carreraUni/regimenEstudio/list`).then(response => {
        console.log(response.data)
        this.regimenesEstudio = response.data.data;
      })
    },
    cambiarLabelTiempo(){
      if (this.carrera.ttec_regimen_estudio_tipo_id == 1) {
        this.labelTiempo = 'Tiempo de estudio (Años)';
      }else{
        this.labelTiempo = 'Tiempo de estudio (Semestres)'
      }
    },
    addCarrera(){
      console.log(this.carrera);
      axios.post(Servicio.getServe() + `carreraUni`, this.carrera).then(response => {
        this.getCarrerasUniversidad();
        this.dialogCarrera = false;
        console.log(response)
        this.toast("success", "Registro realizado correctamente");
      }).catch((e) => {
        if (e.response.status === 500) {
          this.toast("error", "Ocurrio un error al realizar el registro");
        }else{
          this.toast("error", e.response.data.msg);
        }
      })
    },
    editCarrera(item){
      this.carrera.denominacion_titulo_id = item.denominacion_titulo_id;
      this.carrera.institucioneducativa_id = item.institucioneducativa_id;
      this.carrera.ttec_carrera_tipo_id = item.carrera_id;
      this.carrera.unidad_academica_id = null;
      this.carrera.denominacion = item.denominacion;
      this.carrera.nivel_tipo_id = item.nivel_tipo_id;
      this.carrera.tiempo_estudio = item.tiempo_estudio;
      this.carrera.ttec_regimen_estudio_tipo_id = item.ttec_regimen_estudio_tipo_id;

      this.mode = 'Editar';
      this.dialogCarrera = true;
    },
    updateCarrera(){
      console.log(this.carrera)
      axios.put(Servicio.getServe() + `carreraUni/${this.carrera.denominacion_titulo_id}`, this.carrera).then(response => {
        this.getCarrerasUniversidad();
        this.dialogCarrera = false;
        console.log(response)
        this.toast("success", "Registro actualizado correctamente");
      }).catch((e) => {
        if (e.response.status === 500) {
          this.toast("error", "Ocurrio un error al actualizar el registro");
        }else{
          this.toast("error", e.response.data.msg);
        }
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
          axios.delete(Servicio.getServe() + 'carreraUni/'+id).then(response => {
            if (response.data.status == 'success') {
              this.getCarrerasUniversidad();
              this.toast("success", "Registro eliminado correctamente");
            }
          }).catch((e) => {
            if (e.response.status === 500) {
              this.toast("error", "Ocurrio un error al eliminar el registro");
            }else{
              this.toast("error", e.response.data.msg);
            }
          })
        }
      });
    },
    seleccionarUA(unidadAcademicaId){
      this.carrera.unidad_academica_id = unidadAcademicaId;
    },
    toast(mcolor, mtext) {
      this.snack.color = mcolor;
      this.snack.text = mtext;
      this.snack.state = true;
    },
  }
}
</script>
<style scope>
  .titulo {
    /* font-size: 1.2em; */
    color: rgba(9, 1, 46, 0.481);
  }
  h5 {
    font-size: 1.1em;
    min-height: 30px;
    color: rgba(9, 1, 46, 0.781);
  }
  .logo-universidad{
    min-width: 60px;
    min-height: 60px;
    max-width: 60px;
    max-height: 60px;
    margin-right: 20px;
    cursor: pointer;
    background-repeat: no-repeat;
    background-size: contain;
    background-size: cover;
  }
  .fondo {
    background-color: #EEEEEE;
  }
  .tipoSede{
    color: #CCCCCC;
    font-weight: bold;
    padding: 2px 10px;
    background: #EEEEEE;
    border-radius: 10px;
    font-size: 15px;
  }
</style>