var parseBtn = document.getElementById("parseBtn");
var colorsContainer = document.getElementById("popupContent");


parseBtn.addEventListener("click",() => {
    // Получить активную вкладку браузера
    chrome.tabs.query({active: true}, function(tabs) {
        var tab = tabs[0];
        // и если она есть, то выполнить на ней скрипт
        if (tab) {
            execScript(tab);
        } else {
            alert("There are no active tabs")
        }
    })
})

function execScript(tab) {
    // Выполнить функцию на странице указанной вкладки
    // и передать результат ее выполнения в функцию onResult
    chrome.scripting.executeScript(
      {
          target:{tabId: tab.id, allFrames: true},
          func:getColors
      },
      onResult
    )
}

function getColors() {
    const colorMap = new Map();

    // Get all elements on the page
    const allElements = document.querySelectorAll('*');

    // Iterate through each element
    allElements.forEach(element => {
        // Get the computed style of the element
        const computedStyle = window.getComputedStyle(element);

        // Extract color property from the computed style
        const color = computedStyle.color ||
          computedStyle.backgroundColor ||
          computedStyle.borderColor;

        // Check if the color is not transparent
        if (color !== 'rgba(0, 0, 0, 0)' && color !== 'transparent') {
            // Add the element to the color map
            if (colorMap.has(color)) {
                colorMap.get(color).push(element);
            } else {
                colorMap.set(color, [element]);
            }
        }
    });

    // Log the color map
    console.log(colorMap);

    // setPickers(colorMap);


    return colorMap;
}

function onResult(frames) {
    // TODO - Объединить списки цветов
    // затем объединить их преобразовать их в элементы для отображения

    // const colorMap = frames[0].result;

    console.log(colorsContainer)
    console.log(frames)

    // if (colorMap)
    //     colorMap.forEach((value, key) => {
    //         const div = document.createElement('div');
    //         div.style.backgroundColor = key;
    //         colorsContainer.append(div);
    //         // const picker = new Picker(div);
    //         // console.log(picker)
    //     })
    //
    // console.log(colorMap)

}