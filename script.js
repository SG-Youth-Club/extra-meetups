// Make dashboard editable
document.addEventListener("DOMContentLoaded", () => {
    document.querySelector(".page").contentEditable = true;
});
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

            document.querySelector(".page").innerHTML =
                data.html;

  // re-enable editing after loading
document.querySelector(".page").contentEditable = true;

        };

        reader.readAsText(file);

    };

    input.click();
}


// EXPORT PDF
function exportPDF() {

    const element = document.querySelector(".page");

    const opt = {
        margin: 0,
        filename: "meetup.pdf",
        image: {
            type: "jpeg",
            quality: 1
        },
        html2canvas: {
            scale: 2,
            backgroundColor: "#12002e"
        },
        jsPDF: {
    unit: "px",
    format: [1200, element.scrollHeight + 200]
        }
    };

    html2pdf()
        .set(opt)
        .from(element)
        .save();
}