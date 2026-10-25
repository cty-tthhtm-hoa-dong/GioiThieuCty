
const categoryList = document.getElementById("categoryList");
const productGrid = document.getElementById("productGrid");
const productCount = document.getElementById("productCount");
const currentCategoryTitle = document.getElementById("currentCategoryTitle");
const productSearch = document.getElementById("productSearch");

let categories = [];
let products = [];
let selectedCategory = "all";

async function loadData() {
    try {
        const [categoryResponse, productResponse] = await Promise.all([
            fetch("data/categories.json"),
            fetch("data/products.json")
        ]);

        if (!categoryResponse.ok || !productResponse.ok) {
            throw new Error("Không thể tải dữ liệu sản phẩm.");
        }

        categories = await categoryResponse.json();
        products = await productResponse.json();

        renderCategories();
        renderProducts();
    } catch (error) {
        categoryList.textContent = "Không thể tải danh mục.";
        productGrid.textContent =
            "Không thể tải dữ liệu. Hãy chạy website qua máy chủ HTTP.";
        productCount.textContent = "";
        console.error(error);
    }
}

function renderCategories() {
    categoryList.replaceChildren();

    const allButton = createCategoryButton(
        "all",
        "Tất cả sản phẩm"
    );

    categoryList.appendChild(allButton);

    categories.forEach(category => {
        categoryList.appendChild(
            createCategoryButton(category.id, category.name)
        );
    });
}

function createCategoryButton(id, name) {
    const button = document.createElement("button");

    button.type = "button";
    button.className = "category-button";
    button.textContent = name;
    button.classList.toggle("active", selectedCategory === id);

    button.addEventListener("click", () => {
        selectedCategory = id;
        renderCategories();
        renderProducts();
    });

    return button;
}

function renderProducts() {
    const keyword = productSearch.value.trim().toLowerCase();

    const filteredProducts = products.filter(product => {
        const matchesCategory =
            selectedCategory === "all" ||
            product.categoryId === selectedCategory;

        const matchesKeyword =
            product.name.toLowerCase().includes(keyword) ||
            product.description.toLowerCase().includes(keyword);

        return matchesCategory && matchesKeyword;
    });

    const category = categories.find(
        item => item.id === selectedCategory
    );

    currentCategoryTitle.textContent =
        category ? category.name : "Tất cả sản phẩm";

    productCount.textContent =
        `${filteredProducts.length} sản phẩm`;

    productGrid.replaceChildren();

    if (filteredProducts.length === 0) {
        const emptyMessage = document.createElement("p");
        emptyMessage.className = "products-status";
        emptyMessage.textContent = "Không tìm thấy sản phẩm phù hợp.";
        productGrid.appendChild(emptyMessage);
        return;
    }

    filteredProducts.forEach(product => {
        productGrid.appendChild(createProductCard(product));
    });
}

function createProductCard(product) {
    const card = document.createElement("article");
    card.className = "product-card";

    const imageWrapper = document.createElement("div");
    imageWrapper.className = "product-image";

    const image = document.createElement("img");
    image.src = product.image;
    image.alt = product.name;
    image.loading = "lazy";

    image.addEventListener("error", () => {
        image.remove();
        imageWrapper.classList.add("image-unavailable");
        imageWrapper.textContent = "Chưa có hình ảnh";
    }, { once: true });

    imageWrapper.appendChild(image);

    const content = document.createElement("div");
    content.className = "product-card-content";

    const category = categories.find(
        item => item.id === product.categoryId
    );

    const categoryName = document.createElement("p");
    categoryName.className = "product-category";
    categoryName.textContent = category ? category.name : "Sản phẩm";

    const name = document.createElement("h3");
    name.textContent = product.name;

    const description = document.createElement("p");
    description.className = "product-description";
    description.textContent = product.description;

    const price = document.createElement("p");
    price.className = "product-price";
    price.textContent = product.price
        ? product.price
        : "Liên hệ báo giá";

    const contactLink = document.createElement("a");
    contactLink.className = "product-contact-link";
    contactLink.href = "contact.html";
    contactLink.textContent = "Yêu cầu tư vấn →";

    content.append(
        categoryName,
        name,
        description,
        price,
        contactLink
    );

    card.append(imageWrapper, content);

    return card;
}

productSearch.addEventListener("input", renderProducts);

loadData();
