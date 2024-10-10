//Классификация знаков
export function styleFeatures(obj, type) {
    var style = {};
    style.weight = 2;
    if (type == "existing") {
        if (obj.properties.status == 1) {
            style.color = obj.properties.color;
        } else {
            style.weight = 0;
        }
    } else if (type == "planned") {
        if (obj.properties.status == 2 || obj.properties.status == 5) {
            style.color = obj.properties.color;
        } else {
            style.weight = 0;
        }
    } else if (type == "OTSlab") {
        style.color = obj.properties.color;
        style.dashArray = "5, 5";
    } else if (type == "GCUP") {
        if (
            ~obj.properties.title.indexOf("Перспектив") ||
            ~obj.properties.title.indexOf("егпп") ||
            ~obj.properties.title.search(/НВ./)
        ) {
            style.color = "#800000";
        } else style.weight = 0;
        //Существующие
    } else if (type == "Velosipedization") {
        if (~obj.properties.type.indexOf("выезды из города")) {
            style.color = "#e7ae1d";
        } else if (
            ~obj.properties.type.indexOf("загородные связи и продолжения")
        ) {
            style.color = "#6023e5";
        } else if (
            ~obj.properties.type.indexOf("маршруты городского значения и выше")
        ) {
            style.color = "#c8397e";
        } else if (
            ~obj.properties.type.indexOf("маршруты районного значения")
        ) {
            style.color = "#76cc6c";
        } /*else if (~obj.properties.type.indexOf("стройпроект")) {
                    style.color = "#25d0e3";
        }*/ else {
            style.color = "red";
            style.weight = 0;
        }
    } else if (type == "study_veloperception") {
        style.fillColor = obj.properties.color;
        style.fillOpacity = 0.75;
        style.stroke = false;
    }
    return style;
}
//Классификация знаков простая
export function styleFeatures_simple(obj, color) {
    var style = {};
    style.weight = 2;
    //Цвет: тип велоинфраструктуры
    style.color = color;
    return style;
}
