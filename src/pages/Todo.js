import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Todo = () => {
    const navigate = useNavigate();
    const [todos, setTodos] = useState([]);
    const [newTodo, setNewTodo] = useState('');
    const [error, setError] = useState(null);
    const [editingTodoId, setEditingTodoId] = useState(null);
    const [editingTodoText, setEditingTodoText] = useState('');

    useEffect(() => {
        const jwt = localStorage.getItem('jwt');
        console.log('jwt??', jwt);

        if (!jwt) {
            // 토큰이 없는 경우 /signin 페이지로 리다이렉트합니다.
            navigate('/signin');
        } else {
            // 토큰이 있는 경우 /todo 페이지로 리다이렉트합니다.
            navigate('/todo');
        }
    }, [navigate]);

    const handleAddTodo = async () => {
        if (newTodo.trim() !== '') {
            try {
                const token = localStorage.getItem('jwt');
                console.log('token?>', token);
                const response = await fetch('http://localhost:8000/todos', {
                    method: 'POST',
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ todo: newTodo }),
                });

                if (response.ok) {
                    const todo = await response.json();
                    setTodos([...todos, todo]);
                    setNewTodo('');
                } else {
                    setError('TODO 추가에 실패했습니다.');
                }
            } catch (error) {
                setError('서버에 연결할 수 없습니다.');
            }
        }
    };

    const handleDeleteTodo = async (id) => {
        try {
            const token = localStorage.getItem('jwt');
            const response = await fetch(`http://localhost:8000/todos/${id}`, {
                method: 'DELETE',
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.ok) {
                setTodos(todos.filter((todo) => todo.id !== id));
            } else {
                setError('TODO 삭제에 실패했습니다.');
            }
        } catch (error) {
            setError('서버에 연결할 수 없습니다.');
        }
    };

    const handleEditTodo = (id, text) => {
        setEditingTodoId(id);
        setEditingTodoText(text);
    };

    const handleCancelEdit = () => {
        setEditingTodoId(null);
        setEditingTodoText('');
    };

    const handleUpdateTodo = async (id) => {
        try {
            const token = localStorage.getItem('jwt');
            const response = await fetch(`http://localhost:8000/todos/${id}`, {
                method: 'PUT',
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    todo: editingTodoText,
                    isCompleted: false,
                }),
            });

            if (response.ok) {
                const updatedTodo = await response.json();
                const updatedTodos = todos.map((todo) => {
                    if (todo.id === updatedTodo.id) {
                        return updatedTodo;
                    } else {
                        return todo;
                    }
                });
                setTodos(updatedTodos);
                setEditingTodoId(null);
                setEditingTodoText('');
            } else {
                setError('TODO 수정에 실패했습니다.');
            }
        } catch (error) {
            setError('서버에 연결할 수 없습니다.');
        }
    };

    return (
        <div>
            <input
                type="text"
                value={newTodo}
                onChange={(e) => setNewTodo(e.target.value)}
                data-testid="new-todo-input"
            />
            <button onClick={handleAddTodo} data-testid="new-todo-add-button">
                추가
            </button>

            {error && <p>{error}</p>}

            <ul>
                {todos.map((todo) => (
                    <li key={todo.id}>
                        {editingTodoId === todo.id ? (
                            <div>
                                <input
                                    type="text"
                                    value={editingTodoText}
                                    onChange={(e) => setEditingTodoText(e.target.value)}
                                    data-testid="modify-input"
                                />
                                <button
                                    data-testid="submit-button"
                                    onClick={() => handleUpdateTodo(todo.id)}
                                >
                                    제출
                                </button>
                                <button data-testid="cancel-button" onClick={handleCancelEdit}>
                                    취소
                                </button>
                            </div>
                        ) : (
                            <div>
                                <label>
                                    <input type="checkbox" />
                                    <span>{todo.todo}</span>
                                    <button
                                        data-testid="modify-button"
                                        onClick={() => handleEditTodo(todo.id, todo.todo)}
                                    >
                                        수정
                                    </button>
                                    <button
                                        data-testid="delete-button"
                                        onClick={() => handleDeleteTodo(todo.id)}
                                    >
                                        삭제
                                    </button>
                                </label>
                            </div>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Todo;
