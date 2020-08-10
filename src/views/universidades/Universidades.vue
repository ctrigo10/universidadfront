<template>
<v-app>
  <h1>Universidades</h1>
  <!-- <v-container>
    <v-row justify="end">
        <v-btn color="primary" dark @click="showDialog()">Crear</v-btn>
    </v-row>
  </v-container> -->

  <template>
    <v-card>
      <v-card-title>
        Listado de universidades
        <v-spacer></v-spacer>
        <v-text-field
          v-model="search"
          append-icon="mdi-magnify"
          label="Buscar"
          single-line
          hide-details
        ></v-text-field>
        <v-spacer></v-spacer>
        <v-btn class="" color="purple" small outlined dark @click="showDialog()"><v-icon>mdi-plus-outline</v-icon></v-btn>
      </v-card-title>
      <v-data-table
        :headers="headers"
        :items="universidades"
        :search="search"
        no-data-text="No existen registros"
        no-results-text="Sin resultados"
        page-text="de"
      >
        <template v-slot:[`item.dependencia`]="{ item }">
          {{ item.dependencia_tipo.dependencia }}
        </template>
        <template v-slot:[`item.acciones`]="{ item }">
          <v-btn class="mx-1" icon small color="default" @click="edit(item)">
            <v-icon dark color="purple">mdi-square-edit-outline</v-icon>
          </v-btn>
          <v-btn class="mx-1" icon small color="default" @click="deleted(item.id)">
            <v-icon dark color="purple">mdi-close-box-outline</v-icon>
          </v-btn>
        </template>
      </v-data-table>
    </v-card>
    <v-dialog
      v-model="cDialog"
      width="1000"
    >
      <v-card>
        <v-card-title>
          {{mode}} Universidad
        </v-card-title>

        <v-card-text>
          <template>
            <v-form>
              <v-row>
                <v-col cols="12" sm="8" md="8">
                  <v-text-field
                    type="text"
                    color="success"
                    outlined
                    dense
                    label="Nombre"
                    v-model="universidad.institucioneducativa"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" sm="4" md="4">
                  <v-text-field
                    type="text"
                    color="success"
                    outlined
                    dense
                    label="Nro. de Resolución"
                    v-model="universidad.nroResolucion"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" sm="4" md="4">
                  <!-- <v-text-field
                    type="text"
                    color="success"
                    outlined
                    dense
                    label="Fecha de Resolución"
                  ></v-text-field> -->
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
                        v-model="universidad.fechaResolucion"
                        label="Fecha de Resolución"
                        prepend-icon="mdi-calendar-month"
                        readonly
                        v-bind="attrs"
                        v-on="on"
                        outlined
                        dense
                      ></v-text-field>
                    </template>
                    <v-date-picker v-model="universidad.fechaResolucion" @input="menu2 = false"></v-date-picker>
                  </v-menu>
                </v-col>
                <v-col cols="12" sm="4" md="4">
                  <v-text-field
                    type="text"
                    color="success"
                    outlined
                    dense
                    label="Dirección"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" sm="4" md="4">
                  <v-text-field
                    type="text"
                    color="success"
                    outlined
                    dense
                    label="Teléfono"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" sm="4" md="4">
                  <v-text-field
                    type="text"
                    color="success"
                    outlined
                    dense
                    label="Fax"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" sm="4" md="4">
                  <v-text-field
                    type="text"
                    color="success"
                    outlined
                    dense
                    label="Sitio Web"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" sm="4" md="4">
                  <v-text-field
                    type="text"
                    color="success"
                    outlined
                    dense
                    label="Email"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" sm="4" md="4">
                  <v-text-field
                    type="text"
                    color="success"
                    outlined
                    dense
                    label="Decreto Supremo"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" sm="4" md="4">
                  <v-text-field
                    type="text"
                    color="success"
                    outlined
                    dense
                    label="Fecha Decreto Supremo"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" sm="4" md="4">
                  <v-select
                    color="success"
                    outlined
                    dense
                    label="Departamento"
                  ></v-select>
                </v-col>
                <v-col cols="12" sm="4" md="4">
                  <v-select
                    color="success"
                    outlined
                    dense
                    label="Distrito"
                  ></v-select>
                </v-col>
                <v-col cols="12" sm="4" md="4">
                  <v-select
                    type="text"
                    color="success"
                    outlined
                    dense
                    label="Estado"
                  ></v-select>
                </v-col>
                <v-col cols="12" sm="4" md="4">
                  <v-select
                    type="text"
                    color="success"
                    outlined
                    dense
                    label="Dependencia"
                  ></v-select>
                </v-col>
                <v-col cols="12" sm="4" md="4">
                  <v-select
                    type="text"
                    color="success"
                    outlined
                    dense
                    label="Tipo"
                  ></v-select>
                </v-col>
                <v-col cols="12" sm="4" md="4">
                  <v-select
                    type="text"
                    color="success"
                    outlined
                    dense
                    label="Org. Curricular"
                  ></v-select>
                </v-col>
                <v-col cols="12" sm="4" md="4">
                  <v-text-field
                    type="text"
                    color="success"
                    outlined
                    dense
                    label="Fecha creación"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" sm="4" md="4">
                  <v-select
                    type="text"
                    color="success"
                    outlined
                    dense
                    label="Acreditación"
                  ></v-select>
                </v-col>
              </v-row>
            </v-form>
          </template>
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="primary"
            text
            @click="cDialog = false"
          >
            Cancelar
          </v-btn>

          <v-btn
            color="secondary"
            text
            @click="create"
            v-show="mode == 'Crear'"
          >
            Registrar
          </v-btn>
          <v-btn
            color="secondary"
            text
            @click="update"
            v-show="mode == 'Editar'"
          >
            Actualizar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </template>

  
</v-app>
</template>
<script>
  import axios from 'axios';

  export default {
    name: 'Carreras',
    data: () => ({
      headers: [
        { text: 'Sie', sortable: false, value: 'id'},
        { text: 'Universidad', value: 'institucioneducativa'},
        { text: 'Nro. resolución', value: 'nro_resolucion'},
        { text: 'Dependencia', value: 'dependencia'},
        { text: 'Sitio web', value: 'sitioWeb'},
        { text: 'Teléfono', value: 'telefono'},
        { text: 'Acciones', value: 'acciones', sortable: false}
      ],
      universidades: [],
      search: '',
      cDialog: false,
      mode: '',
      universidad: {
        id: '',
        institucioneducativa: ''
      }
    }),
    mounted(){
      this.getList();
    },
    methods: {
      showDialog(){
        this.mode = 'Crear';
        this.universidad.institucioneducativa = '';
        this.cDialog = true;
      },
      getList(){
        axios.get('http://localhost:3000/universidad').then(response => {
          console.log(response);
          this.universidades = response.data.data;
        })
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