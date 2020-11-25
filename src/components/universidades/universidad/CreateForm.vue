<template>
  <div>
    <v-btn color="primary" @click="showDialog">
      <slot></slot>
    </v-btn>
    <v-dialog
      v-model="cDialog"
      max-width="900px"
    >
        <v-card>
          <v-form
            ref="formUniversidad"
          >
            <v-card-title>
              <slot></slot>
            </v-card-title>
            <v-card-text>
              <h4>1.- Datos Generales</h4>
              <v-row>
                <v-col cols="12" sm="6">
                  <v-text-field
                    v-model="universidad.institucioneducativa" 
                    :value="nombreUniversidad"
                    label="Universidad" 
                    placeholder="Nombre de la Universidad" 
                    filled 
                    dense
                    :rules="[v => !!v || 'El nombre es requerido']"
                    :disabled="tipo == 'sede' ? false: true"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" sm="6">
                  <v-text-field
                    v-model="universidad.nombre_sede_subsede" 
                    :label="tipo == 'sede' ? 'SEDE': 'SUBSEDE'" 
                    :placeholder="tipo == 'sede' ? 'Nombre SEDE': 'Nombre SUBSEDE'" 
                    filled 
                    dense
                    :rules="[v => !!v || 'El dato es requerido']"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" sm="4">
                   <v-select
                    v-model="universidad.dependencia_tipo_id"
                    :items="dependencias"
                    item-text="dependencia"
                    item-value="id"
                    label="Tipo"
                    placeholder="Seleccionar..."
                    filled
                    dense
                    :rules="[v => !!v || 'La dependencia es requerida']"
                  ></v-select>
                </v-col>
                <v-col cols="12" sm="4">
                 <v-select
                    v-model="universidad.estadoinstitucion_tipo_id"
                    :items="estados"
                    item-text="estadoinstitucion"
                    item-value="id"
                    label="Estado"
                    placeholder="Seleccionar..."
                    filled
                    dense
                    :rules="[v => !!v || 'El estado es requerido']"
                  ></v-select>
                </v-col>
                <v-col cols="12" sm="4">
                  <v-text-field v-model="universidad.telefonos" label="Teléfono" placeholder="" filled dense prepend-icon="mdi-cellphone-android"></v-text-field>
                </v-col>
                <v-col cols="12" sm="4">
                  <v-text-field v-model="universidad.fax" label="Fax" placeholder="" filled dense prepend-icon="mdi-fax"></v-text-field>
                </v-col>
                <v-col cols="12" sm="4">
                  <v-text-field v-model="universidad.email" label="Correo electrónico" placeholder="" filled dense prepend-icon="mdi-email"></v-text-field>
                </v-col>
                <v-col cols="12" sm="4">
                  <v-text-field v-model="universidad.sitio_web" label="Sitio Web" placeholder="" filled dense prepend-icon="mdi-web"></v-text-field>
                </v-col>
                <v-col cols="12" sm="4" v-if="tipo == 'sede'">
                  <v-text-field
                    v-model="universidad.rector"
                    label="Rector"
                    placeholder="Nombre completo"
                    filled
                    v-if="universidad.tipoSede == 'sede'"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" sm="4">
                  <v-text-field
                    v-model="universidad.vicerector"
                    label="Vice Rector"
                    placeholder="Nombre completo"
                    filled
                  ></v-text-field>
                </v-col>
                <v-col cols="12" sm="4">
                   <v-menu
                    v-model="menu1"
                    :close-on-content-click="false"
                    :nudge-right="40"
                    transition="scale-transition"
                    offset-y
                    min-width="290px"
                  >
                    <template v-slot:activator="{ on, attrs }">
                      <v-text-field
                        v-model="universidad.fecha_creacion"
                        label="Fecha de Creación"
                        prepend-icon="mdi-calendar"
                        placeholder="dd/mm/aaaa"
                        readonly
                        v-bind="attrs"
                        v-on="on"
                        filled
                        :rules="[v => !!v || 'La fecha de creación es requerida']"
                      ></v-text-field>
                    </template>
                    <v-date-picker v-model="universidad.fecha_creacion" @input="menu1 = false"></v-date-picker>
                  </v-menu>
                </v-col>
              </v-row>
              <h4>2.- Datos Legales</h4>
              <v-row>
                <v-col cols="12" sm="4" v-if="tipo == 'sede'">
                  <v-text-field v-model="universidad.decreto_supremo" label="Decreto Supremo" placeholder="Nro. del decreto" filled dense></v-text-field>
                </v-col>
                <v-col cols="12" sm="4" v-if="tipo == 'sede'">
                  <v-menu
                    v-model="menu2"
                    :close-on-content-click="false"
                    :nudge-right="40"
                    transition="scale-transition"
                    offset-y
                    min-width="290px"
                  >
                    <template v-slot:activator="{ on, attrs }">
                      <v-text-field
                        v-model="universidad.fecha_decreto_supremo"
                        label="Fecha Decreto Supremo"
                        prepend-icon="mdi-calendar"
                        placeholder="dd/mm/aaaa"
                        readonly
                        v-bind="attrs"
                        v-on="on"
                        filled
                      ></v-text-field>
                    </template>
                    <v-date-picker v-model="universidad.fecha_decreto_supremo" @input="menu2 = false"></v-date-picker>
                  </v-menu>
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="12" sm="4">
                  <v-text-field v-model="universidad.nro_resolucion" label="Resolución Ministerial" placeholder="Nro. de Resolución Ministerial" filled dense></v-text-field>
                </v-col>
                <v-col cols="12" sm="4">
                  <v-menu
                    v-model="menu3"
                    :close-on-content-click="false"
                    :nudge-right="40"
                    transition="scale-transition"
                    offset-y
                    min-width="290px"
                  >
                    <template v-slot:activator="{ on, attrs }">
                      <v-text-field
                        v-model="universidad.fecha_resolucion"
                        label="Fecha Resolución Ministerial"
                        prepend-icon="mdi-calendar"
                        placeholder="dd/mm/aaaa"
                        readonly
                        v-bind="attrs"
                        v-on="on"
                        filled
                      ></v-text-field>
                    </template>
                    <v-date-picker v-model="universidad.fecha_resolucion" @input="menu3 = false"></v-date-picker>
                  </v-menu>
                </v-col>
                <v-col cols="12" sm="4">
                  <!-- Adjuntar archivo -->
                </v-col>
              </v-row>
              <h4>3.- Localización del Edificio Educativo</h4>
              <v-row>
                <v-col cols="12" sm="6">
                  <v-select
                    v-model="universidad.iddepartamento"
                    :items="departamentos"
                    item-text="lugar"
                    item-value="id"
                    label="Departamento"
                    placeholder="Seleccionar..."
                    filled
                    @change="listarProvinciasDistritos()"
                    dense
                    :rules="[v => !!v || 'El departamento es requerido']"
                  ></v-select>
                </v-col>
                <v-col cols="12" sm="6">
                  <v-select
                    v-model="universidad.idprovincia"
                    :items="provincias"
                    item-text="lugar"
                    item-value="id"
                    label="Provincia"
                    placeholder="Selecccionar..."
                    filled
                    dense
                    @change="getSecciones()"
                    :rules="[v => !!v || 'La provincia es requerida']"
                  ></v-select>
                </v-col>
                <v-col cols="12" sm="6">
                  <v-select
                    v-model="universidad.idseccion"
                    :items="secciones"
                    item-text="lugar"
                    item-value="id"
                    label="Sección"
                    placeholder="Seleccionar..."
                    filled
                    dense
                    :rules="[v => !!v || 'La sección es requerida']"
                  ></v-select>
                </v-col>
                <v-col class="d-flex" cols="12" sm="6">
                  <v-select
                    v-model="universidad.iddistrito"
                    :items="distritos"
                    item-text="distrito"
                    item-value="id"
                    label="Distrito"
                    placeholder="Seleccionar..."
                    filled
                    @change="getProvincias()"
                    dense
                    :rules="[v => !!v || 'El distrito es requerido']"
                  ></v-select>
                </v-col>
                <v-col class="d-flex" cols="12" sm="6">
                  <v-text-field v-model="universidad.zona" label="Zona" placeholder="Ingrese la Zona" filled dense></v-text-field>
                </v-col>
                <v-col class="d-flex" cols="12" sm="6">
                  <v-text-field v-model="universidad.direccion" label="Dirección" placeholder="Ingrese la dirección" filled dense></v-text-field>
                </v-col>
              </v-row>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="secondary" @click="cDialog = false">
                Cancelar
              </v-btn>
              <v-btn color="primary" @click="create" v-if="mode == 'Crear'">
                <v-icon small class="mr-1">mdi-content-save</v-icon> Registrar
              </v-btn>
            </v-card-actions>
          </v-form>
        </v-card>
    </v-dialog>
  </div>
</template>
<script>
  import UniversidadesService from '@/services/universidadesService'
import { mapMutations } from 'vuex';
  export default {
    name: 'universidad-create-form',
    props: {
      idUniversidadSede: {
        type: Number,
        default: 0
      },
      nombreUniversidad: {
        type: String,
        default:''
      },
      tipo: {
        type: String,
        default: 'sede'
      },
    },
    data: () => ({
      cDialog: false,
      mode: 'Crear',
      universidad: {
        id: '',
        iddepartamento: '',
        idprovincia: '',
        idseccion: '',
        iddistrito: '',
        zona: '',
        direccion: '',

        estadoinstitucion_tipo_id: '',
        dependencia_tipo_id: '',
        institucioneducativa_tipo_id: 1,
        institucioneducativa: '',
        nombre_sede_subsede: '',
        fecha_resolucion: '2020-05-02',
        nro_resolucion: '004/2020',
        fecha_creacion: '',
        
        telefonos: '',
        fax: '',
        email: '',
        sitio_web: '',
        decreto_supremo: '',
        fecha_decreto_supremo: '',
        tipoSede: 'sede',
        iduniversidadSede: '',
        observacion: '',
        rector: '',
        vicerector: ''
      },
      departamentos: [],
      provincias: [],
      secciones: [],
      distritos: [],
      estados: [],
      dependencias: [],
      menu1: false,
      menu2: false,
      menu3: false,
    }),
    methods: {
      ...mapMutations(['uniAlert']),
      showDialog(){
        this.cDialog = true;
        this.mode = 'Crear';
        this.universidad = {
          id: '',
          iddepartamento: '',
          idprovincia: '',
          idseccion: '',
          iddistrito: '',
          zona: '',
          direccion: '',

          estadoinstitucion_tipo_id: '',
          dependencia_tipo_id: '',
          institucioneducativa: '',
          nombre_sede_subsede: '',
          fecha_resolucion: '',
          nro_resolucion: '',
          fecha_creacion: '',

          telefonos: '',
          fax: '',
          email: '',
          sitio_web: '',
          decreto_supremo: '',
          fecha_decreto_supremo: '',
          tipoSede: 'sede',
          iduniversidadSede: '',
          observacion: '',
          rector: '',
          vicerector: ''
        }
      
        this.getDepartamentos();
        this.getEstados();
        this.getDependencias();
        this.universidad.institucioneducativa = this.nombreUniversidad
        if (this.tipo == 'subsede') {
          this.universidad.iduniversidadSede = this.idUniversidadSede
        }
        // this.$refs.formUniversidad.resetValidate()
      },
      async getDepartamentos(){
        try {
          let response = await UniversidadesService.getDepartamentos()
          this.departamentos = response.data.data
        } catch (error) {
          console.log(error)
        }
      },
      listarProvinciasDistritos(){
        this.getProvincias();
        this.getDistritos();
        this.universidad.idprovincia = ''
        this.universidad.idseccion = ''
        this.universidad.iddistrito = ''
      },
      async getProvincias(){
        try {
          let response = await UniversidadesService.getProvincias(this.universidad.iddepartamento)
          this.provincias = response.data.data
        } catch (error) {
          console.log(error)
        }
      },
      async getSecciones(){
        try {
          let response = await UniversidadesService.getSecciones(this.universidad.idprovincia)
          this.secciones = response.data.data
        } catch (error) {
          console.log(error)
        }
      },
      async getDistritos(){
        try {
          let response = await UniversidadesService.getDistritos(this.universidad.iddepartamento)
          this.distritos = response.data.data
        } catch (error) {
          console.log(error)
        }
      },
      async getEstados(){
        try {
          let response = await UniversidadesService.getEstados()
          this.estados = response.data.data
        } catch (error) {
          console.log(error)
        }
      },
      async getDependencias(){
        try {
          let response = await UniversidadesService.getDependencias()
          this.dependencias = response.data.data
        } catch (error) {
          console.log(error)
        }
      },
      async create(){
        try {
          if(this.$refs.formUniversidad.validate()){
            let response = await UniversidadesService.createUniversidad(this.universidad)
            if (response.data.status == 'success') {
              this.uniAlert({color: 'success', text: 'Registro realizado correctamente'})
              // this.$parent.obtenerUniversidades()
              this.$emit('actualizar')
              this.cDialog = false
            }
          }
        } catch (error) {
          console.log(error)
        }
      },
    }
  }
</script>