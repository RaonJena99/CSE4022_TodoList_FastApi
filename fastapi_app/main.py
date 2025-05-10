from prometheus_fastapi_instrumentator import Instrumentator
from fastapi import FastAPI,HTTPException
from fastapi.responses import HTMLResponse
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel
import json
import os

app = FastAPI()

# Prometheus 메트릭스 엔드포인트 (/metrics)
Instrumentator().instrument(app).expose(app, endpoint="/metrics")

class ToDoItem(BaseModel):
    id : int
    title : str
    description : str
    completed : bool
    
TODOFile = "todo.json"

def load_todos():
    if not os.path.exists(TODOFile):
        return []
    try:
        with open(TODOFile, "r") as file:
            return json.load(file)
    except json.JSONDecodeError:
        return []

def save_todos(todos):
    with open(TODOFile,"w") as file :
        json.dump(todos,file, indent=4)
        
@app.get("/todos", response_model=list[ToDoItem])
def get_todos():
    return load_todos()

@app.post("/todos", response_model=ToDoItem)
def create_todo(todo: ToDoItem):
    todos = load_todos()
    todos.append(todo.model_dump())
    save_todos(todos)
    return todo

@app.put("/todos/{todo_id}", response_model=ToDoItem)
def update_todo(todo_id : int, updated_todo : ToDoItem):
    todos = load_todos()
    for todo in todos:
        if todo["id"] == todo_id:
            todo["title"] = updated_todo.title
            todo["description"] = updated_todo.description
            save_todos(todos)
            return updated_todo
    raise HTTPException(status_code=404, detail="TO-DO item not found")

@app.delete("/todos/{todo_id}",response_model=dict)
def delete_todo(todo_id : int):
    todos = load_todos()
    todos = [todo for todo in todos if todo["id"] != todo_id]
    save_todos(todos)
    return {"message": "To-Do item deleted"}

@app.put("/check/{todo_id}", response_model=list[ToDoItem])
def check_todo(todo_id : int):
    todos = load_todos()
    for todo in todos:
        if todo["id"] == todo_id:
            if todo["completed"] == False:
                todo["completed"] = True
            else: todo["completed"] = False
    save_todos(todos)
    return todos
    
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
TEMPLATES_DIR = os.path.join(BASE_DIR, "templates")
TEMPLATE_PATH = os.path.join(BASE_DIR, "templates", "index.html")

@app.get("/", response_class=HTMLResponse)
def read_root():
    with open(TEMPLATE_PATH, "r") as file:
        content = file.read()
    return HTMLResponse(content=content)

STATIC_DIR = os.path.join(BASE_DIR, "static")
if os.path.exists(STATIC_DIR):
    app.mount("/static", StaticFiles(directory=STATIC_DIR), name="static")