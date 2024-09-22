document.addEventListener("DOMContentLoaded", () => {
    let fetchedAboutText: Element | null = document.querySelector('[data-id="fetched-about-text"]')
    if (fetchedAboutText) {
        fetch("https://jsonplaceholder.typicode.com/posts/1")
            .then(res => res.json())
            .then(data => {
                fetchedAboutText.innerHTML = data.body;
            })
    }
})