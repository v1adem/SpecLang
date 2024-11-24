// Local storage (Isolated lists)
const contentStore: Record<string, BaseContent> = {};


interface BaseContent {
    id: string;
    createdAt: Date;
    updatedAt: Date;
    publishedAt?: Date;
    status: 'draft' | 'published' | 'archived';
    versions: Version<BaseContent>[]; // List of previous versions
}

interface Article extends BaseContent {
    title: string;
    content: string;
    authorId: string;
    tags?: string[];
}

interface Product extends BaseContent {
    name: string;
    description: string;
    price: number;
    stock: number;
    categories?: string[];
}

// Don`t think that it`s the best solution, but in some case it can be useful
type Version<T> = {
    versionNumber: number;
    content: T;
    modifiedAt: Date;
};

interface ContentOperations<T extends BaseContent> {
    create(data: T): T;
    get(id: string): T | null;
    modify(id: string, updates: Partial<T>): T | null;
    remove(id: string): boolean;
}

const ContentOperationsImplementation: ContentOperations<any> = {
    create(data) {
        const newContent = {
            ...data
        };

        const initialVersion: Version<BaseContent> = {
            versionNumber: 1,
            content: { ...newContent },
            modifiedAt: new Date(),
        };

        newContent.versions.push(initialVersion);
        return newContent;
    },
    get(id, version = -1) { // If you want, you can get specified version
        return contentStore[id]?.versions.at(version)?.content || null;
    },
    modify(id, updates) {
        const content = contentStore[id];
        if (!content) return null;

        const latestContent = content.versions.at(-1)?.content;
        if (!latestContent) return null;

        const updatedContent: BaseContent = {
            ...latestContent,
            ...updates,
            updatedAt: new Date(),
        };

        const newVersion: Version<BaseContent> = {
            versionNumber: content.versions.length + 1,
            content: updatedContent,
            modifiedAt: new Date(),
        };

        content.versions.push(newVersion);
        return updatedContent;
    },
    remove(id) {
        if (contentStore[id]) {
            delete contentStore[id];
            return true;
        }
        return false;
    },
};

type Role = 'admin' | 'editor' | 'viewer';

type Permission = {
    create: boolean;
    read: boolean;
    update: boolean;
    delete: boolean;
};

type AccessControl<T extends BaseContent> = {
    role: Role;
    permissions: {
        [key in keyof Permission]: (content: T) => boolean;
    };
};

type ValidationResult = {
    isValid: boolean;
    errors?: string[];
};

type Validator<T> = {
    validate: (data: T) => ValidationResult;
};

const ArticleValidator: Validator<Article> = {
    validate: (data) => {
        const errors: string[] = [];
        if (!data.title) errors.push('Title is required.');
        if (!data.content) errors.push('Content is required.');
        if (!data.authorId) errors.push('Author ID is required.');

        return {
            isValid: errors.length === 0,
            errors: errors.length ? errors : undefined,
        };
    },
};

const ProductValidator: Validator<Product> = {
    validate: (data) => {
        const errors: string[] = [];
        if (!data.name) errors.push('Name is required.');
        if (data.price < 0) errors.push('Price cannot be negative.');
        if (data.stock < 0) errors.push('Stock cannot be negative.');

        return {
            isValid: errors.length === 0,
            errors: errors.length ? errors : undefined,
        };
    },
};

const CompositeValidator = <T>(validators: Validator<T>[]): Validator<T> => ({
    validate: (data) => {
        const errors: string[] = [];

        validators.forEach((validator) => {
            const result = validator.validate(data);
            if (!result.isValid && result.errors) {
                errors.push(...result.errors);
            }
        });

        return {
            isValid: errors.length === 0,
            errors: errors.length ? errors : undefined,
        };
    },
});



// Tests
function testCreate() {
    console.log("=== Test Create ===");
    const article: Article = {
        id: 'article-1',
        createdAt: new Date(),
        updatedAt: new Date(),
        status: 'draft',
        title: 'Test Article',
        content: 'This is a test article.',
        authorId: 'author-1',
        tags: ['test'],
        versions: [],
    };

    const createdArticle = ContentOperationsImplementation.create(article);
    contentStore[article.id] = createdArticle;

    console.assert(createdArticle.versions.length === 1, "Initial version should be created.");
    console.assert(
        createdArticle.versions[0].content.title === 'Test Article',
        "Created article should have the correct title."
    );
    console.log("Create test passed!");
}

function testModify() {
    console.log("=== Test Modify ===");
    const article = contentStore['article-1'];
    const modifiedArticle = ContentOperationsImplementation.modify('article-1', { status: 'published' });

    console.assert(modifiedArticle !== null, "Modify should return updated content.");
    console.assert(
        modifiedArticle?.status === 'published',
        "Modified article should have updated status."
    );
    console.assert(
        article.versions.length === 2,
        "Version history should include the new version."
    );
    console.log("Modify test passed!");
}

function testGet() {
    console.log("=== Test Get ===");
    const fetchedArticle = ContentOperationsImplementation.get('article-1');
    console.assert(fetchedArticle !== null, "Get should return the article.");
    console.assert(
        fetchedArticle?.id === 'article-1',
        "Fetched article should have the correct ID."
    );
    console.log("Get test passed!");
}

function testRemove() {
    console.log("=== Test Remove ===");
    const isRemoved = ContentOperationsImplementation.remove('article-1');
    console.assert(isRemoved, "Remove should return true for existing item.");
    const fetchedArticle = ContentOperationsImplementation.get('article-1');
    console.assert(fetchedArticle === null, "Removed item should not be fetchable.");
    console.log("Remove test passed!");
}

function testValidation() {
    console.log("=== Test Validation ===");
    const invalidArticle: Article = {
        id: 'article-2',
        createdAt: new Date(),
        updatedAt: new Date(),
        status: 'draft',
        title: '',
        content: '',
        authorId: '',
        versions: [],
    };

    const validationResult = ArticleValidator.validate(invalidArticle);
    console.assert(!validationResult.isValid, "Validation should fail for invalid article.");
    console.assert(
        validationResult.errors?.includes("Title is required."),
        "Validation should detect missing title."
    );
    console.log("Validation test passed!");
}

function testAccessControl() {
    console.log("=== Test Access Control ===");
    const accessControl: AccessControl<BaseContent> = {
        role: 'editor',
        permissions: {
            create: () => true,
            read: () => true,
            update: (content) => content.status !== 'archived',
            delete: () => false,
        },
    };

    const archivedArticle: BaseContent = {
        id: 'archived-1',
        createdAt: new Date(),
        updatedAt: new Date(),
        status: 'archived',
        versions: [],
    };

    console.assert(
        accessControl.permissions.create(archivedArticle),
        "Editor should have create permission."
    );
    console.assert(
        !accessControl.permissions.update(archivedArticle),
        "Editor should not have update permission for archived content."
    );
    console.assert(
        !accessControl.permissions.delete(archivedArticle),
        "Editor should not have delete permission."
    );
    console.log("Access Control test passed!");
}

function runTests() {
    testCreate();
    testModify();
    testGet();
    testRemove();
    testValidation();
    testAccessControl();
}

runTests();
