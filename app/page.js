'use client';
import { signIn, useSession } from 'next-auth/react';
import { useState } from 'react';

export default function AuthPage() {
  const { data: session, status } = useSession(); 
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [isSignUp, setIsSignUp] = useState(false); 

  const [items, setItems] = useState([]); 
  const [newItem, setNewItem] = useState(''); 
  const [isEditing, setIsEditing] = useState(null); 
  const [editedItem, setEditedItem] = useState(''); 

  const handleAuth = async (e) => {
    e.preventDefault();
    setError(null);

    const res = await signIn('credentials', {
      redirect: false,
      email,
      password,
    });

    if (res?.error) {
      setError(res.error);
    }
  };

  // CRUD Operations
  const handleAddItem = () => {
    if (!newItem.trim()) return;
    setItems([...items, newItem]);
    setNewItem('');
  };

  const handleDeleteItem = (index) => {
    const updatedItems = items.filter((_, i) => i !== index);
    setItems(updatedItems);
  };

  const handleEditItem = (index) => {
    setIsEditing(index);
    setEditedItem(items[index]);
  };

  const handleSaveEdit = (index) => {
    const updatedItems = [...items];
    updatedItems[index] = editedItem;
    setItems(updatedItems);
    setIsEditing(null);
  };

  if (status === 'loading') {
    return <p>Loading...</p>;
  }

  return (
    <div style={styles.pageWrapper}>
      <div style={styles.formWrapper}>
        {!session ? (
          <>
            <h1 style={styles.title}>{isSignUp ? 'Sign Up' : 'Sign In'}</h1>

            <form onSubmit={handleAuth} style={styles.form}>
              <div style={styles.inputGroup}>
                <label>Email:</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  style={styles.input}
                />
              </div>
              <div style={styles.inputGroup}>
                <label>Password:</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  style={styles.input}
                />
              </div>
              {error && <p style={styles.error}>{error}</p>}
              <button type="submit" style={styles.button}>
                {isSignUp ? 'Sign Up' : 'Sign In'}
              </button>
            </form>

            <p style={styles.toggleText}>
              {isSignUp ? 'Already have an account?' : "Don't have an account?"}
              <button
                onClick={() => setIsSignUp(!isSignUp)}
                style={styles.toggleButton}
              >
                {isSignUp ? 'Sign In' : 'Sign Up'}
              </button>
            </p>
          </>
        ) : (
          <>
            <h2 style={styles.title}>Welcome, {session.user.email}!</h2>

            <div style={styles.inputGroup}>
              <h3>Add New Item</h3>
              <input
                type="text"
                value={newItem}
                onChange={(e) => setNewItem(e.target.value)}
                placeholder="Enter new item"
                style={styles.input}
              />
              <button onClick={handleAddItem} style={styles.button}>
                Add Item
              </button>
            </div>

            <h3>Your Items</h3>
            <ul style={styles.itemList}>
              {items.map((item, index) => (
                <li key={index} style={styles.listItem}>
                  {isEditing === index ? (
                    <>
                      <input
                        type="text"
                        value={editedItem}
                        onChange={(e) => setEditedItem(e.target.value)}
                        style={styles.input}
                      />
                      <button
                        onClick={() => handleSaveEdit(index)}
                        style={styles.button}
                      >
                        Save
                      </button>
                    </>
                  ) : (
                    <>
                      <span>{item}</span>
                      <div style={styles.buttonGroup}>
                        <button
                          onClick={() => handleEditItem(index)}
                          style={styles.button}
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteItem(index)}
                          style={styles.deleteButton}
                        >
                          Delete
                        </button>
                      </div>
                    </>
                  )}
                </li>
              ))}
            </ul>
          </>
        )}
      </div>
    </div>
  );
}

const styles = {
  pageWrapper: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '50vh',
  },
  formWrapper: {
    backgroundColor: '#fff',
    padding: '40px',
    borderRadius: '8px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
    width: '100%',
    maxWidth: '400px',
  },
  title: {
    fontSize: '2rem',
    textAlign: 'center',
    marginBottom: '20px',
    color: '#0070f3',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
  },
  inputGroup: {
    marginBottom: '16px',
  },
  input: {
    width: '100%',
    padding: '8px',
    fontSize: '1rem',
    border: '1px solid #ccc',
    borderRadius: '4px',
  },
  button: {
    width: '100%',
    padding: '10px',
    fontSize: '1rem',
    color: '#fff',
    backgroundColor: '#0070f3',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    marginTop: '8px',
  },
  deleteButton: {
    backgroundColor: '#ff4d4d',
    padding: '10px',
    borderRadius: '4px',
    marginLeft: '10px',
  },
  toggleText: {
    textAlign: 'center',
    marginTop: '20px',
  },
  toggleButton: {
    marginLeft: '10px',
    backgroundColor: 'transparent',
    border: 'none',
    color: '#0070f3',
    cursor: 'pointer',
  },
  error: {
    color: 'red',
    marginBottom: '10px',
  },
  itemList: {
    listStyle: 'none',
    padding: 0,
  },
  listItem: {
    marginBottom: '10px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  buttonGroup: {
    display: 'flex',
    alignItems: 'center',
  },
};