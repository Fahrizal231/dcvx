document.addEventListener('DOMContentLoaded', async () => {
    const loadingScreen = document.getElementById("loadingScreen");
    const body = document.body;
    body.classList.add("no-scroll");

    try {
        const settings = await fetch('/settings.json').then(res => res.json());

        const apiContent = document.getElementById('apiContent');
        settings.categories.forEach(category => {
            const categoryContent = category.items.map(item => {
                return `
                    <div class="col-md-6 col-lg-4 api-item mb-3">
                        <div class="d-flex justify-content-between align-items-center p-3 border rounded">
                            <div>
                                <h5>${item.name}</h5>
                                <p class="text-muted">${item.desc}</p>
                            </div>
                            <button class="btn btn-dark btn-sm get-api-btn" data-api="${item.path}" data-name="${item.name}" data-desc="${item.desc}">GET</button>
                        </div>
                    </div>
                `;
            }).join('');
            apiContent.insertAdjacentHTML('beforeend', `<h3 class="mb-3">${category.name}</h3><div class="row">${categoryContent}</div>`);
        });

        // Event listener untuk tombol GET
        document.querySelectorAll('.get-api-btn').forEach(btn => {
            btn.addEventListener('click', async (event) => {
                const button = event.target;
                const apiPath = button.getAttribute('data-api');
                const apiName = button.getAttribute('data-name');
                const apiDesc = button.getAttribute('data-desc');

                const modal = new bootstrap.Modal(document.getElementById('apiResponseModal'));
                const modalLabel = document.getElementById('apiResponseModalLabel');
                const modalDesc = document.getElementById('apiResponseModalDesc');
                const modalContent = document.getElementById('apiResponseContent');

                modalLabel.textContent = apiName;
                modalDesc.textContent = apiDesc;
                modalContent.textContent = "Loading...";

                try {
                    const response = await fetch(apiPath);
                    const data = await response.json();
                    modalContent.textContent = JSON.stringify(data, null, 2);
                } catch (error) {
                    modalContent.textContent = "Error fetching API";
                }

                modal.show();
            });
        });

    } catch (error) {
        console.error("Error loading settings:", error);
    } finally {
        setTimeout(() => {
            loadingScreen.style.display = "none";
            body.classList.remove("no-scroll");
        }, 2000);
    }
});