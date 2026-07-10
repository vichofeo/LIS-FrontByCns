// import { Injectable } from '@angular/core';
// import * as pdfMake from 'pdfmake/build/pdfmake';
// import { TDocumentDefinitions } from 'pdfmake/interfaces';
// import { DatePipe } from '@angular/common';
// import { lastValueFrom, map } from 'rxjs';
// import { HttpClient } from '@angular/common/http';
// // eslint-disable-next-line @nrwl/nx/enforce-module-boundaries
// import { environment } from '@env/environment';
// // eslint-disable-next-line @nrwl/nx/enforce-module-boundaries
// import { AdscripcionService, CentroMedicoService, ConsultorioService } from '@pgr-cns/services/vigencia';
// // eslint-disable-next-line @nrwl/nx/enforce-module-boundaries
// import { UbicacionService } from '@pgr-cns/shared/components';
// import { ConsultorioHorarioService } from './consultorio-horario.service';
// import { ReservasService } from './reservas.service';
// import { KardexService } from './kardex.service';
// import * as pdfFonts from 'pdfmake/build/vfs_fonts';
// import { debug } from 'node:console';
// (pdfMake as any).vfs = (pdfFonts as any).pdfMake ? (pdfFonts as any).pdfMake.vfs : (pdfFonts as any).vfs;

import { DatePipe } from '@angular/common'
import { HttpClient } from '@angular/common/http'
import { Injectable, inject } from '@angular/core'
import { environment } from '@env/environment'
import { map } from 'rxjs'
import { UbicacionService } from 'shared'
import { AdscripcionService, CentroMedicoService, ConsultorioService } from 'vigencia'

import { ConsultorioHorarioService } from './consultorio-horario.service'
import { KardexService } from './kardex.service'
import { ReservasService } from './reservas.service'

@Injectable({
  providedIn: 'root',
})
export class ReporteService {
  uri: string
  private http = inject(HttpClient)
  private centroMedicoService = inject(CentroMedicoService)
  private consultorioService = inject(ConsultorioService)
  private pipe = inject(DatePipe)
  private ubicacionService = inject(UbicacionService)
  private consultorioHorarioService = inject(ConsultorioHorarioService)
  private reservasService = inject(ReservasService)
  private adscripcionService = inject(AdscripcionService)
  private kardexService = inject(KardexService)
  constructor(
  ) {
    this.uri = `${environment.reportesApi}/${environment.apiVersion}`
  }

  //   getReservas(consultorioHorarioId: number, fechaReserva: any, regional: string, centroMedico: string, consultorio: string, medico: string, isAdicional: boolean) {
  //     return this.http
  //       .get(`${this.uri}/CitaMedica/Reserva/${consultorioHorarioId}/${fechaReserva}?regional=${regional}&centroMedico=${centroMedico}&consultorio=${consultorio}&medico=${medico}&isAdicional=${isAdicional}`,
  //         {
  //           responseType: 'blob',
  //         })
  //       .pipe(
  //         map((value: Blob, index: number) => {
  //           return new Blob([value], { type: 'application/pdf' });
  //         })
  //       );
  //   }

  getSeguimientoMedico(
    centroMedicoId: number,
    consultorioId: number,
    consultorioHorarioId: number,
    fechaInicio: any,
    fechaFin: any,
    regional: string,
    centroMedico: string,
    consultorio: string,
    medico: string,
  ) {
    return this.http
      .get(
        `${this.uri}/CitaMedica/seguimientoMedico/${centroMedicoId}?consultorioId=${consultorioId}&consultorioHorarioId=${consultorioHorarioId}&fechaInicio=${fechaInicio}&fechaFin=${fechaFin}&regional=${regional}&centroMedico=${centroMedico}&consultorio=${consultorio}&medico=${medico}`,
        {
          responseType: 'blob',
        },
      )
      .pipe(
        map((value: Blob, index: number) => {
          return new Blob([value], { type: 'application/pdf' })
        }),
      )
  }

  //   getReservasPrimerNivel(consultorioHorarioId: number, fechaReserva: any, regional: string, centroMedico: string, consultorio: string, medico: string, isAdicional: boolean) {
  //     return this.http
  //       .get(`${this.uri}/CitaMedica/ReservasPrimerNivel/${consultorioHorarioId}/${fechaReserva}?regional=${regional}&centroMedico=${centroMedico}&consultorio=${consultorio}&medico=${medico}&isAdicional=${isAdicional}`,
  //         {
  //           responseType: 'blob',
  //         })
  //       .pipe(
  //         map((value: Blob, index: number) => {
  //           return new Blob([value], { type: 'application/pdf' });
  //         })
  //       );
  //   }

  //   async print(data: any) {
  //     const centroMedico: any = await lastValueFrom(
  //       this.centroMedicoService.getById(data.consultorioHorario.centroMedicoId)
  //     );
  //     const consultorio: any = await lastValueFrom(
  //       this.consultorioService.getById(data.consultorioHorario.consultorioId)
  //     );
  //     const ubicacion: any = await lastValueFrom(this.ubicacionService.getById(centroMedico?.ubicacionRegionalId));
  //     if (!data.consultorioHorario.medicoUsuario) {
  //       data.consultorioHorario = await lastValueFrom(this.consultorioHorarioService.getById(data.consultorioHorarioId));
  //     }
  //     const abreviatura = data?.consultorioHorario?.abreviaturaActiva == true ? data?.consultorioHorario?.abreviatura : consultorio?.abreviatura;

  //     const formattedTime = new Date().toLocaleTimeString('en-US', {
  //       hour: '2-digit',
  //       minute: '2-digit',
  //       hour12: true
  //     }).replace(' ', '').replace('.', '');
  //     const dd: TDocumentDefinitions = {
  //       content: [
  //         {
  //           columns: [
  //             {
  //               text: `CAJA NACIONAL DE SALUD - ${ubicacion?.descripcion}\n${centroMedico?.descripcion}`,
  //               bold: false,
  //               fontSize: 9,
  //               alignment: 'center',
  //               margin: [0, 0, 0, 0],
  //             },
  //           ],
  //         },
  //         {
  //           columns: [
  //             {
  //               text: consultorio?.descripcion,
  //               bold: true,
  //               fontSize: 10,
  //               alignment: 'center',
  //               margin: [0, 0, 0, 0],
  //             },
  //           ],
  //         },
  //         {
  //           columns: [
  //             {
  //               text: `MÉDICO: ${data.consultorioHorario?.medicoUsuario?.nombres}\n${data.hora?.isAdicional ? 'FICHA ADICIONAL' : ''}`,
  //               fontSize: 9,
  //               alignment: 'center',
  //               margin: [0, 0, 0, 0],
  //             },
  //           ],
  //         },
  //         {
  //           columns: [
  //             {
  //               text: `${abreviatura} - ${data?.hora?.numero}`,
  //               bold: true,
  //               fontSize: 30,
  //               alignment: 'center',
  //               margin: [0, 0, 0, 0],
  //             },
  //           ],
  //         },
  //         {
  //           columns: [
  //             {
  //               text: [
  //                 { text: 'Fecha Atención: ', style: 'prompt' },
  //                 { text: this.pipe.transform(data?.fechaReserva, 'dd/MM/yyyy'), style: 'value' },
  //                 { text: consultorio?.tipoConsultorioId == 3 ? '' : data?.hora?.isAdicional == true ? '' : `  Hora: `, style: 'prompt' },
  //                 { text: consultorio?.tipoConsultorioId == 3 ? '' : data?.hora?.isAdicional == true ? '' : data.hora.inicioDetalle, style: 'value' },
  //               ],
  //               fontSize: 9,
  //               alignment: 'left',
  //               margin: [5, 0, 0, 0],
  //             },
  //           ],
  //         },
  //         {
  //           columns: [
  //             {
  //               text: [
  //                 { text: 'Paciente: ', style: 'prompt' },
  //                 { text: `${data?.asegurado?.nombres} ${data?.asegurado?.paterno} ${data?.asegurado?.materno}`, style: 'value' },
  //               ],
  //               fontSize: 9,
  //               alignment: 'left',
  //               margin: [5, 0, 0, 0],
  //             },
  //           ],
  //         },
  //         {
  //           columns: [
  //             {
  //               text: [
  //                 { text: 'Codigo: ', style: 'prompt' },
  //                 {
  //                   text: [
  //                     { text: `${data?.datosAsegurado?.matriculaTitular?.substring(0, 2)}`, style: 'cod1' },
  //                     { text: `${data?.datosAsegurado?.matriculaTitular?.substring(2)}-${data?.datosAsegurado?.codigo} (${data?.asegurado?.parametroTipoParentescoId == '1' ? 'TITULAR' : data?.datosAsegurado?.parentesco})`, style: 'cod2' }
  //                   ]
  //                 },
  //               ],
  //               fontSize: 9,
  //               alignment: 'left',
  //               margin: [5, 0, 0, 0],
  //             },
  //           ],
  //         },
  //         {
  //           margin: [0, 2, 0, 0],
  //           columns: [
  //             {
  //               margin: [0, 5, 0, 0],
  //               width: '70%',
  //               layout: {
  //                 hLineWidth: function () {
  //                   return 0;
  //                 },
  //                 vLineWidth: function () {
  //                   return 0;
  //                 },
  //               },
  //               table: {
  //                 body: [
  //                   [
  //                     {
  //                       text: consultorio?.tipoConsultorioId == 3 ? 'La atención en emergencia es por Triaje, no por orden de llegada.' : 'La hora de atención programada es referencial, asista minimamente 30 min antes de su atención.',
  //                       style: consultorio?.tipoConsultorioId == 3 ? 'footer_emergencia' : 'footer',
  //                       alignment: 'center',

  //                     },
  //                   ],
  //                   [
  //                     {
  //                       text: `Programado por: ${data?.tipoReserva == 3 ? data.consultorioHorario?.medicoUsuario?.userName : data?.usuarioCreacion} - ${this.pipe.transform(new Date(), 'dd/MM/yyyy')} ${formattedTime}`,
  //                       style: 'firm',
  //                       alignment: 'center',
  //                     },
  //                   ],
  //                 ],
  //               },
  //             },
  //             {
  //               fit: 80,
  //               qr: `Caja Nacional de Salud
  //               \nConsultorio: ${data?.consultorio?.descripcion}
  //               \nPaciente: ${data?.asegurado?.nombres} ${data?.asegurado?.paterno} ${data?.asegurado?.materno}
  //               \nFecha Atencion: ${this.pipe.transform(data?.fechaReserva, 'dd/MM/yyyy')} ${data?.hora?.inicioDetalle}`,
  //             },
  //           ],
  //         },
  //       ],
  //       styles: {
  //         header: {
  //           bold: false,
  //           fontSize: 16,
  //         },
  //         data: {
  //           bold: false,
  //           fontSize: 9
  //         },
  //         field: {
  //           fontSize: 9
  //         },
  //         footer: {
  //           bold: false,
  //           fontSize: 7,
  //         },
  //         footer_emergencia: {
  //           bold: false,
  //           fontSize: 9,
  //         },
  //         firm: {
  //           bold: false,
  //           fontSize: 5,
  //         },
  //         prompt: {
  //           bold: false,
  //           fontSize: 8,
  //         },
  //         value: {
  //           bold: true,
  //           fontSize: 9,
  //         },
  //         cod1: { color: 'gray', fontSize: 9 },
  //       },
  //       pageSize: {
  //         width: 226.8,
  //         height: 256.772
  //       },
  //       pageMargins: [4.252, 2, 4.252, 2]
  //     };
  //     // pdfMake.createPdf(dd).print();

  //     const pdfDocGenerator = pdfMake.createPdf(dd);
  //     pdfDocGenerator.getBlob((blob) => {
  //       const blobUrl = URL.createObjectURL(blob);
  //       const printWindow: any = window.open(blobUrl, 'Print', 'height=600,width=800');
  //       printWindow.print();

  //       setTimeout(() => {
  //         printWindow.close();
  //         URL.revokeObjectURL(blobUrl);
  //       }, 7000);

  //     });

  //   }

  //   async printNoAsegurado(data: any) {
  //     const centroMedico: any = await lastValueFrom(
  //       this.centroMedicoService.getById(data.consultorioHorario.centroMedicoId)
  //     );
  //     const consultorio: any = await lastValueFrom(
  //       this.consultorioService.getById(data.consultorioHorario.consultorioId)
  //     );
  //     const ubicacion: any = await lastValueFrom(this.ubicacionService.getById(centroMedico?.ubicacionRegionalId));
  //     if (!data.consultorioHorario.medicoUsuario) {
  //       data.consultorioHorario = await lastValueFrom(this.consultorioHorarioService.getById(data.consultorioHorarioId));
  //     }
  //     const abreviatura = data?.consultorioHorario?.abreviaturaActiva == true ? data?.consultorioHorario?.abreviatura : consultorio?.abreviatura;

  //     const formattedTime = new Date().toLocaleTimeString('en-US', {
  //       hour: '2-digit',
  //       minute: '2-digit',
  //       hour12: true
  //     }).replace(' ', '').replace('.', '');
  //     const dd: TDocumentDefinitions = {
  //       content: [
  //         {
  //           columns: [
  //             {
  //               text: `CAJA NACIONAL DE SALUD - ${ubicacion?.descripcion}\n${centroMedico?.descripcion}`,
  //               bold: false,
  //               fontSize: 9,
  //               alignment: 'center',
  //               margin: [0, 0, 0, 0],
  //             },
  //           ],
  //         },
  //         {
  //           columns: [
  //             {
  //               text: consultorio?.descripcion,
  //               bold: true,
  //               fontSize: 10,
  //               alignment: 'center',
  //               margin: [0, 0, 0, 0],
  //             },
  //           ],
  //         },
  //         {
  //           columns: [
  //             {
  //               text: `MÉDICO: ${data.consultorioHorario?.medicoUsuario?.nombres}\n${data.hora?.isAdicional ? 'FICHA ADICIONAL' : ''}`,
  //               fontSize: 9,
  //               alignment: 'center',
  //               margin: [0, 0, 0, 0],
  //             },
  //           ],
  //         },
  //         {
  //           columns: [
  //             {
  //               text: `${abreviatura} - ${data?.hora?.numero}`,
  //               bold: true,
  //               fontSize: 30,
  //               alignment: 'center',
  //               margin: [0, 0, 0, 0],
  //             },
  //           ],
  //         },
  //         {
  //           columns: [
  //             {
  //               text: `ATENCIÓN PARTICULAR`,
  //               style: 'data_no_asegurado',
  //               alignment: 'center',
  //               margin: [0, 0, 0, 0],
  //             },
  //           ],
  //         },
  //         {
  //           columns: [
  //             {
  //               text: [
  //                 { text: 'Fecha Atención: ', style: 'prompt' },
  //                 { text: this.pipe.transform(data?.fechaReserva, 'dd/MM/yyyy'), style: 'value' },
  //                 { text: consultorio?.tipoConsultorioId == 3 ? '' : data?.hora?.isAdicional == true ? '' : `  Hora: `, style: 'prompt' },
  //                 { text: consultorio?.tipoConsultorioId == 3 ? '' : data?.hora?.isAdicional == true ? '' : data.hora.inicioDetalle, style: 'value' },
  //               ],
  //               fontSize: 9,
  //               alignment: 'left',
  //               margin: [5, 0, 0, 0],
  //             },
  //           ],
  //         },
  //         {
  //           columns: [
  //             {

  //               text: [
  //                 { text: 'Paciente: ', style: 'prompt' },
  //                 { text: `${data?.noAsegurado?.nombres} ${data?.noAsegurado?.paterno} ${data?.noAsegurado?.materno}`, style: 'value' },
  //               ],
  //               fontSize: 9,
  //               alignment: 'left',
  //               margin: [5, 0, 0, 0],
  //             },
  //           ],
  //         },
  //         {
  //           margin: [0, 2, 0, 0],
  //           columns: [
  //             {
  //               margin: [0, 5, 0, 0],
  //               width: '70%',
  //               layout: {
  //                 hLineWidth: function () {
  //                   return 0;
  //                 },
  //                 vLineWidth: function () {
  //                   return 0;
  //                 },
  //               },
  //               table: {
  //                 body: [
  //                   [
  //                     {
  //                       text: consultorio?.tipoConsultorioId == 3 ? 'La atención en emergencia es por Triaje, no por orden de llegada.' : 'La hora de atención programada es referencial, asista minimamente 30 min antes de su atención.',
  //                       style: consultorio?.tipoConsultorioId == 3 ? 'footer_emergencia' : 'footer',
  //                       alignment: 'center',

  //                     },
  //                   ],
  //                   [
  //                     {
  //                       text: `Programado por: ${data?.tipoReserva == 3 ? data.consultorioHorario?.medicoUsuario?.userName : data?.usuarioCreacion} - ${this.pipe.transform(new Date(), 'dd/MM/yyyy')} ${formattedTime}`,
  //                       style: 'firm',
  //                       alignment: 'center',
  //                     },
  //                   ],
  //                 ],
  //               },
  //             },
  //             {
  //               fit: 80,
  //               qr: `Caja Nacional de Salud
  //               \nConsultorio: ${data?.consultorio?.descripcion}
  //               \nPaciente: ${data?.asegurado?.nombres} ${data?.asegurado?.paterno} ${data?.asegurado?.materno}
  //               \nFecha Atencion: ${this.pipe.transform(data?.fechaReserva, 'dd/MM/yyyy')} ${data?.hora?.inicioDetalle}`,
  //             },
  //           ],
  //         },
  //       ],
  //       styles: {
  //         header: {
  //           bold: false,
  //           fontSize: 16,
  //         },
  //         data: {
  //           bold: false,
  //           fontSize: 9
  //         },
  //         data_no_asegurado: {
  //           bold: true,
  //           fontSize: 10
  //         },
  //         field: {
  //           fontSize: 9
  //         },
  //         footer: {
  //           bold: false,
  //           fontSize: 7,
  //         },
  //         footer_emergencia: {
  //           bold: false,
  //           fontSize: 9,
  //         },
  //         firm: {
  //           bold: false,
  //           fontSize: 5,
  //         },
  //         prompt: {
  //           bold: false,
  //           fontSize: 8,
  //         },
  //         value: {
  //           bold: true,
  //           fontSize: 9,
  //         },
  //       },
  //       pageSize: {
  //         width: 226.8,
  //         height: 256.772
  //       },
  //       pageMargins: [4.252, 0, 4.252, 0]
  //     };
  //     // pdfMake.createPdf(dd).print();

  //     const pdfDocGenerator = pdfMake.createPdf(dd);
  //     pdfDocGenerator.getBlob((blob) => {
  //       const blobUrl = URL.createObjectURL(blob);
  //       const printWindow: any = window.open(blobUrl, 'Print', 'height=600,width=800');
  //       printWindow.print();

  //       setTimeout(() => {
  //         printWindow.close();
  //         URL.revokeObjectURL(blobUrl);
  //       }, 7000);

  //     });

  //   }

  //   getTipoReserva(tipoReserva: number) {
  //     switch (tipoReserva) {
  //       case 1: return "Primera";
  //       case 2: return "Regular";
  //       case 3: return "Reconsulta";
  //       case 4: return "Transferencia";
  //       case 5: return "Transferencia AVC-08";
  //       case 6: return "Reprogramación";
  //       case 7: return "Referencia";
  //       default: return "";
  //     }
  //   }

  //   async printReservasPrimerNivel(consultorioHorario: any, fechaReserva: any, regional: string, centroMedico: string, consultorio: string, medico: string, isAdicional: boolean, centroMedicoId: number): Promise<Blob> {
  //     const imageUrl = `${location.origin}/assets/layout/images/cns.png`;
  //     const reservas = await lastValueFrom(this.reservasService.getByMedicoConsultorio({
  //       consultorioId: consultorioHorario.consultorioId,
  //       medicoUsuarioId: consultorioHorario.medicoUsuarioId,
  //       fechaReserva: this.pipe.transform(fechaReserva, 'yyyy-MM-dd'),
  //     }));
  //     const grupoFamiliarIds: number[] = [];
  //     reservas.forEach((dato) => {
  //       grupoFamiliarIds.push(dato.datosAsegurado?.grupoFamiliarId);
  //     });
  //     const adscripciones = await lastValueFrom(this.adscripcionService.getByGrupoIds({ centroMedicoId: centroMedicoId, grupoIds: grupoFamiliarIds }));

  //     for (const reserva of reservas) {
  //       const adscripcion = adscripciones.find((a) => a.grupoFamiliarId === reserva.datosAsegurado?.grupoFamiliarId);
  //       if (adscripcion) {
  //         reserva.adscripcion = adscripcion;
  //       }
  //     }
  //     const rows: any = [];
  //     reservas.map((r: any) => {
  //       const res: any = [
  //         { text: r.hora?.inicioDetalle, alignment: 'center', style: 'dataTable' },
  //         {
  //           text:
  //             [
  //               { text: r.noAseguradoId > 0 ? '' : `${r.datosAsegurado?.matriculaTitular?.substring(0, 2)}`, style: 'cod1' },
  //               { text: r.noAseguradoId > 0 ? '' : `${r.datosAsegurado?.matriculaTitular?.substring(2)}-${r.datosAsegurado?.codigo}`, style: 'cod2' }
  //             ]
  //         },
  //         { text: r.noAseguradoId > 0 ? `${r.noAsegurado?.nombres} ${r.noAsegurado?.paterno} ${r.noAsegurado?.materno}` : `${r.asegurado?.nombres} ${r.asegurado?.paterno} ${r.asegurado?.materno}`, style: 'dataTable' },
  //         { text: r.noAseguradoId > 0 ? `${r.noAsegurado?.documentoIdentidad}` : `${r.asegurado?.documentoIdentidad}`, alignment: 'center', style: 'dataTable' },
  //         { text: r.noAseguradoId > 0 ? (r.noAsegurado.tipoRegistro == 1 ? 'Particular' : 'Convenio') : r.isNuevo ? 'Primera' : 'Regular', alignment: 'center', style: 'dataTable' },
  //         { text: r.adscripcion?.consultorio?.descripcion, alignment: 'center', style: 'dataTable' },
  //         { text: r.noAseguradoId > 0 ? '' : `${r.datosAsegurado?.razonSocial}\n${r.datosAsegurado?.nroPatronal}`, style: 'dataEmpresa' },
  //       ]
  //       rows.push(res);
  //     }
  //     );
  //     const docDefinition: TDocumentDefinitions = {
  //       // header: [
  //       //   {
  //       //     margin: [10, 10, 10, 10],
  //       //     height: 400,
  //       //     style: 'headerReport',
  //       //     columns: [
  //       //       {
  //       //         width: 100,
  //       //         image: 'logo',
  //       //         fit: [70, 100],
  //       //         alignment: 'center',
  //       //         margin: [20, 0, 0, 0],
  //       //       },
  //       //       {
  //       //         width: '60%',
  //       //         text: `CAJA NACIONAL DE SALUD\n${regional}`,
  //       //         fontSize: 12,
  //       //         bold: true,
  //       //         alignment: 'left'
  //       //       },
  //       //       {
  //       //         fit: 50,
  //       //         qr: `Caja Nacional de Salud`,
  //       //       },
  //       //     ],
  //       //   },
  //       // ],
  //       content: [
  //         {
  //           margin: [0, 0, 0, 0],
  //           style: 'headerReport',
  //           columns: [
  //             {
  //               width: 70,
  //               image: 'logo',
  //               fit: [70, 100],
  //               alignment: 'left',
  //               margin: [0, 0, 0, 0],
  //             },
  //             {
  //               width: '75%',
  //               stack: [
  //                 {
  //                   text: `CAJA NACIONAL DE SALUD`,
  //                   fontSize: 13,
  //                   bold: true,
  //                   alignment: 'left'
  //                 },
  //                 {
  //                   text: regional,
  //                   fontSize: 12,
  //                   bold: true,
  //                   alignment: 'left'
  //                 },
  //                 {
  //                   text: `DETALLE DE PROGRAMACIONES`,
  //                   fontSize: 17,
  //                   bold: true,
  //                   alignment: 'center'
  //                 }
  //               ],
  //             },
  //             {
  //               fit: 100,
  //               qr: `Caja Nacional de Salud\nDetalle de Programaciones\n
  //               ${consultorio} - ${medico}
  //               `,
  //               alignment: 'right'
  //             },
  //           ],
  //         },
  //         {
  //           margin: [0, 10, 0, 0],
  //           columns: [
  //             {
  //               width: '50%',
  //               alignment: 'left',
  //               text:
  //                 [
  //                   {
  //                     text: 'Centro Médico: ',
  //                     style: 'dataCabecera'
  //                   },
  //                   {
  //                     text: centroMedico,
  //                     bold: true,
  //                     style: 'dataCabecera'
  //                   }
  //                 ]
  //             },
  //             {
  //               width: '50%',
  //               alignment: 'left',
  //               text: [
  //                 {
  //                   text: 'Médico: ',
  //                   style: 'dataCabecera'
  //                 },
  //                 {
  //                   text: medico,
  //                   bold: true,
  //                   style: 'dataCabecera'
  //                 }
  //               ]

  //             }]
  //         },
  //         {
  //           columns: [
  //             {
  //               alignment: 'left',
  //               text: [
  //                 {
  //                   text: 'Consultorio: ',
  //                   style: 'dataCabecera'
  //                 },
  //                 {
  //                   text: consultorio,
  //                   bold: true,
  //                   alignment: 'left',
  //                   style: 'dataCabecera'
  //                 }
  //               ]
  //             },
  //             {
  //               alignment: 'left',
  //               text: [
  //                 {
  //                   text: 'Fecha: ',
  //                   style: 'dataCabecera'
  //                 },
  //                 {
  //                   text: `${this.pipe.transform(fechaReserva, 'dd/MM/yyyy')}`,
  //                   bold: true,
  //                   alignment: 'left',
  //                   style: 'dataCabecera'
  //                 }
  //               ]

  //             }]
  //         },
  //         {
  //           columns: [
  //             {
  //               margin: [0, 10, 0, 0],
  //               width: '100%',
  //               fontSize: 10,
  //               table: {

  //                 headerRows: 1,

  //                 widths: [25, 75, 140, 55, 50, 70, 85],
  //                 body: [
  //                   [
  //                     { text: 'Hora', bold: true, style: 'header' },
  //                     { text: 'Codigo', bold: true, style: 'header' },
  //                     { text: 'Paciente', bold: true, style: 'header' },
  //                     { text: 'C.I.', bold: true, style: 'header' },
  //                     { text: 'Tipo Atención', bold: true, style: 'header' },
  //                     { text: 'Consultorio Familiar', bold: true, style: 'header' },
  //                     { text: 'Empresa', bold: true, style: 'header' },
  //                   ],
  //                   ...rows
  //                 ]
  //               },
  //             },
  //           ],
  //         },

  //       ],
  //       footer: {
  //         height: 120,
  //         margin: [20, 0, 20, 0],
  //         table: {
  //           widths: ['*', '*', '*', '*'],
  //           body: [
  //             [
  //               { text: 'ENTREGADO POR', alignment: 'center', fontSize: 10 },
  //               { text: 'RECOGIDO POR', alignment: 'center', fontSize: 10 },
  //               { text: 'DEVUELTO POR', alignment: 'center', fontSize: 10 },
  //               { text: 'RECIBIDO POR', alignment: 'center', fontSize: 10 }
  //             ]
  //           ]
  //         },
  //         layout: 'noBorders'
  //       },
  //       styles: {
  //         cod1: { color: 'gray', fontSize: 9 },
  //         cod2: { bold: true, fontSize: 9 },
  //         header: {
  //           fontSize: 9,
  //           bold: true,
  //           alignment: 'center',
  //         },
  //         dataCabecera: {
  //           fontSize: 10,
  //         },
  //         dataTable: {
  //           fontSize: 9,
  //         },
  //         dataEmpresa: {
  //           fontSize: 7.5,
  //         },
  //       },
  //       images: {
  //         logo: imageUrl,
  //       },
  //       pageSize: 'LETTER',
  //       pageMargins: [30, 30, 30, 30],

  //     };
  //     const pdfDocGenerator = pdfMake.createPdf(docDefinition);
  //     const result = await new Promise<Blob>((resolve, reject) => {
  //       pdfDocGenerator.getBlob((blob: Blob) => {
  //         resolve(blob);
  //       });
  //     });
  //     return result;

  //   }

  //   async printReservas(consultorioHorario: any, fechaReserva: any, regional: string, centroMedico: string, consultorio: string, medico: string, isAdicional: boolean): Promise<Blob> {
  //     const imageUrl = `${location.origin}/assets/layout/images/cns.png`;
  //     const reservas = await lastValueFrom(this.reservasService.getByMedicoConsultorio({
  //       consultorioId: consultorioHorario.consultorioId,
  //       medicoUsuarioId: consultorioHorario.medicoUsuarioId,
  //       fechaReserva: this.pipe.transform(fechaReserva, 'yyyy-MM-dd'),
  //     }));
  //     const rows: any = [];
  //     reservas.map((r: any) => {
  //       const res: any = [
  //         { text: r.hora?.inicioDetalle, alignment: 'center', style: 'dataTable' },
  //         {
  //           text: [
  //             { text: r.noAseguradoId > 0 ? '' : `${r.datosAsegurado?.matriculaTitular?.substring(0, 2)}`, style: 'cod1' },
  //             { text: r.noAseguradoId > 0 ? '' : `${r.datosAsegurado?.matriculaTitular?.substring(2)}-${r.datosAsegurado?.codigo}`, style: 'cod2' }
  //           ]
  //         },
  //         { text: r.noAseguradoId > 0 ? `${r.noAsegurado?.nombres} ${r.noAsegurado?.paterno} ${r.noAsegurado?.materno}` : `${r.asegurado?.nombres} ${r.asegurado?.paterno} ${r.asegurado?.materno}`, style: 'dataTable' },
  //         { text: r.noAseguradoId > 0 ? `${r.noAsegurado?.documentoIdentidad}` : `${r.asegurado?.documentoIdentidad}`, alignment: 'center', style: 'dataTable' },
  //         { text: r.noAseguradoId > 0 ? (r.noAsegurado.tipoRegistro == 1 ? 'Particular' : 'Convenio') : r.isNuevo ? 'Primera' : 'Regular', alignment: 'center', style: 'dataTable' },
  //         // { text: r.datosAsegurado?.consultorioAdscrito, style: 'dataTable' },
  //         { text: r.noAseguradoId > 0 ? '' : `${r.datosAsegurado?.razonSocial}\n${r.datosAsegurado?.nroPatronal}`, style: 'dataEmpresa' },
  //       ]
  //       rows.push(res);
  //     });
  //     const docDefinition: TDocumentDefinitions = {
  //       // header: [
  //       //   {
  //       //     margin: [10, 10, 10, 10],
  //       //     height: 400,
  //       //     style: 'headerReport',
  //       //     columns: [
  //       //       {
  //       //         width: 100,
  //       //         image: 'logo',
  //       //         fit: [70, 100],
  //       //         alignment: 'center',
  //       //         margin: [20, 0, 0, 0],
  //       //       },
  //       //       {
  //       //         width: '60%',
  //       //         text: `CAJA NACIONAL DE SALUD\n${regional}`,
  //       //         fontSize: 12,
  //       //         bold: true,
  //       //         alignment: 'left'
  //       //       },
  //       //       {
  //       //         fit: 50,
  //       //         qr: `Caja Nacional de Salud`,
  //       //       },
  //       //     ],
  //       //   },
  //       // ],
  //       content: [
  //         {
  //           margin: [0, 0, 0, 0],
  //           style: 'headerReport',
  //           columns: [
  //             {
  //               width: 70,
  //               image: 'logo',
  //               fit: [70, 100],
  //               alignment: 'left',
  //               margin: [0, 0, 0, 0],
  //             },
  //             {
  //               width: '70%',
  //               stack: [
  //                 {
  //                   text: `CAJA NACIONAL DE SALUD`,
  //                   fontSize: 13,
  //                   bold: true,
  //                   alignment: 'left'
  //                 },
  //                 {
  //                   text: regional,
  //                   fontSize: 12,
  //                   bold: true,
  //                   alignment: 'left'
  //                 },
  //                 {
  //                   text: `DETALLE DE PROGRAMACIONES`,
  //                   fontSize: 17,
  //                   bold: true,
  //                   alignment: 'center'
  //                 }
  //               ],
  //             },
  //             {
  //               fit: 100,
  //               qr: `Caja Nacional de Salud\nDetalle de Programaciones\n
  //               ${consultorio} - ${medico}
  //               `,
  //               alignment: 'right'
  //             },
  //           ],
  //         },
  //         {
  //           margin: [0, 10, 0, 0],
  //           columns: [
  //             {
  //               width: '50%',
  //               alignment: 'left',
  //               text:
  //                 [
  //                   {
  //                     text: 'Centro Médico: ',
  //                     style: 'dataCabecera'
  //                   },
  //                   {
  //                     text: centroMedico,
  //                     bold: true,
  //                     style: 'dataCabecera'
  //                   }
  //                 ]
  //             },
  //             {
  //               width: '50%',
  //               alignment: 'left',
  //               text: [
  //                 {
  //                   text: 'Médico: ',
  //                   style: 'dataCabecera'
  //                 },
  //                 {
  //                   text: medico,
  //                   bold: true,
  //                   style: 'dataCabecera'
  //                 }
  //               ]

  //             }]
  //         },
  //         {
  //           columns: [
  //             {
  //               alignment: 'left',
  //               text: [
  //                 {
  //                   text: 'Consultorio: ',
  //                   style: 'dataCabecera'
  //                 },
  //                 {
  //                   text: consultorio,
  //                   bold: true,
  //                   alignment: 'left',
  //                   style: 'dataCabecera'
  //                 }
  //               ]
  //             },
  //             {
  //               alignment: 'left',
  //               text: [
  //                 {
  //                   text: 'Fecha: ',
  //                   style: 'dataCabecera'
  //                 },
  //                 {
  //                   text: `${this.pipe.transform(fechaReserva, 'dd/MM/yyyy')}`,
  //                   bold: true,
  //                   alignment: 'left',
  //                   style: 'dataCabecera'
  //                 }
  //               ]

  //             }]
  //         },
  //         {
  //           columns: [
  //             {
  //               margin: [0, 10, 0, 0],
  //               width: '100%',
  //               fontSize: 10,
  //               table: {

  //                 headerRows: 1,

  //                 widths: [30, 80, 175, 65, 65, 85],
  //                 body: [
  //                   [
  //                     { text: 'Hora', bold: true, style: 'header' },
  //                     { text: 'Codigo', bold: true, style: 'header' },
  //                     { text: 'Paciente', bold: true, style: 'header' },
  //                     { text: 'C.I.', bold: true, style: 'header' },
  //                     { text: 'Tipo Atención', bold: true, style: 'header' },
  //                     // { text: 'Consultorio Familiar', bold: true, style: 'header' },
  //                     { text: 'Empresa', bold: true, style: 'header' },
  //                   ],
  //                   ...rows
  //                 ]
  //               },
  //             },
  //           ],
  //         },

  //       ],
  //       footer: {
  //         height: 120,
  //         margin: [20, 0, 20, 0],
  //         table: {
  //           widths: ['*', '*', '*', '*'],
  //           body: [
  //             [
  //               { text: 'ENTREGADO POR', alignment: 'center', fontSize: 10 },
  //               { text: 'RECOGIDO POR', alignment: 'center', fontSize: 10 },
  //               { text: 'DEVUELTO POR', alignment: 'center', fontSize: 10 },
  //               { text: 'RECIBIDO POR', alignment: 'center', fontSize: 10 }
  //             ]
  //           ]
  //         },
  //         layout: 'noBorders'
  //       },
  //       styles: {
  //         cod1: { color: 'gray', fontSize: 10 },
  //         cod2: { bold: true, fontSize: 10 },
  //         header: {
  //           fontSize: 10,
  //           bold: true,
  //           alignment: 'center',
  //         },
  //         dataCabecera: {
  //           fontSize: 10,
  //         },
  //         dataTable: {
  //           fontSize: 10,
  //         },
  //         dataEmpresa: {
  //           fontSize: 7.5,
  //         },
  //       },
  //       images: {
  //         logo: imageUrl,
  //       },
  //       pageSize: 'LETTER',
  //       pageMargins: [30, 30, 30, 30],

  //     };
  //     const pdfDocGenerator = pdfMake.createPdf(docDefinition);
  //     const result = await new Promise<Blob>((resolve, reject) => {
  //       pdfDocGenerator.getBlob((blob: Blob) => {
  //         resolve(blob);
  //       });
  //     });
  //     return result;

  //   }

  //   async printReservasAtendidas(fechaReserva: any, regional: string, centroMedico: string, consultorio: any): Promise<Blob> {
  //     const imageUrl = `${location.origin}/assets/layout/images/cns.png`;
  //     const reservas = await lastValueFrom(this.kardexService.getReservasByConsultorio({
  //       consultorioId: consultorio?.consultorioId,
  //       medicoUsuarioId: consultorio?.medicoUsuarioId,
  //       fechaReserva: this.pipe.transform(fechaReserva, 'yyyy-MM-dd')
  //     }
  //     ));
  //     const grupoFamiliarIds: number[] = [];
  //     reservas.forEach((dato) => {
  //       grupoFamiliarIds.push(dato.datosAsegurado?.grupoFamiliarId);
  //     });

  //     const rows: any = [];
  //     reservas.map((r: any) => {
  //       const res: any = [
  //         { text: r.hora?.inicioDetalle, alignment: 'center', style: 'dataTable' },
  //         {
  //           text: [
  //             { text: r.noAseguradoId > 0 ? '' : `${r.datosAsegurado?.matriculaTitular?.substring(0, 2)}`, style: 'cod1' },
  //             { text: r.noAseguradoId > 0 ? '' : `${r.datosAsegurado?.matriculaTitular?.substring(2)}-${r.datosAsegurado?.codigo}`, style: 'cod2' }
  //           ]
  //         },
  //         { text: r.noAseguradoId > 0 ? `${r.noAsegurado?.nombres} ${r.noAsegurado?.paterno} ${r.noAsegurado?.materno}` : `${r.asegurado?.nombres} ${r.asegurado?.paterno} ${r.asegurado?.materno}`, style: 'dataTable' },
  //         { text: r.noAseguradoId > 0 ? `${r.noAsegurado?.documentoIdentidad}` : `${r.asegurado?.documentoIdentidad}`, alignment: 'center', style: 'dataTable' },
  //         { text: r.noAseguradoId > 0 ? (r.noAsegurado.tipoRegistro == 1 ? 'Particular' : 'Convenio') : r.isNuevo ? 'Primera' : 'Regular', alignment: 'center', style: 'dataTable' },
  //         // { text: r.datosAsegurado?.consultorioAdscrito, style: 'dataTable' },
  //         { text: r.datosAsegurado?.nroPatronal, alignment: 'center', style: 'dataTable' },
  //       ]
  //       rows.push(res);
  //     });
  //     const docDefinition: TDocumentDefinitions = {
  //       content: [
  //         {
  //           margin: [0, 0, 0, 0],
  //           style: 'headerReport',
  //           columns: [
  //             {
  //               width: 70,
  //               image: 'logo',
  //               fit: [70, 100],
  //               alignment: 'left',
  //               margin: [0, 0, 0, 0],
  //             },
  //             {
  //               width: '75%',
  //               stack: [
  //                 {
  //                   text: `CAJA NACIONAL DE SALUD`,
  //                   fontSize: 13,
  //                   bold: true,
  //                   alignment: 'left'
  //                 },
  //                 {
  //                   text: regional,
  //                   fontSize: 12,
  //                   bold: true,
  //                   alignment: 'left'
  //                 },
  //                 {
  //                   text: `DETALLE DE ATENCIONES`,
  //                   fontSize: 17,
  //                   bold: true,
  //                   alignment: 'center'
  //                 }
  //               ],
  //             },
  //             {
  //               fit: 100,
  //               qr: `Caja Nacional de Salud\nDetalle de Programaciones\n
  //               ${consultorio?.consultorio} - ${consultorio?.nombres}
  //               `,
  //               alignment: 'right'
  //             },
  //           ],
  //         },
  //         {
  //           margin: [0, 10, 0, 0],
  //           columns: [
  //             {
  //               width: '50%',
  //               alignment: 'left',
  //               text:
  //                 [
  //                   {
  //                     text: 'Centro Médico: ',
  //                     style: 'dataCabecera'
  //                   },
  //                   {
  //                     text: centroMedico,
  //                     bold: true,
  //                     style: 'dataCabecera'
  //                   }
  //                 ]
  //             },
  //             {
  //               width: '50%',
  //               alignment: 'left',
  //               text: [
  //                 {
  //                   text: 'Médico: ',
  //                   style: 'dataCabecera'
  //                 },
  //                 {
  //                   text: consultorio?.nombres,
  //                   bold: true,
  //                   style: 'dataCabecera'
  //                 }
  //               ]

  //             }]
  //         },
  //         {
  //           columns: [
  //             {
  //               alignment: 'left',
  //               text: [
  //                 {
  //                   text: 'Consultorio: ',
  //                   style: 'dataCabecera'
  //                 },
  //                 {
  //                   text: consultorio.consultorio,
  //                   bold: true,
  //                   alignment: 'left',
  //                   style: 'dataCabecera'
  //                 }
  //               ]
  //             },
  //             {
  //               alignment: 'left',
  //               text: [
  //                 {
  //                   text: 'Fecha: ',
  //                   style: 'dataCabecera'
  //                 },
  //                 {
  //                   text: `${this.pipe.transform(fechaReserva, 'dd/MM/yyyy')}`,
  //                   bold: true,
  //                   alignment: 'left',
  //                   style: 'dataCabecera'
  //                 }
  //               ]

  //             }]
  //         },
  //         {
  //           columns: [
  //             {
  //               margin: [0, 10, 0, 0],
  //               width: '100%',
  //               fontSize: 10,
  //               table: {

  //                 headerRows: 1,

  //                 widths: [25, 75, 180, 65, 60, 100],
  //                 body: [
  //                   [
  //                     { text: 'Nro.', bold: true, style: 'header' },
  //                     { text: 'Codigo', bold: true, style: 'header' },
  //                     { text: 'Paciente', bold: true, style: 'header' },
  //                     { text: 'C.I.', bold: true, style: 'header' },
  //                     { text: 'Estado', bold: true, style: 'header' },
  //                     // { text: 'Consultorio Familiar', bold: true, style: 'header' },
  //                     { text: 'Empresa', bold: true, style: 'header' },
  //                   ],
  //                   ...rows
  //                 ]
  //               },
  //             },
  //           ],
  //         },

  //       ],
  //       footer: {
  //         height: 120,
  //         margin: [20, 0, 20, 0],
  //         table: {
  //           widths: ['*', '*', '*', '*'],
  //           body: [
  //             [
  //               { text: 'ENTREGADO POR', alignment: 'center', fontSize: 10 },
  //               { text: 'RECOGIDO POR', alignment: 'center', fontSize: 10 },
  //               { text: 'DEVUELTO POR', alignment: 'center', fontSize: 10 },
  //               { text: 'RECIBIDO POR', alignment: 'center', fontSize: 10 }
  //             ]
  //           ]
  //         },
  //         layout: 'noBorders'
  //       },
  //       styles: {
  //         cod1: { color: 'gray', fontSize: 9 },
  //         cod2: { bold: true, fontSize: 9 },
  //         header: {
  //           fontSize: 9,
  //           bold: true,
  //           alignment: 'center',
  //         },
  //         dataCabecera: {
  //           fontSize: 10,
  //         },
  //         dataTable: {
  //           fontSize: 9,
  //         },
  //         dataEmpresa: {
  //           fontSize: 7.5,
  //         },
  //       },
  //       images: {
  //         logo: imageUrl,
  //       },
  //       pageSize: 'LETTER',
  //       pageMargins: [30, 30, 30, 30],

  //     };
  //     const pdfDocGenerator = pdfMake.createPdf(docDefinition);
  //     const result = await new Promise<Blob>((resolve, reject) => {
  //       pdfDocGenerator.getBlob((blob: Blob) => {
  //         resolve(blob);
  //       });
  //     });
  //     return result;

  //   }

  //   async printReservasEnfermeria(fechaReserva: any, regional: string, centroMedico: any, consultorio: any): Promise<Blob> {
  //     const imageUrl = `${location.origin}/assets/layout/images/cns.png`;
  //     let reservas = await lastValueFrom(this.kardexService.getReservasByConsultorio({
  //       consultorioId: consultorio?.consultorioId,
  //       medicoUsuarioId: consultorio?.medicoUsuarioId,
  //       fechaReserva: this.pipe.transform(fechaReserva, 'yyyy-MM-dd')
  //     }
  //     ));
  //     const grupoFamiliarIds: number[] = [];
  //     reservas.forEach((dato) => {
  //       grupoFamiliarIds.push(dato.datosAsegurado?.grupoFamiliarId);
  //     });
  //     if (reservas.length > 0) {
  //       const idsGrupo = reservas.map((x: any) => { return x.grupoFamiliarId });
  //       const listAdscripcion = await lastValueFrom(this.adscripcionService.getByIdsGrupo({ grupoIds: idsGrupo }));
  //       if (listAdscripcion.length > 0) {
  //         reservas = reservas.map((x: any) => {
  //           x.adscripcion = listAdscripcion.find((y: any) => y.grupoFamiliarId == x.grupoFamiliarId);
  //           return x;
  //         });
  //       }
  //     }
  //     const rows: any = [];
  //     reservas.map((r: any) => {
  //       const res: any = [
  //         { text: r.hora?.numero, alignment: 'center', style: 'dataTable' },
  //         { text: r.hora?.inicioDetalle, alignment: 'center', style: 'dataTable' },
  //         {
  //           text: [
  //             { text: r.noAseguradoId > 0 ? '' : `${r.datosAsegurado?.matriculaTitular?.substring(0, 2)}`, style: 'cod1' },
  //             { text: r.noAseguradoId > 0 ? '' : `${r.datosAsegurado?.matriculaTitular?.substring(2)}-${r.datosAsegurado?.codigo}`, style: 'cod2' }
  //           ]
  //         },
  //         { text: r.noAseguradoId > 0 ? `${r.noAsegurado?.nombres} ${r.noAsegurado?.paterno} ${r.noAsegurado?.materno}` : `${r.asegurado?.nombres} ${r.asegurado?.paterno} ${r.asegurado?.materno}`, style: 'dataTable' },
  //         { text: r.noAseguradoId > 0 ? `${r.noAsegurado?.documentoIdentidad}` : `${r.asegurado?.documentoIdentidad}`, alignment: 'center', style: 'dataTable' },
  //         { text: r.noAseguradoId > 0 ? (r.noAsegurado.tipoRegistro == 1 ? 'Particular' : 'Convenio') : r.isNuevo ? 'Primera' : 'Regular', alignment: 'center', style: 'dataTable' },
  //         // { text: r.datosAsegurado?.consultorioAdscrito, style: 'dataTable' },
  //         { text: r.noAseguradoId > 0 ? '' : `${r.datosAsegurado?.razonSocial}\n${r.datosAsegurado?.nroPatronal}`, style: 'dataEmpresa' },
  //       ]
  //       rows.push(res);
  //     });
  //     const docDefinition: TDocumentDefinitions = {
  //       content: [
  //         {
  //           margin: [0, 0, 0, 0],
  //           style: 'headerReport',
  //           columns: [
  //             {
  //               width: 70,
  //               image: 'logo',
  //               fit: [70, 100],
  //               alignment: 'left',
  //               margin: [0, 0, 0, 0],
  //             },
  //             {
  //               width: '75%',
  //               stack: [
  //                 {
  //                   text: `CAJA NACIONAL DE SALUD`,
  //                   fontSize: 13,
  //                   bold: true,
  //                   alignment: 'left'
  //                 },
  //                 {
  //                   text: regional,
  //                   fontSize: 12,
  //                   bold: true,
  //                   alignment: 'left'
  //                 },
  //                 {
  //                   text: `DETALLE DE ATENCIONES`,
  //                   fontSize: 17,
  //                   bold: true,
  //                   alignment: 'center'
  //                 }
  //               ],
  //             },
  //             {
  //               fit: 100,
  //               qr: `Caja Nacional de Salud\nDetalle de Programaciones\n
  //               ${consultorio?.consultorio} - ${consultorio?.nombres}
  //               `,
  //               alignment: 'right'
  //             },
  //           ],
  //         },
  //         {
  //           margin: [0, 10, 0, 0],
  //           columns: [
  //             {
  //               width: '50%',
  //               alignment: 'left',
  //               text:
  //                 [
  //                   {
  //                     text: 'Centro Médico: ',
  //                     style: 'dataCabecera'
  //                   },
  //                   {
  //                     text: centroMedico.descripcion,
  //                     bold: true,
  //                     style: 'dataCabecera'
  //                   }
  //                 ]
  //             },
  //             {
  //               width: '50%',
  //               alignment: 'left',
  //               text: [
  //                 {
  //                   text: 'Médico: ',
  //                   style: 'dataCabecera'
  //                 },
  //                 {
  //                   text: consultorio?.nombres,
  //                   bold: true,
  //                   style: 'dataCabecera'
  //                 }
  //               ]

  //             }]
  //         },
  //         {
  //           columns: [
  //             {
  //               alignment: 'left',
  //               text: [
  //                 {
  //                   text: 'Consultorio: ',
  //                   style: 'dataCabecera'
  //                 },
  //                 {
  //                   text: consultorio.consultorio,
  //                   bold: true,
  //                   alignment: 'left',
  //                   style: 'dataCabecera'
  //                 }
  //               ]
  //             },
  //             {
  //               alignment: 'left',
  //               text: [
  //                 {
  //                   text: 'Fecha: ',
  //                   style: 'dataCabecera'
  //                 },
  //                 {
  //                   text: `${this.pipe.transform(fechaReserva, 'dd/MM/yyyy')}`,
  //                   bold: true,
  //                   alignment: 'left',
  //                   style: 'dataCabecera'
  //                 }
  //               ]

  //             }]
  //         },
  //         {
  //           columns: [
  //             {
  //               margin: [0, 10, 0, 0],
  //               width: '100%',
  //               fontSize: 10,
  //               table: {

  //                 headerRows: 1,

  //                 widths: [15, 25, 75, 150, 60, 60, 105],
  //                 body: [
  //                   [
  //                     { text: 'N°', bold: true, style: 'header' },
  //                     { text: 'Hora', bold: true, style: 'header' },
  //                     { text: 'Codigo', bold: true, style: 'header' },
  //                     { text: 'Paciente', bold: true, style: 'header' },
  //                     { text: 'C.I.', bold: true, style: 'header' },
  //                     { text: 'Estado', bold: true, style: 'header' },
  //                     // { text: 'Consultorio Familiar', bold: true, style: 'header' },
  //                     { text: 'Empresa', bold: true, style: 'header' },
  //                   ],
  //                   ...rows
  //                 ]
  //               },
  //             },
  //           ],
  //         },

  //       ],
  //       footer: {
  //         height: 120,
  //         margin: [20, 0, 20, 0],
  //         table: {
  //           widths: ['*', '*', '*', '*'],
  //           body: [
  //             [
  //               { text: 'ENTREGADO POR', alignment: 'center', fontSize: 10 },
  //               { text: 'RECOGIDO POR', alignment: 'center', fontSize: 10 },
  //               { text: 'DEVUELTO POR', alignment: 'center', fontSize: 10 },
  //               { text: 'RECIBIDO POR', alignment: 'center', fontSize: 10 }
  //             ]
  //           ]
  //         },
  //         layout: 'noBorders'
  //       },
  //       styles: {
  //         cod1: { color: 'gray', fontSize: 9 },
  //         cod2: { bold: true, fontSize: 9 },
  //         header: {
  //           fontSize: 9,
  //           bold: true,
  //           alignment: 'center',
  //         },
  //         dataCabecera: {
  //           fontSize: 10,
  //         },
  //         dataTable: {
  //           fontSize: 9,
  //         },
  //         dataEmpresa: {
  //           fontSize: 7.5,
  //         },
  //       },
  //       images: {
  //         logo: imageUrl,
  //       },
  //       pageSize: 'LETTER',
  //       pageMargins: [30, 30, 30, 30],

  //     };
  //     const pdfDocGenerator = pdfMake.createPdf(docDefinition);
  //     const result = await new Promise<Blob>((resolve, reject) => {
  //       pdfDocGenerator.getBlob((blob: Blob) => {
  //         resolve(blob);
  //       });
  //     });
  //     return result;

  //   }

  //   getDataAdscripcion(reserva: any, centro: any) {
  //     if (reserva.adscripcion) {
  //       if (reserva.adscripcion.centroMedicoId != centro.id) {
  //         return `${reserva.adscripcion?.centroMedico?.descripcion} - ${reserva.adscripcion?.consultorio?.descripcion}`;
  //       }
  //       if (reserva.adscripcion.centroMedicoId == centro.id) {
  //         return reserva.adscripcion?.consultorio?.descripcion;
  //       }
  //     }
  //     return reserva.asegurado?.centroMedico;
  //   }

  //   async printDetalleAtenciones(regional: string, centro: string, fechas: string, empresa: string, data: any, dataFooter: any): Promise<Blob> {
  //     const imageUrl = `${location.origin}/assets/layout/images/cns.png`;
  //     const rows: any = [];
  //     let i = 1;
  //     data.map((r: any) => {
  //       const res: any = [
  //         { text: i++, alignment: 'center', style: 'dataTable', valign: 'middle' },
  //         { text: r.paciente, style: 'dataTable', valign: 'middle' },
  //         { text: r.documentoIdentidad, alignment: 'center', style: 'dataTable', valign: 'middle' },
  //         {
  //           text: [
  //             { text: r.noAseguradoId > 0 ? '' : `${r.matriculaTitular?.substring(0, 2)}`, style: 'cod1' },
  //             { text: r.noAseguradoId > 0 ? '' : `${r.matriculaTitular?.substring(2)}-${r.codigo}`, style: 'cod2' }
  //           ],
  //           valign: 'middle'
  //         },
  //         { text: r.ubicacion, alignment: 'center', style: 'dataTable', valign: 'middle' },
  //         { text: r.consultorio, alignment: 'center', style: 'dataTable', valign: 'middle' },
  //         { text: r.medico, style: 'dataTable', valign: 'middle' },
  //         { text: r.fechaReserva, alignment: 'center', style: 'dataTable', valign: 'middle' },
  //         { text: r.estadoReserva, alignment: 'center', style: 'dataTable', valign: 'middle' },
  //       ]
  //       rows.push(res);
  //     });
  //     const docDefinition: TDocumentDefinitions = {
  //       content: [
  //         {
  //           margin: [0, 0, 0, 0],
  //           style: 'headerReport',
  //           columns: [
  //             {
  //               width: 70,
  //               image: 'logo',
  //               fit: [70, 100],
  //               alignment: 'left',
  //               margin: [0, 0, 0, 0],
  //             },
  //             {
  //               width: '75%',
  //               stack: [
  //                 {
  //                   text: `CAJA NACIONAL DE SALUD`,
  //                   fontSize: 13,
  //                   bold: true,
  //                   alignment: 'left'
  //                 },
  //                 {
  //                   text: centro,
  //                   fontSize: 11,
  //                   bold: true,
  //                   alignment: 'left'
  //                 },
  //                 {
  //                   text: ` LISTADO DETALLE DE ATENCIONES`,
  //                   fontSize: 17,
  //                   bold: true,
  //                   alignment: 'center'
  //                 }
  //               ],
  //             },
  //             {
  //               fit: 100,
  //               qr: `Caja Nacional de Salud\nDetalle de atenciones\n
  //               ${centro}
  //               `,
  //               alignment: 'right'
  //             },
  //           ],
  //         },
  //         {
  //           margin: [0, 10, 0, 0],
  //           columns: [
  //             {
  //               width: '50%',
  //               alignment: 'left',
  //               text:
  //                 [
  //                   {
  //                     text: 'Regional: ',
  //                     style: 'dataCabecera'
  //                   },
  //                   {
  //                     text: regional,
  //                     bold: true,
  //                     style: 'dataCabecera'
  //                   }
  //                 ]
  //             },
  //             {
  //               width: '50%',
  //               alignment: 'left',
  //               text: [
  //                 {
  //                   text: empresa == '' ? '' : 'Empresa: ',
  //                   style: 'dataCabecera'
  //                 },
  //                 {
  //                   text: empresa == '' ? '' : empresa,
  //                   bold: true,
  //                   style: 'dataCabecera'
  //                 }
  //               ]

  //             }]
  //         },
  //         {
  //           columns: [
  //             {
  //               alignment: 'left',
  //               text: [
  //                 {
  //                   text: 'Centro Médico: ',
  //                   style: 'dataCabecera'
  //                 },
  //                 {
  //                   text: centro,
  //                   bold: true,
  //                   alignment: 'left',
  //                   style: 'dataCabecera'
  //                 }
  //               ]
  //             },
  //             {
  //               alignment: 'left',
  //               text: [
  //                 {
  //                   text: 'Rango de Fechas: ',
  //                   style: 'dataCabecera'
  //                 },
  //                 {
  //                   text: fechas,
  //                   bold: true,
  //                   alignment: 'left',
  //                   style: 'dataCabecera'
  //                 }
  //               ]

  //             }]
  //         },
  //         {
  //           columns: [
  //             {
  //               margin: [0, 10, 0, 0],
  //               width: '100%',
  //               fontSize: 10,
  //               table: {

  //                 headerRows: 1,

  //                 widths: ['4%', '15%', '10%', '11%', '10%', '15%', '15%', '10%', '10%'],
  //                 body: [
  //                   [
  //                     { text: 'N°', bold: true, style: 'header', valign: 'middle' },            // 20
  //                     { text: 'Paciente', bold: true, style: 'header', valign: 'middle' },      // 60
  //                     { text: 'C.I.', bold: true, style: 'header', valign: 'middle' },          // 40
  //                     { text: 'Matrícula', bold: true, style: 'header', valign: 'middle' },     // 60
  //                     { text: 'Regional', bold: true, style: 'header', valign: 'middle' },      // 60
  //                     { text: 'Consultorio', bold: true, style: 'header', valign: 'middle' },   // 60
  //                     { text: 'Medico', bold: true, style: 'header', valign: 'middle' },        // 60
  //                     { text: 'Fecha Atención', bold: true, style: 'header', valign: 'middle' },// 60
  //                     { text: 'Estado Atención', bold: true, style: 'header', valign: 'middle' }// 60
  //                   ],
  //                   ...rows
  //                 ]
  //               },
  //             },
  //             {
  //               margin: [0, 10, 0, 0],
  //               width: '100%',
  //               fontSize: 10,
  //               table: {

  //                 headerRows: 1,

  //                 widths: ['*', '*'],
  //                 body: [
  //                   [
  //                     { text: 'Total Registros', alignment: 'center', fontSize: 10, colSpan: 2 },
  //                     {} // celda vacía para completar el colSpan
  //                   ],
  //                   [
  //                     { text: 'Atendidos:', alignment: 'center', fontSize: 10 },
  //                     { text: dataFooter.valorAtendidos, alignment: 'center', fontSize: 10 }
  //                   ],
  //                   [
  //                     { text: 'Sin asistencia', alignment: 'center', fontSize: 10 },
  //                     { text: dataFooter.valorSinAsistencia, alignment: 'center', fontSize: 10 }
  //                   ],
  //                   [
  //                     { text: 'Programados', alignment: 'center', fontSize: 10 },
  //                     { text: dataFooter.valorProgramados, alignment: 'center', fontSize: 10 }
  //                   ]
  //                 ]
  //               },
  //             },
  //           ],
  //         },

  //       ],
  //       styles: {
  //         cod1: { color: 'gray', fontSize: 9 },
  //         cod2: { bold: true, fontSize: 9 },
  //         header: {
  //           fontSize: 9,
  //           bold: true,
  //           alignment: 'center',
  //         },
  //         dataCabecera: {
  //           fontSize: 10,
  //         },
  //         dataTable: {
  //           fontSize: 9,
  //         },
  //         dataConsultorio: {
  //           fontSize: 8,
  //         },

  //       },
  //       images: {
  //         logo: imageUrl,
  //       },
  //       pageSize: 'LETTER',
  //       pageOrientation: 'landscape',
  //       pageMargins: [30, 30, 30, 30],

  //     };
  //     const pdfDocGenerator = pdfMake.createPdf(docDefinition);
  //     const result = await new Promise<Blob>((resolve, reject) => {
  //       pdfDocGenerator.getBlob((blob: Blob) => {
  //         resolve(blob);
  //       });
  //     });
  //     return result;

  //   }

  //   async printDetalleAtencionesJSPDF(regional: string, centro: string, fechas: string, empresa: string, data: any, dataFooter: any): Promise<Blob> {
  //     const jsPDF = (await import('jspdf')).jsPDF;
  //     const autoTable = (await import('jspdf-autotable')).default;

  //     const doc = new jsPDF({ orientation: 'landscape', unit: 'pt', format: 'letter' });

  //     const logoUrl = `${location.origin}/assets/layout/images/cns.png`;
  //     const getBase64FromUrl = async (url: string): Promise<string> => {
  //       const response = await fetch(url);
  //       const blob = await response.blob();
  //       return new Promise((resolve, reject) => {
  //         const reader = new FileReader();
  //         reader.onloadend = () => resolve(reader.result as string);
  //         reader.onerror = reject;
  //         reader.readAsDataURL(blob);
  //       });
  //     };
  //     const logoBase64 = await getBase64FromUrl(logoUrl);
  //     doc.addImage(logoBase64, 'PNG', 40, 20, 60, 60);

  //     doc.setFontSize(14);
  //     doc.text('CAJA NACIONAL DE SALUD', 120, 40);
  //     doc.setFontSize(11);
  //     doc.text(centro, 120, 60);
  //     doc.setFontSize(12);
  //     doc.text('LISTADO DE DETALLE DE ATENCIONES', 270, 80);
  //     doc.setFontSize(10);
  //     doc.setFont('normal');
  //     doc.text('Regional:', 120, 100);
  //     doc.setFont('bold');
  //     doc.text(regional, 180, 100);

  //     if (empresa) {
  //       doc.setFont('normal');
  //       doc.text('Empresa:', 450, 100);
  //       doc.setFont('bold');
  //       doc.text(empresa, 510, 100);
  //     }

  //     doc.setFont('normal');
  //     doc.text('Centro Médico:', 120, 120);
  //     doc.setFont('bold');
  //     const centroLines = doc.splitTextToSize(centro, 250);
  //     doc.text(centroLines, 200, 120);

  //     doc.setFont('normal');
  //     doc.text('Rango de Fechas:', 450, 120);
  //     doc.setFont('bold');
  //     doc.text(fechas, 550, 120);
  //     doc.setFont('normal');
  //     const columns = [
  //       { header: 'N°', dataKey: 'nro' },
  //       { header: 'Paciente', dataKey: 'paciente' },
  //       { header: 'C.I.', dataKey: 'ci' },
  //       { header: 'Matrícula', dataKey: 'matricula' },
  //       { header: 'Regional', dataKey: 'regional' },
  //       { header: 'Consultorio', dataKey: 'consultorio' },
  //       { header: 'Medico', dataKey: 'medico' },
  //       { header: 'Fecha Atención', dataKey: 'fecha' },
  //       { header: 'Estado Atención', dataKey: 'estado' }
  //     ];

  //     const rows = data.map((r: any, idx: number) => [
  //       idx + 1,
  //       r.paciente,
  //       r.documentoIdentidad,
  //       r.noAseguradoId > 0 ? '' : `${r.matriculaTitular?.substring(0, 2)}${r.matriculaTitular?.substring(2)}-${r.codigo}`,
  //       r.ubicacion,
  //       r.consultorio,
  //       r.medico,
  //       r.fechaReserva,
  //       r.estadoReserva
  //     ]);

  //     const mainTableResult = autoTable(doc, {
  //       head: [columns.map(col => col.header)],
  //       body: rows,
  //       startY: 140,
  //       margin: { top: 140 },
  //       styles: { fontSize: 8, valign: 'middle', halign: 'center', lineWidth: 0.1, lineColor: [200, 200, 200] },
  //       headStyles: { fillColor: [255, 255, 255], textColor: 20, fontStyle: 'bold', lineWidth: 0.1, lineColor: [200, 200, 200] },
  //       theme: 'grid',
  //       didDrawPage: (dataArg) => {
  //         if (dataArg.pageNumber > 1) {
  //           doc.addImage(logoBase64, 'PNG', 40, 20, 60, 60);
  //           doc.setFontSize(14);
  //           doc.text('CAJA NACIONAL DE SALUD', 120, 40);
  //           doc.setFontSize(11);
  //           doc.text(centro, 120, 60);
  //           doc.setFontSize(12);
  //           doc.text('LISTADO DE DETALLE DE ATENCIONES', 270, 80);
  //           doc.setFontSize(10);
  //           doc.setFont('normal');
  //           doc.text('Regional:', 120, 100);
  //           doc.setFont('bold');
  //           doc.text(regional, 180, 100);

  //           if (empresa) {
  //             doc.setFont('normal');
  //             doc.text('Empresa:', 450, 100);
  //             doc.setFont('bold');
  //             doc.text(empresa, 510, 100);
  //           }

  //           doc.setFont('normal');
  //           doc.text('Centro Médico:', 120, 120);
  //           doc.setFont('bold');
  //           const centroLines = doc.splitTextToSize(centro, 250);
  //           doc.text(centroLines, 200, 120);

  //           doc.setFont('normal');
  //           doc.text('Rango de Fechas:', 450, 120);
  //           doc.setFont('bold');
  //           doc.text(fechas, 550, 120);
  //           doc.setFont('normal');
  //         }
  //         const pageSize = doc.internal.pageSize;
  //         const pageHeight = pageSize.height ? pageSize.height : pageSize.getHeight();
  //         doc.setFontSize(9);
  //         doc.text(`Página ${doc.getNumberOfPages()}`, pageSize.width - 80, pageHeight - 10);
  //       }
  //     });

  //     autoTable(doc, {
  //       head: [['Total registros', 'Atendidos', 'Sin asistencia', 'Programados']],
  //       body: [[
  //         data.length,
  //         dataFooter?.valorAtendidos ?? '',
  //         dataFooter?.valorSinAsistencia ?? '',
  //         dataFooter?.valorProgramados ?? ''
  //       ]],
  //       startY: (doc as any).lastAutoTable?.finalY ? (doc as any).lastAutoTable.finalY + 20 : undefined,
  //       styles: { fontSize: 10, halign: 'center', valign: 'middle', lineWidth: 0.1, lineColor: [200, 200, 200] },
  //       headStyles: { fillColor: [255, 255, 255], textColor: 20, fontStyle: 'bold', lineWidth: 0.1, lineColor: [200, 200, 200] },
  //       theme: 'grid',
  //       margin: { left: doc.internal.pageSize.getWidth() / 2 - 200, right: doc.internal.pageSize.getWidth() / 2 - 200 }, // centrar tabla
  //       tableWidth: 400
  //     });
  //     // Tabla de totales al final
  //     // autoTable(doc, {
  //     //   head: [['Total Registros', 'Atendidos', 'Sin asistencia', 'Programados']],
  //     //   body: [[
  //     //     data.length,
  //     //     dataFooter?.valorAtendidos ?? '',
  //     //     dataFooter?.valorSinAsistencia ?? '',
  //     //     dataFooter?.valorProgramados ?? ''
  //     //   ]],
  //     //   startY: (mainTableResult && (mainTableResult as any).finalY) ? (mainTableResult as unknown).finalY + 20 : undefined,
  //     //   styles: { fontSize: 10, halign: 'center' },
  //     //   headStyles: { fillColor: [41, 128, 185], textColor: 255 },
  //     //   theme: 'grid'
  //     // });

  //     // Retornar un Blob para visor personalizado
  //     // jsPDF v2.5.1: doc.output('blob') es síncrono
  //     return doc.output('blob');
  //   }

  //   async generarJustificativoMedico(datos: any, generateMedico?: boolean) {
  //     const dateDay = new Date(Date.now());
  //     const imageUrl = `${location.origin}/assets/layout/images/cns.png`;
  //     const dataQR = `Centro Médico Acudido: ${datos.centroMedico.descripcion}\n
  //     Paciente: ${datos.asegurado}\n
  //     C.I.: ${datos.documentoIdentidad}\n
  //     Fecha de Atención: ${datos.fecha}\n
  //     Hora de Asignacion de Ficha: ${datos.horaAsignacion}\n
  //     Hora de Atención Médica: ${datos.horaAtencion}\n
  //     Medico Tratante: ${datos.medicoTratante}\n
  //     Fecha Asignación Justificativo: ${this.pipe.transform(dateDay, 'dd/MM/yyyy')}
  //     `;
  //     const contenBody = generateMedico ? 'Sírvase este documento para acreditar la presencia en el Centro medico y la atención médica al paciente.' : 'Sírvase este documento para acreditar la presencia en el centro medico y la atención médica al paciente.\n Este documento ha sido emitido por la Unidad Administrativa del Centro Médico y acredita la presencia en el mismo.';
  //     const docDefinition: TDocumentDefinitions = {
  //       pageSize: 'LETTER',
  //       pageMargins: [30, 20, 30, 30],
  //       content: [
  //         {
  //           columns: [
  //             {
  //               width: 150,
  //               stack: [
  //                 {
  //                   width: 70,
  //                   image: 'logo',
  //                   fit: [70, 100],
  //                   alignment: 'right',
  //                   margin: [0, 0, 0, 0],
  //                 },
  //               ]
  //             },
  //             {
  //               width: '*',
  //               stack: [
  //                 {
  //                   text: 'CAJA NACIONAL DE SALUD',
  //                   fontSize: 20,
  //                   bold: true,
  //                   alignment: 'center',
  //                   margin: [0, 15, 0, 5]
  //                 },
  //                 {
  //                   text: datos.centroMedico.descripcion,
  //                   fontSize: 14,
  //                   bold: true,
  //                   alignment: 'center',
  //                   color: '#666'
  //                 }
  //               ]
  //             },
  //             {
  //               width: 100,
  //               stack: [

  //               ]
  //             },
  //           ],
  //           margin: [0, 0, 0, 10]
  //         },
  //         {
  //           canvas: [
  //             {
  //               type: 'line',
  //               x1: 0,
  //               y1: 0,
  //               x2: 515,
  //               y2: 0,
  //               lineWidth: 1,
  //               lineColor: '#cccccc'
  //             }
  //           ],
  //           margin: [0, 0, 0, 10]
  //         },
  //         {
  //           columns: [
  //             {
  //               width: 130,
  //               stack: [
  //                 {
  //                   fit: 140,
  //                   qr: dataQR,
  //                   alignment: 'right'
  //                 },
  //               ]
  //             },
  //             {
  //               width: '*',
  //               stack: [
  //                 {
  //                   text: 'JUSTIFICATIVO POR ASISTENCIA MÉDICA',
  //                   fontSize: 16,
  //                   bold: true,
  //                   alignment: 'center',
  //                   margin: [0, 0, 0, 10]
  //                 },
  //                 {
  //                   text: [
  //                     { text: 'El paciente ', fontSize: 11 },
  //                     { text: datos.asegurado || '...................................', fontSize: 11, bold: true, },
  //                     { text: ', con cédula de identidad ', fontSize: 11 },
  //                     { text: datos.documentoIdentidad || '...................', fontSize: 11, bold: true, },
  //                     { text: ' acudió a este Centro Médico el día ', fontSize: 11 },
  //                     { text: datos.fecha || '../../../....', fontSize: 11, bold: true, }
  //                   ],
  //                   alignment: 'justify',
  //                   margin: [0, 0, 0, 5]
  //                 },
  //                 {
  //                   text:
  //                     [
  //                       { text: 'Fecha y hora de Programación de la Ficha: ', fontSize: 11 },
  //                       { text: datos.horaAsignacion || '............', fontSize: 11, bold: true }
  //                     ],
  //                   alignment: 'justify',
  //                   margin: [0, 0, 0, 5],
  //                 },
  //                 {
  //                   text: [
  //                     { text: 'Fecha y hora de Atención Médica : ', fontSize: 11 },
  //                     { text: datos.horaAtencion || '............', fontSize: 11, bold: true }
  //                   ],
  //                   alignment: 'justify',
  //                   margin: [0, 0, 0, 10]
  //                 },
  //                 {
  //                   text: contenBody,
  //                   fontSize: 11,
  //                   alignment: 'justify',
  //                   margin: [0, 0, 0, 8]
  //                 },
  //               ],
  //               margin: [20, 0, 0, 0]
  //             }
  //           ],
  //           margin: [0, 0, 0, 10]
  //         },
  //         {
  //           stack: [
  //             {
  //               text: [
  //                 { text: 'La Paz, ', fontSize: 10 },
  //                 { text: this.pipe.transform(dateDay, 'dd') ?? '', fontSize: 10, bold: true },
  //                 { text: ' de ', fontSize: 10 },
  //                 { text: this.pipe.transform(dateDay, 'MMMM') ?? '', fontSize: 10, bold: true },
  //                 { text: ' de ', fontSize: 10 },
  //                 { text: this.pipe.transform(dateDay, 'yyyy') ?? '', fontSize: 10, bold: true }
  //               ].map(item => typeof item.text === 'string' ? item : { ...item, text: item.text ?? '' }),
  //               alignment: 'right',
  //               margin: [0, 0, 0, 10]
  //             },
  //             {
  //               canvas: [
  //                 {
  //                   type: 'rect',
  //                   x: 300,
  //                   y: 0,
  //                   w: 250,
  //                   h: 50,
  //                   r: 5,
  //                   lineWidth: 2,
  //                   lineColor: '#4A90E2'
  //                 }
  //               ],
  //               margin: [0, 0, 0, 5]
  //             },
  //             {
  //               text: generateMedico ? 'Firma y Sello del Medico' : 'Firma y Sello',
  //               fontSize: 10,
  //               alignment: 'right',
  //               margin: [0, 5, 15, 0]
  //             },
  //             {
  //               columns: [
  //                 {
  //                   width: 130,
  //                   text: '',
  //                 },
  //                 {
  //                   width: '*',
  //                   text: 'La autenticidad del presente justificativo puede verificarse mediante el código QR. La alteración, falsificación o uso indebido del documento será pasible a sanciones conforme normativa vigente.',
  //                   fontSize: 7,
  //                   alignment: 'justify',
  //                   margin: [10, 15, 10, 0],
  //                   color: '#666666'
  //                 }
  //               ]
  //             }
  //           ]
  //         },

  //       ],
  //       images: {
  //         logo: imageUrl,
  //       },
  //     };
  //     const pdfDocGenerator = pdfMake.createPdf(docDefinition);
  //     const result = await new Promise<Blob>((resolve, reject) => {
  //       pdfDocGenerator.getBlob((blob: Blob) => {
  //         resolve(blob);
  //       });
  //     });
  //     return result;
  //   }

  //   async printFichaRehabilitacion(datos: any) {
  //     const dataQR = `Centro Médico: ${datos.centroMedico}\n
  //       Paciente: ${datos.paciente}\n
  //       Consultorio: ${datos.consultorio}\n
  //       Medico: ${datos.medico}\n
  //       Nº Sesiones: ${datos.cantidadProgramacion}\n
  //       Fecha de Emisión: ${this.pipe.transform(new Date(), 'dd/MM/yyyy HH:mm:ss')}\n
  //       Programado por: ${datos.userInfo}
  //       `;

  //     const docDefinition: any = {
  //       pageSize: {
  //         width: 226.8,
  //         height: 856.772
  //       },
  //       pageMargins: [10.5, 0, 10.5, 0],
  //       content: [
  //         {
  //           stack: [
  //             {
  //               text: `CAJA NACIONAL DE SALUD - ${datos?.regional}`,
  //               style: 'header',
  //               alignment: 'center'
  //             },
  //             {
  //               text: datos.centroMedico,
  //               style: 'subheader',
  //               alignment: 'center'
  //             }
  //           ],
  //           width: '*'
  //         },
  //         {
  //           text: 'Ficha de Programacion de Citas',
  //           style: 'titulo',
  //           alignment: 'center',
  //           margin: [0, 0, 0, 10]
  //         },
  //         {
  //           stack: [
  //             {
  //               text: [
  //                 { text: 'Paciente: ', style: 'label' },
  //                 { text: datos.paciente, style: 'value' }
  //               ],
  //               margin: [0, 0, 0, 1]
  //             },
  //             {
  //               text: [
  //                 { text: 'Consultorio: ', style: 'label' },
  //                 { text: datos.consultorio, style: 'value' }
  //               ],
  //               margin: [0, 0, 0, 1]
  //             },
  //             {
  //               text: [
  //                 { text: 'Medico: ', style: 'label' },
  //                 { text: datos.medico, style: 'value' }
  //               ],
  //               margin: [0, 0, 0, 1]
  //             },
  //             {
  //               text: [
  //                 { text: 'Nº Sesiones: ', style: 'label' },
  //                 { text: datos.cantidadProgramacion, style: 'value' }
  //               ],
  //               margin: [0, 0, 0, 10]
  //             }
  //           ]
  //         },
  //         {
  //           table: {
  //             headerRows: 1,
  //             widths: ['auto', '*', 'auto', '*'],
  //             body: [
  //               [
  //                 { text: 'Sesion', style: 'tableHeader' },
  //                 { text: 'Fecha', style: 'tableHeader' },
  //                 { text: 'Hora', style: 'tableHeader' },
  //                 { text: 'Estado', style: 'tableHeader' }
  //               ],
  //               ...((datos.fichas ?? []).map((cita: any) => [
  //                 { text: `${cita.numeroSesion}/${datos.cantidadProgramacion}`, style: 'tableCell' },
  //                 { text: this.pipe.transform(cita.fechaReserva, 'dd/MM/yyyy'), style: 'tableCell' },
  //                 { text: cita.horaInicio, style: 'tableCell' },
  //                 { text: cita.estadoReservaId != 3 ? '' : 'Atendido', style: 'tableCell' }
  //               ]))
  //             ]
  //           },
  //           layout: {
  //             hLineWidth: function () { return 0.1; },
  //             vLineWidth: function () { return 0.1; },
  //             hLineColor: function () { return '#808080'; },
  //             vLineColor: function () { return '#808080'; }
  //           }
  //         },
  //         {
  //           text: 'Su hora de atención es referencial. Le recomendamos presentarse 30 minutos antes para asegurar un inicio puntual de su sesión.',
  //           style: 'nota',
  //           margin: [0, 10, 0, 10]
  //         },
  //         {
  //           qr: dataQR,
  //           fit: 100,
  //           alignment: 'right'
  //         },
  //         {
  //           text: `Programado por: ${datos.userInfo} - ${this.pipe.transform(new Date(), 'dd/MM/yyyy HH:mm:ss')}`,
  //           style: 'footer',
  //           alignment: 'center',
  //           margin: [0, 10, 0, 0]
  //         }
  //       ],
  //       styles: {
  //         header: {
  //           fontSize: 9,
  //           bold: true
  //         },
  //         subheader: {
  //           fontSize: 9,
  //           margin: [0, 2, 0, 0]
  //         },
  //         titulo: {
  //           fontSize: 9,
  //           bold: true
  //         },
  //         label: {
  //           fontSize: 8,
  //           bold: true
  //         },
  //         value: {
  //           fontSize: 8
  //         },
  //         tableHeader: {
  //           fontSize: 8,
  //           bold: true,
  //           alignment: 'center',
  //           margin: [0, 2, 0, 2]
  //         },
  //         tableCell: {
  //           fontSize: 8,
  //           alignment: 'center',
  //           margin: [0, 2, 0, 2]
  //         },
  //         nota: {
  //           fontSize: 8,
  //           italics: true,
  //           alignment: 'justify'
  //         },
  //         footer: {
  //           fontSize: 7
  //         }
  //       }
  //     };
  //     const pdfDocGenerator = pdfMake.createPdf(docDefinition);
  //     pdfDocGenerator.getBlob((blob) => {
  //       const blobUrl = URL.createObjectURL(blob);
  //       const printWindow = window.open(blobUrl, 'Print', 'height=600,width=800');
  //       if (printWindow) {
  //         printWindow.print();
  //         setTimeout(() => {
  //           printWindow.close();
  //           URL.revokeObjectURL(blobUrl);
  //         }, 20000);
  //       }

  //     });
  //   }
}
