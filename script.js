
// SAFE EDITING (FIXED PROPERLY)
document.addEventListener("DOMContentLoaded", () => {

    enableEditing();
});

function enableEditing() {

    document.querySelectorAll(".page *").forEach(el => {

        // ❌ lock quick cards (keep links working)
        if (el.closest(".quick-card")) {
            el.contentEditable = false;
            return;
        }

        // ❌ lock any explicitly non-editable sections (NEW FIX)
        if (el.closest(".no-edit")) {
            el.contentEditable = false;
            return;
        }

        // ❌ keep buttons + links functional
        if (el.tagName === "A" || el.tagName === "BUTTON") return;

        el.contentEditable = true;
    });
}

// SAVE VERSION
function saveCopy() {

    const page = document.querySelector(".page");

    const data = {
        html: page.innerHTML
    };

    const blob = new Blob(
        [JSON.stringify(data)],
        { type: "application/json" }
    );

    const a = document.createElement("a");

    a.href = URL.createObjectURL(blob);

    const filename =
        prompt("Enter file name:", "Meeting1") || "Dashboard";

    a.download = filename + ".dashboard";

    a.click();

    URL.revokeObjectURL(a.href);
}


// LOAD VERSION
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

            // re-enable editing after load
            enableEditing();
        };

        reader.readAsText(file);
    };

    input.click();
}


// EXPORT BACKGROUND FIX
function prepareExportBackground() {
    const page = document.querySelector(".page");
    page.style.background = "#12002e";
}


// EXPORT PDF (STABLE WORKING VERSION)
function exportPDF() {

    prepareExportBackground();

    const element = document.querySelector(".page");

    html2pdf().set({
        margin: 0,
        filename: "Spectrum-Youth-Club.pdf",

        image: {
            type: "jpeg",
            quality: 1
        },

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