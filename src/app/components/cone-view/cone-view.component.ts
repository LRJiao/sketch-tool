import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import {CommonModule} from '@angular/common';
import { ConeView } from './coneView';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-cone-view',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './cone-view.component.html',
  styleUrls: ['./cone-view.component.css']
})
export class ConeViewComponent implements AfterViewInit{
  @ViewChild('vtkDiv') vtkDiv!: ElementRef;
  @ViewChild('vtkDiv2') vtkDiv2!: ElementRef;

  inputValue!: string;
  afterButtonPressedValue = '';
  cs2 = new ConeView();

  ngAfterViewInit()
  {

    let c2 = this.vtkDiv2.nativeElement;
    this.cs2.Initialize(c2, 0, 0, 0);
    this.cs2.Add(this.afterButtonPressedValue, c2);
  }

  clicked():void {
    let c2 = this.vtkDiv2.nativeElement;
    let sketchEntries = this.afterButtonPressedValue.split(";");
    let i = 0;
    for(i = 0; i < sketchEntries.length; i++) {
      this.cs2.Add(sketchEntries[i], c2);
    }
  }

  constructor() { }

  saveBtn(): void {
    console.log("btn clicked: " + this.inputValue);
    window.localStorage.setItem("inputValue", this.inputValue);
    window.localStorage.getItem("inputValue");
    this.afterButtonPressedValue = this.inputValue;
  };
  clearStorage(){
    localStorage.clear();
    console.log("ls cleared");
    this.afterButtonPressedValue = '';
  }
}
