// Виведення повідомлення у консоль
console.log("Привіт, це приклад коду на TypeScript!");

// Тип Number: прості математичні операції
let a: number = 10;
let b: number = 25;
let c: number = a + b;
console.log("Сума:", c);

let product: number = a * b;
console.log("Добуток:", product);

// Вираховуємо середнє значення
let average: number = (a + b + c) / 3;
console.log("Середнє значення:", average);

// Boolean: перевірка умов
let isGreater: boolean = a > b;
console.log("a більше за b?", isGreater);

let isEqual: boolean = a === b;
console.log("a дорівнює b?", isEqual);

// Тип String: робота з рядками
let greeting: string = "Привіт, ";
let name: string = "Іван";
let fullGreeting: string = `${greeting}${name}!`;
console.log(fullGreeting);

// Отримання довжини рядка
console.log("Довжина привітання:", fullGreeting.length);

// Робота з рядками: зміна регістру
console.log("Привітання у верхньому регістрі:", fullGreeting.toUpperCase());
console.log("Привітання у нижньому регістрі:", fullGreeting.toLowerCase());

// Масиви
let numbers: number[] = [1, 2, 3, 4, 5];
console.log("Масив чисел:", numbers);

// Додавання елементів до масиву
numbers.push(6);
console.log("Оновлений масив:", numbers);

// Видалення останнього елементу
numbers.pop();
console.log("Масив після видалення:", numbers);

// Ітерація через масив
for (let i: number = 0; i < numbers.length; i++) {
    console.log("Елемент масиву:", numbers[i]);
}

// Функції
function add(x: number, y: number): number {
    return x + y;
}

let result: number = add(5, 10);
console.log("Результат додавання через функцію:", result);

// Об'єкти: опис машини
interface Car {
    brand: string;
    model: string;
    year: number;
    isElectric: boolean;
}

let car: Car = {
    brand: "Toyota",
    model: "Corolla",
    year: 2020,
    isElectric: false
};

// Виведення властивостей об'єкта
console.log("Марка машини:", car.brand);
console.log("Модель машини:", car.model);
console.log("Рік випуску машини:", car.year);
console.log("Електромобіль?", car.isElectric);

// Оновлення властивостей об'єкта
car.year = 2022;
console.log("Оновлений рік машини:", car.year);

// Перевірка, чи машина електрична
if (car.isElectric) {
    console.log("Машина є електромобілем.");
} else {
    console.log("Це звичайна машина на пальному.");
}

// Тип null
let emptyValue: null = null;
console.log("Значення пусте:", emptyValue);

// Використання undefined
let undefinedValue: undefined;
console.log("Не визначене значення:", undefinedValue);

// Стрілкова функція
let multiply = (x: number, y: number): number => x * y;
console.log("Результат множення через стрілкову функцію:", multiply(4, 5));

// Умовна функція
function isPositive(num: number): string {
    return num > 0 ? "Позитивне" : "Негативне або нуль";
}

console.log("Число 10 є:", isPositive(10));
console.log("Число -5 є:", isPositive(-5));

// Цикли та умовні конструкції
let counter: number = 0;
while (counter < 5) {
    console.log("Лічильник:", counter);
    counter++;
}

// Цикл for
for (let i: number = 0; i <= 5; i++) {
    console.log("Значення i у циклі:", i);
}

// Робота з датами
let today: Date = new Date();
console.log("Сьогоднішня дата:", today);

// Отримання року з дати
console.log("Поточний рік:", today.getFullYear());

// Масив об'єктів
interface Student {
    name: string;
    age: number;
}

let students: Student[] = [
    { name: "Олег", age: 21 },
    { name: "Марія", age: 22 },
    { name: "Іван", age: 23 }
];

// Ітерація через масив об'єктів
students.forEach((student: Student) => {
    console.log(`${student.name} має ${student.age} років.`);
});

// Використання try-catch для обробки помилок
try {
    let divisionResult: number = 10 / 0;
    if (!isFinite(divisionResult)) {
        throw new Error("Ділення на нуль!");
    }
    console.log("Результат ділення:", divisionResult);
} catch (error) {
    console.log("Помилка:", (error as Error).message);
}

console.log("Кінець програми.");

