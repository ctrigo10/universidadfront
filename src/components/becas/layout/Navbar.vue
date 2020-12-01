<template>
  <div>
    <v-app-bar app dense dark color="primary">
      <v-app-bar-nav-icon @click="expanded = !expanded"></v-app-bar-nav-icon>
      <v-toolbar-title>{{ bar.text }}</v-toolbar-title>
      <v-spacer></v-spacer>
      <LoggedUser/>
    </v-app-bar>
    <v-navigation-drawer app v-model="expanded" class="drawerstyle">
      <img src="@/assets/logo_minedu.jpg" alt="" class="pa-6" align="center" height="" width="100%">
      <v-list dense>
        <div v-for="item in menuItems" :key="item.title">
          <v-list-item
            color="primary"
            :to="{ name: item.href, query: item.params }"
            v-if="!item.group && checkPermission(item)"
          >
            <v-list-item-icon class="ml-0 mr-2">
              <v-icon>{{ item.icon }}</v-icon>
            </v-list-item-icon>
            <v-list-item-title>{{ item.title }}</v-list-item-title>
          </v-list-item>
          <v-list-group
            v-if="item.group && checkPermission(item)"
            :prepend-icon="item.icon"
            mandatory
            color="primary"
          >
            <v-list-item slot="activator">
              <v-list-item-title style="margin-left: -31px">{{
                item.title
              }}</v-list-item-title>
            </v-list-item>
            <template v-for="subItem in item.group">
              <v-list-item
                class="pl-5"
                :to="{ name: subItem.href, query: subItem.params }"
                :key="subItem.title"
                v-if="checkPermission(subItem)"
              >
                <v-list-item-icon class="mr-2">
                  <v-icon>{{ subItem.icon }}</v-icon>
                </v-list-item-icon>
                <v-list-item-title>{{ subItem.title }}</v-list-item-title>
              </v-list-item>
            </template>
          </v-list-group>
          <v-divider></v-divider>
        </div>
      </v-list>
    </v-navigation-drawer>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import LoggedUser from '@/components/becas/layout/LoggedUser'
//import GeneralService from "@/services/general"
import menuItems from "@/becasMenu.json";
export default {
  name: "app-navbar",
  props: {
    permission: {},
  },
  components:{LoggedUser},
  data: () => ({
    menuItems: menuItems,
    expanded: false,
  }),

  created(){
    this.agredarDisplay(this.$vuetify.breakpoint.name)
    this.expanded = (this.getDisplayGrande)? true:false;
  },

  computed: {
    ...mapGetters(["getDisplayGrande"]),
    bar() {
      if (process.env.NODE_ENV != "production") {
        return {
          text: `SISTEMA DE BECAS (versión de prueba)`,
        };
      } else {
        return {
          text: `SISTEMA DE BECAS`,
        };
      }
    },
  },

  methods: {
    ...mapActions(["agredarDisplay"]),
    checkPermission(item) {
      return this.permission.includes(item.permission);
    },
  },
};
</script>