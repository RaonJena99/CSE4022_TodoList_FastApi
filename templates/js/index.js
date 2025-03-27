const add_list = document.querySelector(".add_list_img");
const page_title = document.querySelector(".page_name");

async function Reload() {
    location.reload(true);
}

async function AddList() {
    const main = document.querySelector("main");

    const add = document.querySelector(".add_form");

    if (add){
        console.log("YES");
        add.remove();
    }
    else {
        console.log("NO");

        const add_form = document.createElement('form');
        add_form.className = "add_form";

        const add_input = document.createElement('div');
        add_input.className = "add_input";

        const add_title = document.createElement('input');
        add_title.className = "add_title";
        add_title.placeholder = "title";

        const add_descript = document.createElement('textarea');
        add_descript.className = "add_descript";
        add_descript.placeholder = "description";

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

add_list.addEventListener("click", AddList);
page_title.addEventListener("click", Reload);









//   async function AditChk(edit){
//     const id = edit.target.className;
//     const res = await fetch(`/check/${id}`,{
//       method : "PUT",
//       headers :  {
//         'Content-Type': 'application/json'
//       },
//       body : JSON.stringify({id})
//     });
//   }

//   async function AditTodo(edit){
//     const id = edit.target.className;

//     Swal.fire({
//       title: 'Adit',
//       html:
//         '<input id="swal-input1" class="swal2-input" placeholder="Title" required>' +
//         '<input id="swal-input2" class="swal2-input" placeholder="Description" required>',
//       focusConfirm: false,
//       showCancelButton: true,

//       preConfirm: () => {
//         const val1 = document.getElementById('swal-input1').value.trim();
//         const val2 = document.getElementById('swal-input2').value.trim();
        
//         if (!val1 || !val2) {
//           Swal.showValidationMessage('Enter all values');
//           return false;
//         }
        
//         return { val1, val2 };
//       },
//       customClass: {
//         popup: 'adit_popup',
//         title: 'adit_title',
//         confirmButton: 'adit_confirm',
//         cancelButton: 'adit_cancel',
//       },
//       confirmButtonText: 'Submit',
//     }).then(async (result) => {
//       if (result.isConfirmed) {
//         const title = result.value.val1;
//         const description = result.value.val2;

//         const res = await fetch(`/todos/${id}`, {
//           method : 'PUT',
//           headers : {
//             'Content-Type': 'application/json'
//           },
//           body : JSON.stringify({id, title, description,completed: false})
//         });
//         fetchTodos();
//       }
//     });
//   }

//   async function DelTodo(edit){
//     if(confirm("Delete?")){
//       const id = edit.target.className;
//       const res  = await fetch(`/todos/${id}`,{
//         method : "DELETE",
//       });
//       fetchTodos();
//     }
//   }

//   async function fetchTodos(){
//     const response = await fetch('/todos');
//     const todos = await response.json();

//     todos.sort((a, b) => b.id - a.id);

//     const todo_list = document.getElementById('list');
//     todo_list.innerHTML = '';
//     todos.forEach(todo => {
//       const todo_box = document.createElement('div');
//       todo_box.className = 'todo_box';

//       const li = document.createElement('li');
//       li.className = "detail_box";
//       li.textContent = `${todo.title}: ${todo.description}`;

//       const date = new Date(todo.id); 
//       const date_box = document.createElement('div');
//       date_box.className = 'date_box';
//       date_box.textContent = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;

//       const completed_box = document.createElement('div');
//       completed_box.className = "completed_box";

//       const completed_text = document.createElement('div');
//       completed_text.className = 'completed_text';
//       completed_text.innerText = "Completed";

//       const completed_chk = document.createElement('input');
//       completed_chk.className = todo.id;
//       completed_chk.id = "completed_chk";
//       completed_chk.type = "checkbox";
//       completed_chk.addEventListener("click", AditChk);
//       if(todo.completed == false){
//         completed_chk.checked = false;
//       }
//       else {
//         completed_chk.checked = true;
//       }

//       const adit_butt = document.createElement('button');
//       adit_butt.className =todo.id;
//       adit_butt.id = "adit_butt";
//       adit_butt.innerText = "Edit";
//       adit_butt.addEventListener("click", AditTodo);

//       const del_butt = document.createElement('button');
//       del_butt.className = todo.id;
//       del_butt.id = "del_butt";
//       del_butt.innerText = "Delete";
//       del_butt.addEventListener("click", DelTodo);

//       completed_box.appendChild(completed_text);
//       completed_box.appendChild(completed_chk);
//       todo_box.appendChild(li);
//       todo_box.appendChild(date_box);
//       todo_box.appendChild(completed_box);
//       todo_box.appendChild(adit_butt);
//       todo_box.appendChild(del_butt);
//       todo_list.appendChild(todo_box);
//     });
//   }

//   document.getElementById('todo_form').addEventListener('submit', async(event) => {
//     event.preventDefault();
//     const title = document.getElementById('title').value;
//     const descript = document.getElementById('descript').value;
//     const response = await fetch('/todos', {
//       method : 'POST',
//       headers : {
//         'Content-Type': 'application/json'
//       },
//       body : JSON.stringify({ id: Date.now(), title, description:descript, completed: false })
//     });
//     if (response.ok) {
//       fetchTodos();
//     }
//   });

//   fetchTodos();
// </script> -->