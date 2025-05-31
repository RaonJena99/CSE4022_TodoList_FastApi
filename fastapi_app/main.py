from prometheus_fastapi_instrumentator import Instrumentator
from fastapi import FastAPI,HTTPException,Body,Request
from fastapi.responses import HTMLResponse
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel
from typing import List
import json
import os
from os import getenv
import logging
import time
from multiprocessing import Queue
from logging_loki import LokiQueueHandler

app = FastAPI()

# Prometheus 메트릭스 엔드포인트 (/metrics)
Instrumentator().instrument(app).expose(app, endpoint="/metrics")

loki_logs_handler = LokiQueueHandler(
    Queue(-1),
    url=getenv("LOKI_ENDPOINT"),
    tags={"application": "fastapi"},
    version="1",
)

# Custom access logger (ignore Uvicorn's default logging)
custom_logger = logging.getLogger("custom.access")
custom_logger.setLevel(logging.INFO)

# Add Loki handler (assuming `loki_logs_handler` is correctly configured)
custom_logger.addHandler(loki_logs_handler)

LOG_PATH = "/app/logs/fastapi.log"
os.makedirs(os.path.dirname(LOG_PATH), exist_ok=True)  # 디렉토리 자동 생성

file_handler = logging.FileHandler(LOG_PATH)
custom_logger.addHandler(file_handler)

async def log_requests(request: Request, call_next):
    start_time = time.time()
    response = await call_next(request)
    duration = time.time() - start_time  # Compute response time

    log_message = (
        f'{request.client.host} - "{request.method} {request.url.path} HTTP/1.1" {response.status_code} {duration:.3f}s'
    )

    # **Only log if duration exists**
    if duration:
        custom_logger.info(log_message)

    return response

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
        
@app.get("/", response_class=HTMLResponse)
def read_root():
    with open(TEMPLATE_PATH, "r") as file:
        content = file.read()
    return HTMLResponse(content=content)

@app.get("/todos", response_model=list[ToDoItem])
def get_todos():
    return load_todos()

@app.post("/todos", response_model=ToDoItem)
def create_todo(todo: ToDoItem):
    todos = load_todos()
    todos.append(todo.model_dump())
    save_todos(todos)
    return todo

@app.put("/todos/reorder", response_model=List[ToDoItem]) 
def update_todo_order(new_order: List[int] = Body(...)):
    todos = load_todos()
    todo_dict = {todo["id"]: todo for todo in todos}
    
    reordered_todos = []
    for todo_id in new_order:
        if todo_id in todo_dict:
            reordered_todos.append(todo_dict[todo_id])

    remaining = [todo for todo in todos if todo["id"] not in new_order]
    reordered_todos.extend(remaining)

    save_todos(reordered_todos)
    return reordered_todos

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


STATIC_DIR = os.path.join(BASE_DIR, "static")
if os.path.exists(STATIC_DIR):
    app.mount("/static", StaticFiles(directory=STATIC_DIR), name="static")