const checkboxes = document.querySelectorAll(".complete-checkbox")

checkboxes.forEach((checkbox)=>{
    checkbox.addEventListener("change",async ()=>{
        // console.log(checkbox.dataset.id);
        const id = checkbox.dataset.id
        const response = await fetch(`/complete/${id}`,{
            method : "POST"
        })
        // console.log(response);
        location.reload();
        
    })
})
const undocheckboxes = document.querySelectorAll(".undo-checkbox")

undocheckboxes.forEach((checkbox)=>{
    checkbox.addEventListener("change",async ()=>{
        // console.log(checkbox.dataset.id);
        const id = checkbox.dataset.id
        const response = await fetch(`/undo/${id}`,{
            method : "POST"
        })
        // console.log(response);
        location.reload();
        
    })
})