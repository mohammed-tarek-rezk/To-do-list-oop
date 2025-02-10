//task class
class Task {
  constructor(task, deadline) {
    (this.id = Date.now()),
      (this.task = task),
      (this.deadline = deadline);
    this.done = false;
  }
}

//storage class
class Storage {
  //getTasks
  static getTasks() {
    return window.localStorage.tasks === undefined
      ? []
      : JSON.parse(window.localStorage.tasks);
  }

  //save Tasks
  static addTask(task) {
    let tasks = Storage.getTasks();
    tasks.push(task);
    window.localStorage.tasks = JSON.stringify(tasks);
    Ui.ShowTasks();
  }

  //remove task
  static removeTask(id) {
    let tasks = Storage.getTasks();
    tasks.forEach((el, index) => {
      if (el.id == id) {
        tasks.splice(index, 1);
      }
    });
    window.localStorage.tasks = JSON.stringify(tasks);
    Ui.ShowTasks();
  }

  //change done
  static changeDone(id) {
    let tasks = Storage.getTasks();
    tasks.forEach((el, index) => {
      if (el.id == id) {
        tasks[index].done = true;
      }
    });
    window.localStorage.tasks = JSON.stringify(tasks);
    Ui.ShowTasks();
  }

  static editData(id , task , date){
    let tasks = Storage.getTasks();
    tasks.forEach((el, index) => {
      if (el.id == id) {
        tasks[index].task = task;
        tasks[index].deadline = date;
      }
    });
    window.localStorage.tasks = JSON.stringify(tasks);
    Ui.ShowTasks();
  }
}
//ui class
class Ui {
  //show tasks
  static ShowTasks() {
    document.getElementById("table-body").innerHTML = "";
    let tasks = Storage.getTasks();
    tasks.sort((a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime());
    console.log(tasks);
    tasks.forEach((el, index) => {
      Ui.addTaskToUi(el, index);
    });
  }
  //done Task
  static doneTask(task, index) {
    let row = document.createElement("tr");
    row.style = "background: #00800054";
    let innerHtml = `
        <td>${index + 1}</td>
        <td>${task.task}</td>
        <td>${new Date(task.deadline).toLocaleString()}</td>
        <td>00:00:00</td>
        <td data-target=${
          task.id
        }><button class="text-red-800 block cursor-pointer" style="color: red"><i class="fa-solid fa-trash-can delete"></i></button> </td>
        `;
    row.innerHTML = innerHtml;
    document.getElementById("table-body").append(row);
  }
  static showPup(task , deadline , id){
    console.log(task)
    console.log(deadline)
    //create cancel layer
    let cancel = document.createElement("div")
    let form = document.createElement("form")
    cancel.className = "cancel"
    cancel.style = `
    background: #00000094;
    position: absolute;
    width: 100%;
    height:100vh;
    top: 0;
    left: 0`
    cancel.onclick = function(e){
        if(e.target.classList.contains("cancel")){
            document.getElementsByClassName("cancel")[0].remove()
        }
    }

    //create the form 
    form.className = "edit-form"
    form.innerHTML= `
      <div class=""style="position: relative;">
        <i class="fa-solid fa-power-off cancel" style="position: absolute; right:0; top: -10px; color:red"></i>
        <label class=""><i class="fa-solid fa-list-check mr-2"></i>Task</label>
        <input type="text" id="edit-task" class="" value = "${task}"/>
      </div>
      <div>
        <label><i class="fa-solid fa-clock mr-2"></i>Deadline</label>
        <input type="datetime-local" id="edit-date" value = "${deadline}" />
      </div>
      <div>
        <input
          type="submit"
          value="Edit Task"
          class="bg-white hover:bg-blue-900 transition-all hover:text-white"
        />
      </div>
    `
    form.onsubmit = (e)=>{
        e.preventDefault()
          //get data
    let taskText = document.getElementById("edit-task").value.trim() || task;
    let date = document.getElementById("edit-date").value || deadline;

    if (Date.parse(date) < Date.now()) {
        //show error
        Ui.showAlerts("Not valid deadline", 0);
        return;
    }

    Storage.editData(id , taskText , date)
    cancel.click()
    Ui.showAlerts("Edit successfully....", 1);
    }
    cancel.appendChild(form)
    document.body.appendChild(cancel)
  }
  static notDoneTask(task, index) {
    let row = document.createElement("tr");
    let innerHtml = `
        <td>${index + 1}</td>
        <td>${task.task}</td>
        <td>${new Date(task.deadline).toLocaleString()}</td>
        <td class="still" data-date=${new Date(task.deadline).getTime()}>${Still.showStill(
      new Date(task.deadline).getTime()
    )}</td>
        <td data-target=${
          task.id
        }><button class="text-red-800 block cursor-pointer" style="color: red"><i class="fa-solid fa-trash-can delete"></i></button> | <button class=""><i class="fa-solid fa-pencil edit"></i></button> | <button style="color: green"><i class="fa-solid fa-square-check done"></i></button></td>
        `;
    row.innerHTML = innerHtml;
    document.getElementById("table-body").append(row);
  }

  //not done task
  //add Task to list
  static addTaskToUi(task, index) {
    task.done ? Ui.doneTask(task, index) : Ui.notDoneTask(task, index);
  }

  //delete filds
  static emptyFields() {
    document.getElementById("task").value = "";
    document.getElementById("date").value = "";
  }

  static showAlerts(msg, success) {
    let div = document.createElement("div");
    div.appendChild(document.createTextNode(msg));
    if (success) {
      div.style = `background: green; color: white ; text-align:center`;
    } else {
      div.style = `background: red; color: white;text-align:center `;
    }
    document.getElementById("alert").appendChild(div);
    setTimeout(() => {
      document.getElementById("alert").firstElementChild.remove();
    }, 2000);
  }
}

//still class
class Still {
  static showStill(date) {
    return date - Date.now() > 0
      ? Still.StillFormat(date - Date.now())
      : "00:00:00";
  }

  static StillFormat(ms) {
    // Get total seconds
    let totalSeconds = Math.floor(ms / 1000);

    // Calculate hours, minutes, seconds, and remaining milliseconds
    let hours = Math.floor(totalSeconds / 3600);
    let minutes = Math.floor((totalSeconds % 3600) / 60);
    let seconds = totalSeconds % 60;
    let milliseconds = ms % 1000;

    // Pad with leading zeros if necessary
    hours = String(hours).padStart(2, "0");
    minutes = String(minutes).padStart(2, "0");
    seconds = String(seconds).padStart(2, "0");
    milliseconds = String(milliseconds).padStart(2, "0");

    // Format to HH:MM:SS.sss
    return `${hours}:${minutes}:${seconds}`;
  }

  static DealingControl() {
    let allStillsCounters = document.querySelectorAll(".still");
    allStillsCounters.forEach((el) => {
      if (el.getAttribute("data-date") - Date.now() > 0) {
        let count = setInterval(() => {
          if (el.getAttribute("data-date") - Date.now() <= 0) {
            clearInterval(count);
            el.parentElement.style = `background: #ff00001c; border-radius: 5px; `;
          }
          el.innerHTML = Still.StillFormat(
            el.getAttribute("data-date") - Date.now()
          );
        }, 1000);
      } else {
        el.parentElement.style = `background: #ff00001c; border-radius: 5px; `;
      }
    });
  }
}

//show tasks
Ui.ShowTasks();
Still.DealingControl();

//handle of submit
document.forms[0].addEventListener("submit", function (e) {
  //prevent default
  e.preventDefault();

  //get data
  let taskText = document.getElementById("task").value.trim();
  let date = document.getElementById("date").value;

  //validate data
  if (taskText === "" || date === "") {
    //show error
    Ui.showAlerts("All fields is required", 0);
    return;
  }

  if (Date.parse(date) < Date.now()) {
    //show error
    Ui.showAlerts("Not valid deadline", 0);
    return;
  }

  //add data to storage
  let task = new Task(taskText, date);

  Storage.addTask(task);

  //clear fields
  Ui.emptyFields();
  Still.DealingControl();
});

//deleting element
document.addEventListener("click", (e) => {
  if (e.target.classList.contains("delete")) {
    //delete Element from storage
    Storage.removeTask(
      e.target.parentElement.parentElement.getAttribute("data-target")
    );

    //alert
    Ui.showAlerts("Task Deleted successfully", 1);
    Still.DealingControl();
  }
});

//click on done

document.addEventListener("click", (e) => {
  if (e.target.classList.contains("done")) {
    Storage.changeDone(
      e.target.parentElement.parentElement.getAttribute("data-target")
    );
  }
});


//click on edit
document.addEventListener("click", (e) => {
    if (e.target.classList.contains("edit")) {
        let id = e.target.parentElement.parentElement.getAttribute("data-target");
        let tasks = Storage.getTasks()
        tasks.forEach((el , index)=>{
            if(el.id == id){
                // console.log("updated")
                // document.getElementById("task").value = el.task;
                // document.getElementById("date").value = el.deadline;
                Ui.showPup( el.task , el.deadline ,id)
            }
        })
    }
  });