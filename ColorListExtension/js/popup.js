var parseBtn = document.getElementById("parseBtn");
var colorsContainer = document.getElementById("popupContent");

parseBtn.addEventListener("click",function() {
    // Получить активную вкладку браузера
    chrome.tabs.query({active: true, lastFocusedWindow: true }, async (tabs) => {
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
    chrome.scripting.executeScript({
        target: { tabId: tab.id, allFrames: true },
        func: getColors
    }, onResult);
}

function getColors() {
    function RGBAToHexA(rgba, forceRemoveAlpha = false) {
        return "#" + rgba.replace(/^rgba?\(|\s+|\)$/g, '') // Get's rgba / rgb string values
          .split(',') // splits them at ","
          .filter((string, index) => !forceRemoveAlpha || index !== 3)
          .map(string => parseFloat(string)) // Converts them to numbers
          .map((number, index) => index === 3 ? Math.round(number * 255) : number) // Converts alpha to 255 number
          .map(number => number.toString(16)) // Converts numbers to hex
          .map(string => string.length === 1 ? "0" + string : string) // Adds 0 when length of one number is 1
          .join("") // Puts the array to togehter to a string
    }

    const colorMap = {};

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
            const hex = RGBAToHexA(color);
            // if (!colorMap.includes(hex)) colorMap.push(hex);

            if (colorMap[hex]) {
                // colorMap[hex].push({...element});
            } else {
                colorMap[hex] = [];
            }
        }
    });

    // Log the color map
    console.log(colorMap);

    return colorMap;
}


function onResult(frames) {
    const colors = Object.keys(frames[0].result);
    console.log(colors);
    colors.forEach((el) => {
        const div = document.createElement('div');
        const picker = new Picker({
            parent: div,
            color: el,
            alpha: false,
            editor: false,
            onChange: function(color) {
                div.style.backgroundColor = color.rgbaString;
            },
        })
        colorsContainer.appendChild(div);
    })
}