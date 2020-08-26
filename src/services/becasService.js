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

    //Convocatorias esta gestion
        getConvocatoriasActual(){
            return axios.get(this.getBaseBecaConvocatoria() + "actual");
        },

        addConvocatoria(item){
            return axios.post(this.getBaseBecaConvocatoria(),item);
        },

        editConvocatoria(item){
            return axios.put(this.getBaseBecaConvocatoria() + item.id, item);
        },

        deleteConvocatoria(item){
            return axios.delete(this.getBaseBecaConvocatoria() + item.id);
        }

};