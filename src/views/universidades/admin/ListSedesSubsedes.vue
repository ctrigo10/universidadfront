<template>
  <div v-cloak>
    <Breadcrumbs :items="breadItems"/>
    <UniversidadHeader :universidadId="universidad.id" :universidad="universidad.institucioneducativa" :imagen="universidad.imagen"/>
    <v-card>
      <v-card-title primary-title>
        Sedes / Subsedes
        <v-spacer></v-spacer>
        <CreateForm v-if="verificarPermiso('tecnico')" @actualizar="actualizar" :idUniversidadSede="universidad ? universidad.id : 0" :nombreUniversidad="universidad.institucioneducativa" tipo="subsede">
          Crear Subsede
        </CreateForm>
      </v-card-title>
      <v-card-text>
        <v-data-table
          :headers="headers"
          :items="sedesSubsedes"
          hide-default-footer
        >
          <template v-slot:[`item.acciones`]="{ item }">
            <v-btn @click="seleccionar(item)" color="secondary" x-small>
              <v-icon x-small class="mr-1">mdi-eye</v-icon> Ingresar
            </v-btn>
          </template>
        </v-data-table>
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
import UniversidadesService from '@/services/universidadesService'
import Breadcrumbs from '@/components/universidades/utils/Breadcrumbs'
import UniversidadHeader from '@/components/universidades/universidad/UniversidadHeader'
import CreateForm from '@/components/universidades/universidad/CreateForm'
export default {
  components: {
    Breadcrumbs,
    UniversidadHeader,
    CreateForm
  },
  data: () => ({
    breadItems: [
      { text: 'Universidades', href: 'universidades-admin-home', disabled: false },
      { text: 'Sedes/Subsedes', href: '', disabled: true },
    ],
    headers: [
      { text: 'Sede/Subsede', value: 'nombre_sede_subsede' },
      { text: 'Código SIE', value: 'id' },
      { text: 'Universidad', value: 'institucioneducativa' },
      { text: 'Nro. Resolución', value: 'nro_resolucion' },
      { text: 'Departamento', value: 'departamento' },
      { text: 'Acciones', value: 'acciones' },
    ],
    idUniversidad: '',
    universidad: '',
    sedesSubsedes: []
  }),
  mounted(){
    this.idUniversidad = sessionStorage.getItem('ids');
    this.sedesSubsedes = []
    this.getDatosSede()
    this.getSedesSubsedes()
  },
  methods: {
    verificarPermiso(rol) {
      return UniversidadesService.verificarPermisoRol(rol)
    },
    actualizar(){
      this.sedesSubsedes = []
      this.getDatosSede()
      this.getSedesSubsedes()
    },
    async getDatosSede() {
      try {
        let response = await UniversidadesService.getDatosUniversidad(this.idUniversidad);
        let data = await response.data.data;
        this.universidad = data;
        // this.sedesSubsedes.push({
        //   id: data.id,
        //   institucioneducativa: data.institucioneducativa,
        //   nombre_sede_subsede: data.nombre_sede_subsede,
        //   nro_resolucion: data.nro_resolucion,
        //   departamento: data.deparmento
        // })
      } catch (error) {
        console.log(error)
      }
    },
    async getSedesSubsedes() {
      try {
        let response = await UniversidadesService.getSedesSubsedesUniversidad(this.idUniversidad);
        let data = await response.data.data;
        console.log(data)
        data.forEach(item => {
          this.sedesSubsedes.push({
            id: item.id,
            institucioneducativa: item.institucioneducativa,
            nombre_sede_subsede: item.nombre_sede_subsede,
            nro_resolucion: item.nro_resolucion,
            departamento: item.deparmento
          })
        })
      } catch (error) {
        console.log(error)
      }
    },
    seleccionar(item) {
      sessionStorage.setItem('idss', item.id)
      this.$router.push({name: 'universidades-admin-information'})
    }
  }
}
</script>

<style>
  [v-cloak] {
    display: none;
  }
</style>  