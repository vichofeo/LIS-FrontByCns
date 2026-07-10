import { CommonModule } from '@angular/common'
import { Component, EventEmitter, Input, OnChanges, OnInit, Output, inject } from '@angular/core'
import { FormsModule } from '@angular/forms'
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser'
import { MenuItem } from 'primeng/api'
import { ColorPickerModule } from 'primeng/colorpicker'
import { MenubarModule } from 'primeng/menubar'
import { PopoverModule } from 'primeng/popover'
import { ScrollPanelModule } from 'primeng/scrollpanel'
import printJS from 'print-js'
import { Observable, fromEvent, map } from 'rxjs'

import { PdfFile } from '../../models/pdf-file'


@Component({
  selector: 'cns-pdf-viewer',
  imports: [
    MenubarModule,
    PopoverModule,
    ColorPickerModule,
    CommonModule,
    FormsModule,
    ScrollPanelModule,
  ],
  templateUrl: './pdf-viewer.html',
  styleUrl: './pdf-viewer.scss',
})
export class PdfViewer implements OnInit, OnChanges {
  @Input() pdf: PdfFile | null = null
  @Input() height = ''
  @Input() enviarCorreo = false
  @Output() selectColor = new EventEmitter<string>()
  @Output() selectDataPdf = new EventEmitter<string>()

  menuPdf: MenuItem[] = []
  color = '#024c45'
  backColor = '#024c45'

  private sanitizer = inject(DomSanitizer)

  ngOnInit(): void {
    this.menuPdf = [
      {
        label: 'Abrir en otra ventana',
        icon: 'pi pi-fw pi-external-link',
        command: () => {
          window.open(this.pdf?.url)
        },
      },
      {
        label: 'Descargar',
        icon: 'pi pi-fw pi-download',
        command: () => {
          if (this.pdf?.blob) {
            this.downloadPdf(this.pdf.blob)
          }
        },
      },
      {
        label: 'Imprimir',
        icon: 'pi pi-fw pi-print',
        command: () => {
          this.imprimir()
        },
      },
    ]
  }

  ngOnChanges() {
    this.menuPdf = [
      {
        label: 'Abrir en otra ventana',
        icon: 'pi pi-fw pi-external-link',
        command: () => {
          window.open(this.pdf?.url)
        },
      },
      {
        label: 'Descargar',
        icon: 'pi pi-fw pi-download',
        command: () => {
          if (this.pdf?.blob) {
            this.downloadPdf(this.pdf.blob)
          }
        },
      },
      {
        label: 'Imprimir',
        icon: 'pi pi-fw pi-print',
        command: () => {
          this.imprimir()
        },
      },
    ]
  }

  downloadPdf(value: Blob): void {
    const fileName = Math.random().toString(36).substring(7)
    const link = document.createElement('a')
    link.setAttribute('href', URL.createObjectURL(value))
    link.setAttribute('download', fileName)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(link.href)
  }

  imprimir(): void {
    if (!this.pdf) return
    const reader = new FileReader()
    reader.readAsDataURL(this.pdf.blob)
    reader.onloadend = () => {
      let base64data = reader.result as string
      base64data = base64data.replace(/^data:.+;base64,/, '')
      printJS({
        printable: base64data,
        type: 'pdf',
        base64: true,
      })
    }
  }

  changeColor() {
    this.backColor = this.color
    this.selectColor.emit(this.color)
  }

  toBase64(blob: Blob): Observable<string> {
    const reader = new FileReader()
    reader.readAsDataURL(blob)
    return fromEvent(reader, 'load').pipe(map(() => reader.result as string))
  }

  emitDataPdf(pdf: Blob) {
    this.toBase64(pdf).subscribe(base64 => {
      this.selectDataPdf.emit(base64)
    })
  }

  safePdfUrl(): SafeResourceUrl | null {
    if (!this.pdf?.url) {
      return null
    }
    return this.sanitizer.bypassSecurityTrustResourceUrl(this.pdf.url)
  }
}
