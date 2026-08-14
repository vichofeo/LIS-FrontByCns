import { NgClass, NgTemplateOutlet } from '@angular/common'
import { AfterViewInit, Component, EventEmitter, Input, Output, ViewChild, computed } from '@angular/core'
import { FormsModule } from '@angular/forms'
import { ButtonModule } from 'primeng/button'
import { InputTextModule } from 'primeng/inputtext'
import { Table, TableModule } from 'primeng/table'
import { TooltipModule } from 'primeng/tooltip'

import { TableColumn } from './table-check.models'

@Component({
  selector: 'lab-table-check',
  standalone: true,
  imports: [NgClass, NgTemplateOutlet, FormsModule, TableModule, InputTextModule, ButtonModule, TooltipModule],
  template: `
    <div class="lab-table-wrapper">
      @if (processedData().length > 10) {
        <div class="lab-table-search">
          <input pInputText
            [(ngModel)]="searchText"
            (ngModelChange)="onSearch($event)"
            placeholder="Filtrar datos..."
            class="p-inputtext-sm"
          />
        </div>
      }

      <p-table
        #dt
        [value]="processedData()"
        [columns]="processedColumns()"
        [dataKey]="dataKey"
        [(selection)]="selectedItems"
        (selectionChange)="onSelectionChange($event)"
        [selectionMode]="singleSelect ? 'single' : 'multiple'"
        [rows]="itemsPerPage"
        [paginator]="processedData().length > itemsPerPage"
        [rowHover]="true"
        [globalFilterFields]="globalFilterFields"
        [scrollable]="true"
        [scrollHeight]="maxHeight + 'px'"
        styleClass="p-datatable-sm lab-table"
        [ngClass]="'sticky-column'"
        class="p-datatable-striped responsive-table"
      >
        
         
        <ng-template pTemplate="caption">
          <div class="lab-table-header">
            @if (caption.trim()) {
              <span class="font-weight-bold text-sm">{{ caption }}</span>
            } @else {
              <ng-content select="[labTableCaption]"></ng-content>
            }
          </div>
        </ng-template>

        <ng-template pTemplate="header" let-columns>
          <tr>
            @if (showSelect) {
              <th style="width: 3rem; position: sticky; left: 0; z-index: 4; background: inherit;">
                @if (!singleSelect) {
                  <p-tableHeaderCheckbox />
                }
              </th>
            }
            @for (col of columns; track col.field) {
              <th
                [pSortableColumn]="col.sortable ? col.field : null"
                [style]="{ textAlign: col.align || 'left', width: col.width || 'auto' }"
                [class]="thClass()"
              >
                {{ col.header }}
                @if (col.sortable) {
                  <p-sortIcon [field]="col.field" />
                }
              </th>
            }
            @if (withEdit || withDel) {
              <th style="width: 7rem" [class]="thClass()">Acción</th>
            }
          </tr>
        </ng-template>

        <ng-template pTemplate="body" let-rowData let-rowIndex="rowIndex">
          <tr [pSelectableRow]="rowData" [pSelectableRowIndex]="rowIndex" [ngClass]="rowClassObj(rowData)">
            @if (showSelect) {
              <td style="position: sticky; left: 0; z-index: 2; background: inherit;">
                <div class="flex align-items-center gap-1">
                  @if (singleSelect) {
                    <p-tableRadioButton [value]="rowData" />
                  } @else {
                    <p-tableCheckbox [value]="rowData" />
                  }
                  
                </div>
              </td>
            }
            @for (col of processedColumns(); track col.field) {
              <td [style]="{ textAlign: col.align || 'left' }">
                {{ resolveFieldData(rowData, col.field) }}
              </td>
            }
            @if (withEdit || withDel) {
              <td>
                @if (withEdit) {
                  <button pButton icon="pi pi-pencil" class="p-button-rounded p-button-text p-button-sm"
                    (click)="handleEdit(rowData, $event)"
                    pTooltip="Editar"
                  ></button>
                }
                @if (withDel) {
                  <button pButton icon="pi pi-trash" class="p-button-rounded p-button-text p-button-danger p-button-sm"
                    (click)="handleDelete(rowData, $event)"
                    pTooltip="Eliminar"
                  ></button>
                }
              </td>
            }
          </tr>
        </ng-template>

        @if (expandable) {
          <ng-template pTemplate="rowexpansion" let-rowData>
            <tr>
              <td [attr.colspan]="processedColumns().length + (showSelect ? 1 : 0) + ((withEdit || withDel) ? 1 : 0)" class="p-3">
                <ng-container *ngTemplateOutlet="expandTemplate; context: { $implicit: rowData }" />
              </td>
            </tr>
          </ng-template>
        }
      </p-table>
    </div>
  `,
  styles: [`
    .lab-table-wrapper { width: 100%; }
    .lab-table-search { display: flex; justify-content: flex-end; padding-bottom: 0.75rem; }
    .lab-table-search input { max-width: 400px; width: 100%; }
    .lab-table-header { padding: 0.75rem 1rem; border-radius: 6px 6px 0 0; font-size: 0.875rem; }
    .lab-table :deep(th) { text-transform: uppercase; letter-spacing: 0.5px; font-size: 0.75rem !important; height: 48px; }
    .lab-table :deep(tbody tr) { transition: background-color 0.2s ease; }
    .lab-table :deep(tbody tr:hover td) { box-shadow: inset 0 0 0 9999px rgba(0, 0, 0, 0.05) !important; }
    .sticky-column :deep(th:first-child),
    .sticky-column :deep(td:first-child) { position: sticky !important; left: 0; }
    .sticky-column :deep(th:nth-child(2)),
    .sticky-column :deep(td:nth-child(2)) { position: sticky !important; left: 48px; }
    .sticky-column :deep(td:first-child),
    .sticky-column :deep(td:nth-child(2)) { z-index: 2; background-color: inherit !important; }
    .sticky-column :deep(th:first-child),
    .sticky-column :deep(th:nth-child(2)) { z-index: 4 !important; }
    .sticky-column :deep(th:first-child::after),
    .sticky-column :deep(td:first-child::after),
    .sticky-column :deep(th:nth-child(2)::after),
    .sticky-column :deep(td:nth-child(2)::after) {
      content: ""; position: absolute; right: 0; top: 0; bottom: 0;
      width: 1px; background-color: rgba(0, 0, 0, 0.12);
    }
  `],
})
export class TableCheckComponent implements AfterViewInit {
  @ViewChild('dt') private dt!: Table

  @Input() columns: TableColumn[] = []
  @Input() data: any[] = []
  @Input() color = 'teal'
  @Input() itemsPerPage = 5
  @Input() singleSelect = true
  @Input() expandable = false
  @Input() withDel = false
  @Input() withEdit = false
  @Input() maxHeight = 500
  @Input() showSelect = false
  @Input() dataKey = 'idl'
  @Input() caption = ''
  @Input() expandTemplate: any = null
  @Input() globalFilterFields: string[] = []

  @Output() selectionChange = new EventEmitter<any | any[]>()
  @Output() editItem = new EventEmitter<any>()
  @Output() deleteItem = new EventEmitter<any>()

  protected searchText = ''
  protected selectedItems: any | any[] = this.singleSelect ? null : []

  readonly colorHex = computed(() => {
    const map: Record<string, string> = {
      teal: '#009688', blue: '#2196F3', green: '#4CAF50',
      amber: '#FFC107', orange: '#FF9800', red: '#F44336',
    }
    return map[this.color] || '#009688'
  })

  readonly thClass = computed(() => `${this.color}-header`)

  readonly processedData = computed(() => {
    if (!this.data) return []
    return this.data.map((obj: any, i: number) => ({ ...obj, [this.dataKey]: i }))
  })

  readonly processedColumns = computed(() => {
    return this.columns.filter(c => !c.hidden)
  })

  ngAfterViewInit(): void {
    // Apply global filter when search text changes
  }

  protected rowClassObj(rowData: any): Record<string, boolean> {
    const idx = rowData[this.dataKey]
    return {
      'lab-row-even': idx !== undefined && idx % 2 === 0,
      'lab-row-odd': idx !== undefined && idx % 2 !== 0,
    }
  }

  protected onSearch(value: string): void {
    this.searchText = value
    this.dt?.filterGlobal(value, 'contains')
  }

  protected onSelectionChange(value: any | any[]): void {
    this.selectedItems = value
    this.selectionChange.emit(value)
  }

  protected handleEdit(rowData: any, _event: Event): void {
    this.selectedItems = this.singleSelect ? rowData : (Array.isArray(this.selectedItems) ? [...this.selectedItems, rowData] : [rowData])
    this.selectionChange.emit(this.selectedItems)
    this.editItem.emit(rowData)
  }

  protected handleDelete(rowData: any, _event: Event): void {
    this.deleteItem.emit(rowData)
  }

  protected resolveFieldData(rowData: any, field: string): any {
    return field.split('.').reduce((obj, key) => obj?.[key], rowData)
  }
}
