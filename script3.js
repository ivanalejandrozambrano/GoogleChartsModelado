document.addEventListener("DOMContentLoaded", function () {
    // Tu código actual relacionado con la creación de gráficos

    // Obtén referencias a los elementos de botones
    const misGraficosBtn = document.getElementById("misGraficosBtn");
    const lookerStudioBtn = document.getElementById("lookerStudioBtn");
    const powerbiBtn = document.getElementById("powerbiBtn");
    const tableuBtn = document.getElementById("tableuBtn");
    const misGraficosDiv = document.getElementById("charts");

    // Obtén referencia al iframe
    const lookerStudioIframe = document.getElementById("lookerStudioIframe");

    const biframe = document.getElementById("biframe");

    const viz1692334557932 = document.getElementById("viz1692334557932");

    // Agrega eventos de clic a los botones
    misGraficosBtn.addEventListener("click", function () {
        misGraficosDiv.style.display = "block";
        lookerStudioIframe.style.display = "none";
        biframe.style.display = "none";
        viz1692334557932.style.display = "none";
    });

    lookerStudioBtn.addEventListener("click", function () {
        misGraficosDiv.style.display = "none";
        lookerStudioIframe.style.display = "block";
        biframe.style.display = "none";
        viz1692334557932.style.display = "none";

    });

    powerbiBtn.addEventListener("click", function () {
        misGraficosDiv.style.display = "none";
        lookerStudioIframe.style.display = "none";
        viz1692334557932.style.display = "none";
        biframe.style.display = "block";

    });

    tableuBtn.addEventListener("click", function () {
        misGraficosDiv.style.display = "none";
        lookerStudioIframe.style.display = "none";
        biframe.style.display = "none";
        viz1692334557932.style.display = "block";

        var divElement = document.getElementById('viz1692334557932');
        var vizElement = divElement.getElementsByTagName('object')[0];
        if (divElement.offsetWidth > 800) {
            vizElement.style.width = '100%';
            vizElement.style.height = '827px';
        } else if (divElement.offsetWidth > 500) {
            vizElement.style.width = '100%';
            vizElement.style.height = '827px';
        } else {
            vizElement.style.width = '100%';
            vizElement.style.height = '1327px';
        }
        var scriptElement = document.createElement('script');
        scriptElement.src = 'https://public.tableau.com/javascripts/api/viz_v1.js';
        vizElement.parentNode.insertBefore(scriptElement, vizElement);


    });
});
