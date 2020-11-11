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
                      <v-text-field type="text" label="Buscar por nombre" v-model="busqueda.nombre"></v-text-field>
                    </v-flex>
                    <v-flex xs12 sm4 class="py-1">
                      <v-btn color="primary" dark @click="searchUniversidad(1)">
                        <v-icon>mdi-magnify</v-icon>Buscar
                      </v-btn>
                    </v-flex>
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
                        item-text="lugar"
                        item-value="id"
                        v-model="busqueda.departamento"
                        required
                      ></v-select>
                    </v-flex>
                    <v-flex xs12 sm4 class="py-1">
                      <v-btn color="primary" dark @click="searchUniversidad(2)">
                        <v-icon>mdi-magnify</v-icon>Buscar
                      </v-btn>
                    </v-flex>
                  </v-layout>
                </v-card-text>
              </v-card>
            </v-tab-item>
            <v-tab-item key="area">
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
            </v-tab-item>
          </v-tabs>
          <v-data-table
            :loading="loadingUniv"
            :headers="headersUniversidad"
            :items="universidades"
            class="elevation-1"
            no-data-text="Sin registros"
            hide-actions-footer
          >
            <template v-slot:items="props">
              <td>{{ props.index + 1 }}</td>
              <td>{{ props.item.id }}</td>
              <td>{{ props.item.institucioneducativa }}</td>
              <td>{{ props.item.fecha_creacion }}</td>
              <td>
                <v-tooltip bottom>
                  <template v-slot:activator="{on}">
                    <v-btn
                      v-on="on"
                      dark
                      icon
                      small
                      depressed
                      color="primary"
                      @click="showDetail(props.item.id)"
                    >
                      <v-icon small>send</v-icon>
                    </v-btn>
                  </template>
                  <span>Ver detalle</span>
                </v-tooltip>
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
        <v-toolbar card dark color="primary">
          <v-toolbar-title>Código: {{ codigo_univ }}</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-toolbar-items>
            <v-btn dark flat @click="dialogDetail = false">Cerrar</v-btn>
          </v-toolbar-items>
        </v-toolbar>
        <v-card-text>
          <v-progress-linear v-if="loadingDetail" :indeterminate="true"></v-progress-linear>
          <v-container grid-list-lg fluid class="pa-0">
            <v-layout row wrap>
              <v-flex xs12 sm8>
                <v-card>
                  <v-card-text>
                    <h4 class="grey--text text--darken-2">Datos de la universidad</h4>
                  </v-card-text>
                  <v-divider></v-divider>
                  <v-card-text>
                    <v-list subheader class="py-0">
                      <v-list-item>
                        <v-list-item-content>
                          <v-list-item-title>Nombre</v-list-item-title>
                          <v-list-item-sub-title>{{ universidad.institucioneducativa }}</v-list-item-sub-title>
                        </v-list-item-content>
                      </v-list-item>
                      <v-list-item>
                        <v-list-item-content>
                          <v-list-item-title>Sigla</v-list-item-title>
                          <v-list-item-sub-title>{{ universidad.obs_rue2 ? universidad.obs_rue2 : 's/n' }}</v-list-item-sub-title>
                        </v-list-item-content>
                      </v-list-item>
                      <v-list-item>
                        <v-list-item-content>
                          <v-list-item-title>Dirección</v-list-item-title>
                          <v-list-item-sub-title>{{ universidad.jurisdiccion_geografica.direccion }}</v-list-item-sub-title>
                        </v-list-item-content>
                      </v-list-item>
                      <v-list-item>
                        <v-list-item-content>
                          <v-list-item-title>Zona</v-list-item-title>
                          <v-list-item-sub-title>{{ universidad.jurisdiccion_geografica.zona }}</v-list-item-sub-title>
                        </v-list-item-content>
                      </v-list-item>
                    </v-list>
                  </v-card-text>
                </v-card>
                <br />
                <v-card>
                  <v-card-text>
                    <h4 class="grey--text text--darken-2">Carreras</h4>
                  </v-card-text>
                  <v-divider></v-divider>
                  <v-data-table
                    :loading="loadingUniv"
                    :headers="headersCurso"
                    :items="cursos"
                    class="elevation-1"
                    no-data-text="Sin registros"
                    hide-actions-footer
                  >
                    <template v-slot:items="props">
                      <td>{{ props.index + 1 }}</td>
                      <td>{{ props.item.codigo }}</td>
                      <td>{{ props.item.curso }}</td>
                      <td>{{ props.item.carga_horaria }}</td>
                      <td>{{ props.item.tiempo_estudio }}</td>
                    </template>
                  </v-data-table>
                </v-card>
              </v-flex>
              <v-flex xs12 sm4>
                <v-card>
                  <v-card-title>
                    <h4 class="grey--text text--darken-2">Localización</h4>
                  </v-card-title>
                  <v-divider></v-divider>
                  <v-card-text>
                    <p>
                      <b>Coordenada:</b>
                      [{{universidad.jurisdiccion_geografica.cordx}}, {{universidad.jurisdiccion_geografica.cordy}}]
                    </p>
                    <img src="/mapa.png" alt="Localización de la universidad" width="100%" />
                  </v-card-text>
                </v-card>
              </v-flex>
            </v-layout>
          </v-container>
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
    active: null,
    headersUniversidad: [
      { text: "Nro", align: "left", sortable: false },
      { text: "Código ", value: "id" },
      { text: "Nombre ", value: "universidad" },
      { text: "Fecha Creación ", value: "fecha_creacion" },
      { text: "Acción", sortable: false },
    ],
    headersCurso: [
      { text: "Nro", align: "left", sortable: false },
      { text: "Código ", sortable: false },
      { text: "Curso ", sortable: false },
      { text: "Carga Horaria ", sortable: false },
      { text: "Tiempo (1 mes) ", sortable: false },
    ],
    busquedas_tipo: [
      { tipo: "Nombre", llave: "nombre" },
      { tipo: "Departamento", llave: "departamento" },
      { tipo: "Área", llave: "area" },
    ],
    busqueda: {
      nombre: "",
      departamento: "",
      area: "",
    },
    codigo_univ: "",
    universidad: {
      jurisdiccion_geografica: {},
    },
    universidades: [],
    departamentos: [],
    areas: [],
    cursos: [],
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
    // this.getAreas();
  },
  methods: {
    changePage(page) {
      console.log(page);
      this.universidades = [];
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
    showDetail(codigo) {
      this.codigo_univ = codigo;
      this.dialogDetail = true;
      this.loadingDetail = true;
      axios
        .get(Service.getServe() + "out/detalle/universidad/" + codigo)
        .then((response) => {
          this.universidad = response.data.universidad;
          console.log(response.data);
          this.cursos = response.data.cursos;
          this.loadingDetail = false;
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