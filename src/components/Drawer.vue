<template>
  <v-navigation-drawer
    color="blue"
    id="drawer"
    :mini-variant.sync="mini"
    fixed
    :dark="$vuetify.dark"
    app
    v-model="drawer"
    width="260"
  >
    <v-toolbar color="blue darken-3" dark>
      <img v-bind:src="require('../assets/logo.svg')" width="200" alt="Logo" />
      <!-- <v-toolbar-title class="ml-0 pl-3">
        <span class="hidden-sm-and-down">CCTP</span>
      </v-toolbar-title> -->
    </v-toolbar>
    <vue-perfect-scrollbar
      class="drawer-menu--scroll"
      :settings="scrollSettings"
    >
      <v-list dense expand>
        <template v-for="(item, i) in menus">
          <!--group with subitems-->
          <v-list-group
            v-if="item.items"
            :key="item.name"
            :group="item.group"
            :prepend-icon="item.icon"
            no-action="no-action"
          >
            <v-list-tile
              slot="activator"
              ripple="ripple"
              active-class="grey lighten-2"
            >
              <v-list-tile-content>
                <v-list-tile-title>{{ item.title }}</v-list-tile-title>
              </v-list-tile-content>
            </v-list-tile>
            <template v-for="(subItem, j) in item.items">
              <!--sub group-->
              <v-list-group
                v-if="subItem.items"
                :key="subItem.name"
                :group="subItem.group"
                sub-group="sub-group"
              >
                <v-list-tile
                  slot="activator"
                  ripple="ripple"
                  active-class="grey lighten-2"
                >
                  <v-list-tile-content>
                    <v-list-tile-title>{{ subItem.title }}</v-list-tile-title>
                  </v-list-tile-content>
                </v-list-tile>
                <v-list-tile
                  v-for="(grand, k) in subItem.children"
                  :key="k"
                  :to="genChildTarget(item, grand)"
                  :href="grand.href"
                  ripple="ripple"
                >
                  <v-list-tile-content>
                    <v-list-tile-title>{{ grand.title }}</v-list-tile-title>
                  </v-list-tile-content>
                </v-list-tile>
              </v-list-group>
              <!--child item-->
              <v-list-tile
                v-else
                :key="j"
                :to="genChildTarget(item, subItem)"
                :href="subItem.href"
                :disabled="subItem.disabled"
                :target="subItem.target"
                ripple="ripple"
                active-class="grey lighten-2"
              >
                <v-list-tile-content>
                  <v-list-tile-title
                    ><span>{{ subItem.title }}</span></v-list-tile-title
                  >
                </v-list-tile-content>
                <v-list-tile-action v-if="subItem.action" class="my_icon">
                  <v-icon :class="[subItem.actionClass || 'success--text']">{{
                    subItem.action
                  }}</v-icon>
                </v-list-tile-action>
              </v-list-tile>
            </template>
          </v-list-group>
          <v-subheader v-else-if="item.header" :key="i">{{
            item.header
          }}</v-subheader>
          <v-divider v-else-if="item.divider" :key="i"></v-divider>
          <!--top-level link-->
          <v-list-tile
            v-else
            :to="!item.href ? { name: item.name } : null"
            :href="item.href"
            ripple="ripple"
            :disabled="item.disabled"
            :target="item.target"
            rel="noopener"
            :key="item.name"
            active-class="grey lighten-2"
          >
            <v-list-tile-action v-if="item.icon">
              <v-icon>{{ item.icon }}</v-icon>
            </v-list-tile-action>
            <v-list-tile-content>
              <v-list-tile-title>{{ item.title }}</v-list-tile-title>
            </v-list-tile-content>
            <v-list-tile-action v-if="item.subAction">
              <v-icon class="success--text">{{ item.subAction }}</v-icon>
            </v-list-tile-action>
          </v-list-tile>
        </template>
      </v-list>
    </vue-perfect-scrollbar>
  </v-navigation-drawer>
</template>
<script>
import VuePerfectScrollbar from "vue-perfect-scrollbar";
export default {
  name: "drawer",
  components: {
    VuePerfectScrollbar,
  },
  props: {
    expanded: {
      type: Boolean,
      default: true,
    },
  },
  data: () => ({
    mini: false,
    drawer: true,
    menus: [
      { header: "Menú" },
      { title: "Inicio", group: "main", icon: "dashboard", name: "principal" },
      {
        title: "Trámites",
        group: "tramite",
        icon: "account_balance",
        items: [
          { title: "Nuevo", icon: "account_balance", name: "nuevo" },
          { title: "Recibido", icon: "account_balance", name: "recibido" },
          { title: "Enviado", icon: "account_balance", name: "enviado" },
          {
            title: "Concluido",
            icon: "transfer_within_a_station",
            name: "concluido",
          },
          {
            title: "Seguimiento",
            icon: "transfer_within_a_station",
            name: "seguimiento",
          },
        ],
      },
    ],
    menus2: [
      { header: "Menú" },
      { title: "Inicio", group: "main", icon: "dashboard", name: "inicio" },
    ],
    scrollSettings: {
      maxScrollbarLength: 160,
    },
  }),
  computed: {},
  created() {
    window.getApp.$on("DRAWER_TOGGLE", () => {
      this.drawer = !this.drawer;
    });
    if (this.$electron != undefined) {
      this.drawer = false;
    }
  },
  methods: {
    genChildTarget(item, subitem) {
      if (subitem.href) return;
      if (subitem.component) {
        return {
          name: subitem.component,
        };
      }
      return { name: `${item.group}/${subitem.name}` };
    },
    getPage(link) {
      this.$router.push("/" + link);
    },
  },
};
</script>

<style lang="css">
#drawer {
  overflow: hidden;
}
#drawer .drawer-menu--scroll {
  height: calc(100vh - 48px);
  overflow: auto;
}
.v-list__tile__action {
  min-width: 40px;
}
.v-list__group__header .v-list__tile {
  padding-left: 0;
}
.v-list__group__items .v-list__tile {
  padding-left: 57px;
}
</style>
