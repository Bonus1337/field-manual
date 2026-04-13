import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import SecurityGuidebook from "./SecurityGuidebook";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/pl/doc/manifesto" replace />} />
      <Route path="/:lang/doc/:id" element={<SecurityGuidebook />} />
      <Route path="*" element={<Navigate to="/pl/doc/manifesto" replace />} />
    </Routes>
  );
}
