//Загрузка описания из текстового файла с разбиением на абзацы
export function fillInfoBoxDescription(entity) {
    var contents = {
        pathtotxt: "sourcedata/streets/" + entity + "/" + "text.txt",
        readTxtDesc: function () {
            var contents;
            $.ajaxSetup({ async: false });
            $.get(this.pathtotxt, function (data) {
                contents = data;
            });
            $.ajaxSetup({ async: true });
            if (typeof contents == "undefined") contents = "";
            return contents;
        },
        splitTxtDesc: function () {
            //Look for TWO line breaks
            var splitContent = this.readTxtDesc().split(/\r?\n/);
            //Если текстовый файл с описанием пустой, то возвращаем пустую строку
            if (splitContent.length == 1 && splitContent[0] == "") return null;
            else {
                function encloseInTag(value, index, array) {
                    array[index] = "<p>" + array[index] + "</p>";
                }
                splitContent.forEach(encloseInTag);
                return splitContent.join("");
            }
        },
    };
    return contents;
}
