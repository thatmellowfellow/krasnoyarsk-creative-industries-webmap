export default function mapLegend(_) {
    // Отрасли КИ и их цвета
    const industryColors = {
        "Изобразительное искусство": "#FFE699",
        "Исполнительское искусство": "#FFE699",
        Киноиндустрия: "#73FB79",
        "Медиа и СМИ": "#00FB92",
        "Музыкальная индустрия": "#00FA00",
        Образование: "#7030A0",
        НИОКР: "#7030A0",
        "Реклама, PR, маркетинг": "#FF8AD8",
        "Игровая индустрия": "#73FEFF",
        "Информационные технологии ": "#73FEFF",
        "Архитектурная, инженерная, конструкторская деятельность, урбанистика":
            "#92D050",
        Дизайн: "#92D050",
        "Издательско-полиграфическая деятельность ": "#D883FF",
        "Индустрия моды": "#FF40FF",
        "Народно-художественные промыслы, ремесла": "#FFC000",
        Гастрономия: "#FFC000",
        "Индустрия наследия (культурного, исторического и природного)":
            "#00B0F0",
        "Индустрия отдыха и развлечений": "#7A81FF",
        "Производство оборудования и материалов для креативных индустрий":
            "#F8CBAD",
        "Тиражирование товаров креативных индустрий": "#F8CBAD",
        "Распространение товаров и услуг креативных индустрий": "#F8CBAD",
        "Обслуживание креативных индустрий": "#F8CBAD",
    };

    let div = L.DomUtil.create("div", "info legend");

    let legendContents = "";
    for (const [cat, color] of Object.entries(industryColors)) {
        legendContents += `
            <div>
                <i style="background: ${color}"></i>
                <span>${cat}</span>
            </div>
        `;
    }
    div.innerHTML = `
    <i title="Условные обозначения" class="legend-close-btn btn btn-light btn-sm fa-solid fa-angle-down" data-bs-toggle="collapse" data-bs-target="#collapseLegend" aria-expanded="true"></i>
    <div class="legend-container collapse show" id="collapseLegend">
        <div style="justify-content: space-between">
            <h6 class="legend-header">Отрасли креативных индустрий</h6>
        </div>
        ${legendContents}
    </div>`;
    return div;
}
