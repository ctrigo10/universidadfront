<template>
  <v-dialog
    v-model="dialogUniversidad"
    max-width="500px"
    transition="dialog-transition"
  >
    <v-card>
      <v-card-title primary-title>
        Actualizar datos
      </v-card-title>
      <v-card-text>
        <v-text-field
          name="name"
          label="Teléfonos"
          v-model="universidad.telefonos"
        ></v-text-field>
        <v-text-field
          name="name"
          label="Email"
          v-model="universidad.email"
        ></v-text-field>
        <v-text-field
          name="name"
          label="Sitio Web"
          v-model="universidad.sitio_web"
        ></v-text-field>
        <v-text-field
          name="name"
          label="Fax"
          v-model="universidad.fax"
        ></v-text-field>
        <v-text-field
          name="name"
          label="Rector"
          v-model="universidad.rector"
        ></v-text-field>
        <v-text-field
          name="name"
          label="Vice rector"
          v-model="universidad.vicerector"
        ></v-text-field>
        <v-text-field
          name="name"
          label="Direccion"
          v-model="universidad.direccion"
        ></v-text-field>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="secondary" @click="dialogUniversidad = false">Cancelar</v-btn>
        <v-btn color="primary" @click="update">Actualizar</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: 'edit-form',
  data: () => ({
    universidad: ''
  }),
  methods: {
    edit(item){
      this.universidad = item;
      console.log('editando', item)
      this.dialogUniversidad = true
    },
    async update(){
      try {
        let response = await UniversidadesService.updateUniversidadDatosGenerales(this.universidad.id, this.universidad);
        let data = await response.data;
        console.log(data);
        if (data.status == 'success') {
          this.uniAlert({ color: 'success', text: 'Registro actualizado correctamente' });
          this.obtenerUniversidades();
          this.dialogUniversidad = false;
        }else{
          this.uniAlert({ color: 'error', text: 'Error al actualizar el registro' });
        }
      } catch (error) {
        console.log(error);
        this.uniAlert({ color: 'error', text: 'Error al actualizar el registro' });
      }
    },
  }
}
</script>

<style>

</style>