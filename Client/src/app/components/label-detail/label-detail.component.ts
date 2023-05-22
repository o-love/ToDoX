import { AfterViewInit, Component, ElementRef, EventEmitter, Input, OnInit, Output, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Form } from 'src/app/models/form';
import { Label } from 'src/app/models/label';
import { LabelService } from 'src/app/services/label/label.service';

@Component({
  selector: 'app-label-detail',
  templateUrl: './label-detail.component.html',
  styleUrls: ['./label-detail.component.scss']
})
export class LabelDetailComponent implements Form, OnInit {
  form: FormGroup;
  color: string | undefined;

  @Input() label: Label | null = null;
  @Input() canClose: boolean = true;

  @Output() close: EventEmitter<void> = new EventEmitter<void>();
  @Output() edited: EventEmitter<Label> = new EventEmitter<Label>();
  @Output() deleted: EventEmitter<void> = new EventEmitter<void>();

  @ViewChildren('input') inputs!: QueryList<ElementRef>;
  @ViewChild('btn') btn!: ElementRef;
  @ViewChild('selector', { read: ElementRef }) select!: ElementRef<any>;

  loading: boolean = false;
  timeout: any;

  private colors: string[] = [];
  
  constructor(private fb: FormBuilder, private labelService: LabelService) {
    this.form = this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(20)]],
      description: ['', [Validators.maxLength(60)]]
    })
  }

  ngOnInit(): void {
    if (!this.label) return;
    this.form.setValue({name: this.label.name , description: this.label.description });
    this.labelService.getColorsName().forEach((color: string) => {
      this.colors.push(color);
    });
    this.color = this.label.color;
  }

  checkErrors(): boolean {
    let errors: boolean = false;

    this.inputs.forEach((input, index) => {
      const control = this.form.controls[Object.keys(this.form.controls)[index]];

      if (control.errors) {
        this.onError(input);
        errors = true;
      }
    })

    if (!this.color) {
      errors = true;
      this.onError(this.select);
    }

    return errors;
  }

  resetErrors(): void {
    this.inputs.forEach((input) => input.nativeElement.style.boxShadow = 'none');
    this.select.nativeElement.style.boxShadow = 'none';
  }

  onError(element: ElementRef<any>): void {
    element.nativeElement.style.boxShadow = '0px 0px 7px rgb(255, 113, 113)';
  }

  onDelete(): void {
    this.btn.nativeElement.style.backgroundColor = "rgba(255, 113, 113)";
    this.btn.nativeElement.style.color = "white";
    this.delete();
  }

  selectColor(i: number) {
    if (i < this.colors.length) this.color = this.colors[i];
    console.log('holi');
    this.save();
  }

  onClose(): void {
    this.close.emit();
  }

  onKeyUp(event: any) {
    clearTimeout(this.timeout);
    let $this = this;
    this.timeout = setTimeout(function() {
      if (event.keyCode != 13) {
        $this.save();
      }
    }, 1000);
  }

  private save(): void  {
    this.resetErrors();
    if (this.checkErrors() || !this.label) return;

    console.log('saving...');

    this.label.name = this.form.value.name;
    this.label.description = this.form.value.description;
    this.label.color = this.color ? this.color : '';

    console.log('new label:', this.label);
    this.edited.emit(this.label);
  }

  private delete(): void {
    if (!this.label) return;
    this.loading = true;
    console.log('deleting label %d...', this.label.id);
    this.labelService.deleteLabel(this.label.id).then(
      (r: any) => {
        this.deleted.emit();
        this.onClose();
      }
    )
  }
}