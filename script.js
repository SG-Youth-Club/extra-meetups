
// ===============================
// EDIT MODE
// ===============================

let editMode = true;

document.addEventListener("DOMContentLoaded", () => {
    setEditMode(true);
});

// toggle button
function toggleEditMode() {
    setEditMode(!editMode);
}

function setEditMode(state) {
    editMode = state;

    document.body.classList.toggle("editing", editMode);

    document.querySelectorAll(".page *").forEach(el => {

        // never edit toolbar
        if (el.closest(".toolbar")) return;

        // never edit links/buttons
        if (el.tagName === "A" || el.tagName === "BUTTON") return;

        // let venue system handle its own text
        if (el.closest(".venue-section")) return;

        el.contentEditable = editMode;
    });
}

// ===============================
// VENUE SYNC (WORKS WITH YOUR HTML)
// ===============================

function syncVenueName() {
    const venueSection = document.querySelector(".venue-section");
    if (!venueSection) return;

    const text = venueSection.querySelector("p");
    const link = venueSection.querySelector(".venue-link");

    if (!text || !link) return;

    const name = text.innerText.trim();

    link.textContent = name.length ? name : "Open Map";
}

// live typing sync
document.addEventListener("input", (e) => {
    if (e.target.closest(".venue-section")) {
        syncVenueName();
    }
});

// ===============================
// SAVE
// ===============================

function saveCopy() {

    const page = document.querySelector(".page");

    const data = {
        html: page.innerHTML
    };

    const blob = new Blob([JSON.stringify(data)], {
        type: "application/json"
    });

    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);

    const filename =
        prompt("Enter file name:", "Meeting1") || "Dashboard";

    a.download = filename + ".dashboard";
    a.click();

    URL.revokeObjectURL(a.href);
}

// ===============================
// LOAD (FIXED + RELIABLE)
// ===============================

function loadVersion() {

    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".dashboard";

    input.onchange = function (e) {

        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();

        reader.onload = function () {

            const data = JSON.parse(reader.result);

            document.querySelector(".page").innerHTML = data.html;

            // IMPORTANT: rebind after DOM rebuild
            setTimeout(() => {
                setEditMode(true);
                syncVenueName();
            }, 0);
        };

        reader.readAsText(file);
    };

    input.click();
}

// ===============================
// PDF EXPORT
// ===============================

function prepareExportBackground() {
    document.querySelector(".page").style.background = "#12002e";
}

function exportPDF() {

    prepareExportBackground();

    const element = document.querySelector(".page");

    html2pdf().set({
        margin: 0,
        filename: "Spectrum-Youth-Club.pdf",
        image: { type: "jpeg", quality: 1 },
        html2canvas: {
            scale: 2,
            useCORS: true,
            backgroundColor: "#12002e"
        },
        jsPDF: {
            unit: "px",
            format: [960, element.scrollHeight],
            orientation: "portrait"
        }
    }).from(element).save();
}