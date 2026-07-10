export interface ThemeConfig {
  theme: string
  regional: string

  pgrsalud_orange: ThemeColors
  pgrsalud_orange_dark: ThemeColors
  pgrsalud_blue_dark: ThemeColors
  staging: ThemeColors
  develop: ThemeColors
  default: ThemeColors
}

export interface ThemeColors {
  'background-color': string
  'color-background-header': string
  'primary-color': string
  'text-color': string
  'text-color-secondary': string
  'primary-color-text': string
  'color-menu': string
  'color-menu-inactive': string
  'color-menu-inactive-hover': string
  'background-icon': string
}
