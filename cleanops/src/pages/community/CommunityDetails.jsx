import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../services/api";
import "./CommunityDetails.css";

export default function CommunityDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [data, setData] = useState(null);
  const [note, setNote] = useState("");
  const [joined, setJoined] = useState(false);

  const isLoggedIn = !!localStorage.getItem("token");

  useEffect(() => {
    fetchCommunity();
  }, [id]);

  const fetchCommunity = async () => {
    try {
      const res = await api.get(`/community/${id}`);
      setData(res.data);
      setJoined(res.data.isJoined || false);
    } catch {
      console.error("Failed to load community");
    }
  };

  const handleJoin = async () => {
    await api.post(`/community/${id}/join`);
    setJoined(true);
    fetchCommunity();
  };

  const handleLeave = async () => {
    await api.post(`/community/${id}/leave`);
    setJoined(false);
    setNote("");
    fetchCommunity();
  };

  const handleAddNote = async () => {
    if (!note.trim()) return;
    await api.post(`/community/${id}/notes`, { text: note });
    setNote("");
    fetchCommunity();
  };

  if (!data) return <p style={{ textAlign: "center" }}>Loading...</p>;

  return (
    <div className="community-details">

      {/* 🔙 BACK BUTTON */}
      <button className="back-btn" onClick={() => navigate("/community")}>
        ← Back to Projects
      </button>

      <h2 className="title">{data.title}</h2>

      <div className="badges">
        <span className="badge">Status: {data.status}</span>
        <span className="badge">Ward: {data.ward}</span>
      </div>

      <div className="project-description">
        <p>{data.description}</p>
      </div>

      {isLoggedIn &&
        (!joined ? (
          <button className="join-btn" onClick={handleJoin}>
            Join
          </button>
        ) : (
          <button className="join-btn" onClick={handleLeave}>
            Leave
          </button>
        ))}

      <h3 className="notes-title">Notes</h3>

      {data.notes?.length ? (
        <ul className="notes-list">
          {data.notes.map((n, i) => (
            <li key={i}>• {n.text}</li>
          ))}
        </ul>
      ) : (
        <p className="empty">No notes yet</p>
      )}

      {isLoggedIn && joined && (
        <>
          <textarea
            className="note-textarea"
            placeholder="Write a note..."
            value={note}
            onChange={(e) => setNote(e.target.value)}
          />
          <button className="add-note-btn" onClick={handleAddNote}>
            Add Note
          </button>
        </>
      )}
    </div>
  );
}