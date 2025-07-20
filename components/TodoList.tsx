'use client';

import React, { useState } from 'react';
import { useTodos } from '../contexts/TodoContext';
import { Todo } from '../types/todo';

export const TodoList: React.FC = () => {
  const { todos, toggleTodo, deleteTodo, updateTodo } = useTodos();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState('');

  const handleEdit = (todo: Todo) => {
    setEditingId(todo.id);
    setEditText(todo.text);
  };

  const handleSave = (id: string) => {
    if (editText.trim()) {
      updateTodo(id, editText.trim());
      setEditingId(null);
      setEditText('');
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditText('');
  };

  if (todos.length === 0) {
    return (
      <div className="text-center text-gray-500 mt-8">
        No todos yet. Add one above!
      </div>
    );
  }

  return (
    <ul className="space-y-2 mt-6">
      {todos.map((todo) => (
        <li
          key={todo.id}
          className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 flex items-center justify-between"
        >
          {editingId === todo.id ? (
            <div className="flex-1 flex items-center space-x-2">
              <input
                type="text"
                value={editText}
                onChange={(e) => setEditText(e.target.value)}
                className="flex-1 px-3 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                autoFocus
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    handleSave(todo.id);
                  }
                }}
              />
              <button
                onClick={() => handleSave(todo.id)}
                className="text-green-600 hover:text-green-800"
              >
                Save
              </button>
              <button
                onClick={handleCancel}
                className="text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>
            </div>
          ) : (
            <>
              <div className="flex items-center space-x-3 flex-1">
                <input
                  type="checkbox"
                  checked={todo.completed}
                  onChange={() => toggleTodo(todo.id)}
                  className="h-5 w-5 text-blue-600 rounded focus:ring-blue-500"
                />
                <span
                  className={`${
                    todo.completed ? 'line-through text-gray-500' : 'text-gray-800'
                  }`}
                >
                  {todo.text}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handleEdit(todo)}
                  className="text-blue-600 hover:text-blue-800 text-sm"
                >
                  Edit
                </button>
                <button
                  onClick={() => deleteTodo(todo.id)}
                  className="text-red-600 hover:text-red-800 text-sm"
                >
                  Delete
                </button>
              </div>
            </>
          )}
        </li>
      ))}
    </ul>
  );
};