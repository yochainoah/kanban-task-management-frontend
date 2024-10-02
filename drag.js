const el = document.querySelector("#drag-me")

function handleMouseMove(evt) {
    el.style.left = evt.clientX + "px"
    el.style.top = evt.clientY + "px"
}

el.addEventListener('mousedown', () => {
    el.addEventListener('mousemove', handleMouseMove)
})

el.addEventListener('mouseup', () => {
    el.removeEventListener('mousemove', handleMouseMove)
})

/*
https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/drag_event
    dragstart
    dragend
    dragover
    dragenter
    dragleave
    drop
*/