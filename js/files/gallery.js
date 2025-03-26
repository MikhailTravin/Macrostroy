const galleries = document.querySelectorAll("[data-gallery]");
if (galleries.length) {
    let galleyItems = [];
    galleries.forEach((gallery => {
        galleyItems.push({
            gallery,
            galleryClass: lightGallery(gallery, {
                licenseKey: "7EC452A9-0CFD441C-BD984C7C-17C8456E",
                speed: 500
            })
        });
    }));

    flsModules.gallery = galleyItems;
}