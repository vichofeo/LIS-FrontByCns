export type TableRow = Record<string, unknown>

export interface TableColumn {
  field: string
  header: string
  sortable?: boolean
  align?: 'left' | 'center' | 'right'
  width?: string
  hidden?: boolean
}

export interface TableCheckEvent {
  originalEvent: Event
  data: unknown
}
