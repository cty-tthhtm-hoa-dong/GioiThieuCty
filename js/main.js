async function includeNavbar() {
    const container = document.getElementById("navbar");

    if (!container) return;

    try {
        const response = await fetch("components/navbar.html");

        if (!response.ok) {
            throw new Error("HTTP " + response.status);
        }

        container.innerHTML = await response.text();
        setActiveNav();
    } catch (error) {
        console.error("Lỗi tải Navbar:", error);
        container.textContent = "Không thể tải thanh điều hướng.";
    }
}

function setActiveNav() {
    const currentPage =
        window.location.pathname.split("/").pop() || "index.html";

    document.querySelectorAll(".nav-menu a[data-page]").forEach(link => {
        link.classList.toggle(
            "active",
            link.dataset.page === currentPage
        );
    });
}

/* ẢNH TỰ CHUYỂN (TRANG CHỦ) */

const SLIDE_INTERVAL = 3500;

function initSlideshows() {
    const reduceMotion =
        window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    document.querySelectorAll(".image-slideshow").forEach((slideshow, index) => {
        const slides = slideshow.querySelectorAll("img");

        if (slides.length < 2 || reduceMotion) return;

        let current = 0;

        // Lệch thời điểm bắt đầu để các khung không đổi ảnh cùng lúc.
        setTimeout(() => {
            setInterval(() => {
                slides[current].classList.remove("is-active");
                current = (current + 1) % slides.length;
                slides[current].classList.add("is-active");
            }, SLIDE_INTERVAL);
        }, index * 700);
    });
}

/* SAO CHÉP LINK BÀI VIẾT */

// Địa chỉ công khai của website. Khi xem thử trên máy (localhost),
// link được sao chép vẫn là link công khai để gửi cho người khác.
const PUBLIC_SITE_URL = "https://cty-tthhtm-hoa-dong.github.io/GioiThieuCty/";

function getShareUrl(path) {
    const host = window.location.hostname;
    const isLocal =
        window.location.protocol === "file:" ||
        host === "" ||
        host === "localhost" ||
        host === "127.0.0.1" ||
        /^(10|192\.168)\./.test(host);

    return new URL(path, isLocal ? PUBLIC_SITE_URL : window.location.href).href;
}

async function copyText(text) {
    if (navigator.clipboard && window.isSecureContext) {
        try {
            await navigator.clipboard.writeText(text);
            return true;
        } catch (error) {
            // Chuyển sang cách dự phòng bên dưới.
        }
    }

    const textarea = document.createElement("textarea");
    textarea.value = text;
    textarea.setAttribute("readonly", "");
    textarea.style.position = "fixed";
    textarea.style.opacity = "0";
    document.body.appendChild(textarea);
    textarea.select();

    let copied = false;

    try {
        copied = document.execCommand("copy");
    } catch (error) {
        copied = false;
    }

    textarea.remove();
    return copied;
}

function initCopyLinks() {
    document.querySelectorAll("[data-copy-link]").forEach(button => {
        const originalLabel = button.textContent.trim();
        let resetTimer;

        button.addEventListener("click", async () => {
            const url = getShareUrl(button.dataset.copyLink);
            const copied = await copyText(url);

            if (!copied) {
                window.prompt("Sao chép link bài viết:", url);
                return;
            }

            button.textContent = "Đã sao chép link ✓";
            button.classList.add("is-copied");

            clearTimeout(resetTimer);
            resetTimer = setTimeout(() => {
                button.textContent = originalLabel;
                button.classList.remove("is-copied");
            }, 2000);
        });
    });
}

document.addEventListener("DOMContentLoaded", () => {
    includeNavbar();
    initSlideshows();
    initCopyLinks();
});
