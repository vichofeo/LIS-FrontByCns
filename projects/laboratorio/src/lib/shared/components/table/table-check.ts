import { NgClass, NgTemplateOutlet } from '@angular/common'
import { Component, EventEmitter, Input, Output, TemplateRef, ViewChild, computed } from '@angular/core'
import { FormsModule } from '@angular/forms'
import { ButtonModule } from 'primeng/button'
import { InputTextModule } from 'primeng/inputtext'
import { Table, TableModule } from 'primeng/table'
import { TooltipModule } from 'primeng/tooltip'

import { TableColumn, TableRow } from './table-check.models'

@Component({
  selector: 'lab-table-check',
  standalone: true,
  imports: [NgClass, NgTemplateOutlet, FormsModule, TableModule, InputTextModule, ButtonModule, TooltipModule],
  templateUrl: './table-check.html',
  styleUrl: './table-check.scss',
})
export class TableCheck {
  @Input() columns: TableColumn[] = []
  @Input() data: TableRow[] = []
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
  @Input() expandTemplate: TemplateRef<unknown> | null = null
  @Input() globalFilterFields: string[] = []

  @Output() selectionChange = new EventEmitter<TableRow | TableRow[]>()
  @Output() editItem = new EventEmitter<TableRow>()
  @Output() deleteItem = new EventEmitter<TableRow>()

  @ViewChild('dt') private dt!: Table

  readonly colorHex = computed(() => {
    const map: Record<string, string> = {
      teal: '#009688', blue: '#2196F3', green: '#4CAF50',
      amber: '#FFC107', orange: '#FF9800', red: '#F44336',
    }
    return map[this.color] || '#009688'
  })

  readonly thClass = computed(() => `${this.color}-header`)

  readonly processedData = computed<TableRow[]>(() => {
    if (!this.data) return []
    return this.data.map((obj, i) => ({ ...obj, [this.dataKey]: i }) as TableRow)
  })

  readonly processedColumns = computed(() => {
    return this.columns.filter(c => !c.hidden)
  })

  protected searchText = ''
  protected selectedItems: TableRow | TableRow[] | null = this.singleSelect ? null : []

  protected rowClassObj(rowData: TableRow): Record<string, boolean> {
    const idx = rowData[this.dataKey]
    return {
      'lab-row-even': typeof idx === 'number' && idx % 2 === 0,
      'lab-row-odd': typeof idx === 'number' && idx % 2 !== 0,
    }
  }

  protected onSearch(value: string): void {
    this.searchText = value
    this.dt?.filterGlobal(value, 'contains')
  }

  protected onSelectionChange(value: TableRow | TableRow[]): void {
    this.selectedItems = value
    this.selectionChange.emit(value)
  }

  protected handleEdit(rowData: TableRow): void {
    const next = this.singleSelect
      ? rowData
      : Array.isArray(this.selectedItems)
        ? [...this.selectedItems, rowData]
        : [rowData]
    this.selectedItems = next
    this.selectionChange.emit(next)
    this.editItem.emit(rowData)
  }

  protected handleDelete(rowData: TableRow): void {
    this.deleteItem.emit(rowData)
  }

  protected resolveFieldData(rowData: TableRow, field: string): unknown {
    return field.split('.').reduce<unknown>((acc, key) => (acc as TableRow)?.[key], rowData)
  }
}
