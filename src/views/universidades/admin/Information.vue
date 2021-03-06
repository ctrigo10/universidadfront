<template>
  <div v-cloak>
    <Breadcrumbs :items="breadItems" />
    <UniversidadHeader
      :universidadId="universidad.id"
      :universidad="universidad.institucioneducativa"
      :sedeSubsede="universidad.nombre_sede_subsede"
      :imagen="universidad.imagen"
    />

    <div class="admin-body">
      <div class="admin-menu">
        <ul class="menu" v-if="verificarPermiso('universidad')">
          <li
            v-for="(menu, index) in menus"
            :key="index"
            @click="componente = menu.component"
          >
            <v-tooltip right>
              <template v-slot:activator="{ on, attrs }">
                <v-icon v-bind="attrs" v-on="on">
                  {{ menu.icon }}
                </v-icon>
              </template>
              <span> {{ menu.text }}</span>
            </v-tooltip>
          </li>
        </ul>
        <ul class="menu" v-if="verificarPermiso('tecnico')">
          <li
            v-for="(menu, index) in menusTecnico"
            :key="index"
            @click="componente = menu.component"
          >
            <v-tooltip right>
              <template v-slot:activator="{ on, attrs }">
                <v-icon v-bind="attrs" v-on="on">
                  {{ menu.icon }}
                </v-icon>
              </template>
              <span> {{ menu.text }}</span>
            </v-tooltip>
          </li>
        </ul>
      </div>
      <div class="admin-contenido">
        <v-progress-circular
          indeterminate
          color="primary"
          v-if="cargando"
        ></v-progress-circular>

        <DatosGenerales
          v-if="componente == 'DatosGenerales' && !cargando"
          :idUniversidad="universidadId"
        />
        <Carreras v-if="componente == 'Carreras'" :carreras="carreras" />
        <Docentes
          v-if="componente == 'Docentes'"
          :idUniversidad="universidadId"
        />
        <Estudiantes
          v-if="componente == 'Estudiantes'"
          :idUniversidad="universidadId"
        />
        <Tramite
          v-if="componente == 'Tramite'"
          :idUniversidad="universidadId"
        />
      </div>
    </div>
  </div>
</template>

<script>
import UniversidadesService from "@/services/universidadesService";
import Breadcrumbs from "@/components/universidades/utils/Breadcrumbs";
import UniversidadHeader from "@/components/universidades/universidad/UniversidadHeader";
import DatosGenerales from "@/components/universidades/universidad/DatosGenerales";
import Carreras from "@/components/universidades/academico/Carreras1";
import Docentes from "@/components/universidades/academico/Docentes";
import Estudiantes from "@/components/universidades/academico/Estudiantes";
import Tramite from "@/components/universidades/tramites/Tramite";
export default {
  name: "admin-information",
  components: {
    Breadcrumbs,
    UniversidadHeader,
    DatosGenerales,
    Carreras,
    Docentes,
    Estudiantes,
    Tramite,
  },
  props: [""],
  data: () => ({
    breadItems: [
      {
        text: "Universidades",
        href: "universidades-admin-home",
        disabled: false,
      },
      {
        text: "Sedes/Subsedes",
        href: "universidades-admin-sedes-subsedes",
        disabled: false,
      },
      { text: "Académico", href: "", disabled: true },
    ],
    universidadId: "",
    menus: [
      {
        component: "DatosGenerales",
        icon: "mdi-home",
        text: "Información general",
      },
      {
        component: "Carreras",
        icon: "mdi-format-list-bulleted-square",
        text: "Carreras",
      },
      { component: "Docentes", icon: "mdi-account", text: "Docentes" },
      {
        component: "Estudiantes",
        icon: "mdi-account-multiple",
        text: "Estudiantes",
      },
    ],
    menusTecnico: [
      {
        component: "DatosGenerales",
        icon: "mdi-home",
        text: "Información general",
      },
      {
        component: "Carreras",
        icon: "mdi-format-list-bulleted-square",
        text: "Carreras",
      },
      { component: "Docentes", icon: "mdi-account", text: "Docentes" },
      {
        component: "Estudiantes",
        icon: "mdi-account-multiple",
        text: "Estudiantes",
      },
    ],
    componente: "DatosGenerales",
    universidad: {},
    carreras: [],
    cargando: false
  }),
  mounted() {
    this.universidadId = sessionStorage.getItem("idss");
    this.verDatosUniversidad();
    this.obtenerCarreras();
  },
  methods: {
    verificarPermiso(rol) {
      return UniversidadesService.verificarPermisoRol(rol);
    },
    async verDatosUniversidad() {
      try {
        this.cargando = true
        let response = await UniversidadesService.getDatosUniversidad(
          this.universidadId
        );
        let data = await response.data.data;
        this.universidad = data;
        this.cargando = false
      } catch (error) {
        console.log(error);
      }
    },
    async obtenerCarreras() {
      try {
        let response = await UniversidadesService.getCarrerasDenominacionesPensumsUniversidad(
          this.universidadId
        );
        let data = await response.data.data;
        this.carreras = data;
        console.log("carreras", data);
      } catch (error) {
        console.log(error);
      }
    },
  },
};
</script>

<style>
[v-cloak] {
  display: none;
}
.admin-body {
  display: flex;
  justify-content: space-between;
}
.admin-menu {
  width: 70px;
  /* background: #EEEEEE; */
  padding: 10px 8px;
  text-align: center;
}
.admin-contenido {
  width: 100%;
  padding: 10px 0 10px 10px;
}
.admin-menu ul {
  padding: 0;
}
.admin-menu ul li {
  list-style: none;
  padding: 5px;
  background-color: #eeeeee;
  margin-bottom: 10px;
  border-radius: 5px;
}
.admin-menu ul li i {
  font-size: 35px !important;
}
.admin-menu ul li:hover {
  cursor: pointer;
  background-color: #cccccc;
}

@media only screen and (max-width: 750px) {
  .admin-body {
    display: block;
  }
  .admin-menu {
    width: 100%;
  }
  .admin-menu ul {
    display: flex;
    justify-content: center;
  }
  .admin-menu ul li {
    margin-left: 10px;
  }
}
</style>
