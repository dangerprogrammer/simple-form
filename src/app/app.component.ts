import { AfterViewInit, Component, ElementRef, QueryList, ViewChild, ViewChildren } from '@angular/core';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [],
  templateUrl: './app.component.html'
})
export class AppComponent implements AfterViewInit {
  @ViewChildren('label') labels!: QueryList<ElementRef>;
  @ViewChild('background') background!: ElementRef;
  @ViewChild('form') form!: ElementRef;

  circlesLimit: number = 5;

  ngAfterViewInit(): void {
    this.labels.forEach(({ nativeElement }) => {
      const label = nativeElement as HTMLLabelElement, { innerText: text } = label;

      label.innerHTML = '';
      for (const i in text.split('')) {
        const span = document.createElement('span');
        const l = text.split('')[i];

        span.innerHTML = l;
        span.style.setProperty('--i', i);

        if (l == ' ') span.classList.add('space');

        label.appendChild(span);
      };
    });

    const form = this.form.nativeElement as HTMLFormElement, size = 60;

    form.style.setProperty('--size', `${size}px`);

    form.addEventListener('mouseenter', () => form.style.setProperty('--moving', '1'));
    form.addEventListener('mouseleave', () => form.style.setProperty('--moving', '0'));

    form.addEventListener('mousemove', ({ clientX, clientY }) => {
      clientX -= form.offsetLeft;
      clientY -= form.offsetTop;

      form.style.setProperty('--x', `${clientX}px`);
      form.style.setProperty('--y', `${clientY}px`);

      const insideLeft = clientX > (size / 2) && clientX < (form.offsetWidth - size / 2),
        insideTop = clientY > (size / 2) && clientY < (form.offsetHeight - size / 2);

      form.style.setProperty('--moving', (insideLeft && insideTop) ? '1' : '0');
    });

    this.generateCircles(this.circlesLimit);
  }

  generateCircles = (num: number = 1) => {
    for (let i = 0; i < num; i++) this.generateCircle();
  }

  generateCircle = () => {
    const circle = document.createElement('div');

    const iX = Math.random() * window.innerWidth, iY = Math.random() * window.innerHeight,
      fX = Math.random() * window.innerWidth, fY = Math.random() * window.innerHeight,
      min = 50, max = 80, size = Math.random() * (max - min) + min,
      time = ((iX - fX) ** 2 + (iY - fY) ** 2) ** (1 / 2), fTime = time * 20;

    circle.className = 'circle-background';
    circle.style.setProperty('--h', `${Math.random() * 5}`);
    circle.style.setProperty('--iX', `${iX}px`);
    circle.style.setProperty('--iY', `${iY}px`);
    circle.style.setProperty('--fX', `${fX}px`);
    circle.style.setProperty('--fY', `${fY}px`);
    circle.style.setProperty('--s', `${size}vmin`);
    circle.style.setProperty('--t', `${fTime}ms`);

    this.background.nativeElement.appendChild(circle);

    setTimeout(() => {
      this.background.nativeElement.removeChild(circle);

      this.generateCircle();
    }, fTime);
  }
}
