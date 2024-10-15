// Импортируем библиотеки
import "leaflet.markercluster";
import "leaflet.markercluster/dist/MarkerCluster.css";
import "leaflet.markercluster/dist/MarkerCluster.Default.css";
//Импортируем функции из модулей
import { styleFeatures } from "./js/modules/styleFeatures.js";
//import { highlight, dehighlight, select } from './js/modules/featuresInteractions.js'
import { getData } from "./js/modules/getData.js";
import { modifyLayersPanel } from "./js/modules/modifyLayersPanel.js";

//Наведение, клик, деклик на выбранный объект
function highlight(layer) {
    let geomType = layer.feature.geometry.type.toLowerCase();
    //Если полигональный объект
    if (~geomType.indexOf("polygon")) {
        layer.setStyle({
            fillOpacity: 0.15,
            weight: 4,
        });
    }
    if (!L.Browser.ie && !L.Browser.opera) {
        layer.bringToFront();
    }
}
function dehighlight(layer, lyrId) {
    if (selected === null || selected._leaflet_id !== layer._leaflet_id) {
        //Не работает при переключении между слоями
        //geoData[lyrId].resetStyle(layer);
        let geomType = layer.feature.geometry.type.toLowerCase();
        //Если полигональный объект
        if (~geomType.indexOf("polygon")) {
            layer.setStyle({
                fillOpacity: 0,
                weight: 2,
            });
        }
    }
}
function select(layer, lyrId) {
    if (selected !== null) {
        var previous = selected;
    }
    if (window.innerWidth > 992) {
        map.fitBounds(layer.getBounds(), { paddingBottomRight: [576, 160] });
    } else {
        map.fitBounds(layer.getBounds());
    }
    selected = layer;
    if (previous) {
        dehighlight(previous, lyrId);
    }
}
//По-хорошему надо поменять
let selected = null;

// Загружаем файл конфигурации карты. Переменную делаем глобальной, чтобы она была видна во всех модулях
window.cfg = getData("js/cfg/mapconfig.json");

//Название сайта
document.title = cfg.website_title;

// Подложки в контроль слоёв
let basemaps = {};
for (let b in cfg.basemaps) {
    basemaps[cfg.basemaps[b]] = L.tileLayer.provider(cfg.basemaps[b]);
}

// Создаём карту, ставим начальное положение и масштаб, мин. и макс. масштаб, охват; загружаем подложки
// Подложка по умолчанию - первая в списке в файле конфига
let map = L.map("mapid", {
    layers: [basemaps[Object.keys(basemaps)[0]]],
    maxBounds: L.latLngBounds(cfg.extent[0], cfg.extent[1]),
    minZoom: cfg.minZoom,
    maxZoom: cfg.maxZoom,
    zoomControl: false,
    zoomSnap: 0.25,
}).setView(cfg.center, cfg.zoom);

//Кнопки масштаба
L.control
    .zoom({
        position: "bottomright",
    })
    .addTo(map);

L.Control.goHome = L.Control.extend({
    onAdd: (map) => {},
});

//Панель слоёв, сразу настраиваем сортировку по порядку в конфиге
let layerControl = L.control
    .layers(basemaps, null, {
        collapsed: false,
        position: "topleft",
        sortLayers: true,
        sortFunction: (layerA, layerB, nameA, nameB) => {
            // Если это слой, а не подложка
            if (layerA.urls) {
                let layerA_Index = cfg.layers.findIndex(function (element) {
                    if (element.name == nameA) {
                        return true;
                    }
                });
                let layerB_Index = cfg.layers.findIndex(function (element) {
                    if (element.name == nameB) {
                        return true;
                    }
                });
                return layerA_Index - layerB_Index;
            } else {
                return 0;
            }
        },
    })
    .addTo(map);

//Масштабная линейка
L.control.scale({ maxWidth: 200, imperial: false }).addTo(map);
//Делаем единицы измерения в масштабной линейке на русском
let scale = document.getElementsByClassName("leaflet-control-scale-line")[0];
scale.textContent = scale.textContent.replace("km", "км").replace("m", "м");
["load", "move", "zoomend"].forEach((event) => {
    map.on(event, (e) => {
        scale.textContent = scale.textContent
            .replace("km", "км")
            .replace("m", "м");
    });
});

//Загружаем geojson с велоинфраструктурой и задаём систему условных обозначений
let geoData = [];
for (let lyrId in cfg.layers) {
    //console.log(cfg.layers[lyrId].name + ', ' + cfg.layers[lyrId].source + ' ' + lyrId);
    let pathToLyr = "sourcedata/mylayers/" + cfg.layers[lyrId].source;
    // Если нужны кластеры маркеров, то инициализируем
    // if (cfg.layers[lyrId].markers) {let markers = L.markerClusterGroup();}
    geoData[lyrId] = new L.GeoJSON.AJAX(pathToLyr, {
        // Стилизация точечного слоя
        pointToLayer: (feature, latlon) => {
            // if (feature.geometry.type) return null;
            return L.circleMarker(
                latlon,
                styleFeatures(feature, cfg.layers[lyrId].style)
            );
        },
        // Стилизация
        style: (feature) => {
            return styleFeatures(feature, cfg.layers[lyrId].style);
        },
        //Настраиваем интерактивность
        onEachFeature: (feature, layer) => {
            if (cfg.layers[lyrId].popup) {
                layer
                    .bindTooltip(feature.properties.name, {
                        direction: "center",
                        className: "bounds-tooltip",
                    })
                    .openTooltip();
            }
            layer.on({
                mouseover: (e) => {
                    highlight(e.target);
                },
                mouseout: (e) => {
                    dehighlight(e.target, lyrId);
                },
                click: (e) => {
                    if (cfg.layers[lyrId].infobox) {
                        select(e.target, lyrId);
                    }
                },
            });
        },
    });
    geoData[lyrId].on("data:loaded", () => {
        layerControl.addOverlay(geoData[lyrId], cfg.layers[lyrId].name);
        //Модифицируем панель слоёв
        modifyLayersPanel();
        // // Если нужны кластеры маркеров, то добавляем
        // if (cfg.layers[lyrId].markers) {
        // let markers = L.markerClusterGroup();
        // markers.addLayer(L.marker(getRandomLatLng(map)));
        // ... Add more layers ...
        // map.addLayer(markers);
        // }
        //Если в конфиге прописано отображения по умолчанию, то отображаем
        if (cfg.layers[lyrId].onByDef) geoData[lyrId].addTo(map);
    });

    //Навешиваем интерактивность на объекты: всплывающее окно
    geoData[lyrId].on("click", (e) => {
        if (cfg.layers[lyrId].infobox) {
            //Путь к папке с изображениями для объекта
            let imagesFolder = `sourcedata/featuredata/layers/${lyrId}/${e.layer.feature.properties.id}/`;
            //Массив источников фотографий
            let imagesSources = [];
            //Получаем данные из папки
            $.ajax({
                url: imagesFolder,
                success: function (res) {
                    let data = $(res).find("a");
                    for (let i = 0; i < data.length; i++) {
                        let dataHref = data[i].getAttribute("href");
                        //Если запись в данных - название файла картинки, то записываем в массив
                        if (dataHref.match(/\.(jpe?g|png|gif)$/)) {
                            imagesSources.push(dataHref);
                            //document.getElementsByClassName('v-infobox-image')[0].src = imgSrc;
                        }
                    }
                },
                async: false,
            });

            let slidesContainer =
                document.getElementsByClassName("carousel-inner")[0];
            let slides =
                slidesContainer.getElementsByClassName("carousel-item");
            let images = document.querySelectorAll(".carousel-item > img");
            let carouselIndicators = document.getElementsByClassName(
                "carousel-indicators"
            )[0];
            let carouselControls = document.querySelectorAll(
                "#carouselIndicators > button"
            );
            //Очищаем галерею, кроме первого слайда
            for (let i = 0; i < slides.length; i++) {
                if (i == 0) slides[i].classList.add("active");
                else slides[i].remove();
            }
            //Удаляем индикаторы
            carouselIndicators.innerHTML = null;
            // Если массив не пустой, то генерируем DOM слайдшоу
            if (imagesSources.length > 0) {
                imagesSources.forEach((value, index, array) => {
                    //Делаем картинки
                    if (index == 0) {
                        images[0].src = value;
                    } else {
                        let slide = document.createElement("div");
                        slide.classList.add("carousel-item");
                        let image = document.createElement("img");
                        image.src = value;
                        image.classList.add("d-block");
                        slide.appendChild(image);
                        slidesContainer.appendChild(slide);
                    }
                    //Если картинка одна, то убираем управление
                    if (imagesSources.length == 1) {
                        carouselControls.forEach((btn) => {
                            btn.classList.add("d-none");
                        });
                    }
                    //Если картинок больше, чем 1, то добавляем управление
                    else if (imagesSources.length > 1) {
                        //Делаем кнопки для слайдшоу снизу
                        let indicator = document.createElement("button");
                        indicator.setAttribute("type", "button");
                        indicator.setAttribute(
                            "data-bs-target",
                            "#carouselIndicators"
                        );
                        indicator.setAttribute(
                            "data-bs-slide-to",
                            String(index)
                        );
                        indicator.setAttribute(
                            "aria-label",
                            "Слайд " + String(index + 1)
                        );
                        if (index == 0) {
                            indicator.classList.add("active");
                            indicator.setAttribute("aria-current", "true");
                        }
                        carouselIndicators.appendChild(indicator);
                        //Убираем display: none для всех кнопок
                        carouselControls.forEach((btn) => {
                            btn.classList.remove("d-none");
                        });
                    }
                });
            }
            // Если массив пустой, то вставляем картинку "нет фото" и убираем управление слайдшоу
            else {
                images[0].src = "sourcedata/noimage.jpg";
                carouselControls.forEach((value) => {
                    value.classList.add("d-none");
                });
            }
            //Путь к логотипу, который по умолчанию при отсутствии фото
            //let pathToLogo = 'sourcedata/logos/' + cfg.layers[lyrId].logo;
            //document.getElementsByClassName('v-infobox-image')[0].src = pathToLogo;
            //Картинка "нет фото" при отсутствии фото
            //document.getElementsByClassName('v-infobox-image')[0].setAttribute("onerror", "this.src='sourcedata/noimage.jpg'")
            //document.getElementsByClassName('v-infobox-image')[0].src = 'sourcedata/streets/' + e.layer.feature.properties.id + '/header.jpg';
            //Заголовок и описание во всплывающем окнк
            let type_status_txt = "";
            if (e.layer.feature.properties.type != null) {
                type_status_txt = `${e.layer.feature.properties.type}. `;
            }
            if (e.layer.feature.properties.status != null) {
                type_status_txt += `${e.layer.feature.properties.status}. `;
            }
            //type_status_txt = `${e.layer.feature.properties.type}. ${e.layer.feature.properties.status}.`
            if (e.layer.feature.properties.title != null) {
                document.getElementById("v-infobox-title").innerHTML =
                    e.layer.feature.properties.title;
                //document.getElementById('v-infobox-text').innerHTML = fillInfoBoxDescription(e.layer.feature.properties.id).splitTxtDesc()
                document.getElementById("v-infobox-text").innerHTML =
                    type_status_txt;
            } else {
                document.getElementById("v-infobox-title").innerHTML =
                    type_status_txt;
                document.getElementById("v-infobox-text").innerHTML = "";
            }
            if (e.layer.feature.properties.description) {
                document.getElementById("v-infobox-text").innerHTML =
                    "<p>" +
                    e.layer.feature.properties.description.replace(
                        /\n/g,
                        "<p></p>"
                    ) +
                    "</p>";
            }
            document
                .getElementsByClassName("v-infobox")[0]
                .classList.add("v-infobox-open");
            document.getElementsByClassName("v-infobox")[0].scrollTop = 0;
        }
    });
}

//Всплывающее окно
document.getElementById("v-infobox-closebutton").onclick = () => {
    document
        .getElementsByClassName("v-infobox")[0]
        .classList.remove("v-infobox-open");
};
