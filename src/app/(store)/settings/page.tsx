import React from 'react';

const UserSettings: React.FC = () => {
  return (
    <div>
      <h1>User Settings</h1>
      <h2>Profile Options</h2>
      <form>
        <label htmlFor="username">Username:</label>
        <input type="text" id="username" name="username" />

        <label htmlFor="email">Email:</label>
        <input type="email" id="email" name="email" />

        <button type="submit">Update Profile</button>
      </form>
      <h2>Password Options</h2>
      <form>
        <label htmlFor="current-password">Current Password:</label>
        <input type="password" id="current-password" name="current-password" />

        <label htmlFor="new-password">New Password:</label>
        <input type="password" id="new-password" name="new-password" />

        <button type="submit">Change Password</button>
      </form>
    </div>
  );
};

export default UserSettings;