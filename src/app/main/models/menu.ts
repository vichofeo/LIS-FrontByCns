export interface Recurso {
  children: Recurso[]
  data: string
  key: string
  label: string
  leaf: false
}

export interface Menu {
  recurso: Recurso[]
  rolId: number
}

export interface ModelMenu {
  label: string
  routerLink: string[]
  items?: ModelMenu[]
}

export interface MenuResponse {
  key: number
  label: string
  data: string
  rolRecursoId: number
  children: MenuResponse[]
}
