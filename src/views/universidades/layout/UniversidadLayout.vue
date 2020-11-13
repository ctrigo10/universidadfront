<template>
  <div>
    <v-app-bar
      elevation="1"
      color="primary"
      :dark="true"
      app
    >
      <v-app-bar-nav-icon @click="menu = !menu"></v-app-bar-nav-icon>
      <v-toolbar-title>
      <!-- <v-toolbar-title v-if="menu == false"> -->
        Sistema de Universidades
      </v-toolbar-title>

      <v-spacer></v-spacer>

      <!-- <v-btn icon>
        <v-icon>mdi-email</v-icon>
      </v-btn> -->

      <Login @actualizarUsuario="actualizarUsuario"/>

    </v-app-bar>

    <v-navigation-drawer
      app
      v-model="menu"
      class="drawerstyle"
      width="220"
    >
      <div class="logo">
        <img src="../../../assets/minedu.png" alt="" class="logo">
      </div>
      <v-divider></v-divider>
      <template>
        <v-list dense>
          <div v-for="(item, i) in items" :key="i">
            <!-- item de menu -->
            <v-list-item
              color="primary"
              :to="{ name: item.href }"
              v-if="!item.submenus && tienePermiso(item)"
            >
              <v-list-item-icon class="ml-0 mr-2">
                <v-icon>{{ item.icon }}</v-icon>
              </v-list-item-icon>
              <v-list-item-title>{{ item.title }}</v-list-item-title>
            </v-list-item>

            <!-- item de menu con submenus -->
            <v-list-group
              :prepend-icon="item.icon"
              mandatory
              color="primary"
              v-if="item.submenus && tienePermiso(item)"
            >
              <v-list-item slot="activator">
                <v-list-item-title style="margin-left: -31px;">{{ item.title }}</v-list-item-title>
              </v-list-item>
              <template v-for="submenu in item.submenus">
                <v-list-item
                  class="pl-5"
                  :to="{ name: submenu.href }"
                  :key="submenu.title"
                >
                  <v-list-item-icon class="mr-2">
                    <v-icon>{{ submenu.icon }}</v-icon>
                  </v-list-item-icon>
                  <v-list-item-title>{{ submenu.title }}</v-list-item-title>
                </v-list-item>
              </template>
            </v-list-group>
          </div>
          <v-divider></v-divider>
        </v-list>
      </template>
    </v-navigation-drawer>
  
    <v-main>
      <v-container fluid>
        <router-view></router-view>
      </v-container>
    </v-main>
  
    <v-footer app>
      <v-col
        class="text-center"
        cols="12"
      >
        {{ new Date().getFullYear() }} — <strong>Ministerio de Educación</strong>
      </v-col>
    </v-footer>

    <Snackbar/>

  </div>
</template>

<script>
import Servicio from '@/services/general'
import Login from '../../../components/universidades/layout/Login'
import Snackbar from '../../../components/universidades/utils/Snackbar'
export default {
  name: 'universidad-view',
  components: {
    Login,
    Snackbar
  },
  data: () => ({
    usuarioLogueado: null,
    items: [
      {
        title: 'Público', 
        href: 'universidades-publico', 
        icon: 'mdi-map',
      },{
        title: 'Dashboard', 
        href: 'universidades-dashboard', 
        icon: 'mdi-home',
        rols: [57,48]
      },
      {
        title: 'Administración', 
        href: 'universidades-admin-home', 
        icon: 'mdi-domain',
        rols: [51,48]
      },
      {
        title: 'Trámites', 
        href: 'universidades-tramites', 
        icon: 'mdi-domain',
        rols: [48,51]
      },
      // {
      //   title: 'Formularios', 
      //   href: 'universidades-formularios', 
      //   icon: 'mdi-domain',
      //   rols: [48,51]
      // },
      // {
      //   title: 'Carreras', 
      //   href: 'universidades-carreras', 
      //   icon: 'mdi-file',
      //   rols: [48]
      // },{
      //   title: 'Universidades', 
      //   href: 'universidades-universidades', 
      //   icon: 'mdi-domain',
      //   rols: [48]
      // },{
      //   title: 'Académico', 
      //   href: 'universidades-academico', 
      //   icon: 'mdi-alpha-a-box',
      //   rols: [57,48]
      // },
      {
        title: 'Configuración', 
        icon: 'mdi-cog',
        rols: [57,48],
        submenus: [
          {
            title: 'Permisos', 
            href: 'universidades-usuarios-permisos', 
            icon: 'mdi-account-cog',
          },{
            title: 'Operativos', 
            href: 'universidades-gestion-operativos', 
            icon: 'mdi-content-save-cog-outline',
          }
        ]
      }
    ],
    menu: true,
    itemSeleccionado: '',
  }),
  computed: {

  },
  mounted(){
    this.usuarioLogueado = this.usuarioLogueado = Servicio.getUser();
    console.log(this.usuarioLogueado)
  },
  methods: {
    tienePermiso(menu){
      if (!menu.rols) {
        // si el menu es publico lo mostramos
        if (this.usuarioLogueado == null) {
          return true;
        }
        return false
      }else{
        // si el menu no es publico verificamos si el usuario esta logueado
        let permiso = false;
        if (this.usuarioLogueado !== null && this.usuarioLogueado !== '') {
          this.usuarioLogueado.roles.forEach(usuarioRol => {
            menu.rols.forEach(menuRol => {
              if (usuarioRol.rol_tipo_id == menuRol) {
                permiso = true;
              }
            });
          });
          return permiso;
        }
      }
      return false;
    },
    actualizarUsuario(data){
      console.log(data)
      console.log('actualizandoUsuario')
      this.usuarioLogueado = this.usuarioLogueado = Servicio.getUser();
    }
  }
}
</script>
<style scope>

.logo{
  width: 100%;
  padding: 7px;
}

/* .u-container{
  padding: 25px;
} */

.tarjeta{
  /* padding: 15px; */
  margin-bottom: 20px;
}

/* Tables */

/* thead > tr > th {
  background-color: rgba(245, 214, 253, 0.1);
}
thead > tr > th > span {
  font-weight: 600;
  font-size: 0.9rem;
  color: #1976d2;
}
table > tbody > tr{
  border-color: red !important;
} */


/* Botones acciones tabla*/

.btn-accion{
  background: #F3F6F9 !important;
  min-width: 30px !important;
  max-width: 30px !important;
  min-height: 30px !important;
  max-height: 30px !important;
  box-shadow: none;
  /* color: #AA00FF !important; */
  color: #DDDDDD !important;
  margin: 0 3px;
  font-size: 100px !important;
}

.btn-accion:hover{
  background: #1976d2 !important;
  color: white !important;
}

.btn-accion > span > i {
  font-size: 20px !important;
}

/* Dialog */

/* .v-dialog .v-card .v-card__title{
  color: #1976d2 !important;
} */

/* Swet alert */
.swal2-header .swal2-title{
  font-family: sans-serif;
  font-size: 1.5em !important;
  color: #8E24AA !important;
}
.swal2-content {
  font-family: sans-serif;
  font-size: 1em;
  color: rgba(0, 0, 0, 0.87);
}
.swal2-actions {
  font-family: sans-serif;
}
/* .swal2-actions .swal2-confirm{ */
.swal2-styled.swal2-confirm{
  
}

/* Footer */
/* .theme--light.v-footer{
  color: purple;
} */

.v-card__title{
  /* font-weight: 300;
  font-size: 1.5em;
  color: #1976d2; */
}
</style>