"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useUser, SignInButton } from "@clerk/nextjs";
import { useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { CategoryBadge, DifficultyBadge } from "@/components/ui/Badges";

export default function SubmitPage() {
  const { isSignedIn, isLoaded, user } = useUser();
  const submitWorkflow = useMutation(api.workflows.submit);

  // Multi-step Form State
  const [currentStep, setCurrentStep] = useState(1);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Marketing");
  const [difficulty, setDifficulty] = useState<"Beginner" | "Intermediate" | "Advanced">("Beginner");
  const [summary, setSummary] = useState("");
  const [problem, setProblem] = useState("");
  const [tools, setTools] = useState<string[]>([]);
  const [toolInput, setToolInput] = useState("");
  const [steps, setSteps] = useState([{ title: "", content: "" }]);
  const [prompts, setPrompts] = useState([{ label: "", code: "" }]);
  const [mistakes, setMistakes] = useState([""]);
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  // Tools management
  const handleAddTool = (e: React.FormEvent) => {
    e.preventDefault();
    if (toolInput.trim() && !tools.includes(toolInput.trim())) {
      setTools([...tools, toolInput.trim()]);
      setToolInput("");
    }
  };
  const handleRemoveTool = (i: number) => setTools(tools.filter((_, idx) => idx !== i));

  // Steps management
  const handleAddStep = () => setSteps([...steps, { title: "", content: "" }]);
  const handleStepChange = (i: number, field: "title" | "content", value: string) => {
    const updated = [...steps]; updated[i][field] = value; setSteps(updated);
  };
  const handleRemoveStep = (i: number) => { if (steps.length > 1) setSteps(steps.filter((_, idx) => idx !== i)); };

  // Prompts management
  const handleAddPrompt = () => setPrompts([...prompts, { label: "", code: "" }]);
  const handlePromptChange = (i: number, field: "label" | "code", value: string) => {
    const updated = [...prompts]; updated[i][field] = value; setPrompts(updated);
  };
  const handleRemovePrompt = (i: number) => { if (prompts.length > 1) setPrompts(prompts.filter((_, idx) => idx !== i)); };

  // Mistakes management
  const handleAddMistake = () => setMistakes([...mistakes, ""]);
  const handleMistakeChange = (i: number, value: string) => {
    const updated = [...mistakes]; updated[i] = value; setMistakes(updated);
  };
  const handleRemoveMistake = (i: number) => { if (mistakes.length > 1) setMistakes(mistakes.filter((_, idx) => idx !== i)); };

  // ── REAL SUBMIT → Convex ──────────────────────────────────────────────────
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError("");

    try {
      const slug = title
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^a-z0-9-]/g, "")
        .substring(0, 80);

      await submitWorkflow({
        slug,
        title,
        category,
        difficulty,
        tools,
        summary,
        problem,
        steps: steps.filter(s => s.title && s.content),
        prompts: prompts.filter(p => p.label && p.code),
        mistakes: mistakes.filter(m => m.trim()),
        lastTested: "just submitted",
      });

      setSubmitted(true);
    } catch (err: any) {
      setSubmitError(err.message ?? "Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // ── SCREEN: LOADING ───────────────────────────────────────────────────────
  if (!isLoaded) {
    return (
      <div style={{ padding: "100px 24px", display: "flex", justifyContent: "center", position: "relative", zIndex: 1 }}>
        <div className="font-mono" style={{ fontSize: 11, color: "#5863EA", fontWeight: 700 }}>LOADING...</div>
      </div>
    );
  }

  // ── SCREEN 1: LOGIN REQUIREMENT ───────────────────────────────────────────
  if (!isSignedIn) {
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
            <SignInButton mode="modal">
              <button className="glass-button-primary" style={{
                width: "100%", borderRadius: 12, padding: "14px 20px", fontSize: 14,
                fontWeight: 700, cursor: "pointer", border: "none",
                display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
              }}>
                <span style={{ fontSize: 16 }}>🔑</span>
                <span>Sign in to continue</span>
              </button>
            </SignInButton>
            <Link href="/" className="glass-button" style={{
              width: "100%", borderRadius: 12, padding: "14px 20px", fontSize: 14,
              fontWeight: 700, cursor: "pointer", textDecoration: "none",
              boxSizing: "border-box", display: "inline-block", textAlign: "center",
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
          padding: "64px 40px", borderRadius: 24, maxWidth: 480,
          width: "100%", textAlign: "center", border: "1px solid rgba(0, 0, 0, 0.08)",
        }}>
          <div style={{ fontSize: 60, marginBottom: 20 }}>🎉</div>
          <h2 className="font-serif" style={{ fontSize: 28, fontWeight: 700, color: "#000000", marginBottom: 12 }}>
            Playbook Submitted!
          </h2>
          <p style={{ fontSize: 15, color: "rgba(0, 0, 0, 0.6)", lineHeight: 1.6, marginBottom: 36 }}>
            Thank you for contributing! Your playbook <strong>"{title}"</strong> has been queued for admin review. You can track it in your profile.
          </p>
          <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
            <Link href="/workflows" className="glass-button-primary" style={{
              borderRadius: 12, padding: "14px 28px", fontSize: 14, fontWeight: 700, textDecoration: "none",
            }}>Browse Library</Link>
            <Link href="/profile" className="glass-button" style={{
              borderRadius: 12, padding: "14px 28px", fontSize: 14, fontWeight: 700, textDecoration: "none",
            }}>My Profile</Link>
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
              <div key={stepNum} style={{
                width: 32, height: 6, borderRadius: 3,
                background: currentStep >= stepNum ? "#5863EA" : "rgba(0,0,0,0.06)",
                transition: "background 0.3s"
              }} />
            ))}
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit}>

        {/* ── STEP 1: BASIC DETAILS ── */}
        {currentStep === 1 && (
          <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
            <div className="glass-panel" style={{ padding: "32px", borderRadius: 20, border: "1px solid rgba(0,0,0,0.08)", display: "flex", flexDirection: "column", gap: 20 }}>
              <div>
                <label className="font-mono" style={{ display: "block", fontSize: 10, fontWeight: 700, color: "#000", marginBottom: 8 }}>PLAYBOOK TITLE</label>
                <input type="text" value={title} onChange={e => setTitle(e.target.value)} placeholder="e.g. Cold Email Personalization at Scale" required className="glass-input" style={{ width: "100%", padding: "14px", borderRadius: 12, fontSize: 14.5, boxSizing: "border-box" }} />
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                <div>
                  <label className="font-mono" style={{ display: "block", fontSize: 10, fontWeight: 700, color: "#000", marginBottom: 8 }}>CATEGORY</label>
                  <select value={category} onChange={e => setCategory(e.target.value)} className="glass-input font-sans" style={{ width: "100%", padding: "14px", borderRadius: 12, fontSize: 14, cursor: "pointer" }}>
                    {["Marketing", "Coding", "Research", "Productivity", "Writing", "Design"].map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="font-mono" style={{ display: "block", fontSize: 10, fontWeight: 700, color: "#000", marginBottom: 8 }}>DIFFICULTY</label>
                  <select value={difficulty} onChange={e => setDifficulty(e.target.value as any)} className="glass-input font-sans" style={{ width: "100%", padding: "14px", borderRadius: 12, fontSize: 14, cursor: "pointer" }}>
                    {["Beginner", "Intermediate", "Advanced"].map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="font-mono" style={{ display: "block", fontSize: 10, fontWeight: 700, color: "#000", marginBottom: 8 }}>SHORT SUMMARY (2 LINES MAX)</label>
                <input type="text" value={summary} onChange={e => setSummary(e.target.value)} placeholder="e.g. Generate personalized outreach using LinkedIn bios and ChatGPT." required className="glass-input" style={{ width: "100%", padding: "14px", borderRadius: 12, fontSize: 14.5, boxSizing: "border-box" }} />
              </div>
              <div>
                <label className="font-mono" style={{ display: "block", fontSize: 10, fontWeight: 700, color: "#000", marginBottom: 8 }}>WHAT PAIN THIS SOLVES</label>
                <textarea value={problem} onChange={e => setProblem(e.target.value)} placeholder="Describe the workflow's use-case and why it saves time or improves quality..." required rows={4} className="glass-input" style={{ width: "100%", padding: "14px", borderRadius: 12, fontSize: 14.5, boxSizing: "border-box", lineHeight: 1.6, resize: "vertical" }} />
              </div>
              <div>
                <label className="font-mono" style={{ display: "block", fontSize: 10, fontWeight: 700, color: "#000", marginBottom: 8 }}>TOOLS REQUIRED (TYPE & PRESS ENTER)</label>
                <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
                  <input type="text" value={toolInput} onChange={e => setToolInput(e.target.value)} placeholder="e.g. ChatGPT, Notion, Hunter.io" className="glass-input" style={{ flex: 1, padding: "12px", borderRadius: 10, fontSize: 14, boxSizing: "border-box" }} onKeyDown={e => { if (e.key === "Enter") { e.preventDefault(); handleAddTool(e); } }} />
                  <button type="button" onClick={handleAddTool} className="glass-button" style={{ padding: "0 18px", borderRadius: 10, fontWeight: 700, fontSize: 13, cursor: "pointer" }}>Add</button>
                </div>
                <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                  {tools.map((t, idx) => (
                    <span key={idx} className="glass-badge font-mono" style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "4px 10px", borderRadius: 8, fontSize: 10, fontWeight: 700 }}>
                      {t.toUpperCase()}
                      <button type="button" onClick={() => handleRemoveTool(idx)} style={{ background: "none", border: "none", cursor: "pointer", color: "rgba(0,0,0,0.4)", fontWeight: 800, padding: 0 }}>×</button>
                    </span>
                  ))}
                  {tools.length === 0 && <span style={{ fontSize: 13, color: "rgba(0,0,0,0.4)" }}>No tools added yet.</span>}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── STEP 2: WORKFLOW INSTRUCTIONS ── */}
        {currentStep === 2 && (
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <div className="font-mono" style={{ fontSize: 11, color: "rgba(0,0,0,0.5)", fontWeight: 700, marginBottom: -10 }}>DEFINE EXPANDABLE STEPS IN ORDER</div>
            {steps.map((step, idx) => (
              <div key={idx} className="glass-panel" style={{ padding: "24px", borderRadius: 16, border: "1px solid rgba(0,0,0,0.08)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                  <span className="font-mono" style={{ fontSize: 11, fontWeight: 700, color: "#5863EA" }}>STEP {String(idx + 1).padStart(2, "0")}</span>
                  {steps.length > 1 && <button type="button" onClick={() => handleRemoveStep(idx)} style={{ background: "none", border: "none", color: "#dc2626", fontSize: 11, fontWeight: 700, cursor: "pointer", padding: 0 }}>REMOVE STEP</button>}
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  <input type="text" value={step.title} onChange={e => handleStepChange(idx, "title", e.target.value)} placeholder="Step Title" required className="glass-input" style={{ width: "100%", padding: "12px", borderRadius: 10, fontSize: 14, boxSizing: "border-box" }} />
                  <textarea value={step.content} onChange={e => handleStepChange(idx, "content", e.target.value)} placeholder="Step instructions and execution details..." required rows={3} className="glass-input" style={{ width: "100%", padding: "12px", borderRadius: 10, fontSize: 14, boxSizing: "border-box", lineHeight: 1.5, resize: "vertical" }} />
                </div>
              </div>
            ))}
            <button type="button" onClick={handleAddStep} className="glass-button font-mono" style={{ padding: "14px", borderRadius: 12, fontWeight: 700, fontSize: 11, cursor: "pointer", width: "100%" }}>+ ADD NEW WORKFLOW STEP</button>
          </div>
        )}

        {/* ── STEP 3: PROMPTS & WARNINGS ── */}
        {currentStep === 3 && (
          <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div className="font-mono" style={{ fontSize: 11, color: "rgba(0,0,0,0.5)", fontWeight: 700 }}>PROMPT TEMPLATES (COPY-PASTE READY)</div>
              {prompts.map((prompt, idx) => (
                <div key={idx} className="glass-panel" style={{ padding: "24px", borderRadius: 16, border: "1px solid rgba(0,0,0,0.08)" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                    <span className="font-mono" style={{ fontSize: 11, fontWeight: 700, color: "#5863EA" }}>PROMPT {String(idx + 1).padStart(2, "0")}</span>
                    {prompts.length > 1 && <button type="button" onClick={() => handleRemovePrompt(idx)} style={{ background: "none", border: "none", color: "#dc2626", fontSize: 11, fontWeight: 700, cursor: "pointer", padding: 0 }}>REMOVE</button>}
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                    <input type="text" value={prompt.label} onChange={e => handlePromptChange(idx, "label", e.target.value)} placeholder="Prompt Label" required className="glass-input font-mono" style={{ width: "100%", padding: "12px", borderRadius: 10, fontSize: 11, fontWeight: 700, boxSizing: "border-box" }} />
                    <textarea value={prompt.code} onChange={e => handlePromptChange(idx, "code", e.target.value)} placeholder="Paste your prompt template with {placeholders}..." required rows={5} className="glass-input font-mono" style={{ width: "100%", padding: "12px", borderRadius: 10, fontSize: 12.5, boxSizing: "border-box", lineHeight: 1.6, resize: "vertical" }} />
                  </div>
                </div>
              ))}
              <button type="button" onClick={handleAddPrompt} className="glass-button font-mono" style={{ padding: "14px", borderRadius: 12, fontWeight: 700, fontSize: 11, cursor: "pointer", width: "100%" }}>+ ADD PROMPT TEMPLATE</button>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div className="font-mono" style={{ fontSize: 11, color: "rgba(0,0,0,0.5)", fontWeight: 700 }}>COMMON MISTAKES & FIXES</div>
              {mistakes.map((mistake, idx) => (
                <div key={idx} style={{ display: "flex", gap: 10, alignItems: "center" }}>
                  <span style={{ fontSize: 16, flexShrink: 0 }}>⚡</span>
                  <input type="text" value={mistake} onChange={e => handleMistakeChange(idx, e.target.value)} placeholder="e.g. Waiting too long to email prospects. Do it within 1 hour." required className="glass-input" style={{ flex: 1, padding: "12px", borderRadius: 10, fontSize: 14, boxSizing: "border-box" }} />
                  {mistakes.length > 1 && <button type="button" onClick={() => handleRemoveMistake(idx)} style={{ background: "none", border: "none", color: "#dc2626", fontSize: 20, cursor: "pointer", padding: 0 }}>×</button>}
                </div>
              ))}
              <button type="button" onClick={handleAddMistake} className="glass-button font-mono" style={{ padding: "12px", borderRadius: 10, fontWeight: 700, fontSize: 11, cursor: "pointer", width: "100%" }}>+ ADD MISTAKE CALLOUT</button>
            </div>
          </div>
        )}

        {/* ── STEP 4: REVIEW & PREVIEW ── */}
        {currentStep === 4 && (
          <div style={{ display: "flex", flexDirection: "column", gap: 40 }}>
            <div>
              <p style={{ fontSize: 14.5, color: "rgba(0,0,0,0.6)", lineHeight: 1.6, margin: "0 0 20px" }}>
                Verify your playbook's details below. Here is a live rendering of how your card will appear in the directory:
              </p>
              <div style={{ maxWidth: 360, margin: "0 auto" }}>
                <div className="glass-card" style={{ padding: "28px", border: "1px solid rgba(0,0,0,0.08)", borderRadius: 24, textAlign: "left" }}>
                  <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center", marginBottom: 16 }}>
                    <CategoryBadge cat={category} />
                    <DifficultyBadge level={difficulty} />
                  </div>
                  <h3 className="font-serif" style={{ fontWeight: 800, fontSize: 19, color: "#000000", marginBottom: 8, lineHeight: 1.3 }}>{title || "Untitled AI Playbook"}</h3>
                  <p style={{ fontSize: 13.5, color: "rgba(0,0,0,0.6)", lineHeight: 1.5, margin: "0 0 16px" }}>{summary || "No summary provided."}</p>
                  <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                    {tools.map(t => <span key={t} className="font-mono" style={{ background: "rgba(0,0,0,0.04)", border: "1px solid rgba(0,0,0,0.06)", borderRadius: 6, fontSize: 8.5, color: "rgba(0,0,0,0.5)", padding: "3px 8px" }}>{t.toUpperCase()}</span>)}
                  </div>
                </div>
              </div>
            </div>
            {submitError && (
              <div style={{ background: "rgba(220,38,38,0.06)", border: "1px solid rgba(220,38,38,0.2)", borderRadius: 12, padding: "16px 20px", color: "#dc2626", fontSize: 14 }}>
                ⚠️ {submitError}
              </div>
            )}
          </div>
        )}

        {/* ── NAVIGATION FOOTER ── */}
        <div style={{ marginTop: 48, paddingTop: 24, borderTop: "1px solid rgba(0,0,0,0.06)", display: "flex", justifyContent: "space-between" }}>
          {currentStep > 1 ? (
            <button type="button" onClick={() => setCurrentStep(currentStep - 1)} className="glass-button font-mono" style={{ borderRadius: 12, padding: "14px 28px", fontSize: 11, fontWeight: 700, cursor: "pointer" }}>← BACK</button>
          ) : <div />}

          {currentStep < 4 ? (
            <button type="button" onClick={() => {
              if (currentStep === 1 && (!title || !summary || !problem)) { alert("Please fill out all required fields."); return; }
              setCurrentStep(currentStep + 1);
            }} className="glass-button-primary font-mono" style={{ borderRadius: 12, padding: "14px 28px", fontSize: 11, fontWeight: 700, cursor: "pointer", border: "none" }}>CONTINUE →</button>
          ) : (
            <button type="submit" disabled={isSubmitting} className="glass-button-primary font-mono" style={{ borderRadius: 12, padding: "14px 28px", fontSize: 11, fontWeight: 700, cursor: isSubmitting ? "wait" : "pointer", border: "none", opacity: isSubmitting ? 0.7 : 1 }}>
              {isSubmitting ? "SUBMITTING..." : "SUBMIT PLAYBOOK"}
            </button>
          )}
        </div>

      </form>
    </div>
  );
}
