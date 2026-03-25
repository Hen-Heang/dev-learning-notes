"use client";

import { useState, useEffect, useMemo, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';
import {
  getLists, getTodos,
  createList, deleteList,
  createTodo, updateTodo, deleteTodo,
} from '@/lib/supabase/todos';
import type {
  Todo, TodoList, TodoListWithCount,
  ActiveList, SmartListType,
} from '@/types/todos';

const todayStr = () => new Date().toISOString().split('T')[0];

export function useTodos(userId: string) {
  const [supabase] = useState(() => createClient());
  const [lists, setLists] = useState<TodoList[]>([]);
  const [todos, setTodos] = useState<Todo[]>([]);
  const [activeList, setActiveList] = useState<ActiveList>({ type: 'smart', id: 'all' });
  const [selectedTodo, setSelectedTodo] = useState<Todo | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // ── Initial load ──────────────────────────────────────────────────────────
  useEffect(() => {
    async function load() {
      try {
        const [listsData, todosData] = await Promise.all([
          getLists(supabase),
          getTodos(supabase),
        ]);
        setLists(listsData);
        setTodos(todosData);
      } catch (err) {
        const msg = err instanceof Error ? err.message : String(err);
        console.error('[useTodos] load failed:', msg);
        setError(msg);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [supabase]);

  // ── Real-time subscriptions ───────────────────────────────────────────────
  useEffect(() => {
    const channel = supabase
      .channel('todos-realtime')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'todos' },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            const row = payload.new as Todo;
            setTodos(prev => (prev.some(t => t.id === row.id) ? prev : [...prev, row]));
          } else if (payload.eventType === 'UPDATE') {
            const row = payload.new as Todo;
            setTodos(prev => prev.map(t => t.id === row.id ? row : t));
            setSelectedTodo(prev => (prev?.id === row.id ? row : prev));
          } else if (payload.eventType === 'DELETE') {
            const id = payload.old.id as string;
            setTodos(prev => prev.filter(t => t.id !== id));
            setSelectedTodo(prev => (prev?.id === id ? null : prev));
          }
        }
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'lists' },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            const row = payload.new as TodoList;
            setLists(prev => (prev.some(l => l.id === row.id) ? prev : [...prev, row]));
          } else if (payload.eventType === 'UPDATE') {
            const row = payload.new as TodoList;
            setLists(prev => prev.map(l => l.id === row.id ? row : l));
          } else if (payload.eventType === 'DELETE') {
            const id = payload.old.id as string;
            setLists(prev => prev.filter(l => l.id !== id));
          }
        }
      )
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [supabase]);

  // ── Derived state ─────────────────────────────────────────────────────────
  const listsWithCount = useMemo<TodoListWithCount[]>(
    () =>
      lists.map(list => {
        const listTodos = todos.filter(t => t.list_id === list.id);
        return {
          ...list,
          todo_count: listTodos.filter(t => !t.is_completed).length,
          completed_count: listTodos.filter(t => t.is_completed).length,
        };
      }),
    [lists, todos]
  );

  const smartCounts = useMemo(() => {
    const today = todayStr();
    return {
      today:     todos.filter(t => !t.is_completed && t.due_date === today).length,
      scheduled: todos.filter(t => !t.is_completed && t.due_date !== null).length,
      all:       todos.filter(t => !t.is_completed).length,
      completed: todos.filter(t => t.is_completed).length,
    };
  }, [todos]);

  const activeTodos = useMemo<Todo[]>(() => {
    const today = todayStr();
    let filtered = todos;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      filtered = todos.filter(t => 
        t.title.toLowerCase().includes(q) || 
        (t.notes && t.notes.toLowerCase().includes(q))
      );
      return filtered.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    }

    if (activeList.type === 'smart') {
      switch (activeList.id as SmartListType) {
        case 'today':     filtered = todos.filter(t => !t.is_completed && t.due_date === today); break;
        case 'scheduled': filtered = todos.filter(t => !t.is_completed && t.due_date !== null); break;
        case 'all':       filtered = todos.filter(t => !t.is_completed); break;
        case 'completed': filtered = todos.filter(t => t.is_completed); break;
      }
    } else {
      filtered = todos.filter(t => t.list_id === activeList.id && !t.is_completed);
    }

    return filtered.sort((a, b) => a.position - b.position);
  }, [todos, activeList, searchQuery]);

  const activeListColor = useMemo(() => {
    if (activeList.type === 'list') {
      return lists.find(l => l.id === activeList.id)?.color ?? '#007AFF';
    }
    const colors: Record<SmartListType, string> = {
      today: '#007AFF', scheduled: '#FF9500', all: '#8E8E93', completed: '#34C759',
    };
    return colors[activeList.id as SmartListType];
  }, [lists, activeList]);

  // ── Todo CRUD ─────────────────────────────────────────────────────────────
  const addTodo = useCallback(async (title: string) => {
    const resolvedListId = activeList.type === 'list' ? activeList.id : null;
    const tempId = `temp-${Date.now()}`;
    const optimistic: Todo = {
      id: tempId, user_id: userId, list_id: resolvedListId,
      title, notes: null, due_date: null, due_time: null,
      priority: 'none', is_completed: false, completed_at: null, notify: false,
      position: todos.length, created_at: new Date().toISOString(),
    };
    setTodos(prev => [...prev, optimistic]);
    try {
      const created = await createTodo(supabase, {
        user_id: userId, list_id: resolvedListId, title, position: todos.length,
      });
      setTodos(prev => prev.map(t => t.id === tempId ? created : t));
    } catch (err) {
      console.error('[useTodos] addTodo failed:', err);
      setTodos(prev => prev.filter(t => t.id !== tempId));
      setError(err instanceof Error ? err.message : 'Failed to add todo');
    }
  }, [supabase, userId, todos.length, activeList]);

  const toggleTodo = useCallback(async (id: string) => {
    const todo = todos.find(t => t.id === id);
    if (!todo) return;
    const now = new Date().toISOString();
    const patch = todo.is_completed
      ? { is_completed: false as const, completed_at: null }
      : { is_completed: true as const, completed_at: now };
    setTodos(prev => prev.map(t => t.id === id ? { ...t, ...patch } : t));
    setSelectedTodo(prev => (prev?.id === id ? { ...prev, ...patch } : prev));
    try {
      await updateTodo(supabase, id, patch);
    } catch (err) {
      console.error('[useTodos] toggleTodo failed:', err);
      setTodos(prev => prev.map(t => t.id === id ? todo : t));
      setSelectedTodo(prev => (prev?.id === id ? todo : prev));
      setError(err instanceof Error ? err.message : 'Failed to update todo');
    }
  }, [supabase, todos]);

  const saveTodo = useCallback(async (id: string, patch: Partial<Todo>) => {
    const original = todos.find(t => t.id === id);
    if (!original) return;
    setTodos(prev => prev.map(t => t.id === id ? { ...t, ...patch } : t));
    setSelectedTodo(prev => (prev?.id === id ? { ...prev, ...patch } : prev));
    try {
      const updated = await updateTodo(supabase, id, patch as Parameters<typeof updateTodo>[2]);
      setTodos(prev => prev.map(t => t.id === id ? updated : t));
      setSelectedTodo(prev => (prev?.id === id ? updated : prev));
    } catch (err) {
      console.error('[useTodos] saveTodo failed:', err);
      setTodos(prev => prev.map(t => t.id === id ? original : t));
      setSelectedTodo(prev => (prev?.id === id ? original : prev));
      setError(err instanceof Error ? err.message : 'Failed to save todo');
    }
  }, [supabase, todos]);

  const removeTodo = useCallback(async (id: string) => {
    const original = todos.find(t => t.id === id);
    setTodos(prev => prev.filter(t => t.id !== id));
    setSelectedTodo(prev => (prev?.id === id ? null : prev));
    try {
      await deleteTodo(supabase, id);
    } catch (err) {
      console.error('[useTodos] removeTodo failed:', err);
      if (original) setTodos(prev => [...prev, original]);
      setError(err instanceof Error ? err.message : 'Failed to delete todo');
    }
  }, [supabase, todos]);

  const clearCompleted = useCallback(async () => {
    const completedIds = todos.filter(t => t.is_completed).map(t => t.id);
    if (completedIds.length === 0) return;

    const originalTodos = [...todos];
    setTodos(prev => prev.filter(t => !t.is_completed));
    
    try {
      await Promise.all(completedIds.map(id => deleteTodo(supabase, id)));
    } catch (err) {
      console.error('[useTodos] clearCompleted failed:', err);
      setTodos(originalTodos);
      setError('Failed to clear completed tasks');
    }
  }, [supabase, todos]);

  const reorderActiveTodos = useCallback(async (reordered: Todo[]) => {
    setTodos(prev => {
      const reorderedMap = new Map(reordered.map((t, i) => [t.id, { ...t, position: i }]));
      return prev.map(t => reorderedMap.get(t.id) ?? t);
    });
    try {
      await Promise.all(
        reordered.map((t, i) => updateTodo(supabase, t.id, { position: i }))
      );
    } catch (err) {
      console.error('[useTodos] reorder failed:', err);
    }
  }, [supabase]);

  // ── List CRUD ─────────────────────────────────────────────────────────────
  const addList = useCallback(async (name: string, color: string, icon: string) => {
    const tempId = `temp-list-${Date.now()}`;
    const optimistic: TodoList = {
      id: tempId, user_id: userId, name, color, icon,
      position: lists.length, created_at: new Date().toISOString(),
    };
    setLists(prev => [...prev, optimistic]);
    try {
      const created = await createList(supabase, {
        user_id: userId, name, color, icon, position: lists.length,
      });
      setLists(prev => prev.map(l => l.id === tempId ? created : l));
    } catch (err) {
      console.error('[useTodos] addList failed:', err);
      setLists(prev => prev.filter(l => l.id !== tempId));
      setError(err instanceof Error ? err.message : 'Failed to add list');
    }
  }, [supabase, userId, lists.length]);

  const removeList = useCallback(async (id: string) => {
    setLists(prev => prev.filter(l => l.id !== id));
    setTodos(prev => prev.map(t => t.list_id === id ? { ...t, list_id: null } : t));
    if (activeList.type === 'list' && activeList.id === id) {
      setActiveList({ type: 'smart', id: 'all' });
    }
    try {
      await deleteList(supabase, id);
    } catch (err) {
      console.error('[useTodos] removeList failed:', err);
      setError(err instanceof Error ? err.message : 'Failed to delete list');
    }
  }, [supabase, activeList]);

  return {
    loading,
    error,
    clearError: () => setError(null),
    lists: listsWithCount,
    todos: activeTodos,
    smartCounts,
    activeList,
    setActiveList,
    activeListColor,
    selectedTodo,
    setSelectedTodo,
    addTodo,
    toggleTodo,
    saveTodo,
    removeTodo,
    clearCompleted,
    reorderActiveTodos,
    addList,
    removeList,
    searchQuery,
    setSearchQuery,
  };
}
