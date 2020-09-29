import axios from "axios";
import general from '@/services/general'
export default{
  // obtener universidades activas
  async getDatosUniversidad(sie){
    return await axios.get(`${general.getServe()}universidad/${sie}`);
  },
  // obtener universidades activas
  async getUniversidadesActivas(){
    return await axios.get(`${general.getServe()}universidad/lista/universidades/activa`);
  },
  // buscar universidad por nombre
  async buscarUniversidadNombre(nombreBuscar){
    return await axios.get(`${general.getServe()}universidad/buscar/universidad/${nombreBuscar}`);
  },
  // obtener cantidad de universidades segun su tipo 
  async getTotalesTiposUniversidades() {
    return await axios.get(general.getServe() + "informe/listaTipoUniversidades");
  },
  // obtener sub sedes
  async getSubsedes(sede){
    return await axios.get(`${general.getServe()}universidad/lista/Subsedes/${sede}`);
  },
  // obtener universidades por usuario
  async getUniversidadesUsuario(usuario){
    return await axios.get(`${general.getServe()}universidad/listaUniversidades/usuario/${usuario}`);
  },
  // actualizar datos generales de universidad
  async updateUniversidadDatosGenerales(idDatos, data){
    return await axios.put(`${general.getServe()}universidad/universidadDatos/${idDatos}`, data);
  },

  //------------------------------ CARRERAS --------------------------------*//
  // obtener carreras universidad
  async getCarrerasUniversidad(sie){
    return await axios.get(`${general.getServe()}carreraUni/carreraUniversidad/${sie}`);
  },

  //------------------------------ USUARIOS --------------------------------*//
  // obtener usuarios
  async getUsuarios(){
    return await axios.get(`${general.getServe()}universidad/lista/roles/usuario`);
  },
  // obtener usuarios
  async buscarUsuarioNombre(nombre){
    return await axios.get(`${general.getServe()}universidad/buscar/usuario/${nombre}`);
  },
  // asignar permiso de universidad al usuario
  async actualizarPermisosUniversidadUsuario(data){
    return await axios.post(`${general.getServe()}universidad/agregarUniversidad/usuario`, data);
  },
}