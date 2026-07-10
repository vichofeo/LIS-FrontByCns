export interface AppMenuItem {
  label: string
  routerLink?: string[]
  icon?: string
  items?: AppMenuItem[]
}
