const canvas = document.querySelector('canvas')
toolBtns = document.querySelectorAll(".tool"),
    fillColor = document.querySelector("#fill-color"),
    sizeSlider = document.querySelector("#size-slider"),
    colorBtns = document.querySelectorAll(".colors .option"),
    colroPicker = document.querySelector("#color-picker"),
    clearCanvas = document.querySelector(".clear-canvas"),
    saveImg = document.querySelector(".save-img"),


    ctx = canvas.getContext('2d')

let prevMouseX, prevMouseY, snapshot,
    isDrawing = false,
    selectedTool = "brush",
    brushWidth = 0;
selectedColor = "#000"

window.addEventListener('load', () => {
    // setting canvas widht/height .. offsetWidth/height returns viewable width/height of an element
    canvas.width = canvas.offsetWidth
    canvas.height = canvas.offsetHeight
})

// Draw Rectangle 
const drawRect = (e) => {
    // if fillColor isn't checked draw a react with border else draw rect with background
    if (!fillColor.checked) {
        // crating circle according to the mouse pointer
        return ctx.strokeRect(e.offsetX, e.offsetY, prevMouseX - e.offsetX, prevMouseY - e.offsetY);
    }
    ctx.fillRect(e.offsetX, e.offsetY, prevMouseX - e.offsetX, prevMouseY - e.offsetY);
}


// Draw circle 

const drawCircle = (e) => {
    ctx.beginPath()
    //getting redius for circle according to the mouse pointer
    let radius = Math.sqrt(Math.pow((prevMouseX - e.offsetX), 2) + Math.pow((prevMouseY - e.offsetY), 2))
    ctx.arc(prevMouseX, prevMouseY, radius, 0, 2 * Math.PI)//creatign circle according to the mouse pointer
    fillColor.checked ? ctx.fill() : ctx.stroke(); // if fillcolor is checked fill circle else draw border circle
}

// draw Triangle
const drawTriangle = (e) => {
    ctx.beginPath();//creating new path to draw circle
    ctx.moveTo(prevMouseX, prevMouseY);// moving triangle to the mouse pointer
    ctx.lineTo(e.offsetX, e.offsetY) // creating first line according to the mouse pointer
    ctx.lineTo(prevMouseX * 2 - e.offsetX, e.offsetY);//creating botton line of triangle
    ctx.closePath(); // closing path of a triangle so the third line draw automatically
    fillColor.checked ? ctx.fill() : ctx.stroke();
}
//  straight line

const drawLine = (e) => {
    ctx.beginPath();
    ctx.moveTo(prevMouseX, prevMouseY)
    ctx.lineTo(e.offsetX, e.offsetY)
    ctx.stroke();
}
// start draw
const startDraw = (e) => {
    isDrawing = true
    prevMouseX = e.offsetX; //passing current mouseX position as prevMouseX value
    prevMouseY = e.offsetY;//passing current mouseY position as prevMouseY value
    ctx.beginPath() //craeting new path to draw
    ctx.lineWidth = brushWidth; // passing brushSize as line widht
    ctx.strokeStyle = selectedColor; //Passing selectedColor as stroke style
    ctx.fillStyle = selectedColor; //Passing selectedColor as fill style
    // Copying canvas data & passing as snapshot value.. this avoids dragging the image
    snapshot = ctx.getImageData(0, 0, canvas.width, canvas.height)
}


const drawing = (e) => {
    if (!isDrawing) return;
    ctx.putImageData(snapshot, 0, 0)

    if (selectedTool === "brush" || selectedTool === "eraser") {
        //if selected tool is eraser then set strokeStyle to white
        // to paint white color on to the existing canvas content else set the stroke color to selected color
        ctx.strokeStyle = selectedTool === "eraser" ? "#fff" : selectedColor
        ctx.lineTo(e.offsetX, e.offsetY);
        ctx.stroke()
    } else if (selectedTool === "rectangle") {
        drawRect(e);
    }

    else if (selectedTool === "circle") {
        drawCircle(e);
    } else if (selectedTool === "line") {
        drawLine(e);
    }
    else {
        drawTriangle(e);
    }

}

toolBtns.forEach(btn => {
    btn.addEventListener("click", () => { // adding click event to all tool option
        document.querySelector(".options .active").classList.remove("active");
        btn.classList.add("active")
        selectedTool = btn.id
        console.log(selectedTool);

    })
});

sizeSlider.addEventListener("change", () => brushWidth = sizeSlider.value)

colorBtns.forEach(btn => {
    btn.addEventListener("click", () => { // adding click event to all color button
        // Removing selected class from the previous option and adding on current clicked option
        document.querySelector(".options .selected").classList.remove("selected");
        btn.classList.add("selected")
        // Passing selected btn background color as selector color value
        selectedColor = window.getComputedStyle(btn).getPropertyValue("background-color");

    })
});

colroPicker.addEventListener("change", () => {
    colroPicker.parentElement.style.background = colroPicker.value
    colroPicker.parentElement.click()
})
clearCanvas.addEventListener("click", () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height)//Clearing whole canvas
})

saveImg.addEventListener("click", () => {
    const link = document.createElement("a"); //Creating <a> Element
    link.download = `${Date.now()}.jpg`; // Passing current date as link download value
    link.href = canvas.toDataURL(); // Passing canvasData as link href value
    link.click(); // Clicking link to download image

})
canvas.addEventListener("mousedown", startDraw) // if isDrawing is false returns from here
canvas.addEventListener("mousemove", drawing) // creating line according to the mouse pointer
canvas.addEventListener("mouseup", () => isDrawing = false) // drawing/ filling line with color