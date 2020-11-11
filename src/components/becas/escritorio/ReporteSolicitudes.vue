<template>
  <div></div>
</template>
<script>
import { mapGetters } from "vuex";
import general from "@/services/general";
import becasService from "@/services/becasService";
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
pdfMake.vfs = pdfFonts.pdfMake.vfs;
export default {
  props: ["descargar", "datosPdf"],
  computed: {
    ...mapGetters(["getConvertirFecha","getDateNowFull"]),
  },
  watch: {
    async descargar() {
      let content = await this.getSolicitudes(this.datosPdf);
      var docDefinition = {
        pageSize: "LETTER",
        pageMargins: [40, 55, 40, 40],
        header: [{
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
                  margin: 11,
                  table: {
                    body: [
                      [
                        {
                          text: `Gestión:`,
                          style: "cabecera_3",
                        },
                        {
                          text: `${this.datosPdf.gestion_tipo_id}`,
                          alignment: "center",
                        },
                      ],
                      [
                        {
                          text: `Convocatoria:`,
                          style: "cabecera_3",
                        },
                        {
                          text: `${this.datosPdf.version}`,
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
        },{
          canvas: [ { type: 'line', x1: 50, y1: 0, x2: 595-2*20, y2: 0, lineWidth: 1, lineColor: '#7F59B0' }],
        }],
        content: content,
        footer: function (currentPage, pageCount) {
          return [
            {
              margin: 5,
            canvas: [ { type: 'line', x1: 50, y1: 10, x2: 595-2*20, y2: 10, lineWidth: 1, lineColor: '#7F59B0' }],
          },{
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
          }];
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
          },
          table: {
            fontSize: 8,
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
    },
  },
  methods: {
    async getSolicitudes(item) {
      let now = this.getDateNowFull(0);
      let datos = [];
      let universidad_beca_universidad_id = item.universidad
        ? item.universidad.id
        : 0;
      datos = {
        universidad_beca_universidad_id,
        opcion: item.opcion,
      };

      let content = [];
      let resp = await becasService.getSolicitudesPdf(datos);
      for (let res of resp.data.data) {
        let universidad_ = {
          columns: [
            {
              with: 65,
              text: `${res.institucioneducativa} (${res.buniversidad.cantidad_becas} Becas)`,
              alignment: "center",
              style: "header",
            },
          ],
        };
        //logo universidad
     /*   if (res.institucioneducativa_dato)
          universidad_.columns.push({
            image: await this.getBase64ImageFromURL(
              `${general.getServe()}${res.institucioneducativa_dato.pathImage}`
            ),
            width: 40,
            height: 40,
          });
          */
        content.push(universidad_);

         ////<RESUMEN>
         content.push({
           text: 'Validado (VA), Rechazado (RE), En Proceso (PR), Cancelado (CA)',
           fontSize: 8
         });
        let resumens = await becasService.getSolicitudesResumenPdf(res.buniversidad.id);
        let tablaResumen = [];
        tablaResumen = {
            columns: [
              { width: "*", text: "" },
              {
                width: "auto",
                style: "tableExample",
                table: {
                  body: [
                    [
                      { text: "No", bold: true, style: "cabecera_3" },
                      { text: "NIVEL", bold: true, style: "cabecera_3" },
                      { text: "CARRERA", bold: true, style: "cabecera_3" },
                      { text: "BECAS", bold: true, style: "cabecera_3" },
                      { text: "VA", bold: true, style: "cabecera_3" },
                      { text: "RE", bold: true, style: "cabecera_3" },
                      { text: "PR", bold: true, style: "cabecera_3" },
                      { text: "CA", bold: true, style: "cabecera_3" },
                      { text: "TOTAL", bold: true, style: "cabecera_3" },
                    ],
                  ],
                  alignment: "center",
                  style: "cabecera_3",
                },
              },
              { width: "*", text: "" },
            ],
          };
           let n = 1;
          let tcantidad_becas=0;let tvalidado = 0; let trechazado = 0; let tenproceso = 0; let tcancelado = 0; let ttotal = 0;
          for (let resumen of resumens.data.data) {
              tcantidad_becas += +resumen.cantidad_becas;
              tvalidado += +resumen.validado;
              trechazado += +resumen.rechazado;
              tenproceso += +resumen.enproceso;
              tcancelado += +resumen.cancelado;
              ttotal += +resumen.total;
            tablaResumen.columns[1].table.body.push([
              n,
              {
                text: resumen.nivel,
                alignment: "left",
              },
              {
                text: resumen.carrera,
                alignment: "left",
              },
              resumen.cantidad_becas,
              resumen.validado,
              resumen.rechazado,
              resumen.enproceso,
              resumen.cancelado,
              resumen.total,
            ]);
            n++;
          }
          tablaResumen.columns[1].table.body.push([
            {
              text: 'TOTAL',
              colSpan: 3,
              bold: true,
            },
            0,0,
            {text: tcantidad_becas, bold: true},
            {text: tvalidado, bold: true},
            {text: trechazado, bold: true},
            {text: tenproceso, bold: true},
            {text: tcancelado, bold: true},
            {text: ttotal, bold: true},
          ])
          content.push(tablaResumen);
        //</RESUMEN>
        //carreras
        if(res.buniversidad.bcarrera <= 0)
          content.push({
                text: "No existe carreras con becas registradas.",
                alignment: "center",
              });
        for (let carrera of res.buniversidad.bcarrera) {
          //nombre carrera
          content.push({
            text: `${carrera.titpro.nivel_tipo.nivel} - ${carrera.titpro.tica.tct.nombre}`,
            style: "subheader",
          });
          //Cabecera de la tabla
          let tablaEstudiante = [];
          tablaEstudiante = {
            columns: [
              { width: "*", text: "" },
              {
                width: "auto",
                style: "tableExample",
                table: {
                  body: [
                    [
                      { text: "No", bold: true, style: "cabecera_3" },
                      { text: "SOLICITANTE", bold: true, style: "cabecera_3" },
                      { text: "C.I.", bold: true, style: "cabecera_3" },
                      { text: "NACIMIENTO", bold: true, style: "cabecera_3" },
                      { text: "CELULAR", bold: true, style: "cabecera_3" },
                      { text: "ESTADO", bold: true, style: "cabecera_3" },
                    ],
                  ],
                  alignment: "center",
                  style: "cabecera_3",
                },
              },
              { width: "*", text: "" },
            ],
          };
          let i = 1;
          for (let estudiante of carrera.bsolicitud) {
            let fecha_nacimiento = this.getConvertirFecha(
              estudiante.estudiante.fecha_nacimiento
            );
            tablaEstudiante.columns[1].table.body.push([
              i,
              {
                text: estudiante.estudiante.nombre_completo,
                alignment: "left",
              },
              estudiante.estudiante.carnet_identidad_complemento,
              fecha_nacimiento,
              estudiante.celular,
              estudiante.bestado.nombre,
            ]);
            i++;
          }
          if (i <= 1) {
            content.push({
              text: "No existe solicitudes registradas.",
              alignment: "center",
            });
          } else {
            content.push(tablaEstudiante);
          }
        }
        content.push({
          text: '',
          margin: 10,
        })
      }
      content.push({
        text: `Fecha y hora de impresión: ${now}`,
        fontSize: 8
      })
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
    getBase64(img) {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      canvas.width = img.width;
      canvas.height = img.height;

      // I think this won't work inside the function from the console
      img.crossOrigin = "anonymous";

      ctx.drawImage(img, 0, 0);

      return canvas.toDataURL();
    },
  },
};
</script>