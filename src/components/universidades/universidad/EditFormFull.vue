<template>
  <div>
    <v-btn color="primary" @click="showDialog"> <v-icon small class="mr-2">mdi-pencil</v-icon> Editar </v-btn>
    <v-dialog
      v-model="cDialog"
      max-width="900px"
    >
        <v-card>
          <v-form
            ref="formUniversidad"
          >
            <v-card-title>
              Editar Universidad
            </v-card-title>
            <v-card-text>
              <v-alert
                icon="mdi-shield-lock-outline"
                text
                type="info"
                v-if="verificarPermiso('universidad')"
              >
                La modificación de datos es restringida
              </v-alert>
              <h4>1.- Datos Generales</h4>
              <v-row>
                <v-col cols="12" sm="6">
                  <v-text-field
                    :value="datosUniversidad.institucioneducativa" 
                    label="Universidad" 
                    placeholder="Nombre de la Universidad" 
                    filled 
                    dense
                    disabled
                  ></v-text-field>
                </v-col>
                <v-col cols="12" sm="6">
                  <v-text-field
                    v-model="universidad.nombre_sede_subsede" 
                    label="SEDE" 
                    placeholder="Nombre SEDE" 
                    filled 
                    dense
                    :disabled="verificarPermiso('universidad')"
                    :rules="[v => !!v || 'El nombre es requerido']"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" sm="4" v-if="verificarPermiso('tecnico')">
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
                <v-col cols="12" sm="4" v-if="verificarPermiso('tecnico')">
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
                <v-col cols="12" sm="4" v-if="datosUniversidad.id == datosUniversidad.sede">
                  <v-text-field
                    v-model="universidad.rector"
                    label="Rector"
                    placeholder="Nombre completo"
                    filled
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
                <v-col cols="12" sm="4" v-if="verificarPermiso('tecnico')">
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
              <h4 v-if="verificarPermiso('tecnico')">2.- Datos Legales</h4>
              <v-row v-if="verificarPermiso('tecnico')">
                <v-col cols="12" sm="4" v-if="datosUniversidad.id == datosUniversidad.sede">
                  <v-text-field v-model="universidad.decreto_supremo" label="Decreto Supremo" placeholder="Nro. del decreto" filled dense></v-text-field>
                </v-col>
                <v-col cols="12" sm="4" v-if="datosUniversidad.id == datosUniversidad.sede">
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
              <v-row v-if="verificarPermiso('tecnico')">
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
                <v-col cols="12" sm="6" v-if="verificarPermiso('tecnico')">
                  <v-text-field
                    :value="datosUniversidad.deparmento"
                    label="Departamento"
                    filled
                    disabled
                  ></v-text-field>
                </v-col>
                <v-col cols="12" sm="6" v-if="verificarPermiso('tecnico')">
                  <v-text-field
                    :value="datosUniversidad.provincia"
                    label="Provincia"
                    filled
                    disabled
                  ></v-text-field>
                </v-col>
                <v-col cols="12" sm="6" v-if="verificarPermiso('tecnico')">
                  <v-text-field
                    :value="datosUniversidad.seccion"
                    label="Sección"
                    filled
                    disabled
                  ></v-text-field>
                </v-col>
                <v-col cols="12" sm="6" v-if="verificarPermiso('tecnico')">
                  <v-text-field
                    :value="datosUniversidad.distrito ? datosUniversidad.distrito.dist : ''"
                    label="Distrito"
                    filled
                    disabled
                  ></v-text-field>
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
              <v-btn color="primary" @click="update">
                <v-icon small class="mr-2">mdi-content-save</v-icon> Actualizar
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
    name: 'universidad-edit-form',
    props: ['datosUniversidad'],
    data: () => ({
      cDialog: false,
      mode: 'Editar',
      universidad: {
        id: '',
        // iddepartamento: '',
        // idprovincia: '',
        // idseccion: '',
        // iddistrito: '',
        zona: '',
        direccion: '',

        estadoinstitucion_tipo_id: '',
        dependencia_tipo_id: '',
        // institucioneducativa_tipo_id: 3,
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
        tipoSede: '',
        // iduniversidadSede: '',
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
      ...mapMutations(['uniAlert', 'uniVerificarPermiso']),
      verificarPermiso(rol) {
        return UniversidadesService.verificarPermisoRol(rol)
      },
      showDialog(){
        this.mode = 'Editar';
        this.universidad = {
          id: this.datosUniversidad.id,
          zona: this.datosUniversidad.zona,
          direccion: this.datosUniversidad.direccion,
          estadoinstitucion_tipo_id: this.datosUniversidad.estadoinstitucion_id,
          dependencia_tipo_id: this.datosUniversidad.dependencia_id,
          // institucioneducativa: this.datosUniversidad.institucioneducativa,
          nombre_sede_subsede: this.datosUniversidad.nombre_sede_subsede,
          fecha_resolucion: this.datosUniversidad.fecha_creacion,
          nro_resolucion: this.datosUniversidad.nro_resolucion,
          fecha_creacion: this.datosUniversidad.fecha_creacion,
          telefonos: this.datosUniversidad.telefonos,
          fax: this.datosUniversidad.fax,
          email: this.datosUniversidad.email,
          sitio_web: this.datosUniversidad.sitio_web,
          decreto_supremo: this.datosUniversidad.decreto_supremo,
          fecha_decreto_supremo: this.datosUniversidad.fecha_decreto_supremo,
          rector: this.datosUniversidad.rector,
          vicerector: this.datosUniversidad.vicerector
        }
      
        this.getEstados();
        this.getDependencias();
        this.cDialog = true;
        // this.$refs.formUniversidad.resetValidate()
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
      async update(){
        try {
          if(this.$refs.formUniversidad.validate()){
            let response = await UniversidadesService.updateUniversidad(this.universidad.id, this.universidad)
            if (response.data.status == 'success') {
              this.uniAlert({color: 'success', text: 'Registro actualizado correctamente'})
              this.$emit('actualizar') // actualizar lso datos del componente Datos generales
              this.cDialog = false
              return
            }else{
              this.uniAlert({color: 'error', text: 'Ocurrio un error al actualizar el registro'})
            }
          }
        } catch (error) {
          console.log(error)
          this.uniAlert({color: 'error', text: 'Ocurrio un error al actualizar el registro'})
        }
      },
    }
  }
</script>