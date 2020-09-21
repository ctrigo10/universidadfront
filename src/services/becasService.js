import axios from "axios";
import general from '@/services/general'
export default{
    getBaseBeca() {
        return general.getServe() + "beca/";
        //return "http://localhost:3000/beca/"
      },

    getBaseBecaConvocatoria() {
        return this.getBaseBeca() + "convocatoria/";
        //return "http://localhost:3000/beca/"
      },

      getBaseBecaUniversidad() {
        return this.getBaseBeca() + "universidad/";
        //return "http://localhost:3000/beca/"
      },

      getBaseBecaCarrera() {
        return this.getBaseBeca() + "carrera/";
        //return "http://localhost:3000/beca/"
      },

      getBaseBecaUsuario() {
        return this.getBaseBeca() + "usuario/";
        //return "http://localhost:3000/beca/"
      },

    //Convocatorias esta gestion
        getConvocatoriasActual(){
            return axios.get(this.getBaseBecaConvocatoria() + "actual");
        },

        addConvocatoria(item){
            return axios.post(this.getBaseBecaConvocatoria(),item, general.getHeader());
        },

        editConvocatoria(item){
            return axios.put(this.getBaseBecaConvocatoria() + item.id, item, general.getHeader());
        },

        deleteConvocatoria(item){
            return axios.delete(this.getBaseBecaConvocatoria() + item.id, general.getHeader());
        },

    //Univesidades Todos
        /*getUniversidades(options){
            return axios.get(this.getBaseBeca() + "universidades" ,{
                params: options
            });
        },*/
        getUniversidades(options){
            return axios({
                method: 'get',
                url: this.getBaseBeca() + 'universidades',
                params: options,
                headers: { "Authorization": general.getToken() }
            })
        },
        getUniversidadesList(){
            return axios.get(this.getBaseBeca() + "universidades/lista");
        },

    //Universidad
        addUniversidad(item){
            return axios.post(this.getBaseBecaUniversidad(), item, general.getHeader());
        },

        editUniversidad(item){
            return axios.put(this.getBaseBecaUniversidad() + item.id, item, general.getHeader());
        },

        getUniversidad(item){
            return axios.get(this.getBaseBecaUniversidad() + item.id);
        },

        getCarrerasByUniversidad(item){
            return axios.get(this.getBaseBecaUniversidad() + item + "/carreras");
        },

        getCarrerasBecasByUniversidad(item){
            return axios.get(this.getBaseBecaUniversidad() + item + "/becas");
        },

    //Carreras
        addCarrera(item){
            return axios.post(this.getBaseBecaCarrera(), item, general.getHeader());
        },

        editBecaCarrera(item){
            return axios.put(this.getBaseBecaCarrera() + item.universidad_beca_carrera_id, item, general.getHeader());
        },

        deleteCarrera(item){
            return axios.delete(this.getBaseBecaCarrera() + item.universidad_beca_carrera_id, general.getHeader());
        },

    //Usuarios
        getUsuarios(){
            return axios.get(this.getBaseBecaUsuario());
        },

        addUniversidadesUsuario(datos){
            return axios.post(this.getBaseBecaUsuario(), datos, general.getHeader());
        }
};