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
    //OTS с классификацией
    //Цвет и наличие штриховки: тип велоинфраструктуры
    else if (type == "OTSlab") {
        if (~obj.properties.title.indexOf("ланир")) {
            style.color = "#808080";
        } else if (
            ~obj.properties.title.indexOf("елод") &&
            ~obj.properties.title.indexOf("рож")
        ) {
            style.color = "#004c00";
        } else if (~obj.properties.title.indexOf("елопол")) {
            style.color = "#18ad18";
        } else if (
            ~obj.properties.title.indexOf("ело") &&
            ~obj.properties.title.indexOf("пеш")
        ) {
            style.color = "#004c00";
        } else if (~obj.properties.title.indexOf("бщес")) {
            style.color = "#004080";
        } else if (~obj.properties.title.indexOf("овмещ")) {
            style.color = "#800000";
        } else if (~obj.properties.title.indexOf("авигац")) {
            style.color = "#996633";
        } else if (~obj.properties.title.indexOf("елопере")) {
            style.color = "#004c00";
        } else {
            style.color = "red";
            style.weight = 4;
        }
        //Предлагаемую инфр-ру - пунктиром
        if (
            !(
                ~obj.properties.title.indexOf("ущест") ||
                ~obj.properties.title.indexOf("ланир")
            )
        ) {
            style.dashArray = "5, 5";
        } else {
            //Сущ./план. - убираем
            style.weight = 0;
        }
        //OTS
    } else if (type == "OTS") {
        if (!~obj.properties.title.indexOf("ущест")) {
            style.color = "#157ee6";
        } else style.weight = 0;
        //GCUP
    } else if (type == "GCUP") {
        if (
            ~obj.properties.title.indexOf("Перспектив") ||
            ~obj.properties.title.indexOf("егпп") ||
            ~obj.properties.title.search(/НВ./)
        ) {
            style.color = "#800000";
        } else style.weight = 0;
        //Существующие и планируемые
    } else if (type == "existing") {
        if (~obj.properties.status.indexOf("Существующая")) {
            style.color = obj.properties.color_old;
        } else {
            style.weight = 0;
        }
    } else if (type == "planned") {
        if (~obj.properties.status.indexOf("Планируемая")) {
            style.color = obj.properties.color_old;
        } else {
            style.weight = 0;
        }
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
    let style = {};
    style.weight = 2;
    //Цвет: тип велоинфраструктуры
    style.color = color;
    return style;
}
