<template>
  <div>
    <v-container grid-list-xl fluid>
      <header-title title="Inscripciones"></header-title>
      <v-card>
        <v-card-title>
          <v-flex xs12 sm4>
            <v-select
              label="Seleccione curso"
              :items="curso_habilitado"
              v-model="options.curso_id"
              item-text="descripcion"
              item-value="id"
              @change="changeCurso"
            ></v-select>
          </v-flex>
          <v-text-field
            v-model="search"
            append-icon="mdi-magnify"
            label="Buscar"
            autocomplete="off"
            single-line
            clearable
            @input="changeSearch"
            :disabled="options.curso_id == 0 && inscritos.length == 0"
          ></v-text-field>
          <v-spacer></v-spacer>
          <v-btn
            color="primary"
            dark
            :loading="downloading"
            @click="downloadFile()"
          >
            <v-icon left>mdi-cloud-download</v-icon>Descargar
          </v-btn>
        </v-card-title>
      </v-card>
      <v-row class="mb-6">
        <v-col cols="12" sm="12">
          <v-card>
            <v-card-text v-if="habilitado">
              <v-data-table
                :loading="loading"
                :headers="headers"
                :items="inscritos"
                :page.sync="options.page"
                :items-per-page="options.itemsPerPage"
                hide-default-footer
                class="elevation-1"
              >
                <template v-slot:item.num="{ item }">
                  <td>
                    {{
                      (options.page - 1) * 10 + (inscritos.indexOf(item) + 1)
                    }}
                  </td>
                </template>
              </v-data-table>
              <div class="v-data-footer">
                <v-row>
                  <v-col cols="12" sm="4">
                    <div class="v-data-footer__select">
                      Filas por página:
                      <v-select
                        :items="[10, 20, 30, 50, 100]"
                        v-model="options.itemsPerPage"
                        @change="changePerPage()"
                        hide-details
                        class="my-0"
                      ></v-select>
                    </div>
                  </v-col>
                  <v-col cols="12" sm="8" class="text-center">
                    <v-pagination
                      v-model="options.page"
                      :length="options.pageCount"
                      :total-visible="5"
                      @input="changePage"
                    ></v-pagination>
                  </v-col>
                </v-row>
              </div>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
    <v-snackbar
      v-model="snack.state"
      top="top"
      right="right"
      rounded="pill"
      :color="snack.color"
      timeout="2500"
      >{{ snack.text }}</v-snackbar
    >
  </div>
</template>

<script>
import HeaderTitle from "@/components/HeaderTitle";
import Service from "../../services/general";
import axios from "axios";
export default {
  name: "inscripcion",
  components: {
    HeaderTitle,
  },
  data: () => ({
    loading: false,
    downloading: false,
    btn_loading: false,
    search: "",
    headers: [
      {
        text: "#",
        align: "start",
        sortable: false,
        value: "num",
      },
      { text: "Código RUDE", value: "codigo_rude" },
      { text: "Nombres", value: "nombres" },
      { text: "Apellidos", value: "apellidos" },
      { text: "Correo", value: "correo" },
      { text: "Departamento", value: "departamento" },
    ],
    options: {
      search: "",
      curso_id: "",
      page: 1,
      pageCount: 0,
      itemsPerPage: 10,
    },
    inscritos: [],
    habilitado: false,
    curso_habilitado: [],
    snack: {
      state: false,
      color: "success",
      text: "",
    },
  }),
  mounted() {
    let user = Service.getUser();
    let role_id = user ? user.roles.findIndex(
      (item) => item.rol_tipo_id == Service.rolePreuniversitario()
    ) : -1;
    if (user && role_id >= 0) {
      this.checkCursoHabilitado();
    } else {
      this.$router.replace({ name: "pre-escritorio" });
    }
  },
  methods: {
    checkCursoHabilitado() {
      axios
        .get(Service.getBasePre() + "habilitar/cursos/activo")
        .then((response) => {
          this.curso_habilitado = response.data;
        })
        .catch((error) => {
          console.error("Error al cargar registros", error);
        });
    },
    changeCurso() {
      this.habilitado = true;
      this.inscritos = [];
      this.getInscripcion();
    },
    getInscripcion() {
      this.loading = true;
      axios
        .post(
          Service.getBasePre() + "lista/inscripcion",
          this.options,
          Service.getHeader()
        )
        .then((response) => {
          this.loading = false;
          this.inscritos = response.data.rows;
          this.options.pageCount =
            Math.floor(response.data.count / this.options.itemsPerPage) + 1;
        })
        .catch((error) => {
          this.loading = false;
          console.error("Error al cargar registros", error);
        });
    },

    downloadFile() {
      if (this.options.curso_id != "") {
        this.downloading = true;
        axios
          .post(
            Service.getBasePre() + "export/inscripcion",
            // { responseType: "blob" },
            { curso_id: this.options.curso_id },
            Service.getHeader()
          )
          .then((response) => {
            this.downloading = false;
            if (response.status === 200) {
              const url = window.URL.createObjectURL(new Blob([response.data]));
              const link = document.createElement("a");
              link.href = url;
              link.setAttribute("download", "inscripcion.csv");
              document.body.appendChild(link);
              link.click();
            } else {
              this.toast("warning", "No se pudo descargar la inscripción.");
            }
          })
          .catch((error) => {
            this.downloading = false;
            console.error("Error al cargar registros", error);
          });
      } else {
        this.toast("info", "Seleccione un curso");
      }
    },

    changeSearch() {
      this.options.page = 1;
      this.options.search = this.search;
      this.getInscripcion();
    },

    changePerPage() {
      this.options.page = 1;
      this.getInscripcion();
    },

    changePage() {
      this.getInscripcion();
    },

    toast(mcolor, mtext) {
      this.snack.color = mcolor;
      this.snack.text = mtext;
      this.snack.state = true;
    },
  },
};
</script>
<style lang="css" scoped>
.theme--light.v-pagination .v-pagination__item:focus {
  outline: 0;
}
</style>