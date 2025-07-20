'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Todo } from '../types/todo';
import { useAuth } from './AuthContext';

interface TodoContextType {
  todos: Todo[];
  addTodo: (text: string) => void;
  toggleTodo: (id: string) => void;
  deleteTodo: (id: string) => void;
  updateTodo: (id: string, text: string) => void;
}

const TodoContext = createContext<TodoContextType | undefined>(undefined);

export const useTodos = () => {
  const context = useContext(TodoContext);
  if (!context) {
    throw new Error('useTodos must be used within a TodoProvider');
  }
  return context;
};

export const TodoProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const { user } = useAuth();

  // Load todos from localStorage when user changes
  useEffect(() => {
    if (user) {
      const allTodos = JSON.parse(localStorage.getItem('todos') || '[]');
      const userTodos = allTodos.filter((todo: Todo) => todo.userId === user.id);
      setTodos(userTodos);
    } else {
      setTodos([]);
    }
  }, [user]);

  // Save todos to localStorage whenever they change
  const saveTodos = (newTodos: Todo[]) => {
    if (!user) return;
    
    const allTodos = JSON.parse(localStorage.getItem('todos') || '[]');
    const otherUsersTodos = allTodos.filter((todo: Todo) => todo.userId !== user.id);
    const updatedTodos = [...otherUsersTodos, ...newTodos];
    localStorage.setItem('todos', JSON.stringify(updatedTodos));
    setTodos(newTodos);
  };

  const addTodo = (text: string) => {
    if (!user) return;
    
    const newTodo: Todo = {
      id: Date.now().toString(),
      text,
      completed: false,
      userId: user.id,
      createdAt: new Date().toISOString(),
    };
    
    saveTodos([...todos, newTodo]);
  };

  const toggleTodo = (id: string) => {
    const updatedTodos = todos.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    );
    saveTodos(updatedTodos);
  };

  const deleteTodo = (id: string) => {
    const updatedTodos = todos.filter(todo => todo.id !== id);
    saveTodos(updatedTodos);
  };

  const updateTodo = (id: string, text: string) => {
    const updatedTodos = todos.map(todo =>
      todo.id === id ? { ...todo, text } : todo
    );
    saveTodos(updatedTodos);
  };

  return (
    <TodoContext.Provider value={{ todos, addTodo, toggleTodo, deleteTodo, updateTodo }}>
      {children}
    </TodoContext.Provider>
  );
};