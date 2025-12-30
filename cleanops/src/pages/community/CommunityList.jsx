import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../services/api";
import { useAuth } from "../../context/AuthContext";
import "./CommunityList.css";

export default function CommunityList() {
  const { user } = useAuth(); // ✅ get logged-in user
  const [list, setList] = useState([]);

  useEffect(() => {
    api.get("/community").then((res) => setList(res.data));
  }, []);

  return (
    <div className="community-list-container">
      
      {/* HEADER */}
      <div className="list-header">
        <h2>Community Projects</h2>

        {/* ✅ SHOW FOR ALL LOGGED-IN USERS */}
        {user && (
          <Link to="/community/create" className="create-btn">
            Create Project
          </Link>
        )}
      </div>

      {/* LIST */}
      {list.length === 0 ? (
        <p>No community projects</p>
      ) : (
        <ul className="project-list">
          {list.map((c) => (
            <li key={c._id}>
              <Link to={`/community/${c._id}`}>
                {c.title} – {c.status} – Ward {c.ward}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
