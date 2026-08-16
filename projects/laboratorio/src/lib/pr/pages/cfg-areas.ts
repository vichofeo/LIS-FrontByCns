import { Component } from '@angular/core'

import { TabStep } from '../../shared/components/tabstep/tab-step'

@Component({
  selector: 'lab-cfg-areas-page',
  standalone: true,
  imports: [TabStep],
  templateUrl: './cfg-areas.html',
  styleUrl: './cfg-areas.scss',
})
export class CfgAreas { }
