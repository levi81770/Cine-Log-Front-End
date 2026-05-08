// src/components/Dashboard/Dashboard.jsx

import { useContext, useEffect, useState } from "react";
import { UserContext } from "../../contexts/UserContext";

import { index } from "../../services/userService";

const Dashboard = () => {
  const { user } = useContext(UserContext);
  const [users, setUsers] = useState([]);
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const fetchUsers = await index();
        console.log(fetchUsers);
        setUsers(fetchUsers);
      } catch (err) {
        console.log(err);
      }
    };

    fetchUsers();
  }, []);

  return (
    <main>
      <h1>Welcome, {user.username}</h1>
      <p>
        This is the dashboard page where you can see a list of all the users.
      </p>
      {users?.map((u) => (
        <div key={u._id}>
          <h2>{u.username}</h2>
        </div>
      ))}
    </main>
  );
};

export default Dashboard;
