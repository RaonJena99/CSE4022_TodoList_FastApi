import sys
import os
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

import pytest
from fastapi.testclient import TestClient
from main import app, save_todos, load_todos, ToDoItem

client = TestClient(app)

@pytest.fixture(autouse=True)
def setup_and_teardown():
    save_todos([])  # 테스트 전 초기화
    yield
    save_todos([])  # 테스트 후 정리

def test_get_todos_empty():
    response = client.get("/todos")
    assert response.status_code == 200
    assert response.json() == []

def test_get_todos_with_items():
    todo = ToDoItem(id=1, title="Test", description="Test description", completed=False)
    save_todos([todo.model_dump()])
    response = client.get("/todos")
    assert response.status_code == 200
    data = response.json()
    assert len(data) == 1
    assert data[0]["title"] == "Test"

def test_create_todo():
    todo = {
        "id": 1,
        "title": "Test",
        "description": "Test description",
        "completed": False
    }
    response = client.post("/todos", json=todo)
    assert response.status_code == 200
    data = response.json()
    assert data["title"] == "Test"

def test_create_todo_invalid():
    todo = {
        "id": 2,
        "title": "Missing fields"
        # description, completed 필드 누락
    }
    response = client.post("/todos", json=todo)
    assert response.status_code == 422  # Unprocessable Entity

def test_update_todo():
    original = ToDoItem(id=1, title="Old", description="Old description", completed=False)
    save_todos([original.model_dump()])
    updated = {
        "id": 1,
        "title": "Updated",
        "description": "Updated description",
        "completed": True
    }
    response = client.put("/todos/1", json=updated)
    assert response.status_code == 200
    data = response.json()
    assert data["title"] == "Updated"

def test_update_todo_not_found():
    updated = {
        "id": 999,
        "title": "Updated",
        "description": "Updated description",
        "completed": True
    }
    response = client.put("/todos/999", json=updated)
    assert response.status_code == 404

def test_delete_todo():
    todo = ToDoItem(id=1, title="To Delete", description="bye", completed=False)
    save_todos([todo.model_dump()])
    response = client.delete("/todos/1")
    assert response.status_code == 200
    assert response.json()["message"] == "To-Do item deleted"

def test_check_todo():
    todo = {"id": 99, "title": "test", "description": "testing", "completed": False}
    client.post("/todos", json=todo)
    response = client.put("/check/99")
    assert response.status_code == 200
    assert response.json()[0]["completed"] is True

def test_root_page():
    response = client.get("/")
    assert response.status_code == 200
    assert "text/html" in response.headers["content-type"]

def test_delete_todo_not_found():
    response = client.delete("/todos/999")
    assert response.status_code == 200
    assert response.json()["message"] == "To-Do item deleted"
