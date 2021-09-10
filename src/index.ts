import {Observable} from 'rxjs';

const observable = new Observable(subscriber => {
    subscriber.next("Hello World!");
    subscriber.next("Hello Again!");
    subscriber.complete();
    subscriber.next('Bye');
});

observable.subscribe(
    {
        next(value: any) {logItem(value)},
        error(err: any) {logItem('Error: ' + err)},
        complete() {logItem('Completed')}
    }
);


function logItem(item: any) {
    const node = document.createElement('li');
    const textNode = document.createTextNode(item);
    node.appendChild(textNode);
    document.getElementById("list").appendChild(node);
}