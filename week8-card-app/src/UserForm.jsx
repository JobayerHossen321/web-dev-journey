import { useState } from 'react';

function UserForm({ onAddUser }) {
  const [formData, setFormData] = useState({
    name: '',
    email: ''
  });
  
  // 1. Separate state for tracking whether the email field has been left/touched
  const [emailTouched, setEmailTouched] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  // 2. Event handler for when focus leaves the input
  const handleBlur = () => {
    setEmailTouched(true);
  };

  const isNameEmpty = formData.name.trim() === '';
  const emailRegex = /^\S+@\S+\.\S+$/;
  const isEmailValid = emailRegex.test(formData.email);
  
  // 3. Three-part condition for showing the error
  const showEmailError = emailTouched && formData.email.length > 0 && !isEmailValid;
  const isFormValid = !isNameEmpty && isEmailValid;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isFormValid) return;

    onAddUser({
      id: Date.now(),
      name: formData.name.trim(),
      email: formData.email.trim(),
      role: 'Contributor'
    });

    // 4. Reset form data AND reset touched state back to false
    setFormData({ name: '', email: '' });
    setEmailTouched(false);
  };

  return (
    <form onSubmit={handleSubmit} noValidate className="user-form">
      <h2>Add New User</h2>
      
      <div className="field-group" style={{ marginBottom: "10px" }}>
        <label htmlFor="name" style={{ display: "block", marginBottom: "4px" }}>Name:</label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Enter name..."
        />
      </div>

      <div className="field-group" style={{ marginBottom: "10px" }}>
        <label htmlFor="email" style={{ display: "block", marginBottom: "4px" }}>Email:</label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder="Enter email..."
        />
        {showEmailError && <p className="error-text" style={{ color: "red", fontSize: "0.85rem" }}>Please enter a valid email address.</p>}
      </div>

      <button type="submit" disabled={!isFormValid}>
        Add User
      </button>
    </form>
  );
}

export default UserForm;