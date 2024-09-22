const toggleHiddenMode = (selector:string, modal: Element) => {
    let element: Element | null = document.querySelector(`[data-id="${selector}"]`);
    if (element) {
        element.addEventListener("click", () => {
            modal.classList.toggle("hidden");
        })
    }
}

document.addEventListener("DOMContentLoaded", () => {
    let modal: Element | null = document.querySelector('[data-id="about-modal-container"]');
    if (modal) {
        toggleHiddenMode("read-more", modal);
        toggleHiddenMode("about-span-close", modal);
        toggleHiddenMode("about-modal-confirm-button", modal);
    }
})