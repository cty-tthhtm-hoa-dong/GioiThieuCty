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

document.addEventListener("DOMContentLoaded", includeNavbar);
