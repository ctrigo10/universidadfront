import Vue from 'vue';
import Vuetify from 'vuetify/lib';
import { VDialog, VCard, VCardText, VBtn, VSpacer, VCardTitle, VCardActions } from "vuetify/lib";
//import colors from 'vuetify/lib/util/colors';

import es from 'vuetify/es5/locale/es'

// Vue.use(Vuetify);
Vue.use(Vuetify, {
  components: {VDialog,VCard,VCardText,VBtn,VSpacer,VCardTitle,VCardActions},
  theme: {
    primary: '#ee44aa',
    secondary: '#424242',
    accent: '#82B1FF',
    error: '#FF5252',
    info: '#2196F3',
    success: '#4CAF50',
    warning: '#FFC107',
  }
})

export default new Vuetify({
  theme: {
    themes: {
      light: {
        //primary: "#7F59B0",
        //secondary: colors.teal,
       primary: "#1a578d",
       secondary: "#019cde",
        //accent: colors.indigo.base, // #3F51B5
        /*
          AZUL PRINCIPAL
          1b3f61

          AZUL1
          1a578d

          AZUL 2
          577baf

          CELESTE
          019cde

          AMARILLO
          feed3b
        */
      },
    },
  },
  lang: {
    locales: { es },
    current: 'es',
  }
});
