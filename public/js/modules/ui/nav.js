export function setActiveNavByPath(pathname = window.location.pathname) {
    const page = pathname.split('/').pop();
    document.querySelectorAll('.dock-item').forEach((item) => {
        const href = item.getAttribute('href') || '';
        if (href.endsWith(page)) item.classList.add('active');
    });
}
