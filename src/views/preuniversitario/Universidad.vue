<template>
  <div id="buscaUniversidad">
    <v-container grid-list-xl fluid>
      <header-title title="Universidades"></header-title>
      <v-card>
        <v-card-text>
          <v-tabs v-model="active">
            <v-tab
              v-for="(item, index) in busquedas_tipo"
              :key="index"
              ripple
              @click="changePage(index)"
            >{{ item.tipo }}</v-tab>
            <v-tab-item key="nombre">
              <v-card flat>
                <v-card-text>
                  <v-layout row wrap>
                    <v-flex xs12 sm8 class="py-1">
                      <v-text-field type="text" clearable label="Buscar por nombre" v-model="search"></v-text-field>
                      <!-- <v-text-field type="text" label="Buscar por nombre" v-model="busqueda.nombre"></v-text-field> -->
                    </v-flex>
                    <!-- <v-flex xs12 sm4 class="py-1">
                      <v-btn color="primary" dark @click="searchUniversidad(1)">
                        <v-icon>mdi-magnify</v-icon>Buscar
                      </v-btn>
                    </v-flex> -->
                  </v-layout>
                </v-card-text>
              </v-card>
            </v-tab-item>
            <v-tab-item key="departamento">
              <v-card flat>
                <v-card-text>
                  <v-layout row wrap>
                    <v-flex xs12 sm8 class="py-1">
                      <v-select
                        :items="departamentos"
                        label="Buscar por departamentos"
                        item-text="descripcion"
                        item-value="id"
                        v-model="search"
                        required
                      ></v-select>
                      <!-- <v-select
                        :items="departamentos"
                        label="Buscar por departamentos"
                        item-text="lugar"
                        item-value="id"
                        v-model="busqueda.departamento"
                        required
                      ></v-select> -->
                    </v-flex>
                    <!-- <v-flex xs12 sm4 class="py-1">
                      <v-btn color="primary" dark @click="searchUniversidad(2)">
                        <v-icon>mdi-magnify</v-icon>Buscar
                      </v-btn>
                    </v-flex> -->
                  </v-layout>
                </v-card-text>
              </v-card>
            </v-tab-item>
            <!-- <v-tab-item key="area">
              <v-card flat>
                <v-card-text>
                  <v-layout row wrap>
                    <v-flex xs12 sm8 class="py-1">
                      <v-select
                        :items="areas"
                        label="Buscar por áreas"
                        item-text="area_formacion"
                        item-value="id"
                        v-model="busqueda.area"
                        class="grey--text text-darken-4"
                        required
                      ></v-select>
                    </v-flex>
                    <v-flex xs12 sm4 class="py-1">
                      <v-btn color="primary" dark @click="searchUniversidad(3)">
                        <v-icon>mdi-magnify</v-icon>Buscar
                      </v-btn>
                    </v-flex>
                  </v-layout>
                </v-card-text>
              </v-card>
            </v-tab-item> -->
          </v-tabs>
          <v-data-table
            :loading="loadingUniv"
            :headers="headersUniversidad"
            :items="universidades"
            :search="search"
            class="elevation-1"
            no-data-text="Sin registros"
            hide-actions-footer
          >
            <template v-slot:item.num="{ item }">
              <td>
                {{ universidades.indexOf(item) + 1 }}
              </td>
            </template>
            <template v-slot:item.accion="{ item }">
              <td>
                <v-btn
                  @click="showDetail(item)"
                >
                  Carreras
                </v-btn>
              </td>
            </template>
          </v-data-table>
        </v-card-text>
      </v-card>
    </v-container>
    <v-dialog
      v-model="dialogDetail"
      fullscreen
      hide-overlay
      transition="dialog-bottom-transition"
      scrollable
    >
      <v-card tile>
        <v-toolbar
          flat
          dark
          color="primary"
        >
          <v-btn
            icon
            dark
            @click="dialogDetail = false"
          >
            <v-icon>mdi-close</v-icon>
          </v-btn>
          <v-toolbar-title>Información</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-toolbar-items>
            <v-btn
              dark
              text
              @click="dialogDetail = false"
            >
              Cerrar
            </v-btn>
          </v-toolbar-items>
        </v-toolbar>
        <v-card-text>
          <v-list
            three-line
            subheader
          >
            <v-subheader>Datos de la Universidad</v-subheader>
            <v-list-item>
              <v-list-item-content>
                <v-list-item-title>Nombre: {{ universidad.nombre }}</v-list-item-title>
                <v-list-item-subtitle>Dirección: {{ universidad.direccion }}</v-list-item-subtitle>
                <v-list-item-subtitle>Zona: {{ universidad.zona }}</v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
          </v-list>
          <v-divider></v-divider>
          <v-list
            three-line
            subheader
          >
            <v-subheader>Listado de carreras</v-subheader>
            <v-list-item>
              <v-list-item-content>
                <v-simple-table>
                  <template v-slot:default>
                    <thead style="background: #E0E0E0">
                      <tr>
                        <th class="text-left">
                          Denominación
                        </th>
                        <th class="text-left">
                          Regimen de estudio
                        </th>
                        <th class="text-left">
                          Nivel
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr
                        v-for="(item, index) in carreras"
                        :key="index"
                      >
                        <td>{{ item.denominacion }}</td>
                        <td>{{ item.regimen_estudio }}</td>
                        <td>{{ item.nivel }}</td>
                      </tr>
                    </tbody>
                  </template>
                </v-simple-table>
              </v-list-item-content>
            </v-list-item>
          </v-list>
        </v-card-text>
        <div style="flex: 1 1 auto;"></div>
      </v-card>
    </v-dialog>
    <v-snackbar
      v-model="snack.state"
      top
      right
      :timeout="2500"
      :color="snack.color"
      :multi-line="snack.mode === 'multi-line'"
    >{{ snack.text }}</v-snackbar>
  </div>
</template>

<script>
import HeaderTitle from "@/components/HeaderTitle";
import Service from "../../services/general";
import axios from "axios";
export default {
  name: "universidad",
  components: {
    HeaderTitle,
  },
  data: () => ({
    loading: false,
    loadingUniv: false,
    loadingDetail: false,
    search: "",
    active: null,
    headersUniversidad: [
      { text: "Nro", align: "left", value: "num", sortable: false },
      // { text: "Código ", value: "id" },
      { text: "Nombre ", value: "institucioneducativa" },
      { text: "Resolución ", value: "nro_resolucion" },
      { text: "Fecha Creación ", value: "fecha_creacion" },
      { text: "Departamento ", value: "departamento" },
      { text: "Acción", value: "accion", sortable: false },
    ],
    headersCarrera: [
      { text: "Nro", align: "left", sortable: false },
      { text: "Código ", sortable: false },
      { text: "Carrera ", sortable: false },
      { text: "Carga Horaria ", sortable: false },
      { text: "Tiempo (1 mes) ", sortable: false },
    ],
    busquedas_tipo: [
      { tipo: "Nombre", llave: "nombre" },
      { tipo: "Departamento", llave: "departamento" },
      // { tipo: "Área", llave: "area" },
    ],
    busqueda: {
      nombre: "",
      departamento: "",
      area: "",
    },
    codigo_univ: "",
    universidad: {
      nombre: "",
    },
    universidades: [],
    departamentos: [],
    areas: [],
    carreras: [],
    dialogDetail: false,
    snack: {
      state: false,
      color: "success",
      mode: "",
      timeout: 2500,
      text: "",
    },
    message: "",
  }),
  mounted() {
    // this.getDepartamentos(1);
    this.departamentos = [
      { id: "Chuquisaca", descripcion: "Chuquisaca" },
      { id: "La Paz", descripcion: "La Paz" },
      { id: "Cochabamba", descripcion: "Cochabamba" },
      { id: "Oruro", descripcion: "Oruro" },
      { id: "Potosí", descripcion: "Potosí" },
      { id: "Tarija", descripcion: "Tarija" },
      { id: "Santa Cruz", descripcion: "Santa Cruz" },
      { id: "Beni", descripcion: "Beni" },
      { id: "Pando", descripcion: "Pando" },
    ];
    // this.getAreas();
    this.getUniversidades();
  },
  methods: {
    changePage(page) {
      console.log(page);
      // this.universidades = [];
      this.search = "";
      this.busqueda = {
        nombre: "",
        departamento: "",
        area: "",
      };
    },
    getDepartamentos(pais_id) {
      axios
        .get(Service.getServe() + "out/lugar/tipo/8/" + pais_id)
        .then((response) => {
          this.departamentos = response.data;
        })
        .catch((error) => {
          console.error("Error al cargar datos", error);
        });
    },
    getAreas() {
      axios
        .get(Service.getBase() + "areas")
        .then((response) => {
          this.areas = response.data;
        })
        .catch((error) => {
          console.error("Error al cargar datos", error);
        });
    },
    searchUniversidad(busqueda_tipo) {
      switch (busqueda_tipo) {
        case 2:
          if (this.busqueda.departamento == "") {
            this.toast("warning", "Seleccione un departamento");
            return false;
          }
          break;
        case 3:
          if (this.busqueda.area == "") {
            this.toast("warning", "Seleccione un área");
            return false;
          }
          break;
        default:
          if (this.busqueda.nombre == "") {
            this.toast("warning", "Ingrese el nombre de la universidad");
            return false;
          }
          break;
      }
      this.message = "";
      this.loadingUniv = true;
      /* if(this.codigo != '') {
        this.loading = false;
        console.log(this.codigo);
      } else {
        this.message = 'Ingrese información a buscar';
        this.loading = false;
      } */
      axios
        .post(Service.getServe() + "out/buscar/universidad", this.busqueda)
        .then((response) => {
          this.universidades = response.data;
          this.loadingUniv = false;
        })
        .catch((error) => {
          this.loadingUniv = false;
          console.error("Error al cargar datos", error);
        });
    },
    getUniversidades() {
      this.loadingUniv = true;
      axios
        .get(Service.getBasePre() + "lista/universidades")
        .then((response) => {
          this.loadingUniv = false;
          this.universidades = response.data;
        })
        .catch((error) => {
          this.loadingUniv = false;
          console.error("Error al cargar datos", error);
        });
    },
    showDetail(universidad) {
      this.codigo_univ = universidad.id;
      this.universidad.nombre = universidad.institucioneducativa;
      this.universidad.direccion = universidad.direccion;
      this.universidad.zona = universidad.zona;
      this.dialogDetail = true;
      this.loadingDetail = true;
      axios
        .get(Service.getBasePre() + "lista/carreras/" + universidad.id)
        .then((response) => {
          this.loadingDetail = false;
          this.carreras = response.data;
        })
        .catch((error) => {
          this.loadingDetail = false;
          console.error("Error al cargar datos", error);
        });
    },
    toast(color, text) {
      this.snack.color = color;
      this.snack.text = text;
      this.snack.state = true;
    },
  },
};
</script>