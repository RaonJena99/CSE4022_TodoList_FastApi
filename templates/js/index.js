const add_list = document.querySelector(".add_list_img");
const page_title = document.querySelector(".page_name");

async function Reload() {
    location.reload(true);
}

async function fetchTodos(){
    const response = await fetch('/todos');
    const todos = await response.json();

    todos.sort((a, b) => b.id - a.id);

    const todo_list = document.querySelector('footer');
    todo_list.innerHTML = '';

    todos.forEach(todo => {
        const todo_box = document.createElement('div');
        todo_box.className = 'todo_box';

        const list_item = document.createElement('div');
        list_item.className = "list_item";

        const list_title = document.createElement('div');
        list_title.className = "list_title";
        list_title.innerText = `${todo.title}`;

        const list_descript = document.createElement('div');
        list_descript.className = "list_descript";
        list_descript.innerText = `${todo.description}`;

        const date = new Date(todo.id); 
        const date_box = document.createElement('div');
        date_box.className = 'date_box';
        date_box.textContent = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;

        const completed_box = document.createElement('div');
        completed_box.className = "completed_box";

        const completed_chk = document.createElement('input');
        completed_chk.className = todo.id;
        completed_chk.id = "completed_chk";
        completed_chk.type = "checkbox";
        completed_chk.addEventListener("click", EditChk);
        if(todo.completed == false){
            completed_chk.checked = false;
        }
        else {
            completed_chk.checked = true;
        }

        const adit_butt = document.createElement('button');
        adit_butt.className =todo.id;
        adit_butt.id = "adit_butt";
        adit_butt.innerText = "Edit";
        adit_butt.addEventListener("click", EditTodo);

        const del_butt = document.createElement('button');
        del_butt.className = todo.id;
        del_butt.id = "del_butt";
        del_butt.innerText = "Delete";
        del_butt.addEventListener("click", DelTodo);

        list_item.appendChild(list_title);
        list_item.appendChild(list_descript);

        completed_box.appendChild(completed_chk);

        todo_box.appendChild(completed_box);
        todo_box.appendChild(list_item);
        todo_box.appendChild(date_box);
        todo_box.appendChild(adit_butt);
        todo_box.appendChild(del_butt);

        todo_list.appendChild(todo_box);
    });
}

async function AddList() {
    const main = document.querySelector("main");

    const add = document.querySelector(".add_form");

    if (add){
        add.remove();
    }
    else {
        const add_form = document.createElement('form');
        add_form.className = "add_form";
        add_form.addEventListener("submit",CreateList);

        const add_input = document.createElement('div');
        add_input.className = "add_input";

        const add_title = document.createElement('input');
        add_title.className = "add_title";
        add_title.placeholder = "title";
        add_title.spellcheck = false;
        add_title.required = true;
        add_title.maxLength = "15";

        const add_descript = document.createElement('textarea');
        add_descript.className = "add_descript";
        add_descript.placeholder = "description";
        add_descript.spellcheck = false;
        add_descript.required = true;
        add_descript.maxLength = "75";

        const add_submit = document.createElement('button');
        add_submit.className = "add_submit";
        add_submit.innerText = "Add";

        add_input.appendChild(add_title);
        add_input.appendChild(add_descript);

        add_form.appendChild(add_input);
        add_form.appendChild(add_submit);

        main.appendChild(add_form);
    }
}

async function CreateList (event) {
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

async function EditTodo(edit){
    const id = edit.target.className;

    Swal.fire({
        title: 'Edit',
        html:
        '<input id="swal-input1" class="swal2-input" placeholder="Title" required>' +
        '<input id="swal-input2" class="swal2-input" placeholder="Description" required>',
        focusConfirm: false,
        showCancelButton: true,

        preConfirm: () => {
            const val1 = document.getElementById('swal-input1').value.trim();
            const val2 = document.getElementById('swal-input2').value.trim();
                
            if (!val1 || !val2) {
                Swal.showValidationMessage('Enter all values');
                return false;
            }
                
            return { val1, val2 };
        },
        customClass: {
            popup: 'edit_popup',
            title: 'edit_title',
            confirmButton: 'edit_confirm',
            cancelButton: 'edit_cancel',
        },

        confirmButtonText: 'Submit',
    }).then(async (result) => {
        if (result.isConfirmed) {
            const title = result.value.val1;
            const description = result.value.val2;

            const res = await fetch(`/todos/${id}`, {
                method : 'PUT',
                headers : {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({id, title, description, completed: false})
            });
            fetchTodos();
        }
    });
}

async function EditChk(edit){
    const id = edit.target.className;
    const res = await fetch(`/check/${id}`,{
        method : "PUT",
        headers :  {
            'Content-Type': 'application/json'
        },
        body : JSON.stringify({id})
    });
}

async function DelTodo(edit){
    if(confirm("Delete?")){
        const id = edit.target.className;
        const res  = await fetch(`/todos/${id}`,{
            method : "DELETE",
        });
        fetchTodos();
    }
}

add_list.addEventListener("click", AddList);
page_title.addEventListener("click", Reload);

fetchTodos();
