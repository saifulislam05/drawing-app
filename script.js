const canvas = document.querySelector('canvas')
toolBtns = document.querySelectorAll(".tool"),
    fillColor = document.querySelector("#fill-color"),



    ctx = canvas.getContext('2d')

let preMouseX, preMouseY, snapshot,
    isDrawing = false,
    selectedTool = "brush",
    brushWidth = 5;

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
        return ctx.strokeRect(e.offsetX, e.offsetY, preMouseX - e.offsetX, preMouseY - e.offsetY);
    }
    ctx.fillRect(e.offsetX, e.offsetY, preMouseX - e.offsetX, preMouseY - e.offsetY);
}


// Draw circle 

const drawCircle = (e) => {
    let radius = Math.sqrt(Math.pow((preMouseX - e.offsetX, 2) + Math.pow(preMouseY - e.offsetY), 2))
    ctx.arc(preMouseX, preMouseY, radius, 0, 2 * Math.PI)
    ctx.stroke()
}



const startDraw = (e) => {
    isDrawing = true
    preMouseX = e.offsetX; //passing current mouseX position as prevMouseX value
    preMouseY = e.offsetY;//passing current mouseY position as prevMouseY value
    ctx.beginPath() //craeting new path to draw
    ctx.lineWidth = brushWidth; // passing brushSize as line widht
    snapshot = ctx.getImageData(0, 0, canvas.width, canvas.height)
}


const drawing = (e) => {
    if (!isDrawing) return;
    ctx.putImageData(snapshot, 0, 0)
    if (selectedTool === "brush") {
        ctx.lineTo(e.offsetX, e.offsetY);
        ctx.stroke()
    } else if (selectedTool === "rectangle") {
        drawRect(e);
    }

    else if (selectedTool === "circle") {
        drawCircle(e);
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

canvas.addEventListener("mousedown", startDraw) // if isDrawing is false returns from here
canvas.addEventListener("mousemove", drawing) // creating line according to the mouse pointer
canvas.addEventListener("mouseup", () => isDrawing = false) // drawing/ filling line with color