import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { DataService } from '../../services/data.service';
import { ToggleService } from '../../services/toggle.service';
import { Subscription } from 'rxjs';

export interface MyData {
  id?: number;
  text: string;
}

@Component({
  selector: 'app-main',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  providers: [DataService],
  templateUrl: './main.component.html',
  styleUrl: './main.component.scss'
})
export class MainComponent {
  @Input() arrowRotationState!: boolean;

  private toggleSubscription: Subscription;

  isNameVisible: boolean = true;
  usedIndexes: Set<number> = new Set();
  optionFirst = 'Option 1'
  optionSecond = 'Option 2'
  optionThird = 'Option 3'
  selectedOption: string = this.optionFirst;
  parsedData: MyData[] = [];
  displayedTextIndex: number = 0;
  displayedText: string = '';
  addedTexts: string[] = [];
  lastAddedText: string = '';
  blockThird: string = 'Blok z długą nazwą która sama się przytnie lorem lorem 123'
  newOrEditedData: MyData = { text: '' };
  currentlyEditingIndex: number | null = null;

  constructor(private dataService: DataService, private toggleService: ToggleService) {
    this.toggleSubscription = this.toggleService.nameVisible$.subscribe(visible => {
      this.isNameVisible = visible;
    });

    this.toggleService.resetTexts$.subscribe(reset => {
      if (reset) {
        this.addedTexts = [];
      }
    });
  }

  ngOnInit() {
    this.getData();
  }

  getData() {
    this.dataService.getJsonData().subscribe(
      data => {
        this.parsedData = data;
        this.displayedText = this.parsedData[0]?.text || '';
      },
      error => console.error('error:', error)
    );
  }

  addTextWithTag(index: number) {
    if (index < this.parsedData.length) {
      const textWithTag = `<tag>${this.parsedData[index]?.text || ''}</tag>`;
      this.addedTexts.push(textWithTag);
      this.displayedText = textWithTag;
    }
  }

  addRandomTextExcludingFirstTwo() {
    if (this.parsedData.length > 2) {
      let attempts = 0;
      let randomIndex;
      let uniqueFound = false;

      while (!uniqueFound && attempts < this.parsedData.length) {
        randomIndex = 2 + Math.floor(Math.random() * (this.parsedData.length - 2));
        const candidateText = this.parsedData[randomIndex]?.text || '';

        if (!this.usedIndexes.has(randomIndex) && candidateText !== this.displayedText) {
          uniqueFound = true;
          this.usedIndexes.add(randomIndex);
          this.displayedText += `<tag>${candidateText}</tag>`;
          this.addedTexts.push(candidateText);
        }
        attempts++;
      }

      if (!uniqueFound) {
        alert('nie mogę spełnić warunku');
      }
    }
  }

  addText() {
    if (this.displayedTextIndex < this.parsedData.length - 1) {
      this.displayedTextIndex++;
      const nextText = this.parsedData[this.displayedTextIndex]?.text || '';

      if (!this.addedTexts.includes(nextText)) {
        this.addedTexts.push(nextText);
        this.addedTexts.sort((a, b) => a.localeCompare(b));
        this.displayedText = this.addedTexts.join('');
      }
    }
  }

  onSubmit() {
    this.addedTexts = [];
    this.displayedText = '';

    if (this.selectedOption === 'Option 1') {
      this.displayedTextIndex = 0;
      this.addTextWithTag(0);
    } else if (this.selectedOption === 'Option 2') {
      this.displayedTextIndex = 1;
      this.addTextWithTag(1);
    } else if (this.selectedOption === 'Option 3') {
      this.addRandomTextExcludingFirstTwo();
    }
    this.addedTexts.sort((a, b) => a.localeCompare(b));
    this.displayedText = this.addedTexts.join('');
  }

  addNextUniqueText() {
    let startIndex = this.selectedOption === 'Option 1' ? 0 : 1;
    for (let i = startIndex; i < this.parsedData.length; i++) {
      if (!this.usedIndexes.has(i)) {
        this.addTextWithTag(i);
        this.usedIndexes.add(i);
        break;
      }
    }
  }

  addUniqueRandomText() {
    if (this.usedIndexes.size >= this.parsedData.length) return;
    let uniqueFound = false;
    let randomIndex;
    while (!uniqueFound) {
      randomIndex = Math.floor(Math.random() * this.parsedData.length);
      if (!this.usedIndexes.has(randomIndex)) {
        uniqueFound = true;
        this.addTextWithTag(randomIndex);
        this.usedIndexes.add(randomIndex);
      }
    }
  }

  ngOnDestroy() {
    this.toggleSubscription.unsubscribe();
  }

  addData() {
    if (this.currentlyEditingIndex !== null) {
      this.parsedData[this.currentlyEditingIndex] = { ...this.newOrEditedData };
      this.currentlyEditingIndex = null;
    } else {
      this.parsedData.push({ ...this.newOrEditedData });
    }
    this.updateLocalStorage();
    this.newOrEditedData = { text: '' };
  }

  editData(index: number) {
    this.newOrEditedData = { ...this.parsedData[index] };
    this.currentlyEditingIndex = index;
  }

  deleteData(index: number) {
    if (index >= 0 && index < this.parsedData.length) {
      this.parsedData.splice(index, 1);
      this.updateLocalStorage();
    }
  }

  private updateLocalStorage() {
    localStorage.setItem('myData', JSON.stringify(this.parsedData));
  }
}
