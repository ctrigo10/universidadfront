<template>
  
  <v-app>
    <v-app-bar app>
      <v-app-bar-nav-icon></v-app-bar-nav-icon>

      <v-toolbar-title>
        Sistema de Universidades
      </v-toolbar-title>

      <v-spacer></v-spacer>

      <v-btn icon>
        <v-icon>mdi-magn  ify</v-icon>
      </v-btn>

      <v-btn class="ma-2" outlined color="white"><v-icon left>far fa-user</v-icon>Ingresar</v-btn>
      <!-- <v-menu
        left
        bottom
      >
        <template v-slot:activator="{ on, attrs }">
          <v-btn
            icon
            v-bind="attrs"
            v-on="on"
          >
            <v-icon>mdi-dots-vertical</v-icon>
          </v-btn>
          
        </template>


        <v-list>
          <v-list-item
            @click="() => {}"
          >
            <v-list-item-title>Ingreso al Sistema </v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu> -->
    </v-app-bar>

    <v-navigation-drawer
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
                <!-- <h2 style="color: #7F59B0;" @click="getPage('/')"> <v-icon color="#7F59B0">fas fa-school fa-</v-icon> <span style="margin-left: 10px">Universidades</span></h2> -->
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
    </v-navigation-drawer>
  
    <v-main>
  
      <v-container fluid>
  
        <router-view></router-view>
      </v-container>
    </v-main>
  
    <v-footer app>
    </v-footer>
  </v-app>
</template>

<script>
export default {
  name: 'universidad-view',
  data: () => ({
    items: [
      {icon: 'fas fa-map', title: 'Público', path: '/universidades/publico'},
      {icon: 'fas fa-home', title: 'Dashboard', path: '/universidades/dashboard'},
      {icon: 'fas fa-file', title: 'Carreras', path: '/universidades/carreras'},
      {icon: 'fas fa-edit', title: 'Universidades', path: '/universidades/universidades'},
    ]
  }),
  methods: {
    getPage(link) {
      this.$router.push(link);
    }
  }
}
</script>
<style scope>
.v-navigation-drawer__content{
  /* background: #7F59B0; */
}
.v-list-item__title{
  /* color: white; */
}
.v-list-item__subtitle{
  color: gray;
}
.v-toolbar__content{
  background: #7F59B0;
  color: white;
}
.v-toolbar__content .v-icon{
  color: white !important;
}

.logo{
  width: 100%;
}
</style>