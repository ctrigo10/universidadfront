<template>
  <div>
    <v-breadcrumbs :items="breadcrumbs">
      <template v-slot:divider>
        <v-icon>mdi-forward</v-icon>
      </template>
    </v-breadcrumbs>
    <v-card class="tarjeta" elevation="7">
      <v-card-title primary-title>
        Universidades
        <v-spacer></v-spacer>
        <v-text-field
          v-model="search"
          append-icon="mdi-magnify"
          label="Buscar"
          single-line
          hide-details
          color="primary"
        ></v-text-field>
        <v-spacer></v-spacer>
        <v-btn color="primary" dark @click="showDialog()">Nueva Universidad</v-btn>
      </v-card-title>
      <v-card-text>
        <v-data-table
          :headers="headers"
          :items="universidades"
          :search="search"
        >
          <template v-slot:[`item.dependencia`]="{ item }">
            <v-chip
              class="ma-2"
              :color="getColor(item.dependencia)"
              outlined
            >
              {{ item.dependencia }}
            </v-chip>
          </template>
          <template v-slot:[`item.acciones`]="{ item }">
            
            <RMUniversidad
              :idUniversidad="item.id" 
              :universidad="item.institucioneducativa"
            />
            
            <v-tooltip top>
              <template v-slot:activator="{ on, attrs }">
                <v-btn class="btn-accion" @click="edit(item.id)" v-bind="attrs" v-on="on">
                  <v-icon>mdi-square-edit-outline</v-icon>
                </v-btn>
              </template>
              <span>Editar</span>
            </v-tooltip>
            <v-tooltip top>
              <template v-slot:activator="{ on, attrs }">
                <v-btn class="btn-accion" @click="ver(item.id)" v-bind="attrs" v-on="on">
                  <v-icon>mdi-eye</v-icon>
                </v-btn>
              </template>
              <span>Ver detalles</span>
            </v-tooltip>
          </template>
        </v-data-table>
      </v-card-text>

      <v-dialog
        v-model="cDialog"
        :width="paso == 1 || paso == 3 ? 600 : 1000"
        persistent
      >
        
        <v-card v-show="paso == 1">
          <v-form
            ref="form1"
            v-model="validForm1"
          >
            <v-card-title>
              Edificio Educativo
            </v-card-title>
            <v-card-text>
              <v-row no-gutters>
                <v-col class="d-flex" cols="12" sm="12" v-if="mode == 'Crear'">
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
                <v-col class="d-flex" cols="12" sm="12" v-if="mode == 'Crear'">
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
                <v-col class="d-flex" cols="12" sm="12" v-if="mode == 'Crear'">
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
                <v-col class="d-flex" cols="12" sm="12" v-if="mode == 'Crear'">
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
                <v-col class="d-flex" cols="12" sm="12">
                  <v-text-field v-model="universidad.zona" label="Zona" placeholder="Ingrese la Zona" filled dense></v-text-field>
                </v-col>
                <v-col class="d-flex" cols="12" sm="12">
                  <v-text-field v-model="universidad.direccion" label="Dirección" placeholder="Ingrese la dirección" filled dense></v-text-field>
                </v-col>
                
              </v-row>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="secondary" @click="cDialog = false">
                Cancelar
              </v-btn>
              <v-btn color="primary" @click="validarFormulario1">
                Siguiente
              </v-btn>
            </v-card-actions>
          </v-form>
        </v-card>
        <v-card v-show="paso == 2">
          <v-form
            ref="form2"
            v-model="validForm2"
          >
            <v-card-title>
              Datos de la Universidad
            </v-card-title>
            <v-card-text>
              <v-row no-gutters>
                <v-col cols="12" sm="12">
                  <v-radio-group
                    v-model="universidad.tipoSede" 
                    :mandatory="false" 
                    row
                    :rules="[v => !!v || 'El tipo es requerido']"
                    @change="cambiarTipoSede"
                  >
                    <v-radio label="Sede" value="sede"></v-radio>
                    <v-radio label="Sub Sede" value="subsede"></v-radio>
                  </v-radio-group>
                  <v-select
                    v-model="universidad.iduniversidadSede"
                    :items="sedes"
                    item-text="institucioneducativa"
                    item-value="institucioneducativa_id"
                    label="Sede"
                    placeholder="Seleccionar la sede a la que pertenece..."
                    filled
                    dense
                    v-if="universidad.tipoSede == 'subsede'"
                  ></v-select>
                </v-col>
                <v-col cols="12" sm="12">
                  <v-text-field
                    v-model="universidad.institucioneducativa" 
                    label="Nombre" 
                    placeholder="Nombre de la Universidad" 
                    filled 
                    dense
                    :rules="[v => !!v || 'El nombre es requerido']"
                  ></v-text-field>
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="12" sm="6">
                  <h4>Contacto</h4>
                  <v-text-field v-model="universidad.telefonos" label="Teléfono" placeholder="" filled dense prepend-icon="mdi-cellphone-android"></v-text-field>
                  <v-text-field v-model="universidad.fax" label="Fax" placeholder="" filled dense prepend-icon="mdi-fax"></v-text-field>
                  <v-text-field v-model="universidad.sitio_web" label="Sitio Web" placeholder="" filled dense prepend-icon="mdi-web"></v-text-field>
                  <v-text-field v-model="universidad.email" label="Email" placeholder="" filled dense prepend-icon="mdi-email"></v-text-field>
                </v-col>
                <v-col cols="12" sm="6">
                  <br>
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

                  <v-text-field
                    v-model="universidad.rector"
                    label="Rector"
                    placeholder="Nombre completo"
                    filled
                    v-if="universidad.tipoSede == 'sede'"
                  ></v-text-field>
                  <v-text-field
                    v-model="universidad.vicerector"
                    label="Vice Rector"
                    placeholder="Nombre completo"
                    filled
                  ></v-text-field>


                  <v-menu
                    v-model="menu2"
                    :close-on-content-click="false"
                    :nudge-right="40"
                    transition="scale-transition"
                    offset-y
                    min-width="290px"
                    v-if="universidad.tipoSede == 'subsede'"
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
                    <v-date-picker v-model="universidad.fecha_creacion" @input="menu2 = false"></v-date-picker>
                  </v-menu>
                </v-col>
              </v-row>
              <v-row v-if="universidad.tipoSede == 'sede'">
                <v-col cols="12" sm="4" >
                  <v-text-field v-model="universidad.decreto_supremo" label="Decreto Supremo" placeholder="Nro. del decreto" filled dense></v-text-field>
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
                    <v-date-picker v-model="universidad.fecha_decreto_supremo" @input="menu1 = false"></v-date-picker>
                  </v-menu>
                </v-col>
                <v-col cols="12" sm="4">
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
                    <v-date-picker v-model="universidad.fecha_creacion" @input="menu2 = false"></v-date-picker>
                  </v-menu>
                </v-col>
              </v-row>
            </v-card-text>
            <v-card-actions>
              <v-btn color="primary" @click="paso--">
                Atras
              </v-btn>
              <v-spacer></v-spacer>
              <v-btn color="secondary" @click="cDialog = false">
                Cancelar
              </v-btn>
              <v-btn color="primary" @click="create" v-if="mode == 'Crear'">
                Registrar
              </v-btn>
              <v-btn color="primary" @click="update" v-if="mode == 'Editar'">
                Actualizar
              </v-btn>
            </v-card-actions>
          </v-form>
        </v-card>
          <v-card v-show="paso == 3">
            <v-card-title>
              Resolución Ministerial
            </v-card-title>
            <v-card-text>
              <v-row>
                <v-col cols="12" sm=6>
                  <v-text-field
                    label="Nro. de Resolución"
                    placeholder="Ingrese el número de Resolución" 
                    v-model="resolucion.nro_resolucion"
                    filled>
                  </v-text-field>
                  <v-text-field
                    label="Fecha de Resolución"
                    placeholder="Ingrese el Fecha de Resolución" 
                    v-model="resolucion.fecha_resolucion"
                    filled>
                  </v-text-field>
                </v-col>
                <v-col cols="12" sm=6>
                  <v-textarea
                    label="Descripción"
                    placeholder="Ingrese descripción de la Resolución" 
                    v-model="resolucion.descripcion"
                    filled>
                  </v-textarea>
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="12" sm=12>
                  <v-file-input
                    label="Archivo R.M."
                    filled
                    prepend-icon="mdi-file"
                  ></v-file-input>
                </v-col>
              </v-row>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="primary" text @click="create">
                Registrar
              </v-btn>
              <v-btn color="red" text @click="cDialog = false">
                Omitir
              </v-btn>
            </v-card-actions>
          </v-card>
        
      </v-dialog>
    </v-card>

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
  </div>
</template>
<script>
  import Servicio from '../../services/general'
  import RMUniversidad from '../../components/universidades/RMUniversidad'
  import axios from 'axios';

  export default {
    name: 'Universidades',
    components: {
      RMUniversidad
    },
    data: () => ({
      breadcrumbs: [
        {
          text: 'Dashboard',
          disabled: false,
          href: '/universidades/dashboard',
        },
        {
          text: 'Universidades',
          disabled: true,
          href: 'universidades',
        },
      ],
      headers: [
        { text: 'Sie', sortable: false, value: 'id'},
        { text: 'Universidad', value: 'institucioneducativa'},
        { text: 'Nro. resolución', value: 'nro_resolucion'},
        { text: 'Dependencia', value: 'dependencia'},
        // { text: 'Sitio web', value: 'sitioWeb'},
        // { text: 'Teléfono', value: 'telefono'},
        { text: 'Departamento', value: 'departamento'},
        { text: 'Acciones', value: 'acciones', sortable: false, align: 'end'}
      ],
      universidades: [],
      search: '',
      cDialog: false,
      mode: '',
      paso: 1,
      validForm1: true,
      validForm2: true,
      validForm3: true,
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
        // fecha_resolucion: '2020-05-02',
        // nro_resolucion: '004/2020',
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
      resolucion: {
        id: '',
        iduniversidad: '',
        nro_resolucion: '',
        fecha_resolucion: '',
        descripcion: '',
        file: ''
      },
      departamentos: [],
      provincias: [],
      secciones: [],
      distritos: [],
      estados: [],
      dependencias: [],
      sedes: [],
      menu1: false,
      menu2: false,
      snack: {
        state: false,
        color: "success",
        mode: "",
        timeout: 3000,
        text: ""
      }
    }),
    mounted(){
      this.getList();
    },
    computed: {
      
    },
    methods: {
      getColor(id){
        switch(id){
          case 'Indigena': return '#9fb441';
          case 'Privada': return 'purple'; 
          case 'Regimen Especial': return 'blue';
          default: return 'secondary';
        }
      },
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
        this.getSedes();
        this.paso = 1;
        this.$refs.form1.reset()
      },
      getList(){
        axios.get(Servicio.getServe() + 'universidad').then(response => {
          console.log(response);
          this.universidades = response.data.data;
        })
      },
      getDepartamentos(){
        if (this.departamentos.length == 0) {
          axios.get(Servicio.getServe() + 'universidad/departamentos/list').then(response => {
            console.log(response);
            this.departamentos = response.data.data;
          }).catch(() => {
  
          }).finally(() => {
  
          });
        }
      },
      listarProvinciasDistritos(){
        this.getProvincias();
        this.getDistritos();
      },
      getDistritos(){
        if (this.universidad.departamento != '') {
          axios.get(Servicio.getServe() + `universidad/distritos/${this.universidad.iddepartamento}`).then(response => {
            console.log(response);
            this.distritos = response.data.data;
          }).catch(() => {
  
          }).finally(() => {
  
          });
        }
      },
      getProvincias(){
        if (this.universidad.departamento != '') {
          axios.get(Servicio.getServe() + `universidad/provincias/${this.universidad.iddepartamento}`).then(response => {
            console.log(response);
            this.provincias = response.data.data;
          }).catch(() => {
  
          }).finally(() => {
  
          });
        }
      },
      getSecciones(){
        if (this.universidad.provincia != '') {
          axios.get(Servicio.getServe() + `universidad/secciones/${this.universidad.idprovincia}`).then(response => {
            console.log(response);
            this.secciones = response.data.data;
          }).catch(() => {
  
          }).finally(() => {
  
          });
        }
      },
      getEstados(){
        axios.get(Servicio.getServe() + 'universidad/estados/list').then(response => {
          console.log(response);
          this.estados = response.data.data;
        }).catch(() => {

        }).finally(() => {

        });
      },
      getDependencias(){
        axios.get(Servicio.getServe() + 'universidad/dependencias/list').then(response => {
          console.log(response);
          this.dependencias = response.data.data;
        }).catch(() => {

        }).finally(() => {

        });
      },
      getSedes(){
        axios.get(Servicio.getServe() + 'universidad/sedes/list').then(response => {
          this.sedes = response.data.data;
        })
      },
      cambiarTipoSede(){
        if (this.universidad.tipoSede == 'sede') {
          // this.universidad.vicerector = '';
        }else{
          this.universidad.rector = '';
          this.universidad.decreto_supremo = '';
          this.universidad.fecha_decreto_supremo = '';
        }
      },
      validarFormulario1(){
        if(this.$refs.form1.validate()){
          this.paso = 2;
        }
      },
      create(){
        if(this.$refs.form2.validate()){
          axios.post(Servicio.getServe() + 'universidad', this.universidad).then(response => {
            if (response.data.status == 'success') {
              this.getList();
              this.cDialog = false;
              this.toast("success", "Registro realizado correctamente");
            }
          }).catch( () => {
            this.toast("error", "Ocurrio un error al realizar el registro");
          }).finally( () => {
            
          })
        }
      },
      async edit(id){
        this.mode = 'Editar';
        this.getEstados();
        this.getDependencias();
        this.getSedes();
        this.paso = 1;

        await axios.get(Servicio.getServe() + `universidad/${id}`).then(response => {
          if (response.data.status == 'success') {

            let univData = response.data.data;
            let datos = response.data.datos;
            let sede = response.data.dataSede.sede;

            // console.log(univData)
            // console.log(datos)

            this.universidad.id = univData.id;
            this.universidad.iddepartamento = '';
            this.universidad.idprovincia = '';
            this.universidad.idseccion = '';
            this.universidad.iddistrito = '';
            this.universidad.zona = univData.jurisdiccion_geografica.zona;
            this.universidad.direccion = univData.jurisdiccion_geografica.direccion;

            this.universidad.estadoinstitucion_tipo_id = univData.estadoinstitucion_tipo_id;
            this.universidad.dependencia_tipo_id = univData.dependencia_tipo_id;
            this.universidad.institucioneducativa = univData.institucioneducativa;
            this.universidad.fecha_resolucion = '2020-05-02';
            this.universidad.nro_resolucion = '123/2020';
            this.universidad.fecha_creacion = univData.fecha_creacion;

            this.universidad.telefonos = datos.telefonos;
            this.universidad.fax = datos.fax;
            this.universidad.email = datos.email;
            this.universidad.sitio_web = datos.sitio_web;
            this.universidad.decreto_supremo = datos.decreto_supremo;
            this.universidad.fecha_decreto_supremo = datos.fecha_decreto_supremo;

            if (sede == univData.id) {
              this.universidad.tipoSede = 'sede'
              this.universidad.iduniversidadSede = '';
            }else{
              this.universidad.tipoSede = 'subsede';
              this.universidad.iduniversidadSede = sede;
            }

            this.universidad.rector = datos.rector;
            this.universidad.vicerector = datos.vicerector;

            this.cDialog = true;
          }
          
        }).catch( () => {
          
        }).finally( () => {
          this.cDialog = true;
        })
      },
      update(){
        if(this.$refs.form2.validate()){
          
          axios.put(Servicio.getServe() + `universidad/${this.universidad.id}`, this.universidad).then(response => {
            if (response.data.status == 'success') {
              this.getList();
              this.cDialog = false;
              this.toast("success", "Registro actualizado correctamente");
            }
          }).catch( () => {
            this.toast("error", "Ocurrio un error al realizar la actualización");
          });
        }
      },
      // funcion para ir al detalle de la universidad
      ver(sie){
        this.$router.push(`/universidades/gestion/${sie}`);
        // router.push({ path: `/user/${userId}` }) // -> /user/123
      },
      toast(mcolor, mtext) {
        this.snack.color = mcolor;
        this.snack.text = mtext;
        this.snack.state = true;
      },
    }
  }
</script>