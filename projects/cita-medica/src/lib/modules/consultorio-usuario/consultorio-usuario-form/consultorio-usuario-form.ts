import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { UsuarioRequest } from 'auth';
import { MessageService } from 'primeng/api';
import { AutoCompleteCompleteEvent, AutoCompleteModule } from 'primeng/autocomplete';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { TableModule } from 'primeng/table';
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import { forkJoin } from 'rxjs';
import { MenubarService, PermisosResponse, RegionalDistrital, UbicacionService } from 'shared';
import { CentroMedico, CentroMedicoService, Consultorio, ConsultorioService } from 'vigencia';

import { UsuarioConfiguracion } from '../../../models/usuario-configuracion';
import { ConsultorioUsuarioService } from '../../../services/consultorio-usuario.service';
import { PersonalService } from '../../../services/personal.service';

@Component({
  selector: 'lib-consultorio-usuario-form',
  imports: [
    CommonModule,
    FormsModule,
    DialogModule,
    TableModule,
    ReactiveFormsModule,
    SelectModule,
    AutoCompleteModule,
    InputTextModule,
    ButtonModule,
    ToggleSwitchModule
  ],
  templateUrl: './consultorio-usuario-form.html',
  styleUrl: './consultorio-usuario-form.scss',
})
export class ConsultorioUsuarioForm implements OnChanges, OnInit {
  @Input() toggle = false;
  @Input() data: UsuarioConfiguracion | undefined
  @Input() regionalId = 0;
  @Input() centroMedicoId = 0;
  @Input() params: PermisosResponse | null = null
  @Output() closed = new EventEmitter<boolean>();

  title = 'Nueva asignación';
  fb = inject(FormBuilder);
  dataForm: FormGroup = this.fb.group({});
  usuarios = signal<UsuarioRequest[]>([]);
  regionales = signal<RegionalDistrital[]>([]);
  centrosMedicos = signal<CentroMedico[]>([]);
  consultorios = signal<Consultorio[]>([]);
  searchBusqueda = '';
  searchBusquedaRight = '';
  selectedConsultoriosLeft: Consultorio[] = [];
  selectedConsultoriosRight: Consultorio[] = [];
  filteredConsultoriosLeft = signal<Consultorio[]>([]);
  filteredConsultoriosRight: Consultorio[] = [];
  filteredConsultoriosRightCopy: Consultorio[] = [];
  allCentrosMedicos = signal<CentroMedico[]>([]);
  allConsultorios = signal<Consultorio[]>([]);

  private messageService = inject(MessageService);
  private ubicacionService = inject(UbicacionService);
  private centroMedicoService = inject(CentroMedicoService);
  private consultorioUsuarioService = inject(ConsultorioUsuarioService);
  private personalService = inject(PersonalService);
  private consultorioService = inject(ConsultorioService);
  private menuBarService = inject(MenubarService);

  get f() {
    return this.dataForm.controls;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if ('params' in changes) {
      if (this.params) {
        this.setDataDropdowns();
      }
    }
    if ('toggle' in changes) {
      if (this.toggle) {
        this.buildForm();
        if (this.data) {
          this.setValueForm();
          this.title = 'Editar asignación';
        } else {
          this.title = 'Nueva asignación';
        }
      }
    }
  }

  ngOnInit(): void {
    this.dataForm = this.fb.group({});
    this.getDataDropdowns();
    this.buildForm();
  }

  setDataDropdowns() {
    this.menuBarService.hideOptions(
      'regional',
      this.regionales(),
      'id',
      this.params!,
      null
    );
  }

  getDataDropdowns() {
    forkJoin([
      this.centroMedicoService.getAllCentros(),
      this.consultorioService.getAllConsultorios({}),
      this.ubicacionService.getAll({})
    ]).subscribe((allResult) => {
      this.allCentrosMedicos.set(allResult[0]);
      this.allConsultorios.set(allResult[1]);
      this.regionales.set(allResult[2]);
    });
  }

  buildForm() {
    this.dataForm = this.fb.group({
      usuario: [{ value: null, disabled: !!this.data }, Validators.required],
      idsRegional: [null],
      idsCentros: [null],
      idsConsultorio: [null, Validators.required],
      estado: [true],
      isAdmin: [false],
      regionalId: [this.regionalId > 0 ? String(this.regionalId) : null],
      centroMedicoId: [this.centroMedicoId > 0 ? this.centroMedicoId : null],
    });
    if (this.regionalId > 0) {
      this.onChangeRegional()
    }
    this.centrosMedicos.set([]);
    this.consultorios.set([]);
    this.filteredConsultoriosLeft.set([]);
    this.filteredConsultoriosRight = this.filteredConsultoriosRightCopy = [];
  }

  setValueForm() {
    this.dataForm.setValue({
      idsRegional: this.data?.idsRegional,
      idsCentros: this.data?.idsCentros,
      idsConsultorio: this.data?.idsConsultorio,
      estado: this.data?.estado,
      isAdmin: this.data?.isAdmin,
      usuario: this.data?.usuario,
      regionalId: this.regionalId > 0 ? String(this.regionalId) : null,
      centroMedicoId: this.centroMedicoId > 0 ? this.centroMedicoId : null,
    });
    if (this.regionalId > 0) {
      this.onChangeRegional()
    }
    this.filteredConsultoriosRight =
      this.filteredConsultoriosRightCopy =
      (this.data?.idsConsultorio ?? []).flatMap((id: number) => {
        const cons = this.allConsultorios().find((c) => c.id === id);
        return cons ? [cons] : [];
      });
    if (this.filteredConsultoriosRightCopy.length > 0) {
      this.filteredConsultoriosRightCopy = this.filteredConsultoriosRight = this.filteredConsultoriosRightCopy
        .map((c) => {
          c.centroMedico = this.allCentrosMedicos().find((w) => w.id == c?.centroMedicoId);
          return c;
        });
    }
  }

  onChangeRegional() {
    this.centrosMedicos.set([]);
    this.filteredConsultoriosLeft.set([]);
    this.getCentrosMedicos();
  }

  getCentrosMedicos() {
    this.centroMedicoService.getAll({ ubicacionRegionalId: this.f['regionalId'].value })
      .subscribe((response) => {
        this.centrosMedicos.set(response);
        this.menuBarService.hideOptions(
          'centroMedico',
          response,
          'id',
          this.params!,
          null
        );
        if (this.centrosMedicos().length > 0) {
          this.onChangeCentroMedico();
        }
      });
  }

  onChangeCentroMedico() {
    this.consultorioService.getAll({
      centroMedicoId: this.dataForm.controls['centroMedicoId'].value,
      isEspecialidad: true,
    }).subscribe((response) => {
      this.consultorios.set(response);
      this.filteredConsultoriosLeft.set(this.consultorios().filter((c) =>
        !this.filteredConsultoriosRight.some(rc => rc.id === c.id)
      ));
    });
  }

  saveData() {
    if (!this.dataForm.valid) {
      this.dataForm.markAllAsTouched();
      return;
    }
    this.dataForm.disable();
    this.add();
  }

  add() {
    const idsRegional = [...new Set(this.filteredConsultoriosRightCopy.map((w) => w.centroMedico?.ubicacionRegionalId))];
    const idsCentros = [...new Set(this.filteredConsultoriosRightCopy.map((w) => w.centroMedicoId))];
    const idsConsultorio = [...new Set(this.filteredConsultoriosRightCopy.map((w) => w.id))];
    const data = {
      usuario: this.f['usuario'].value,
      usuarioId: this.f['usuario'].value.id,
      idsRegional: idsRegional,
      idsCentros: idsCentros,
      idsConsultorio: idsConsultorio,
      estado: this.f['estado'].value,
      isAdmin: this.f['isAdmin'].value
    };
    this.consultorioUsuarioService.post(data).subscribe({
      next: () => {
        this.close(true);
        this.messageService.add({
          severity: 'success', summary: '¡Registro exitoso!', detail: 'Se guardo correctamente'
        });
      },
      error: () => {
        this.dataForm.enable();
        this.messageService.add({ severity: 'warn', summary: 'Error', detail: 'No se pudo guardar el registro' });
      },
      complete: () => {
        this.dataForm.enable();
      },
    });
  }

  searchUsuarios(event: AutoCompleteCompleteEvent) {
    this.personalService.getAll(event.query, true)
      .subscribe((response) => {
        this.usuarios.set(response);
      });
  }

  filterConsultorios() {
    this.filteredConsultoriosLeft.set(this.consultorios().filter((c) =>
      c.descripcion.toLowerCase().includes(this.searchBusqueda.toLowerCase()) &&
      !this.filteredConsultoriosRight.includes(c)
    ));
  }

  filterConsultoriosRight() {
    this.filteredConsultoriosRight = this.filteredConsultoriosRightCopy.filter(c =>
      c.descripcion.toLowerCase().includes(this.searchBusquedaRight.toLowerCase())
    );
  }

  moveToRight() {
    this.selectedConsultoriosLeft = this.selectedConsultoriosLeft
      .map((c) => {
        c.centroMedico = this.allCentrosMedicos().find((w) => w.id == c.centroMedicoId);
        return c;
      });
    this.filteredConsultoriosRightCopy = this.filteredConsultoriosRight = this.filteredConsultoriosRightCopy
      .concat(this.selectedConsultoriosLeft);
    this.filteredConsultoriosLeft.set(
      this.filteredConsultoriosLeft()
        .filter(c => !this.selectedConsultoriosLeft.includes(c))
    );
    this.selectedConsultoriosLeft = [];
    const idsConsultorio = this.filteredConsultoriosRightCopy
      .map((w) => { return w.id; });
    this.f['idsConsultorio'].setValue(idsConsultorio);
  }

  moveToLeft() {
    this.filteredConsultoriosLeft.set(this.filteredConsultoriosLeft()
      .concat(this.selectedConsultoriosRight));
    this.filteredConsultoriosRightCopy = this.filteredConsultoriosRight = this.filteredConsultoriosRightCopy
      .filter(c =>
        !this.selectedConsultoriosRight.includes(c)
      );
    this.selectedConsultoriosRight = [];
    this.filterConsultorios();
    const idsConsultorio = this.filteredConsultoriosRightCopy.map((w) => { return w.id; });
    this.f['idsConsultorio'].setValue(idsConsultorio);
  }

  close(type: boolean) {
    this.dataForm.enable();
    this.dataForm.reset();
    this.toggle = false;
    this.buildForm();
    this.closed.emit(type);
  }
}
