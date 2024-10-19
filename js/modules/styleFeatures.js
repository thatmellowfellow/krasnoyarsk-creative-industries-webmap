//Классификация знаков
export function styleFeatures(obj, type) {
    let style = {
        weight: 2,
    };
    if (["ul", "ip"].includes(type)) {
        style = {
            ...style,
            radius: 6,
            fillColor: obj.properties["Цвет категории"],
            color: "#545454",
            opacity: 0.6,
            fillOpacity: 0.8,
        };
    } else if (type == "bounds_mo") {
        style = {
            ...style,
            color: "#7d8b8f",
            opacity: 0.7,
            fillOpacity: 0,
            dashArray: "5, 5",
        };
    }
    return style;
}
