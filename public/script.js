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

const editbuttons = document.querySelectorAll(".edit-btn")
const editTitle = document.getElementById("edit-title");
const editId = document.getElementById("edit-id");
const editDescription = document.getElementById("edit-description");
const editdeadline = document.getElementById("edit-deadline");
const editpriority = document.getElementById("edit-priority");

const editModal = document.getElementById("edit-modal")

const saveBtn = document.getElementById("save-btn");

const closeBtn = document.getElementById("close-btn")

const tasktitles = document.querySelectorAll(".task-title")

const descriptionModal = document.getElementById("description-modal")
const descriptionText = document.getElementById("description-text")
const descriptionTitle = document.getElementById("description-title")
const descriptionDeadline = document.getElementById("description-deadline")

editbuttons.forEach((button)=>{
    button.addEventListener("click",()=>{
        editTitle.value = button.dataset.title;
        editDescription.value = button.dataset.description;
        editdeadline.value = button.dataset.deadline;
        editpriority.value = button.dataset.priority;
        editId.value = button.dataset.id;
        // console.log(editId.value);

        editModal.style.display = "flex"
    })
})

saveBtn.addEventListener("click", async()=>{
    const task = {
        title : editTitle.value,
        description : editDescription.value,
        deadline : editdeadline.value,
        priority : editpriority.value
    }
    const response = await fetch(`/edit/${editId.value}`,{
        method:"POST",
        headers : {
            "Content-Type":"application/json",
        },
        body:JSON.stringify(task)
        
    })
    // console.log(task);
    location.reload();
    editModal.style.display = "none"
    
})

closeBtn.addEventListener("click",() => {
  editModal.style.display = "none"
})

tasktitles.forEach((title)=>{
    title.addEventListener("click",() => {
        descriptionTitle.textContent =title.dataset.title;
        descriptionText.textContent =title.dataset.description;
        descriptionDeadline.textContent ="Deadline: " + title.dataset.deadline;
        descriptionModal.style.display = "flex"
        //  console.log(title.dataset);
    })
})

descriptionModal.addEventListener("click",(event)=>{

    if(event.target === descriptionModal){
        descriptionModal.style.display = "none";
    }

});