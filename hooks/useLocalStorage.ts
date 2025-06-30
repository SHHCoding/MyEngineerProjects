import { useState, useCallback } from 'react';

// This hook allows you to use localStorage with the same API as useState.
// It persists the state to localStorage, so it's not lost on page refresh.
export function useLocalStorage<T>(key: string, initialValue: T): [T, React.Dispatch<React.SetStateAction<T>>] {
  // The `useState` initializer function is only executed on the initial render.
  const [storedValue, setStoredValue] = useState<T>(() => {
    // This code should only run on the client side.
    if (typeof window === "undefined") {
      return initialValue;
    }
    
    try {
      // Get from local storage by key.
      const item = window.localStorage.getItem(key);
      // Parse stored JSON or if none, return initialValue.
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      // If there's an error (e.g., parsing error), return initialValue.
      console.error(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  // Wrap the setter in a useCallback to make it stable.
  // Use the functional update form of useState's setter to avoid stale state.
  const setValue = useCallback<React.Dispatch<React.SetStateAction<T>>>((value) => {
    try {
      setStoredValue(currentStoredValue => {
        // Allow value to be a function so we have the same API as useState.
        const valueToStore = value instanceof Function ? value(currentStoredValue) : value;
        
        // Save to local storage
        if (typeof window !== "undefined") {
          window.localStorage.setItem(key, JSON.stringify(valueToStore));
        }

        return valueToStore;
      });
    } catch (error) {
      // A more advanced implementation could handle the error case.
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  }, [key]);

  return [storedValue, setValue];
}