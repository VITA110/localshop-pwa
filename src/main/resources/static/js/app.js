const locationButton = document.querySelector("#location-button");
const locationMessage = document.querySelector("#location-message");
const installButton = document.querySelector("#install-button");
let toastTimeout;
let installPrompt;

function showMessage(message) {
    locationMessage.textContent = message;
    locationMessage.classList.add("is-visible");
    window.clearTimeout(toastTimeout);
    toastTimeout = window.setTimeout(() => locationMessage.classList.remove("is-visible"), 5000);
}

function setLocationLoading(isLoading) {
    locationButton.disabled = isLoading;
    locationButton.querySelector("span").textContent = isLoading ? "Buscando..." : "Encontrar tiendas";
}

locationButton.addEventListener("click", () => {
    if (!("geolocation" in navigator)) {
        showMessage("Tu navegador no permite consultar la ubicación.");
        return;
    }

    setLocationLoading(true);
    navigator.geolocation.getCurrentPosition(
        ({ coords }) => {
            const latitude = coords.latitude.toFixed(5);
            const longitude = coords.longitude.toFixed(5);
            const mapUrl = `https://www.openstreetmap.org/?mlat=${latitude}&mlon=${longitude}#map=16/${latitude}/${longitude}`;
            showMessage(`Tu ubicación está lista: ${latitude}, ${longitude}.`);
            const link = document.createElement("a");
            link.href = mapUrl;
            link.target = "_blank";
            link.rel = "noopener noreferrer";
            link.textContent = " Ver mapa";
            locationMessage.append(link);
            setLocationLoading(false);
        },
        (error) => {
            const message = error.code === error.PERMISSION_DENIED
                ? "Permite el acceso a tu ubicación en el navegador para encontrar tiendas cercanas."
                : "No pudimos obtener tu ubicación. Inténtalo de nuevo.";
            showMessage(message);
            setLocationLoading(false);
        },
        { enableHighAccuracy: false, timeout: 10000, maximumAge: 60000 }
    );
});

window.addEventListener("beforeinstallprompt", (event) => {
    event.preventDefault();
    installPrompt = event;
    installButton.hidden = false;
});

installButton.addEventListener("click", async () => {
    if (!installPrompt) return;
    installPrompt.prompt();
    await installPrompt.userChoice;
    installPrompt = null;
    installButton.hidden = true;
});

window.addEventListener("appinstalled", () => {
    installPrompt = null;
    installButton.hidden = true;
    showMessage("Localshop quedó instalada en tu dispositivo.");
});

if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
        navigator.serviceWorker.register("/sw.js")
            .catch((error) => console.error("No se pudo registrar el Service Worker:", error));
    });
}
