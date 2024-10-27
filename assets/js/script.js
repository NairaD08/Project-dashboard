// Retrieve tasks and nextId from localStorage
let taskList = JSON.parse(localStorage.getItem("taskList")) || [];
let nextId = JSON.parse(localStorage.getItem("nextId")) || 1;

// Todo: create a function to generate a unique task id
function generateTaskId() {
  return nextId++;
}

// Todo: create a function to create a task card
function createTaskCard(task) {
  const card = $("<div></div>")
    .addClass("task-card") // Add class for draggable functionality

    .attr("data-id", task.id); // Store the task ID in the card
  console.log(task.id);
  const title = $("<p></p>").text(task.taskTitle);
  const dueDate = $("<div></div>").text(task.taskDueDate);
  const Description = $("<div></div>").text(task.taskDiscription); //variable
  const deleteButton = $("<div></div>")
    .text("Delete")
    .addClass("delete-button"); //message

  //create task due date and task div elements
  card.append(title);
  card.append(dueDate);
  card.append(Description); //append gives the commend where to go/input
  card.append(deleteButton);

  // Bind the click event to the delete button
  deleteButton.click(function () {
    console.log("Delete button clicked for task ID:", task.id);
    handleDeleteTask(task.id);
  });
  return card;
}

// Todo: create a function to render the task list and make cards draggable
function renderTaskList() {
  // Clear the existing task cards
  $("#todo-cards").empty(); // This clears the container before rendering new cards
  $("#in-progress-cards").empty();
  $("#done-cards").empty();
  // Retrieve the updated task list from local storage

  const taskList = JSON.parse(localStorage.getItem("taskList")) || [];
  for (let i = 0; i < taskList.length; i++) {
    const taskCard = createTaskCard(taskList[i]);
    if (taskList[i].status === "to-do") {
      taskCard.addClass("todo-card");
      taskCard.removeClass("inprogress-card done-card");
      $("#todo-cards").append(taskCard);
    }
    if (taskList[i].status === "done") {
      taskCard.addClass("done-card");
      taskCard.removeClass("inprogress-card todo-card");
      $("#done-cards").append(taskCard);
    }
    if (taskList[i].status === "in-progress") {
      taskCard.addClass("inprogress-card");
      taskCard.removeClass("todo-card done-card");
      $("#in-progress-cards").append(taskCard);
    }
  }
  // Make task cards draggable
  $(".task-card").draggable({
    revert: "invalid", // If not dropped, revert back
    start: function () {
      $(this).addClass("dragging"); // Add a class for styling if needed
    },
    stop: function () {
      $(this).removeClass("dragging"); // Remove the class after dragging
    },
  });
  // Make status lanes droppable
  $(".task-lane").droppable({
    revert: "invalid",
    accept: ".task-card", // Accept only task cards
    drop: function (event, ui) {
      const newStatus = $(this).data("status"); // Get the new status from the lane
      const taskId = ui.draggable.data("id"); // Get the ID of the dragged task
      console.log(newStatus);
      console.log(taskId);
      handleDrop(event, taskId, newStatus); // Call the function to handle dropping
    },
  });
}

// Todo: create a function to handle adding a new task
function handleAddTask(event) {
  event.preventDefault(); // prevents refresh of the page
  const taskTitle = $("#taskTitle").val(); //value
  const taskDueDate = $("#taskDueDate").val();
  const taskDiscription = $("#taskDiscription").val();

  const newTaskId = generateTaskId(); // Use the generateTaskId function
  const newTask = {
    id: newTaskId,
    taskTitle,
    taskDueDate,
    taskDiscription,
    status: "To Do",
  };
  const taskList = JSON.parse(localStorage.getItem("taskList")) || []; // ||empty array retrieve the list
  taskList.push(newTask); // updating the list with the new task in javascript
  console.log(taskList);
  localStorage.setItem("taskList", JSON.stringify(taskList)); // saving the updated list to local storage
  localStorage.setItem("nextId", JSON.stringify(nextId)); // Update nextId in local storage
  renderTaskList();
  //   console.log(taskTitle, taskDueDate, taskDiscription);
}

// Todo: create a function to handle deleting a task
function handleDeleteTask(taskId) {
  let taskList = JSON.parse(localStorage.getItem("taskList")) || [];
  console.log("Before deletion:", taskList); // Log before deletion
  taskList = taskList.filter((task) => task.id !== taskId); // Filter out the deleted task
  console.log("After deletion:", taskList); // Log after deletion
  localStorage.setItem("taskList", JSON.stringify(taskList)); // Update local storage
  renderTaskList(); // Re-render the task list to reflect changes
}

// Todo: create a function to handle dropping a task into a new status lane
function handleDrop(event, ui) {
  let taskList = JSON.parse(localStorage.getItem("taskList")) || [];
  console.log(taskList);
  const id = ui.draggable[0].dataset.id;
  const newStatus = event.target.id;
  const task = taskList.find((task) => task.id == id); // Find the task by ID

  console.log(task);
  if (task) {
    console.log("inside");
    task.status = newStatus; // Update the task's status
    // if (newStatus === ""

    localStorage.setItem("taskList", JSON.stringify(taskList)); // Update local storage
    renderTaskList(); // Re-render the task list to reflect changes
  }
}

// Todo: when the page loads, render the task list, add event listeners, make lanes droppable, and make the due date field a date picker
$(document).ready(function () {
  renderTaskList(); // Render the task list on page load

  $("#submit").click(handleAddTask); // Add task button click event
  $("#taskDueDate").datepicker({ changeMonth: true, changeYear: true }); // Initialize datepicker

  // Initialize draggable and droppable after rendering the task list
  $(".task-card").draggable({
    revert: "invalid",
    start: function () {
      $(this).addClass("dragging");
    },
    stop: function () {
      $(this).removeClass("dragging");
    },
  });
  $(".lane").droppable({
    accept: ".task-card",
    drop: handleDrop,
  });
  $(".task-lane").droppable({
    revert: "invalid",
    accept: ".task-card",
    drop: function (event, ui) {
      const newStatus = $(this).data("status");
      const taskId = ui.draggable.data("id");
      console.log(newStatus);
      handleDrop(taskId, newStatus);
    },
  });
});
