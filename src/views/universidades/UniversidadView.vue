<template>
  <div>
    <v-app-bar
      elevation="1"
      color="purple lighten-1"
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
      <template>
        <v-card
          class="mx-auto"
          max-width="300"
          tile
          elevation="0"
        >
          <v-list dense >
            <v-list-item-group v-model="item" color="purple">
              <v-list-item
                v-for="(item, i) in items"
                :key="i"
                @click="getPage(item.path)"
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

    <!-- <v-navigation-drawer
      app
      class="drawerstyle"
    >
      <v-list
          dense
          nav
          class="py-0"
        >
          <v-list-item two-line>
            

            <v-list-item-content>
              <v-list-item-title>
                <img src="../../assets/logo-minedu.png" class="logo"/>
              </v-list-item-title>
            </v-list-item-content>
          </v-list-item>

          <v-divider></v-divider>

          <v-list-item
            v-for="item in items"
            :key="item.title"
            link
            @click="getPage(item.path)"
          >
            
              <v-list-item-icon>
                <v-icon>{{ item.icon }}</v-icon>
              </v-list-item-icon>

              <v-list-item-content>
                <v-list-item-title>{{ item.title }}</v-list-item-title>
              </v-list-item-content>
            
          </v-list-item>
        </v-list>
    </v-navigation-drawer> -->
  
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
      {icon: 'mdi-map', title: 'Público', path: '/universidades/publico'},
      {icon: 'mdi-home', title: 'Dashboard', path: '/universidades/dashboard'},
      {icon: 'mdi-file', title: 'Carreras', path: '/universidades/carreras'},
      {icon: 'mdi-pencil', title: 'Universidades', path: '/universidades/universidades'},
    ],
    menu: true
  }),
  methods: {
    getPage(link) {
      this.$router.push(link);
    }
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
}

/* Tables */
table > tr{
  border-color: red !important;
}

thead > tr > th > span {
  /* color: purple; */
  font-weight: 600;
  font-size: 0.9rem;
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
  color: #8E24AA !important;
  /* background: #8E24AA !important;
  color: white !important; */
}

</style>