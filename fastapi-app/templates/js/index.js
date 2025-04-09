const add_list = document.querySelector(".add_list_img");
const page_title = document.querySelector(".page_name");

const day = new Map([
  [0, "Sunday"],
  [1, "Monday"],
  [2, "Tuesday"],
  [3, "Wednesday"],
  [4, "Thursday"],
  [5, "Friday"],
  [6, "Saturday"],
]);

const month = new Map([
  [0, "Jan"],
  [1, "Feb"],
  [2, "Mar"],
  [3, "Apr"],
  [4, "May"],
  [5, "Jun"],
  [6, "Jul"],
  [7, "Aug"],
  [8, "Sep"],
  [9, "Oct"],
  [10, "Nov"],
  [11, "Dec"],
]);

async function Reload() {
  location.reload(true);
}

async function fetchTodos() {
  const response = await fetch("/todos");
  const todos = await response.json();

  todos.sort((a, b) => b.id - a.id);

  const todo_list = document.querySelector("footer");
  todo_list.innerHTML = "";

  todos.forEach((todo) => {
    const todo_box = document.createElement("div");
    todo_box.className = "todo_box";

    const list_item = document.createElement("div");
    list_item.className = "list_item";

    const list_title = document.createElement("div");
    list_title.className = "list_title";
    list_title.innerText = `${todo.title}`;

    const list_descript = document.createElement("div");
    list_descript.className = "list_descript";
    list_descript.innerText = `${todo.description}`;

    const date = new Date(todo.id);
    const date_box = document.createElement("div");
    date_box.className = "date_box";
    date_box.textContent = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;

    const completed_box = document.createElement("div");
    completed_box.className = "completed_box";

    const completed_chk = document.createElement("input");
    completed_chk.className = todo.id;
    completed_chk.id = "completed_chk";
    completed_chk.type = "checkbox";
    completed_chk.addEventListener("click", EditChk);

    if (todo.completed == false) {
      completed_chk.checked = false;
    } else {
      completed_chk.checked = true;
    }

    const add_more = document.createElement("div");
    add_more.className = "add_more";

    const add_more_img = document.createElement("img");
    add_more_img.id = todo.id;
    add_more_img.className = "add_more_img";
    add_more_img.src = "assets/more.svg";

    add_more_img.addEventListener("click", More_detail);

    list_item.appendChild(list_title);
    list_item.appendChild(list_descript);

    completed_box.appendChild(completed_chk);
    add_more.appendChild(add_more_img);

    todo_box.appendChild(completed_box);
    todo_box.appendChild(list_item);
    todo_box.appendChild(date_box);
    todo_box.appendChild(add_more);

    todo_list.appendChild(todo_box);
  });
}

async function AddList() {
  Minimization();

  const add = document.querySelector(".add_form");
  if (add) {
    add.remove();
  } else {
    const main = document.querySelector("main");

    const add_form = document.createElement("form");
    add_form.className = "add_form";
    add_form.addEventListener("submit", CreateList);

    const add_input = document.createElement("div");
    add_input.className = "add_input";

    const add_title = document.createElement("input");
    add_title.className = "add_title";
    add_title.placeholder = "title";
    add_title.spellcheck = false;
    add_title.required = true;
    add_title.maxLength = "15";

    const add_descript = document.createElement("textarea");
    add_descript.className = "add_descript";
    add_descript.placeholder = "description";
    add_descript.spellcheck = false;
    add_descript.required = true;
    add_descript.maxLength = "75";

    const add_submit = document.createElement("button");
    add_submit.className = "add_submit";
    add_submit.innerText = "Add";

    add_input.appendChild(add_title);
    add_input.appendChild(add_descript);

    add_form.appendChild(add_input);
    add_form.appendChild(add_submit);

    main.appendChild(add_form);

    setTimeout(() => {
      add_form.classList.add("active");
    }, 0);
  }
}

async function CreateList(event) {
  event.preventDefault();

  const title = document.querySelector(".add_title").value;
  const descript = document.querySelector(".add_descript").value;

  const response = await fetch("/todos", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      id: Date.now(),
      title,
      description: descript,
      completed: false,
    }),
  });
  if (response.ok) {
    document.querySelector(".add_form").remove();
    fetchTodos();
  }
}

async function EditTodo(edit) {
  Minimization();

  const id = edit.target.className;

  Swal.fire({
    title: "Edit",
    html:
      '<input id="swal-input1" class="swal2-input" placeholder="Title" required>' +
      '<input id="swal-input2" class="swal2-input" placeholder="Description" required>',
    focusConfirm: false,
    showCancelButton: true,

    preConfirm: () => {
      const val1 = document.getElementById("swal-input1").value.trim();
      const val2 = document.getElementById("swal-input2").value.trim();

      if (!val1 || !val2) {
        Swal.showValidationMessage("Enter all values");
        return false;
      }

      return { val1, val2 };
    },
    customClass: {
      popup: "edit_popup",
      title: "edit_title",
      confirmButton: "edit_confirm",
      cancelButton: "edit_cancel",
    },

    confirmButtonText: "Submit",
  }).then(async (result) => {
    if (result.isConfirmed) {
      const title = result.value.val1;
      const description = result.value.val2;

      const res = await fetch(`/todos/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id, title, description, completed: false }),
      });
      fetchTodos();
    }
  });
}

async function EditChk(edit) {
  Minimization();

  const id = edit.target.className;
  const res = await fetch(`/check/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ id }),
  });
}

async function DelTodo(edit) {
  Minimization();

  Swal.fire({
    title: "Delete?",
    showCancelButton: true,
    confirmButtonText: "Yes",
    cancelButtonText: "No",
  }).then(async (result) => {
    if (result.isConfirmed) {
      const id = edit.target.className;
      const res = await fetch(`/todos/${id}`, {
        method: "DELETE",
      });
      fetchTodos();
    }
  });
}

async function More_detail(event) {
  const parent = event.target.closest("div");
  const id = event.target.id;

  const edit_butt = document.createElement("button");
  edit_butt.className = id;
  edit_butt.id = "edit_butt";
  edit_butt.innerText = "Edit";
  edit_butt.addEventListener("click", EditTodo);

  const del_butt = document.createElement("button");
  del_butt.className = id;
  del_butt.id = "del_butt";
  del_butt.innerText = "Delete";
  del_butt.addEventListener("click", DelTodo);

  const more_box = document.createElement("div");
  more_box.className = "more_box";

  more_box.appendChild(edit_butt);
  more_box.appendChild(del_butt);

  const more_arrow = document.createElement("div");
  more_arrow.className = "more_arrow";

  const child1 = parent.querySelector(".more_box");
  const child2 = parent.querySelector(".more_arrow");

  if (child1) {
    child1.remove();
    child2.remove();
  } else {
    Minimization();
    parent.appendChild(more_box);
    parent.appendChild(more_arrow);

    setTimeout(() => {
      more_box.classList.add("active");
    }, 0);
  }
}

function Minimization() {
  document
    .querySelectorAll(".more_box, .more_arrow")
    .forEach((el) => el.remove());
}

async function Check_today(params) {
  let today = new Date();
  document.querySelector(".page_day").innerText = day.get(today.getDay());
  document.querySelector(".page_year").innerText = `${month.get(
    today.getMonth()
  )} ${today.getDate()}, ${today.getFullYear()}`;
}

add_list.addEventListener("click", AddList);
page_title.addEventListener("click", Reload);

Check_today();
setInterval(Check_today, 1000);

fetchTodos();

document.addEventListener("click", (event) => {
  if (
    !event.target.closest(".more_box") &&
    !event.target.closest(".more_arrow") &&
    !event.target.closest(".add_more_img")
  ) {
    Minimization();
  }
});
