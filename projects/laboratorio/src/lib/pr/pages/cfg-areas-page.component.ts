import { Component } from '@angular/core'

import { TabStepComponent } from '../../shared/components/tabstep/tab-step.component'

@Component({
  selector: 'lab-cfg-areas-page',
  standalone: true,
  imports: [TabStepComponent],
  template: `
    <lab-tab-step dominio="areas" modelGroup="areas_group" [lengthCols]="6"  [swStepper]="false">
  `,
})
export class CfgAreasPageComponent { }
