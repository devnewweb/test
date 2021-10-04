// #1
const div = document.createElement('div');
const p1 = document.createElement('p');
const p2 = document.createElement('p');
const span1 = document.createElement('span');
const span2 = document.createElement('span');
const a1 = document.createElement('a');
const a2 = document.createElement('a');

span1.appendChild(a1);
span2.appendChild(a2);
p1.appendChild(span1);
p2.appendChild(span2);
div.appendChild(p1);
div.appendChild(p2);

console.log(div);
console.log(nodeChildCount(div));
console.log(nodeChildCount(div, 2));
console.log(nodeChildCount(div, 1));

function nodeChildCount(node, deep) {
    let count = node.childElementCount;
    if (count > 0 && (deep == undefined || deep - 1 > 0)) {
        node.childNodes.forEach(n => {
            count += nodeChildCount(n, deep - 1 || undefined)
        })
    }
    return count
}

// #2
iterator = chunkArray([1, 2, 3, 4, 5, 6, 7, 8], 3);
console.log(iterator.next());
console.log(iterator.next());
console.log(iterator.next());
console.log(iterator.next());

function chunkArray(array, count) {
    let begin = 0;
    let end = count;

    function getNextIndex() {
        let index = [begin, end];
        begin += count;
        end += count;
        return index
    }

    return {
        next: () => begin < array.length
            ? { value: array.slice(...getNextIndex()), done: false }
            : { value: undefined, done: true }

    }
}

//#3
const f1 = (cb) => cb(1);
const f2 = (x, cb) => cb(x);
const f3 = (x, y, cb) => setTimeout(() => cb([x, y]), 1000);

bulkRun([
    [f1, []],
    [f2, [2]],
    [f3, [3, 4]],
]).then(console.log);

function bulkRun(funcArray) {
    return Promise.all(funcArray.map(
        (item) => new Promise(
            (resolve) => item[0](...item[1], resolve))));
}

//#4
let testData3 = [
    {"name":"Vasya","email":"vasya@example.com","age":20,"skills":{"php":0,"js":-1,"madness":10,"rage":10}},
    {"name":"Dima","email":"dima@example.com","age":34,"skills":{"php":5,"js":7,"madness":3,"rage":2}},
    {"name":"Colya","email":"colya@example.com","age":46,"skills":{"php":8,"js":-2,"madness":1,"rage":4}},
    {"name":"Misha","email":"misha@example.com","age":16,"skills":{"php":6,"js":6,"madness":5,"rage":2}},
    {"name":"Ashan","email":"ashan@example.com","age":99,"skills":{"php":0,"js":10,"madness":10,"rage":1}},
    {"name":"Rafshan","email":"rafshan@example.com","age":11,"skills":{"php":0,"js":0,"madness":0,"rage":10}}
]

const rules = [
  ["name", "n", (value) => value.toLowerCase()],
  ["age", "a"]
]

let map = testData3.map(mapper(rules)) // [{"n":"vasya","a":20},{"n":"dima","a":34},{"n":"colya","a":46},{"n":"misha","a":16},{"n":"ashan","a":99},{"n":"rafshan","a":11}]
console.log(map);

function mapper(rules) {
    return (item) => {
        let obj = {};
        rules.forEach(rule => {
            let [key, newKey, convert] = rule;
            obj[newKey] = item[key];
            obj[newKey] = convert ? convert(obj[newKey]) : obj[newKey];
        });
        return obj;
    }
}

//#5
function NotificationException() {}
function ErrorException() {}
function primitiveMultiply(a, b) {
  const rand = Math.random();
  if (rand < 0.5) {
    return a * b;
  } else if(rand > 0.85) {
    throw new ErrorException()
  } else {
    throw new NotificationException()
  }
}

function reliableMultiply(a, b) {
    try {
        return primitiveMultiply(a, b);
    } catch (error) {
        if (error instanceof NotificationException) {
            return reliableMultiply(a, b);
        } else if (error instanceof ErrorException) {
            return NaN;
        }
    }
}
console.log(reliableMultiply(8, 8));

//#6
let matrix = [
    [5, 3, 6],
    [7, 11, 2],
    [15, 9, 4]
];

function transform(matrix) {
    let cols = matrix[0].length;
    let array = matrix.flat(1);
    let min = Math.min(...array);
    
    array = array.map(x => x % 2 != 0 ? x * min : x);
    return [...multiArray(array, cols)]
}

function multiArray(array, count) {
    return {
        [Symbol.iterator]() {
            return {
                next: () => array.length > 0
                    ? { value: array.splice(0, count), done: false }
                    : { value: undefined, done: true }
            }
        }
    }
}

console.log(transform(matrix));