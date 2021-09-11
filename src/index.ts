import { BehaviorSubject, combineLatest, filter, from, fromEvent, map, of, startWith, switchMap, tap } from 'rxjs';

// const arr = [1,2,3,4,5];


// const arr$ = of(arr);

const body = document.querySelector('body');

const windowEvent = fromEvent(window,'keydown');

const x$ = new BehaviorSubject<number>(0);
const y$ = new BehaviorSubject<number>(0);

const catImg$ = from(fetch('https://cataas.com/cat/says/hello').then(res => res.blob()));
const imgImg$ = from(fetch('https://picsum.photos/500/500').then(res => res.blob()));
const rnImgImg$ = from(fetch('https://random.imagecdn.app/500/500').then(res => res.blob()));

// const sub = arr$.pipe(
//     switchMap((data) => of(from(data))),
//     switchMap((v) => v),
//     map((v) => v + 1),
//     filter((v) => (v % 2) === 0)
//     ).subscribe((data) => {
//     console.log(data);
//     addDataToDocument(data);
// });

// sub.unsubscribe();

// const sub = catImg$
// .pipe(tap((d) => console.log(d)))
// .subscribe((data) => {
//     addDataToDocument(data);
//     sub.unsubscribe();
// });

combineLatest([catImg$,imgImg$,rnImgImg$])
.pipe(
    tap((data) => console.log(data))
    )
.subscribe(([cat,bear,dog]) => {
    addDataToDocument(cat);
    addDataToDocument(bear);
    addDataToDocument(dog);
});

const arrowEvents$ = windowEvent.pipe(
    startWith({keyCode: 40}),
    filter((e: KeyboardEvent) => e.keyCode >= 37 && e.keyCode <= 40),
    tap(({keyCode}) => {
        const currentX = x$.value;
        const currentY = y$.value;
        switch (keyCode) {
            case 37:
                x$.next(currentX === 0 ? currentX  : x$.value - 1);
                break;
            case 38:
                y$.next(currentY === 0 ? currentY : y$.value - 1);
                break;
            case 39:
                x$.next(x$.value + 1);
                break;
            case 40:
                y$.next(y$.value + 1);
                break;
            default:
                break;
        }
    })
    );

combineLatest([arrowEvents$,x$,y$])
.pipe(
    map(([_,x,y]) => {
    return [x*4,y*4]
}))
.subscribe(([x,y]) => {
    rerenderSquare(x,y);
})


function addDataToDocument(data: any): void {
    if (Array.isArray(data)) {
        console.log(data);
    } else {
        const url = URL.createObjectURL(data);
        document.body.innerHTML += `<img src=${url}>`;
    }
}

function rerenderSquare(x: number, y: number): void {
    let square = document.querySelector('#square') as HTMLDivElement;
    if (square) {
        square.remove();
        square.setAttribute('class', 'square');
    } else {
      square = document.createElement('div');
      square.setAttribute('id','square');
      square.setAttribute('class', 'square');
    }
    body.appendChild(square);
    square.style.left = `${x}px`;
    square.style.top = `${y}px`;
}