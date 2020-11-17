<template>
  <v-card>
    <v-card-text>
      <div v-for="(record,index) in records" :key="index">
        <div class="title-record">
          <h2>{{ record.universidad }}</h2>
          <h3>RECORD ACADÉMICO</h3>
        </div>
        <v-divider></v-divider>
        <table class="datosEstudiante">
          <tr>
            <th align="left">Carnet</th><td>{{record.carnet }}</td>
          </tr>
          <tr>
            <th align="left">Estudiante</th><td>{{ record.estudiante }}</td>
          </tr>
          <tr>
            <th align="left">Carrera</th><td>{{ record.carrera }}</td>
          </tr>
        </table>

        <br>

        <v-divider></v-divider>
        <v-data-table
          :headers="headers"
          :items="record.materias"
          class="elevation-0"
          dense
          hide-default-footer
        >
        </v-data-table>
        <br>
        <v-btn color="error" small @click="generarRecordPdf(record)">
          <v-icon small>mdi-file-pdf-outline</v-icon> Descargar
        </v-btn>
        <br>
      </div>
    </v-card-text>
  </v-card>
</template>

<script>
import Service from '@/services/general'
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
pdfMake.vfs = pdfFonts.pdfMake.vfs;

export default {
  name: 'record-academico',
  props: ['records','estudiante'],
  data: () => ({
    headers: [
      { text: 'Código', value: 'codigo'},
      { text: 'Materia', value: 'materia'},
      { text: 'Nota', value: 'nota_cuantitativa'},
    ],
  }),
  methods: {
    async generarRecordPdf(record) {
      console.log('genrando pdf', record)

      let dataMaterias = [[ { text: 'Código', bold: true }, { text: 'Materia', bold: true }, { text: 'Nota', bold: true } ]]
      record.materias.map(materia => {
        console.log(materia)
        dataMaterias.push([`${materia.codigo}`,`${materia.materia}`,`${materia.nota_cuantitativa}`])
      })
      // dataMaterias = [
      //   ['1','2',3],['1','2',3],['1','2',3],['1','2',3],['1','2',3],['1','2',3],['1','2',3],['1','2',3],['1','2',3],['1','2',3],['1','2',3],['1','2',3],
      //   ['1','2',3],['1','2',3],['1','2',3],['1','2',3],['1','2',3],['1','2',3],['1','2',3],['1','2',3],['1','2',3],['1','2',3],['1','2',3],['1','2',3],
      //   ['1','2',3],['1','2',3],['1','2',3],['1','2',3],['1','2',3],['1','2',3],['1','2',3],['1','2',3],['1','2',3],['1','2',3],['1','2',3],['1','2',3],
      //   ['1','2',3],['1','2',3],['1','2',3],['1','2',3],['1','2',3],['1','2',3],['1','2',3],['1','2',3],['1','2',3],['1','2',3],['1','2',3],['1','2',3],
      //   ['1','2',3],['1','2',3],['1','2',3],['1','2',3],['1','2',3],['1','2',3],['1','2',3],['1','2',3],['1','2',3],['1','2',3],['1','2',3],['1','2',3],
      //   ['1','2',3],['1','2',3],['1','2',3],['1','2',3],['1','2',3],['1','2',3],['1','2',3],['1','2',3],['1','2',3],['1','2',3],['1','2',3],['1','2',3],
      // ]

      console.log(dataMaterias)

      var dd = {
        pageSize: "LETTER",
        // pageMargins: [40, 55, 40, 40],
        header: [{
          layout: "noBorders",
          table: {
            style: 'header',
            widths: ["*", "50%", "*"],
            body: [
              [
                {
                  stack: [
                    {
                      image: await this.getBase64ImageFromURL(
                        `${Service.getServe()}beca/image/logo-minedu.png`
                      ),
                      width: 140,
                      heigth: 35
                    },
                  ],
                  margin: [35, 15, -35, 0],
                  layout: "noBorders",
                },
                {
                  margin: 20,
                  text: `${record.universidad}`,
                  alignment: "center",
                  fontSize: 13,
                  bold: true
                },
                {
                  
                }
              ]
            ]
          },
        },{
          canvas: [ { type: 'line', x1: 40, y1: 1, x2: 595-20, y2: 1, lineWidth: 1, lineColor: '#7F59B0' }],
        }],
        content: [
          {
            text: 'RECORD ACADÉMICO',
            alignment: 'center',
            fontSize: 9,
            bold: true
          },
          {
            style: 'tabla',
            layout: 'noBorders', // optional
            table: {
              // headers are automatically repeated if the table spans over multiple pages
              // you can declare how many rows should be treated as headers
              headerRows: 1,
              widths: [ 80, 'auto'],

              body: [
                [ { text: 'Carnet:', bold: true }, record.carnet ],
                [ { text: 'Estudiante:', bold: true }, record.estudiante ],
                [ { text: 'Carrera:', bold: true }, record.carrera ],
              ]
            }
          },
          {
            style: 'tabla',
            // layout: 'lightHorizontalLines', // optional
            layout: {
                fillColor: function (rowIndex) {
                    return (rowIndex === 0) ? '#c2dec2' : null;
                }
            },
            table: {
              // headers are automatically repeated if the table spans over multiple pages
              // you can declare how many rows should be treated as headers
              headerRows: 1,
              widths: [ 50, '*', 100 ],

              // body: [
              //   [ 'First', 'Second', 'Third', 'The last one' ],
              //   [ 'Value 1', 'Value 2', 'Value 3', 'Value 4' ],
              //   [ { text: 'Bold value', bold: true }, 'Val 2', 'Val 3', 'Val 4' ]
              // ]
              body: dataMaterias
            }
          }
        ],
        styles: {
          tabla: {
            margin: [0, 15, 0, 0],
            fontSize: 10,
          },
          header: {
            heigth: 50,
            color: 'red'
          },
          anotherStyle: {
            italics: true,
            alignment: 'right'
          }
        }
      }
      pdfMake.createPdf(dd).download(`Record-Academico__${record.nombre}-${record.paterno}.pdf`);
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
}
</script>

<style>
  .title-record {
    text-align: center;
    padding: 20px;
  }
  .datosEstudiante > tr > td{
      padding-left: 20px;
  }
</style>