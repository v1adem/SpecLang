type BaseProduct = {
    id: number;
    name: string;
    price: number;
    description: string;
};

type Electronics = BaseProduct & {
    category: 'electronics';
    brand: string;
    warranty: number;
};

type Clothing = BaseProduct & {
    category: 'clothing';
    size: string;
    material: string;
};

type Book = BaseProduct & {
    category: 'book';
    author: string;
    pages: number;
};

const findProduct = <T extends BaseProduct>(products: T[], id: number): T | undefined => {
    return products.find(product => product.id === id);
};

const filterByPrice = <T extends BaseProduct>(products: T[], maxPrice: number): T[] => {
    return products.filter(product => product.price <= maxPrice);
};

type CartItem<T> = {
    product: T;
    quantity: number;
};

const addToCart = <T extends BaseProduct>(
    cart: CartItem<T>[],
    product: T,
    quantity: number
): CartItem<T>[] => {
    const existingItem = cart.find(item => item.product.id === product.id);
    if (existingItem) {
        existingItem.quantity += quantity;
    } else {
        cart.push({ product, quantity });
    }
    return cart;
};

const calculateTotal = <T extends BaseProduct>(cart: CartItem<T>[]): number => {
    return cart.reduce((total, item) => total + item.product.price * item.quantity, 0);
};

// Testing area
const electronics: Electronics[] = [
    {
        id: 1,
        name: "Phone",
        price: 10000,
        description: "Modern smartphone",
        category: 'electronics',
        brand: "Samsung",
        warranty: 24
    },
    {
        id: 2,
        name: "Laptop",
        price: 30000,
        description: "High-performance laptop",
        category: 'electronics',
        brand: "Apple",
        warranty: 12
    }
];

const clothing: Clothing[] = [
    {
        id: 3,
        name: "T-Shirt",
        price: 500,
        description: "Cotton T-shirt",
        category: 'clothing',
        size: "L",
        material: "Cotton"
    },
    {
        id: 4,
        name: "Jacket",
        price: 2000,
        description: "Warm winter jacket",
        category: 'clothing',
        size: "M",
        material: "Polyester"
    }
];

const books: Book[] = [
    {
        id: 5,
        name: "Novel",
        price: 300,
        description: "Bestselling novel",
        category: 'book',
        author: "Famous Author",
        pages: 350
    },
    {
        id: 6,
        name: "Science Book",
        price: 800,
        description: "Informative science book",
        category: 'book',
        author: "Renowned Scientist",
        pages: 500
    }
];

console.log("Testing findProduct:");
console.log(findProduct(electronics, 1));
console.log(findProduct(clothing, 3));
console.log(findProduct(books, 6));
console.log(findProduct(books, 10)); // Should return undefined

console.log("Testing filterByPrice:");
console.log(filterByPrice(electronics, 15000));
console.log(filterByPrice(clothing, 1000));
console.log(filterByPrice(books, 500));

let cart: CartItem<BaseProduct>[] = [];
console.log("Testing addToCart:");
cart = addToCart(cart, electronics[0], 1);
cart = addToCart(cart, clothing[0], 2);
cart = addToCart(cart, books[0], 3);
cart = addToCart(cart, electronics[0], 1);
console.log(cart);

console.log("Testing calculateTotal:");
console.log(calculateTotal(cart));
