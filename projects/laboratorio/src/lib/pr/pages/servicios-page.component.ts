import { Component } from '@angular/core'
import { LabCrudComponent } from '../../shared/components/crud/lab-crud.component'

@Component({
  selector: 'lab-servicios-page',
  standalone: true,
  imports: [LabCrudComponent],
  template: `
    <lab-crud
      modelo="serviciosn"
      carpeta="areas"
      [lengthCols]="6"
      tituloCentral="Servicio"
      tituloPopup="Formulario de datos"
    />
  `,
})
export class ServiciosPageComponent {}
