<template>
<div></div>
</template>
<script>
import { mapGetters, mapActions } from "vuex";
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import general from "@/services/general";
pdfMake.vfs = pdfFonts.pdfMake.vfs;
import becasService from "@/services/becasService";
export default {
  props: ["descargar", "solicitud_id"],
  data: () => ({
    datos: [],
    cuestionario: [],
    host: "",
    ide: '',
    id: '',
  }),
  computed: {
    ...mapGetters(["getConvertirFecha", "getDateNowFull"]),
  },
  mounted(){
    if(this.solicitud_id!=0){
      let ver = 0;
      try{
        ver = Buffer.from(`${this.solicitud_id}`, 'hex').toString();
        ver = ver.split(" ");
        ver = ver[1];
        this.pdf();
      }catch(error){
        this.alert({
          text: 'No existe un registro con los datos proporcionados',
          color: "red",
        });
      }finally{
        if(ver)
          this.$router.push({ name: "becas-seguimiento", params:{solicitud_id: +ver }});
        else
          this.$router.push({ name: "becas-seguimiento", params:{solicitud_id: 0 }});
      }
    }
  },
  watch: {
    async descargar() {
      this.pdf();
    },
  },
  methods: {
    ...mapActions(["alert"]),
    async pdf() {
     try{
        this.host = becasService.getBaseBeca();
      let content = await this.cargarDatos();
      var docDefinition = {
        pageSize: "LETTER",
        pageMargins: [40, 55, 40, 40],
        header: [
          {
            layout: "noBorders",
            table: {
              widths: ["*", "50%", "*"],
              body: [
                [
                  {
                    stack: [
                      {
                        image: await this.getBase64ImageFromURL(
                          `${general.getServe()}beca/image/logo-minedu.png`
                        ),
                        width: 140,
                        height: 28,
                      },
                    ],
                    margin: [35, 15, -35, 0],
                    layout: "noBorders",
                  },
                  {
                    margin: 10,
                    text: "BECAS SOCIALES",
                    style: "cabecera",
                    alignment: "center",
                  },
                  {
                    margin: 5,
                    table: {
                      body: [
                        [
                          {
                            text: `Gestión:`,
                            style: "cabecera_3",
                          },
                          {
                            text: `${this.datos.convocatoria.gestion_tipo_id}`,
                            alignment: "center",
                          },
                        ],
                        [
                          {
                            text: `Convocatoria:`,
                            style: "cabecera_3",
                          },
                          {
                            text: `${this.datos.convocatoria.version}`,
                            alignment: "center",
                          },
                        ],
                      ],
                    },
                    style: "date",
                  },
                ],
              ],
            },
          },
          {
            canvas: [
              {
                type: "line",
                x1: 50,
                y1: 0,
                x2: 595 - 2 * 20,
                y2: 0,
                lineWidth: 1,
                lineColor: "#7F59B0",
              },
            ],
          },
        ],
        content: content,
        footer: function (currentPage, pageCount) {
          return [
            {
              margin: 5,
              canvas: [
                {
                  type: "line",
                  x1: 50,
                  y1: 10,
                  x2: 595 - 2 * 20,
                  y2: 10,
                  lineWidth: 1,
                  lineColor: "#7F59B0",
                },
              ],
            },
            {
              columns: [
                {
                  fontSize: 9,
                  text: [
                    {
                      text:
                        "© Ministerio de Educación, Deportes y Culturas. " +
                        currentPage.toString() +
                        " de " +
                        pageCount,
                    },
                  ],
                  alignment: "center",
                },
              ],
            },
          ];
        },
        styles: {
          header: {
            fontSize: 18,
            bold: true,
            alignment: "justify",
            margin: [0, 0, 0, 10],
          },
          tableExample: {
            margin: [0, 5, 0, 15],
            alignment: "center",
            fontSize: 10,
          },
          subheader: {
            fontSize: 16,
            bold: true,
            margin: [0, 10, 0, 5],
            alignment: "center",
          },
          table: {
            fontSize: 10,
          },
          date: {
            fontSize: 7,
            alignment: "left",
          },
          cabecera: {
            fontSice: 10,
          },
          cabecera_3: {
            fillColor: "#008080",
            color: "#ffffff",
          },
        },
      };
      pdfMake.createPdf(docDefinition).download("Solicitud.pdf");
     }catch(error){
       this.alert({
          text: 'No existe un registro con los datos proporcionados',
          color: "red",
        });
     }
    },
    async cargarDatos() {
      //desencriptar
      let ver = 0;
      ver = await Buffer.from(`${this.solicitud_id}`, 'hex').toString();
      ver = ver.split(" ");
      ver = ver[1];
      let content = [];
      //Obtención de datos
      this.datos = await becasService.getSolicitudPdf(+ver);
      this.datos = this.datos.data.data;
      this.datos = this.datos[0];
      this.cuestionario = await becasService.getRespuestasBySolicitud(
        +ver
      );
      this.cuestionario = this.cuestionario.data.data;
      //NOMBRE Y QR
      content.push({
        columns: [
          {
            text: "",
            width: "10%",
          },
          {
            text: this.datos.solicitante.nombre_completo,
            style: "header",
            alignment: "center",
            width: "80%",
          },
          {
            qr: `${window.location.host}/becas/solicitud/${this.solicitud_id}/pdf`,
            fit: "80",
            width: "auto",
          },
        ],
      });
      content.push({ text: "", margin: 15 });
      //Mensaje
      let fecha = new Date(this.datos.fecha);
      content.push({
        text: [
          `Con C.I. `,
          {
            text: this.datos.solicitante.carnet_identidad_complemento,
            bold: true,
          },
          `, código rude `,
          { text: this.datos.solicitante.codigo_rude, bold: true },
          `, número de ceular `,
          { text: this.datos.celular, bold: true },
          ` y correo electrónico `,
          { text: this.datos.correo, bold: true },
          `, realizó su solitiud de beca en la carrera de `,
          {
            text: `${this.datos.carrera.nivel.toUpperCase()} - ${this.datos.carrera.nombre.toUpperCase()}`,
            bold: true,
          },
          ` en la `,
          { text: this.datos.universidad.nombre.toUpperCase(), bold: true },
          ` de la ciudad de `,
          {
            text: this.datos.universidad.ciudad.departa.toUpperCase(),
            bold: true,
          },
          ` en fecha y hora: `,
          { text: fecha.toLocaleString("en-GB"), bold: true },
          ".",
        ],
        fontSize: 16,
        alignment: "justify",
      });
      //Estado
      content.push({
        text: [
          "Estado de la solicitud: ",
          { text: this.datos.estado, bold: true },
          ".",
        ],
        fontSize: 18,
        margin: [0, 10],
      });
      //Cuestionario
      //si estado no es cancelado
      if(this.datos.estado != 'Cancelado'){
        content.push({
          text: "CUESTIONARIO",
          style: "subheader",
        });
        let tablaCuestionario = {
          columns: [
            { width: "*", text: "" },
            {
              width: "auto",
              style: "tableExample",
              table: {
                body: [
                  [
                    { text: "No", bold: true, style: "cabecera_3" },
                    { text: "Pregunta", bold: true, style: "cabecera_3" },
                    { text: "Respuesta", bold: true, style: "cabecera_3" },
                    { text: "Archivo", bold: true, style: "cabecera_3" },
                  ],
                ],
                alignment: "center",
              },
            },
            { width: "*", text: "" },
          ],
        };
        let i = 1;
        for (let consulta of this.cuestionario) {
          let archivo = [];
          if (consulta.pathFile)
            archivo = {
              text: "Ver",
              link: `${this.host}${consulta.pathFile}`,
              color: "#008080",
              decoration: "underline",
              target: "_blank",
            };
          else
            archivo = {
              text: "No",
            };
          tablaCuestionario.columns[1].table.body.push([
            i,
            {
              text: consulta.bcresp.bcuestionario.pregunta,
              alignment: "left",
            },
            {
              text: consulta.bcresp.respuesta,
              alignment: "left",
            },
            archivo,
          ]);
          i++;
        }
        content.push(tablaCuestionario);
        //Condiciones
        content.push({ text: "", margin: 10 });
        for (let condicion of this.datos.condiciones) {
          if (condicion.pathFile)
            content.push({
              text: [
                { text: "- ", bold: true },
                `${condicion.mensaje}. `,
                {
                  text: "Ver",
                  link: `${this.host}${condicion.pathFile}`,
                  color: "#008080",
                  decoration: "underline",
                  target: "_blank",
                },
              ],
              fontSize: 12,
            });
          else
            content.push({
              text: [{ text: "- ", bold: true }, `${condicion.mensaje}`],
              fontSize: 12,
            });
        }
      }
      //Fecha impresión
      content.push({ text: "", margin: 15 });
      let now = this.getDateNowFull(0);
      content.push({
        text: `Fecha y hora de impresión: ${now}`,
        fontSize: 9,
      });
      return content;
    },
    getBase64ImageFromURL(url) {
      return new Promise((resolve, reject) => {
        var img = new Image();
        img.setAttribute("crossOrigin", "anonymous");

        img.onload = () => {
          var canvas = document.createElement("canvas");
          canvas.width = img.width;
          canvas.height = img.height;

          var ctx = canvas.getContext("2d");
          ctx.drawImage(img, 0, 0);

          var dataURL = canvas.toDataURL("image/png");

          resolve(dataURL);
        };

        img.onerror = (error) => {
          reject(error);
        };

        img.src = url;
      });
    },
  },
};
</script>