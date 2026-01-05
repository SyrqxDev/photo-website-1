
    /* =========================
    CLIENT CONFIGURATION
    ========================= */
    const GALLERIES = {
        "PFI 3rd Jan": {
            title: "PFI 3rd Jan",
            description: "",
            path: "https://originals.tristansharpe.com/pfi-3rd-jan",
            thumbs: "galleries/PFI-3rd-Jan/thumbs",
            manifest: "manifest.json",
            zip: "https://originals.tristansharpe.com/pfi-3rd-jan/PFI-3rd-Jan.zip"
        }
    };
    /* ========================= */

    let currentGalleryKey = null;
    let currentImages = [];
    let slideIndex = 0;
    let timer = null;
    let currentIndex = 0;

    /* -------------------------
    MENU
    ------------------------- */
    function toggleMenu() {
    document.getElementById("menu").classList.toggle("active");
}

    function buildMenu() {
    const list = document.getElementById("galleryList");
    list.innerHTML = "";
    Object.keys(GALLERIES).forEach(key => {
    const btn = document.createElement("button");
    btn.textContent = key;
    btn.onclick = () => loadGallery(key);
    list.appendChild(btn);
});
}

    /* -------------------------
    LOAD GALLERY
    ------------------------- */
    async function loadGallery(key) {
    currentGalleryKey = key;
    const g = GALLERIES[key];

    document.getElementById("title").textContent = g.title;
    document.getElementById("description").textContent = g.description;

    const response = await fetch(`${g.path}/${g.manifest}`);
    currentImages = await response.json();

    slideIndex = 0;
    startSlideshow();
    showHome();
    toggleMenu();
}

    /* -------------------------
    SLIDESHOW (THUMBNAILS)
    ------------------------- */
    function startSlideshow() {
    if (!currentImages.length) return;
    const g = GALLERIES[currentGalleryKey];
    const slide = document.getElementById("slide");

    slideIndex = 0;
    slide.src = `${g.thumbs}/${currentImages[0]}`;

    clearInterval(timer);
    timer = setInterval(() => {
    slideIndex = (slideIndex + 1) % currentImages.length;
    slide.src = `${g.thumbs}/${currentImages[slideIndex]}`;
}, 3000);
}

    /* -------------------------
    GALLERY GRID
    ------------------------- */
    function showGallery() {
    const grid = document.getElementById("gallery");
    const g = GALLERIES[currentGalleryKey];

    grid.innerHTML = "";
    currentImages.forEach((file, index) => {
    const img = document.createElement("img");
    img.src = `${g.thumbs}/${file}`;
    img.loading = "lazy";
    img.onclick = () => openLightbox(index);
    grid.appendChild(img);
});

    document.getElementById("home").style.display = "none";
    grid.style.display = "grid";
}

    function showHome() {
    document.getElementById("home").style.display = "block";
    document.getElementById("gallery").style.display = "none";
}

    /* -------------------------
    LIGHTBOX
    ------------------------- */
    let touchStartX = 0;

    function openLightbox(index) {
    currentIndex = index;
    const lb = document.getElementById("lightbox");
    const img = document.getElementById("lightboxImg");
    const g = GALLERIES[currentGalleryKey];

    img.src = `${g.path}/${currentImages[currentIndex]}`;
    lb.style.display = "flex";

    lb.ontouchstart = e => {
    touchStartX = e.changedTouches[0].screenX;
};

    lb.ontouchend = e => {
    const touchEndX = e.changedTouches[0].screenX;
    handleSwipe(touchEndX);
};
}

    function closeLightbox() {
    document.getElementById("lightbox").style.display = "none";
}

    function handleSwipe(touchEndX) {
    const threshold = 50;
    if (touchEndX < touchStartX - threshold) nextImage();
    if (touchEndX > touchStartX + threshold) prevImage();
}

    function nextImage() {
    const g = GALLERIES[currentGalleryKey];
    currentIndex = (currentIndex + 1) % currentImages.length;
    document.getElementById("lightboxImg").src =
    `${g.path}/${currentImages[currentIndex]}`;
}

    function prevImage() {
    const g = GALLERIES[currentGalleryKey];
    currentIndex = (currentIndex - 1 + currentImages.length) % currentImages.length;
    document.getElementById("lightboxImg").src =
    `${g.path}/${currentImages[currentIndex]}`;
}

    /* -------------------------
    DOWNLOADS
    ------------------------- */
    function downloadGallery() {
        const g = GALLERIES[currentGalleryKey];
        if (!g.zip) {
            alert("ZIP not available for this gallery yet.");
            return;
        }
        // direct download link (no fetch, no CORS)
        window.location.href = g.zip;
    }


    function downloadCurrent() {
        const g = GALLERIES[currentGalleryKey];
        const file = currentImages[currentIndex];
        const a = document.createElement("a");
        a.href = `${g.path}/${file}`;
        a.download = file;
        a.target = "_blank";
        a.click();
    }


    /* -------------------------
    INIT
    ------------------------- */
    buildMenu();
    loadGallery(Object.keys(GALLERIES)[0]);

