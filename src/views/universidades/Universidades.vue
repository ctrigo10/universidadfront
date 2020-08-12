<template>
  <v-card class="tarjeta">
    <v-card-title primary-title>
      Universidades
      <v-spacer></v-spacer>
      <v-text-field
        v-model="search"
        append-icon="mdi-magnify"
        label="Buscar"
        single-line
        hide-details
        color="purple accent-4"
      ></v-text-field>
      <v-spacer></v-spacer>
      <v-btn color="purple accent-4" dark @click="showDialog()">Nueva Universidad</v-btn>
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
            :color="getColor(item.dependencia_tipo.id)"
            outlined
          >
            {{ item.dependencia_tipo.dependencia }}
          </v-chip>
        </template>
        <template v-slot:[`item.acciones`]="{ item }">
          <v-btn class="btn-accion" @click="edit(item)">
            <v-icon>mdi-square-edit-outline</v-icon>
          </v-btn>
          <v-btn class="btn-accion" @click="deleted(item.id)">
            <v-icon>mdi-delete</v-icon>
          </v-btn>
        </template>
      </v-data-table>
    </v-card-text>

    <v-dialog
      v-model="cDialog"
      :width="paso == 1 ? 600 : 1000"
      persistent
    >
      <v-form>
        <v-card v-show="paso == 1">
          <v-card-title>
            Edificio Educativo
          </v-card-title>
          <v-card-text>
            <v-row no-gutters>
              <v-col class="d-flex" cols="12" sm="12">
                <v-select
                  v-model="universidad.departamento"
                  :items="departamentos"
                  item-text="lugar"
                  item-value="id"
                  label="Departamento"
                  placeholder="Seleccionar..."
                  filled
                  @change="getProvincias()"
                  dense
                ></v-select>
              </v-col>
              <v-col class="d-flex" cols="12" sm="12">
                <v-select
                  v-model="universidad.provincia"
                  :items="provincias"
                  item-text="lugar"
                  item-value="id"
                  label="Provincia"
                  placeholder="Selecccionar..."
                  filled
                  dense
                  @change="getSecciones()"
                ></v-select>
              </v-col>
              <v-col class="d-flex" cols="12" sm="12">
                <v-select
                  v-model="universidad.seccion"
                  :items="secciones"
                  item-text="lugar"
                  item-value="id"
                  label="Sección"
                  placeholder="Seleccionar..."
                  filled
                  dense
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
            <v-btn color="purple accent-4" text @click="paso++">
              Siguiente
            </v-btn>
            <v-btn color="red" text @click="cDialog = false">
              Cancelar
            </v-btn>
          </v-card-actions>
        </v-card>
        <v-card v-show="paso == 2">
          <v-card-title>
            Datos de la Universidad
          </v-card-title>
          <v-card-text>
            <v-row no-gutters>
              <v-col class="d-flex" cols="12" sm="12">
                <v-text-field v-model="universidad.institucioneducativa" label="Nombre" placeholder="Nombre de la Universidad" filled dense></v-text-field>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12" sm="6">
                <h4>Contacto</h4>
                <v-text-field v-model="universidad.telefono" label="Teléfono" placeholder="" filled dense prepend-icon="mdi-cellphone-android"></v-text-field>
                <v-text-field v-model="universidad.fax" label="Fax" placeholder="" filled dense prepend-icon="mdi-fax"></v-text-field>
                <v-text-field v-model="universidad.sitio_web" label="Sitio Web" placeholder="" filled dense prepend-icon="mdi-web"></v-text-field>
                <v-text-field v-model="universidad.email" label="Email" placeholder="" filled dense prepend-icon="mdi-email"></v-text-field>
              </v-col>
              <v-col cols="12" sm="6">
                <v-select
                  v-model="universidad.estado"
                  :items="estados"
                  item-text="estadoinstitucion"
                  item-value="id"
                  label="Estado"
                  placeholder="Seleccionar..."
                  filled
                  dense
                ></v-select>
                <v-select
                  v-model="universidad.dependencia"
                  :items="dependencias"
                  item-text="dependencia"
                  item-value="id"
                  label="Dependencia"
                  placeholder="Seleccionar..."
                  filled
                  dense
                ></v-select>
                <v-select
                  v-model="universidad.tipo"
                  :items="tipos"
                  item-text="descripcion"
                  item-value="id"
                  label="Tipo"
                  placeholder="Seleccionar..."
                  filled
                  dense
                ></v-select>
                <v-select
                  v-model="universidad.orgCurricular"
                  :items="orgCurriculares"
                  item-text="orgcurricula"
                  item-value="id"
                  label="Org. Curricular"
                  placeholder="Seleccionar..."
                  filled
                  dense
                ></v-select>
                <v-select
                  v-model="universidad.acreditacion"
                  :items="acreditaciones"
                  item-text="institucioneducativa_acreditacion"
                  item-value="id"
                  label="Acreditación"
                  placeholder="Seleccionar..."
                  filled
                  dense
                ></v-select>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12" sm="4">
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
                      v-model="universidad.fechaDecreto"
                      label="Fecha Decreto Supremo"
                      prepend-icon="mdi-calendar"
                      placeholder="dd/mm/aaaa"
                      readonly
                      v-bind="attrs"
                      v-on="on"
                      filled
                    ></v-text-field>
                  </template>
                  <v-date-picker v-model="universidad.fechaDecreto" @input="menu1 = false"></v-date-picker>
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
                      v-model="universidad.fechaCreacion"
                      label="Fecha de Creación"
                      prepend-icon="mdi-calendar"
                      placeholder="dd/mm/aaaa"
                      readonly
                      v-bind="attrs"
                      v-on="on"
                      filled
                    ></v-text-field>
                  </template>
                  <v-date-picker v-model="universidad.fechaCreacion" @input="menu2 = false"></v-date-picker>
                </v-menu>
              </v-col>
            </v-row>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="purple accent-4" text>
              Registrar
            </v-btn>
            <v-btn color="red" text @click="cDialog = false">
              Cancelar
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-form>
    </v-dialog>
  </v-card>
</template>
<script>
  import axios from 'axios';

  export default {
    name: 'Universidades',
    data: () => ({
      headers: [
        { text: 'Sie', sortable: false, value: 'id'},
        { text: 'Universidad', value: 'institucioneducativa'},
        { text: 'Nro. resolución', value: 'nro_resolucion'},
        { text: 'Dependencia', value: 'dependencia'},
        { text: 'Sitio web', value: 'sitioWeb'},
        { text: 'Teléfono', value: 'telefono'},
        { text: 'Acciones', value: 'acciones', sortable: false, align: 'end'}
      ],
      universidades: [],
      search: '',
      cDialog: false,
      mode: '',
      paso: 1,
      universidad: {
        id: '',
        institucioneducativa: '',
        departamento: '',
        provincia: '',
        seccion: '',
        // fechaDecreto: new Date().toISOString().substr(0, 10),
        fechaDecreto: '',
        fechaCreacion: '',
      },
      departamentos: [],
      provincias: [],
      secciones: [],
      estados: [],
      dependencias: [],
      tipos: [],
      orgCurriculares: [],
      acreditaciones: [],
      menu1: false,
      menu2: false,
    }),
    mounted(){
      this.getList();
    },
    computed: {
      
    },
    methods: {
      getColor(id){
        switch(id){
          case 1: return 'purple accent-4';
          case 2: return 'teal accent-3'; 
          case 3: return 'blue';
          default: return 'secondary';
        }
      },
      showDialog(){
        this.mode = 'Crear';
        this.universidad.institucioneducativa = '';
        this.cDialog = true;
        this.getDepartamentos();
        this.getEstados();
        this.getDependencias();
        this.getTipos();
        this.getOrgCurriculares();
        this.getAcreditaciones();
        this.paso = 1;
      },
      getList(){
        axios.get('http://localhost:3000/universidad').then(response => {
          console.log(response);
          this.universidades = response.data.data;
        })
      },
      getDepartamentos(){
        if (this.departamentos.length == 0) {
          axios.get('http://localhost:3000/universidad/departamentos').then(response => {
            console.log(response);
            this.departamentos = response.data.data;
          }).catch(() => {
  
          }).finally(() => {
  
          });
        }
      },
      getProvincias(){
        if (this.universidad.departamento != '') {
          let params = {
            iddepartamento: 3
          }
          axios.get(`http://localhost:3000/universidad/provincias`, { params }).then(response => {
            console.log(response);
            this.provincias = response.data.data;
          }).catch(() => {
  
          }).finally(() => {
  
          });
        }
      },
      getSecciones(){
        if (this.universidad.provincia != '') {
          axios.get('http://localhost:3000/universidad/secciones', {idprovincia: this.universidad.provincia}).then(response => {
            console.log(response);
            this.secciones = response.data.data;
          }).catch(() => {
  
          }).finally(() => {
  
          });
        }
      },
      getEstados(){
        axios.get('http://localhost:3000/universidad/estados').then(response => {
          console.log(response);
          this.estados = response.data.data;
        }).catch(() => {

        }).finally(() => {

        });
      },
      getDependencias(){
        axios.get('http://localhost:3000/universidad/dependencias').then(response => {
          console.log(response);
          this.dependencias = response.data.data;
        }).catch(() => {

        }).finally(() => {

        });
      },
      getTipos(){
        axios.get('http://localhost:3000/universidad/universidadTipo').then(response => {
          console.log(response);
          this.tipos = response.data.data;
        }).catch(() => {

        }).finally(() => {

        });
      },
      getOrgCurriculares(){
        axios.get('http://localhost:3000/universidad/universidaOrg').then(response => {
          console.log(response);
          this.orgCurriculares = response.data.data;
        }).catch(() => {

        }).finally(() => {

        });
      },
      getAcreditaciones(){
        axios.get('http://localhost:3000/universidad/universidaAcreditada').then(response => {
          console.log(response);
          this.acreditaciones = response.data.data;
        }).catch(() => {

        }).finally(() => {

        });
      },
      
      create(){
        // if(this.universidad.institucioneducativa == ''){
        //   alert('complete el nombre')
        //   return;
        // }

        // axios.post('http://localhost:3000/universidad', this.universidad).then(response => {
        //   if (response.data.status == 'success') {
        //     alert('Universidad registrada');
        //     this.getList();
        //     this.cDialog = false;
        //   }
        // }).catch( () => {
          
        // }).finally( () => {
        //   this.cDialog = false;
        // })
      },
      edit(item){
        this.mode = 'Editar';
        this.universidad = {
          id: item.id,
          institucioneducativa: item.institucioneducativa,
          nroResolucion: item.nro_resolucion,
        };
        this.cDialog = true;
      },
      update(){
        // if(this.universidad.institucioneducativa == ''){
        //   alert('complete el nombre')
        //   return;
        // }

        // axios.put('http://localhost:3000/universidad/'+this.universidad.id, this.universidad).then(response => {
        //   if (response.data.status == 'success') {
        //     alert('Universidad actualizada');
        //     this.getList();
        //     this.cDialog = false;
        //   }
        // }).catch( () => {
          
        // }).finally( () => {
        //   this.cDialog = false;
        // })
      },
      deleted(id){
        alert('eliminando '+id);
        // axios.delete('http://localhost:3000/carrera/'+id).then(response => {
        //   if (response.data.status == 'success') {
        //     alert('Universidad eliminada');
        //     this.getList();
        //     this.cDialog = false;
        //   }
        // }).catch( () => {
          
        // }).finally( () => {
        //   this.cDialog = false;
        // })
      }
    }
  }
</script>