'use client';

import { useAuth } from '../contexts/AuthContext';
import { AuthForm } from '../components/AuthForm';
import { AddTodo } from '../components/AddTodo';
import { TodoList } from '../components/TodoList';

export default function Home() {
  const { user, logout, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto p-4">
        <header className="text-center py-8">
          <h1 className="text-4xl font-bold text-gray-800">Simple Todo App</h1>
          {user && (
            <div className="mt-4">
              <p className="text-gray-600">Welcome, {user.email}!</p>
              <button
                onClick={logout}
                className="mt-2 text-red-500 hover:underline"
              >
                Logout
              </button>
            </div>
          )}
        </header>

        <main>
          {!user ? (
            <AuthForm />
          ) : (
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-semibold mb-6">My Todos</h2>
              <AddTodo />
              <TodoList />
            </div>
          )}
        </main>
      </div>
    </div>
  );
}