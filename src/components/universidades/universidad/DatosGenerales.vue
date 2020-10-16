<template>
  <div>
    <h3>Información general</h3>
    <v-row>
      <v-col cols="12" lg="9" md="9" sm="8" xs="12">
        <v-card>
          <v-card-text>
            <h4>1.- Datos Generales</h4>
            <v-row>
              <v-col cols="12" lg="3" md="4" sm="6" xs="12">
                <Dato label="Código SIE" :value="universidad.id" />
              </v-col>
              <v-col cols="12" lg="6" md="8" sm="12" xs="12">
                <Dato label="Nombre" :value="universidad.institucioneducativa" />
              </v-col>
              <v-col cols="12" lg="3" md="4" sm="6" xs="12">
                <Dato label="Dependencia" :value="universidad.dependencia" />
              </v-col>
              <v-col cols="12" lg="3" md="4" sm="6" xs="12">
                <Dato label="Estado" :value="universidad.estadoinstitucion" :chip="universidad.estadoinstitucion == 'Abierta' ? { color: 'success', icon: 'mdi-check' } : { color: 'gray', icon: 'mdi-cancel' }"/>
              </v-col>
              <v-col cols="12" lg="3" md="4" sm="6" xs="12">
                <Dato label="Teléfonos" :value="universidad.telefonos" />
              </v-col>
              <v-col cols="12" lg="3" md="4" sm="6" xs="12">
                <Dato label="Fax" :value="universidad.fax" />
              </v-col>
              <v-col cols="12" lg="3" md="4" sm="6" xs="12">
                <Dato label="Correo electrónico" :value="universidad.email" />
              </v-col>
              <v-col cols="12" lg="3" md="4" sm="6" xs="12">
                <Dato label="Sitio web" :value="universidad.sitio_web" />
              </v-col>
              <v-col cols="12" lg="3" md="4" sm="6" xs="12">
                <Dato label="Rector" :value="universidad.rector? universidad.rector : ''" />
              </v-col>
              <v-col cols="12" lg="3" md="4" sm="6" xs="12">
                <Dato label="Vice Rector" :value="universidad.vicerector? universidad.vicerector : ''" />
              </v-col>
            </v-row>
            <br>
            <h4>2.- Datos legales</h4>
            <v-row>
              <v-col cols="12" sm="3" xs="6">
                <Dato label="Decreto Supremo" :value="universidad.decreto_supremo" />
              </v-col>
              <v-col cols="12" sm="3" xs="6">
                <Dato label="Fecha Decreto Supremo" :value="universidad.fecha_decreto_supremo" />
              </v-col>
              <v-col cols="12" sm="3" xs="6">
                <Dato label="Resolución Ministerial" :value="universidad.nro_resolucion" />
              </v-col>
              <v-col cols="12" sm="3" xs="6">
                <Dato label="Fecha Resolución" :value="universidad.fecha_resolucion" />
              </v-col>
            </v-row>
            <br>
            <h4>3.- Localización del Edificio Educativo</h4>
            <v-row>
              <v-col cols="12" sm="3" xs="6">
                <Dato label="Código LE" :value="universidad.id" />
              </v-col>
              <v-col cols="12" sm="3" xs="6">
                <Dato label="Departamento" :value="universidad.deparmento? universidad.deparmento : ''" />
              </v-col>
              <v-col cols="12" sm="3" xs="6">
                <Dato label="Provincia" :value="universidad.provincia? universidad.provincia : ''" />
              </v-col>
              <v-col cols="12" sm="3" xs="6">
                <Dato label="Sección" :value="universidad.seccion? universidad.seccion : ''" />
              </v-col>
              <v-col cols="12" sm="3" xs="6">
                <Dato label="Distrito" :value="universidad.distrito ? universidad.distrito.dist : ''" />
              </v-col>
              <v-col cols="12" sm="3" xs="6">
                <Dato label="Zona" :value="universidad.zona" />
              </v-col>
              <v-col cols="12" sm="3" xs="6">
                <Dato label="Dirección" :value="universidad.direccion" />
              </v-col>
            </v-row>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-tooltip left>
              <template v-slot:activator="{ on, attrs }">
                <v-btn color="primary" v-bind="attrs" v-on="on">  <v-icon>mdi-pencil</v-icon></v-btn>
              </template>
              <span>Actualizar Información</span>
            </v-tooltip>
          </v-card-actions>
        </v-card>
      </v-col>
      <v-col cols="12" lg="3" md="3" sm="4" xs="12">
        <v-card>
          <v-card-text>
            <h4>Logo</h4>
            <div class="div-logo">
              <v-img :src="`${host + universidad.imagen }`" ></v-img>
            </div>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-tooltip left>
              <template v-slot:activator="{ on, attrs }">
                <v-btn color="primary" v-bind="attrs" v-on="on">  <v-icon>mdi-pencil</v-icon></v-btn>
              </template>
              <span>Actualizar logo</span>
            </v-tooltip>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>

    <v-dialog
      v-model="dialogFormulario"
      max-width="500px"
    >
      
    </v-dialog>

  </div>
</template>

<script>
import Servicio from '@/services/general'
import Dato from '@/components/universidades/universidad/Dato'
export default {
  name: 'datos-generales',
  props: ['universidad'],
  components: {
    Dato
  },
  data: () => ({
    host: Servicio.getServe(),
    dialogFormulario: false
  })
}
</script>

<style>
  .div-logo {
    align-items: center;
    display: flex;
    justify-content: center !important;
  }
</style>