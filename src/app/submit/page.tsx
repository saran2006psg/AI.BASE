"use client";

import React, { useState } from "react";
import Link from "next/link";
import { CategoryBadge, DifficultyBadge } from "@/components/ui/Badges";

export default function SubmitPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  
  // Multi-step Form State
  const [currentStep, setCurrentStep] = useState(1);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Marketing");
  const [difficulty, setDifficulty] = useState("Beginner");
  const [summary, setSummary] = useState("");
  const [problem, setProblem] = useState("");
  const [tools, setTools] = useState<string[]>([]);
  const [toolInput, setToolInput] = useState("");
  
  const [steps, setSteps] = useState([{ title: "", content: "" }]);
  const [prompts, setPrompts] = useState([{ label: "", code: "" }]);
  const [mistakes, setMistakes] = useState([""]);
  
  const [submitted, setSubmitted] = useState(false);

  // Auth simulation
  const handleLogin = () => {
    setIsLoggingIn(true);
    setTimeout(() => {
      setIsLoggingIn(false);
      setIsLoggedIn(true);
    }, 1200);
  };

  // Tools management
  const handleAddTool = (e: React.FormEvent) => {
    e.preventDefault();
    if (toolInput.trim() && !tools.includes(toolInput.trim())) {
      setTools([...tools, toolInput.trim()]);
      setToolInput("");
    }
  };

  const handleRemoveTool = (indexToRemove: number) => {
    setTools(tools.filter((_, i) => i !== indexToRemove));
  };

  // Steps management
  const handleAddStep = () => {
    setSteps([...steps, { title: "", content: "" }]);
  };

  const handleStepChange = (index: number, field: "title" | "content", value: string) => {
    const updated = [...steps];
    updated[index][field] = value;
    setSteps(updated);
  };

  const handleRemoveStep = (index: number) => {
    if (steps.length > 1) {
      setSteps(steps.filter((_, i) => i !== index));
    }
  };

  // Prompts management
  const handleAddPrompt = () => {
    setPrompts([...prompts, { label: "", code: "" }]);
  };

  const handlePromptChange = (index: number, field: "label" | "code", value: string) => {
    const updated = [...prompts];
    updated[index][field] = value;
    setPrompts(updated);
  };

  const handleRemovePrompt = (index: number) => {
    if (prompts.length > 1) {
      setPrompts(prompts.filter((_, i) => i !== index));
    }
  };

  // Mistakes management
  const handleAddMistake = () => {
    setMistakes([...mistakes, ""]);
  };

  const handleMistakeChange = (index: number, value: string) => {
    const updated = [...mistakes];
    updated[index] = value;
    setMistakes(updated);
  };

  const handleRemoveMistake = (index: number) => {
    if (mistakes.length > 1) {
      setMistakes(mistakes.filter((_, i) => i !== index));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  // ── SCREEN 1: LOGIN REQUIREMENT ───────────────────────────────────────────
  if (!isLoggedIn) {
    return (
      <div style={{ padding: "100px 24px", minHeight: "80vh", display: "flex", alignItems: "center", justifyContent: "center", position: "relative", zIndex: 1 }}>
        <div className="glass-panel" style={{ 
          padding: "54px 40px", 
          borderRadius: 24, 
          maxWidth: 440, 
          width: "100%", 
          textAlign: "center",
          border: "1px solid rgba(0, 0, 0, 0.08)",
          boxShadow: "0 20px 40px rgba(0,0,0,0.03)"
        }}>
          <div className="font-mono" style={{ fontSize: 11, color: "#5863EA", fontWeight: 700, marginBottom: 12 }}>
            ✦ AUTHENTICATION REQUIRED // SUBMIT
          </div>
          
          <h2 className="font-serif" style={{ fontSize: 26, fontWeight: 700, color: "#000000", marginBottom: 12 }}>
            Join the Contributors
          </h2>
          
          <p style={{ fontSize: 14.5, color: "rgba(0, 0, 0, 0.6)", lineHeight: 1.6, marginBottom: 36 }}>
            FlowBase is community-driven. Sign in to document, structure, and share your custom AI workflows.
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <button 
              onClick={handleLogin}
              disabled={isLoggingIn}
              className="glass-button-primary"
              style={{
                width: "100%",
                borderRadius: 12,
                padding: "14px 20px",
                fontSize: 14,
                fontWeight: 700,
                cursor: "pointer",
                border: "none",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 10,
              }}
            >
              {isLoggingIn ? (
                <span>Connecting...</span>
              ) : (
                <>
                  <span style={{ fontSize: 16 }}>🔑</span>
                  <span>Sign in to continue</span>
                </>
              )}
            </button>

            <Link href="/" className="glass-button" style={{
              width: "100%",
              borderRadius: 12,
              padding: "14px 20px",
              fontSize: 14,
              fontWeight: 700,
              cursor: "pointer",
              textDecoration: "none",
              boxSizing: "border-box",
              display: "inline-block",
            }}>Cancel</Link>
          </div>
        </div>
      </div>
    );
  }

  // ── SCREEN 2: SUCCESS SCREEN ──────────────────────────────────────────────
  if (submitted) {
    return (
      <div style={{ padding: "100px 24px", minHeight: "80vh", display: "flex", alignItems: "center", justifyContent: "center", position: "relative", zIndex: 1 }}>
        <div className="glass-panel" style={{ 
          padding: "64px 40px", 
          borderRadius: 24, 
          maxWidth: 480, 
          width: "100%", 
          textAlign: "center",
          border: "1px solid rgba(0, 0, 0, 0.08)",
        }}>
          <div style={{ fontSize: 60, marginBottom: 20 }}>🎉</div>
          
          <h2 className="font-serif" style={{ fontSize: 28, fontWeight: 700, color: "#000000", marginBottom: 12 }}>
            Playbook Submitted!
          </h2>
          
          <p style={{ fontSize: 15, color: "rgba(0, 0, 0, 0.6)", lineHeight: 1.6, marginBottom: 36 }}>
            Thank you for contributing! Your playbook <strong>"{title}"</strong> has been queued for admin review. You'll receive a notification once it goes live.
          </p>

          <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
            <Link href="/workflows" className="glass-button-primary" style={{
              borderRadius: 12,
              padding: "14px 28px",
              fontSize: 14,
              fontWeight: 700,
              textDecoration: "none",
            }}>Browse Library</Link>
            
            <button 
              onClick={() => {
                setSubmitted(false);
                setCurrentStep(1);
                setTitle("");
                setSummary("");
                setProblem("");
                setTools([]);
                setSteps([{ title: "", content: "" }]);
                setPrompts([{ label: "", code: "" }]);
                setMistakes([""]);
              }} 
              className="glass-button" 
              style={{
                borderRadius: 12,
                padding: "14px 28px",
                fontSize: 14,
                fontWeight: 700,
                cursor: "pointer",
              }}
            >Submit Another</button>
          </div>
        </div>
      </div>
    );
  }

  // ── SCREEN 3: MULTI-STEP CREATION FORM ──────────────────────────────────
  return (
    <div style={{ maxWidth: 840, margin: "0 auto", padding: "80px 24px 120px", position: "relative", zIndex: 1 }}>
      {/* Step Progress Tracker */}
      <div style={{ marginBottom: 40 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <div>
            <span className="font-mono" style={{ fontSize: 10, color: "#5863EA", fontWeight: 700 }}>
              STEP {String(currentStep).padStart(2, "0")} / 04
            </span>
            <h1 className="font-serif" style={{ fontSize: 28, fontWeight: 700, color: "#000000", margin: "6px 0 0" }}>
              {currentStep === 1 && "Basic Details"}
              {currentStep === 2 && "Workflow Instructions"}
              {currentStep === 3 && "Prompts & Warnings"}
              {currentStep === 4 && "Review & Preview"}
            </h1>
          </div>
          
          <div style={{ display: "flex", gap: 4 }}>
            {[1, 2, 3, 4].map(stepNum => (
              <div 
                key={stepNum} 
                style={{ 
                  width: 32, 
                  height: 6, 
                  borderRadius: 3, 
                  background: currentStep >= stepNum ? "#5863EA" : "rgba(0,0,0,0.06)",
                  transition: "background 0.3s"
                }} 
              />
            ))}
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        
        {/* ── STEP 1: BASIC DETAILS ────────────────────────────────────────── */}
        {currentStep === 1 && (
          <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
            <div className="glass-panel" style={{ padding: "32px", borderRadius: 20, border: "1px solid rgba(0,0,0,0.08)", display: "flex", flexDirection: "column", gap: 20 }}>
              
              {/* Playbook Title */}
              <div>
                <label className="font-mono" style={{ display: "block", fontSize: 10, fontWeight: 700, color: "#000", marginBottom: 8 }}>
                  PLAYBOOK TITLE
                </label>
                <input 
                  type="text" 
                  value={title} 
                  onChange={e => setTitle(e.target.value)}
                  placeholder="e.g. Cold Email Personalization Scale Pipeline" 
                  required
                  className="glass-input"
                  style={{ width: "100%", padding: "14px", borderRadius: 12, fontSize: 14.5, boxSizing: "border-box" }}
                />
              </div>

              {/* Category & Difficulty */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                <div>
                  <label className="font-mono" style={{ display: "block", fontSize: 10, fontWeight: 700, color: "#000", marginBottom: 8 }}>
                    CATEGORY
                  </label>
                  <select 
                    value={category} 
                    onChange={e => setCategory(e.target.value)}
                    className="glass-input font-sans"
                    style={{ width: "100%", padding: "14px", borderRadius: 12, fontSize: 14, cursor: "pointer" }}
                  >
                    {["Marketing", "Coding", "Research", "Productivity", "Writing", "Design"].map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="font-mono" style={{ display: "block", fontSize: 10, fontWeight: 700, color: "#000", marginBottom: 8 }}>
                    DIFFICULTY
                  </label>
                  <select 
                    value={difficulty} 
                    onChange={e => setDifficulty(e.target.value)}
                    className="glass-input font-sans"
                    style={{ width: "100%", padding: "14px", borderRadius: 12, fontSize: 14, cursor: "pointer" }}
                  >
                    {["Beginner", "Intermediate", "Advanced"].map(d => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Summary */}
              <div>
                <label className="font-mono" style={{ display: "block", fontSize: 10, fontWeight: 700, color: "#000", marginBottom: 8 }}>
                  SHORT SUMMARY (2 LINES MAX)
                </label>
                <input 
                  type="text" 
                  value={summary} 
                  onChange={e => setSummary(e.target.value)}
                  placeholder="e.g. Generate highly-personalized outbound outreach templates matching prospects LinkedIn bio." 
                  required
                  className="glass-input"
                  style={{ width: "100%", padding: "14px", borderRadius: 12, fontSize: 14.5, boxSizing: "border-box" }}
                />
              </div>

              {/* Problem statement */}
              <div>
                <label className="font-mono" style={{ display: "block", fontSize: 10, fontWeight: 700, color: "#000", marginBottom: 8 }}>
                  WHAT PAIN THIS SOLVES
                </label>
                <textarea 
                  value={problem} 
                  onChange={e => setProblem(e.target.value)}
                  placeholder="Describe the workflow's use-case and why it saves time or improves quality..." 
                  required
                  rows={4}
                  className="glass-input"
                  style={{ width: "100%", padding: "14px", borderRadius: 12, fontSize: 14.5, boxSizing: "border-box", lineHeight: 1.6, resize: "vertical" }}
                />
              </div>

              {/* Tools Required */}
              <div>
                <label className="font-mono" style={{ display: "block", fontSize: 10, fontWeight: 700, color: "#000", marginBottom: 8 }}>
                  TOOLS REQUIRED (TYPE & PRESS ENTER)
                </label>
                <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
                  <input 
                    type="text" 
                    value={toolInput} 
                    onChange={e => setToolInput(e.target.value)}
                    placeholder="e.g. ChatGPT, Notion, Hunter.io" 
                    className="glass-input"
                    style={{ flex: 1, padding: "12px", borderRadius: 10, fontSize: 14, boxSizing: "border-box" }}
                    onKeyDown={e => { if (e.key === "Enter") { e.preventDefault(); handleAddTool(e); } }}
                  />
                  <button type="button" onClick={handleAddTool} className="glass-button" style={{ padding: "0 18px", borderRadius: 10, fontWeight: 700, fontSize: 13, cursor: "pointer" }}>Add</button>
                </div>
                
                <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                  {tools.map((t, idx) => (
                    <span key={idx} className="glass-badge font-mono" style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "4px 10px", borderRadius: 8, fontSize: 10, fontWeight: 700 }}>
                      {t.toUpperCase()}
                      <button type="button" onClick={() => handleRemoveTool(idx)} style={{ background: "none", border: "none", cursor: "pointer", color: "rgba(0,0,0,0.4)", fontWeight: 800, padding: 0 }}>×</button>
                    </span>
                  ))}
                  {tools.length === 0 && (
                    <span style={{ fontSize: 13, color: "rgba(0,0,0,0.4)" }}>No tools added yet.</span>
                  )}
                </div>
              </div>

            </div>
          </div>
        )}

        {/* ── STEP 2: WORKFLOW INSTRUCTIONS ─────────────────────────────────── */}
        {currentStep === 2 && (
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <div className="font-mono" style={{ fontSize: 11, color: "rgba(0,0,0,0.5)", fontWeight: 700, marginBottom: -10 }}>
              DEFINE EXPANDABLE STEPS IN ORDER
            </div>
            
            {steps.map((step, idx) => (
              <div key={idx} className="glass-panel" style={{ padding: "24px", borderRadius: 16, border: "1px solid rgba(0,0,0,0.08)", position: "relative" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                  <span className="font-mono" style={{ fontSize: 11, fontWeight: 700, color: "#5863EA" }}>
                    STEP {String(idx + 1).padStart(2, "0")}
                  </span>
                  
                  {steps.length > 1 && (
                    <button 
                      type="button" 
                      onClick={() => handleRemoveStep(idx)}
                      style={{ background: "none", border: "none", color: "#dc2626", fontSize: 11, fontWeight: 700, cursor: "pointer", padding: 0 }}
                    >REMOVE STEP</button>
                  )}
                </div>
                
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  <input 
                    type="text"
                    value={step.title}
                    onChange={e => handleStepChange(idx, "title", e.target.value)}
                    placeholder="Step Title (e.g. Personalize outreach mail)"
                    required
                    className="glass-input"
                    style={{ width: "100%", padding: "12px", borderRadius: 10, fontSize: 14, boxSizing: "border-box" }}
                  />
                  <textarea 
                    value={step.content}
                    onChange={e => handleStepChange(idx, "content", e.target.value)}
                    placeholder="Step instructions and execution details..."
                    required
                    rows={3}
                    className="glass-input"
                    style={{ width: "100%", padding: "12px", borderRadius: 10, fontSize: 14, boxSizing: "border-box", lineHeight: 1.5, resize: "vertical" }}
                  />
                </div>
              </div>
            ))}
            
            <button 
              type="button" 
              onClick={handleAddStep} 
              className="glass-button font-mono" 
              style={{ padding: "14px", borderRadius: 12, fontWeight: 700, fontSize: 11, cursor: "pointer", width: "100%" }}
            >
              + ADD NEW WORKFLOW STEP
            </button>
          </div>
        )}

        {/* ── STEP 3: PROMPTS & WARNINGS ───────────────────────────────────── */}
        {currentStep === 3 && (
          <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
            
            {/* Prompts Section */}
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div className="font-mono" style={{ fontSize: 11, color: "rgba(0,0,0,0.5)", fontWeight: 700 }}>
                PROMPT TEMPLATES (COPY-PASTE READY)
              </div>
              
              {prompts.map((prompt, idx) => (
                <div key={idx} className="glass-panel" style={{ padding: "24px", borderRadius: 16, border: "1px solid rgba(0,0,0,0.08)" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                    <span className="font-mono" style={{ fontSize: 11, fontWeight: 700, color: "#5863EA" }}>
                      PROMPT {String(idx + 1).padStart(2, "0")}
                    </span>
                    
                    {prompts.length > 1 && (
                      <button 
                        type="button" 
                        onClick={() => handleRemovePrompt(idx)}
                        style={{ background: "none", border: "none", color: "#dc2626", fontSize: 11, fontWeight: 700, cursor: "pointer", padding: 0 }}
                      >REMOVE</button>
                    )}
                  </div>
                  
                  <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                    <input 
                      type="text"
                      value={prompt.label}
                      onChange={e => handlePromptChange(idx, "label", e.target.value)}
                      placeholder="Prompt Label (e.g. Cold email copywriter prompt)"
                      required
                      className="glass-input font-mono"
                      style={{ width: "100%", padding: "12px", borderRadius: 10, fontSize: 11, fontWeight: 700, boxSizing: "border-box" }}
                    />
                    <textarea 
                      value={prompt.code}
                      onChange={e => handlePromptChange(idx, "code", e.target.value)}
                      placeholder="Paste your prompt template with [placeholders]..."
                      required
                      rows={4}
                      className="glass-input font-mono"
                      style={{ width: "100%", padding: "12px", borderRadius: 10, fontSize: 12.5, boxSizing: "border-box", lineHeight: 1.6, resize: "vertical" }}
                    />
                  </div>
                </div>
              ))}
              
              <button 
                type="button" 
                onClick={handleAddPrompt} 
                className="glass-button font-mono" 
                style={{ padding: "14px", borderRadius: 12, fontWeight: 700, fontSize: 11, cursor: "pointer", width: "100%" }}
              >
                + ADD PROMPT TEMPLATE
              </button>
            </div>

            {/* Mistakes/Warnings Section */}
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div className="font-mono" style={{ fontSize: 11, color: "rgba(0,0,0,0.5)", fontWeight: 700 }}>
                COMMON MISTAKES & FIXES
              </div>
              
              {mistakes.map((mistake, idx) => (
                <div key={idx} style={{ display: "flex", gap: 10, alignItems: "center" }}>
                  <span style={{ fontSize: 16, flexShrink: 0 }}>⚡</span>
                  <input 
                    type="text"
                    value={mistake}
                    onChange={e => handleMistakeChange(idx, e.target.value)}
                    placeholder="e.g. Waiting too long to email prospects. Do it within 1 hour."
                    required
                    className="glass-input"
                    style={{ flex: 1, padding: "12px", borderRadius: 10, fontSize: 14, boxSizing: "border-box" }}
                  />
                  {mistakes.length > 1 && (
                    <button 
                      type="button" 
                      onClick={() => handleRemoveMistake(idx)}
                      style={{ background: "none", border: "none", color: "#dc2626", fontSize: 20, cursor: "pointer", padding: 0 }}
                    >×</button>
                  )}
                </div>
              ))}
              
              <button 
                type="button" 
                onClick={handleAddMistake} 
                className="glass-button font-mono" 
                style={{ padding: "12px", borderRadius: 10, fontWeight: 700, fontSize: 11, cursor: "pointer", width: "100%" }}
              >
                + ADD MISTAKE CALLOUT
              </button>
            </div>

          </div>
        )}

        {/* ── STEP 4: REVIEW & PREVIEW ──────────────────────────────────────── */}
        {currentStep === 4 && (
          <div style={{ display: "flex", flexDirection: "column", gap: 40 }}>
            <div>
              <p style={{ fontSize: 14.5, color: "rgba(0,0,0,0.6)", lineHeight: 1.6, margin: "0 0 20px" }}>
                Verify your playbook's details below. Here is a live rendering of how your card will appear in the directory:
              </p>
              
              {/* Directory Card Preview */}
              <div style={{ maxWidth: 360, margin: "0 auto" }}>
                <div className="glass-card" style={{ padding: "28px", border: "1px solid rgba(0,0,0,0.08)", borderRadius: 24, textAlign: "left" }}>
                  <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center", marginBottom: 16 }}>
                    <CategoryBadge cat={category} />
                    <DifficultyBadge level={difficulty} />
                  </div>
                  <div>
                    <h3 className="font-serif" style={{ fontWeight: 800, fontSize: 19, color: "#000000", marginBottom: 8, lineHeight: 1.3 }}>
                      {title || "Untitled AI Playbook"}
                    </h3>
                    <p style={{ fontSize: 13.5, color: "rgba(0,0,0,0.6)", lineHeight: 1.5, margin: 0 }}>
                      {summary || "No summary template provided."}
                    </p>
                  </div>
                  <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginTop: 16 }}>
                    {tools.map(t => (
                      <span key={t} className="font-mono" style={{ background: "rgba(0,0,0,0.04)", border: "1px solid rgba(0,0,0,0.06)", borderRadius: 6, fontSize: 8.5, color: "rgba(0,0,0,0.5)", padding: "3px 8px" }}>
                        {t.toUpperCase()}
                      </span>
                    ))}
                    {tools.length === 0 && <span style={{ fontSize: 11, color: "rgba(0,0,0,0.3)" }}>No tools defined</span>}
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 18, borderTop: "1px solid rgba(0,0,0,0.05)", paddingTop: 16 }}>
                    <span className="font-mono" style={{ fontSize: 9.5, color: "rgba(0,0,0,0.4)", fontWeight: 700 }}>UPDATED JUST NOW</span>
                    <span style={{ fontSize: 12, color: "rgba(0,0,0,0.4)" }}>♡ 0 saves</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Warning Checklist */}
            <div className="glass-panel" style={{ padding: "24px", borderRadius: 16, border: "1px solid rgba(0,0,0,0.06)" }}>
              <div className="font-mono" style={{ fontSize: 10, color: "#5863EA", fontWeight: 700, marginBottom: 12 }}>
                FINAL CHECKLIST
              </div>
              <ul style={{ padding: 0, margin: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: 10, fontSize: 13.5, color: "rgba(0,0,0,0.7)" }}>
                <li>✓ Form validation passed successfully</li>
                <li>✓ Monospaced tokens mapped to proper variables</li>
                <li>✓ High-end editorial formatting verified</li>
                <li>✓ Playbook ready for community curation</li>
              </ul>
            </div>
          </div>
        )}

        {/* ── MULTI-STEP NAVIGATION FOOTER ─────────────────────────────────── */}
        <div style={{ 
          marginTop: 48, 
          paddingTop: 24, 
          borderTop: "1px solid rgba(0,0,0,0.06)", 
          display: "flex", 
          justifyContent: "space-between" 
        }}>
          {currentStep > 1 ? (
            <button 
              type="button" 
              onClick={() => setCurrentStep(currentStep - 1)}
              className="glass-button font-mono" 
              style={{ borderRadius: 12, padding: "14px 28px", fontSize: 11, fontWeight: 700, cursor: "pointer" }}
            >
              ← BACK
            </button>
          ) : (
            <div />
          )}

          {currentStep < 4 ? (
            <button 
              type="button" 
              onClick={() => {
                // simple step checks
                if (currentStep === 1 && (!title || !summary || !problem)) {
                  alert("Please fill out all required fields.");
                  return;
                }
                setCurrentStep(currentStep + 1);
              }}
              className="glass-button-primary font-mono" 
              style={{ borderRadius: 12, padding: "14px 28px", fontSize: 11, fontWeight: 700, cursor: "pointer", border: "none" }}
            >
              CONTINUE →
            </button>
          ) : (
            <button 
              type="submit" 
              className="glass-button-primary font-mono" 
              style={{ borderRadius: 12, padding: "14px 28px", fontSize: 11, fontWeight: 700, cursor: "pointer", border: "none" }}
            >
              SUBMIT PLAYBOOK
            </button>
          )}
        </div>

      </form>
    </div>
  );
}
