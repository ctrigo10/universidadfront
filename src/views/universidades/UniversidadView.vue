<template>
  <div>
    <v-app-bar
      elevation="1"
      color="primary"
      :dark="true"
      app
    >
      <v-app-bar-nav-icon @click="menu = !menu"></v-app-bar-nav-icon>
      <v-toolbar-title v-if="menu == false">
        Sistema de Universidades
      </v-toolbar-title>

      <v-spacer></v-spacer>

      <v-btn icon>
        <v-icon>mdi-email</v-icon>
      </v-btn>
      <v-btn icon>
        <v-icon>mdi-account</v-icon>
      </v-btn>
    </v-app-bar>

    <v-navigation-drawer
      app
      v-model="menu"
      class="drawerstyle"
    >
      <div class="logo">
        <img src="../../assets/minedu.png" alt="" class="logo">
      </div>
      <v-divider></v-divider>
      <template>
        <v-card
          class="mx-auto"
          max-width="300"
          tile
          elevation="0"
        >
          <v-list dense >
            <v-list-item-group color="primary">
              <v-list-item
                v-for="(item, i) in items"
                :key="i"
                :to="item.path"
              >
                <v-list-item-icon>
                  <v-icon v-text="item.icon"></v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title v-text="item.title"></v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </v-list-item-group>
          </v-list>
        </v-card>
      </template>
    </v-navigation-drawer>
  
    <v-main>
      <v-container fluid class="u-container">
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
  </div>
</template>

<script>
export default {
  name: 'universidad-view',
  data: () => ({
    items: [
      {icon: 'mdi-map', title: 'Público', path: '/universidades'},
      {icon: 'mdi-home', title: 'Dashboard', path: '/universidades/dashboard'},
      {icon: 'mdi-file', title: 'Carreras', path: '/universidades/carreras'},
      {icon: 'mdi-domain', title: 'Universidades', path: '/universidades/universidades'},
    ],
    menu: true
  }),
  methods: {

  }
}
</script>
<style scope>

header {
  /* flex: none !important; */
  /* padding-top: 15px; */
}

main{
  background: #F3F6F9 !important;
}

.logo{
  width: 100%;
  padding: 15px;
}

.u-container{
  padding: 25px;
}

.tarjeta{
  padding: 15px;
  margin-bottom: 7px;
}

/* Tables */

thead > tr > th {
  background-color: rgb(25, 118, 210, 0.1);
}
thead > tr > th > span {
  /* color: purple; */
  font-weight: 600;
  font-size: 0.9rem;
  color: #1976d2;
}
table > tbody > tr{
  border-color: red !important;
}


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
  background: #AA00FF !important;
  color: white !important;
}

.btn-accion > span > i {
  font-size: 20px !important;
}

/* Dialog */

.v-dialog .v-card .v-card__title{
  /* color: #8E24AA !important; */
  color: #1976d2 !important;
}

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
.theme--light.v-footer{
  color: purple;
}

.v-card__title{
  font-weight: 300;
  font-size: 1.5em;
  color: #1976d2;
}
</style>