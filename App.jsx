import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ThemeToggle } from "@/components/theme-toggle";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import PredictiveAnalytics from './components/PredictiveAnalytics.jsx';
import FlowDiscovery from './components/FlowDiscovery.jsx';
import AITestGeneration from './components/AITestGeneration.jsx';
import SentimentAnalysis from './components/SentimentAnalysis.jsx';
import BugPredictions from './components/BugPredictions.jsx';
import AIAssistant from './components/AIAssistant.jsx';
import AIRightPanel from './components/AIRightPanel.jsx';
import AISidebar from './components/AISidebar.jsx';
import DesignPreviewRouter from './pages/DesignPreviewRouter.jsx';
import SavedQueriesDropdown from './components/SavedQueriesDropdown.jsx';
import DesignPreview from './pages/DesignPreview.jsx';

import Toast from "@/components/common/Toast";
import Modal from "@/components/modals/Modal";
import TestDetailModal from "@/components/modals/TestDetailModal.jsx";
import NewBugModal from "@/components/modals/NewBugModal";
import BugDetailModal from "@/components/modals/BugDetailModal";
import NewTestModal from "@/components/modals/NewTestModal";
import GenerateTestsModal from "@/components/modals/GenerateTestsModal";
import RunTestsModal from "@/components/modals/RunTestsModal";
import SyncNowModal from "@/components/modals/SyncNowModal";
import AddIntegrationModal from "@/components/modals/AddIntegrationModal";
import StartRecordingModal from "@/components/modals/StartRecordingModal";
const PAGES_WITH_RIGHT_PANEL = ['ai', 'aitriage', 'dashboard', 'home'];

const NAV = [
  { id: "dashboard", icon: "◈", label: "Dashboard" },
  { id: "allbugs", icon: "⬡", label: "Bugs" },
  { id: "alltests", icon: "△", label: "Tests" },
  { id: "aitriage", icon: "◉", label: "AI Panel" },
  { id: "automation", icon: "⬢", label: "Automation" },
  { id: "clickup", icon: "⚡", label: "ClickUp" },
  { id: "settings", icon: "◎", label: "Settings" },
  { id: "design_preview", icon: "🎨", label: "Design Preview" },
];

// Simple host for Design Preview route (to be mounted in the main layout)
export const DesignPreviewHost = () => {
  return (
    <DesignPreviewRouter />
  )
}

// (Removed erroneous top-level dashboardFilters state here)

const sidebarNav = [
  { group: "Overview", items: [
    { id: "activity", icon: "◈", label: "Activity Feed" },
    { id: "sprint", icon: "▦", label: "Sprint Board" },
  ]},
  { group: "Test Automation", items: [
    { id: "alltests", icon: "△", label: "All Tests", badge: "24", badgePurple: true },
    { id: "record", icon: "◎", label: "Record Test" },
    { id: "runs", icon: "▶", label: "Test Runs" },
    { id: "mobile", icon: "⬡", label: "Mobile Tests" },
    { id: "api", icon: "⬢", label: "API Tests" },
    { id: "elements", icon: "◫", label: "Element Repo" },
    { id: "cloud", icon: "⬭", label: "Cloud Runner" },
  ]},
  { group: "Bug Tracking", items: [
    { id: "allbugs", icon: "⬡", label: "All Bugs", badge: "7" },
    { id: "kanban", icon: "⬜", label: "Kanban Board" },
    { id: "stories", icon: "▤", label: "User Stories" },
    { id: "duplicates", icon: "◈", label: "Duplicates" },
  ]},
  { group: "Saved Queries", items: [
    { id: "dashboard", icon: "◈", label: "Dashboard", tooltip: "Go to Dashboard" },
    { id: "dashboard_filters", icon: "🔖", label: "Dashboard Filters", tooltip: "Save current dashboard filters" }
  ]},
  { group: "AI Intelligence", items: [
    { id: "aitriage", icon: "◉", label: "AI Triage" },
    { id: "flows", icon: "◇", label: "Flow Discovery" },
    { id: "predictions", icon: "◈", label: "Predictions" },
    { id: "generate", icon: "⚡", label: "Generate Tests" },
  ]},
  { group: "Integrations", items: [
    { id: "clickup", icon: "⬢", label: "ClickUp Sync" },
    { id: "reports", icon: "◫", label: "Reports" },
    { id: "settings", icon: "◎", label: "Settings" },
    { id: "design_preview", icon: "🎨", label: "Design Preview" },
  ]},
];

// Animation variants for reusable effects

const pageVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.98 },
  visible: { 
    opacity: 1, y: 0, scale: 1,
    transition: { type: "spring", stiffness: 300, damping: 25, staggerChildren: 0.05, delayChildren: 0.05 }
  },
  exit: { opacity: 0, y: -10, transition: { duration: 0.2 } }
};

const staggerItemVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 25 } }
};

 
 

 

function DashboardPage({ showToast, setShowNewBug, setShowNewTest, setShowGenerateTests, setShowRunTests, setShowSyncNow, setShowAddIntegration, setShowStartRecording, setShowInvite, setShowExport, setShowProfile, setShowNewUserStory, setPage, bugs = [], tests = [], openStatDetail, backFromDetail, detailPage, filters = {}, setFilters }) {
  const [bugFilter, setBugFilter] = useState("all");
  const passRate = tests.length ? Math.round((tests.filter(t => t.status === "passed").length / tests.length) * 100) : 0;
  const resolvedBugs = bugs.filter(b => b.status === "fixed").length;
  const resolutionRate = bugs.length ? Math.round((resolvedBugs / bugs.length) * 100) : 0;
  const qualityScore = Math.round((passRate * 0.6) + (resolutionRate * 0.4));

  const applyFilters = (list) => {
    let result = list;
    if (filters.priority) result = result.filter(b => b.priority === filters.priority);
    if (filters.status) result = result.filter(b => b.status === filters.status);
    if (filters.assignee) result = result.filter(b => b.assignee === filters.assignee);
    if (filters.severity) result = result.filter(b => b.severity === filters.severity);
    if (filters.titleSearch) result = result.filter(b => b.title.toLowerCase().includes(filters.titleSearch.toLowerCase()));
    return result;
  };

  const tabFilteredBugs = bugs.filter(b => {
    if (bugFilter === "critical") return b.priority === "blocker";
    if (bugFilter === "sprint") return b.status !== "fixed";
    if (bugFilter === "mine") return b.assignee === "Waleed";
    return true;
  });
  const filteredBugs = applyFilters(tabFilteredBugs);
  const displayBugs = applyFilters(bugs);
  const openBugsCount = displayBugs.filter(b => b.status === "open" || b.status === "New" || b.status === "Active").length;
  const hasActiveFilters = Object.values(filters).some(v => v);

  const handleStatClick = (detailId) => {
    if (openStatDetail) openStatDetail(detailId);
  };

  return (
    <>
      {hasActiveFilters && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 14px', marginBottom: 12, background: 'rgba(255,0,153,0.07)', border: '1px solid rgba(255,0,153,0.22)', borderRadius: 10, fontSize: '.76rem' }}>
          <span>🔖</span>
          <span style={{ color: 'var(--pink)', fontWeight: 600 }}>Dashboard filters active:</span>
          <span style={{ color: 'var(--muted)' }}>{Object.entries(filters).filter(([,v]) => v).map(([k,v]) => `${k}=${v}`).join(' · ')}</span>
        </div>
      )}
      <div className="stats-row">
        <div className="stat-card pink" onClick={() => handleStatClick('db-open-bugs')}>
          <div className="stat-label">Open Bugs</div>
          <div className="stat-value">{openBugsCount}</div>
          <div className="stat-sub"><span className="stat-trend down">↑ 2</span> from last sprint · {displayBugs.filter(b => b.priority === "blocker").length} critical</div>
          <div className="stat-card-link">View details →</div>
        </div>
        <div className="stat-card blue" onClick={() => handleStatClick('db-total-tests')}>
          <div className="stat-label">Total Tests</div>
          <div className="stat-value">{tests.length}</div>
          <div className="stat-sub"><span className="stat-trend up">↑ 3</span> added this sprint</div>
          <div className="stat-card-link">View details →</div>
        </div>
        <div className="stat-card green" onClick={() => handleStatClick('db-pass-rate')}>
          <div className="stat-label">Pass Rate</div>
          <div className="stat-value">{passRate}%</div>
          <div className="stat-sub"><span className="stat-trend up">↑ 2%</span> vs last sprint</div>
          <div className="stat-card-link">View details →</div>
        </div>
        <div className="stat-card purple" onClick={() => handleStatClick('db-quality')}>
          <div className="stat-label">Quality Score</div>
          <div className="stat-value">{qualityScore}</div>
          <div className="stat-sub">Tests + resolution rate</div>
          <div className="stat-card-link">View details →</div>
        </div>
      </div>
      <div style={{ display: 'flex', justifyContent: 'flex-end', padding: '0 12px', marginTop: 8 }}>
        <SavedQueriesDropdown currentFilters={filters} onApply={(f) => setFilters && setFilters(f)} />
      </div>

      <div className="card">
        <div className="card-header">
          <div className="card-title">
            🧠 Neural Feed
            <span className="live-dot" style={{ marginLeft: 8, width: 8, height: 8, borderRadius: '50%', background: 'var(--green)', animation: 'pulse 2s infinite' }}></span>
          </div>
        </div>
        <div className="card-body">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: 8, borderRadius: 8, background: 'rgba(255,0,153,0.05)', border: '1px solid rgba(255,0,153,0.1)' }}>
              <span>🤖</span>
              <span style={{ flex: 1, fontSize: '0.87rem' }}>Analyzing test patterns for US-042 Checkout Flow</span>
              <span style={{ fontSize: '0.75rem', color: 'var(--muted)' }}>Just now</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: 8, borderRadius: 8, background: 'rgba(157,78,221,0.05)', border: '1px solid rgba(157,78,221,0.1)' }}>
              <span>🔮</span>
              <span style={{ flex: 1, fontSize: '0.87rem' }}>Predicted 3 high-risk components in Auth Module</span>
              <span style={{ fontSize: '0.75rem', color: 'var(--muted)' }}>2 min ago</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: 8, borderRadius: 8, background: 'rgba(0,255,133,0.05)', border: '1px solid rgba(0,255,133,0.1)' }}>
              <span>✨</span>
              <span style={{ flex: 1, fontSize: '0.87rem' }}>Generated 12 new test cases from user flows</span>
              <span style={{ fontSize: '0.75rem', color: 'var(--muted)' }}>5 min ago</span>
            </div>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <div className="card-title">🗺️ Sprint 4 Progress <span style={{ color: "var(--muted)", fontWeight: 400, fontSize: "0.85rem" }}>{new Date().toLocaleDateString("en-US", { month: "short", day: "numeric" })} — Active Sprint</span></div>
        </div>
        <div className="card-body">
          <div className="sprint-info">
            <div className="sprint-stat"><div className="sprint-stat-val" style={{ color: "var(--green)" }}>12</div><div className="sprint-stat-lbl">Done</div></div>
            <div className="sprint-stat"><div className="sprint-stat-val" style={{ color: "var(--blue)" }}>5</div><div className="sprint-stat-lbl">In Progress</div></div>
            <div className="sprint-stat"><div className="sprint-stat-val" style={{ color: "var(--pink)" }}>3</div><div className="sprint-stat-lbl">Blocked</div></div>
            <div className="sprint-stat"><div className="sprint-stat-val" style={{ color: "var(--muted)" }}>4</div><div className="sprint-stat-lbl">To Do</div></div>
          </div>
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: "50%" }}></div>
          </div>
          <div className="progress-labels"><span>0</span><span style={{ color: "var(--green)", fontWeight: 600 }}>50% complete · Day 10</span><span>24 stories</span></div>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <div className="card-title">🐛 Open Bugs</div>
        </div>
        <div className="card-body">
          <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
            {["all","critical","sprint","mine"].map(f => (
              <button key={f} className={`tab${bugFilter === f ? " active" : ""}`} onClick={() => setBugFilter(f)}>
                {f === "all" ? "All" : f === "critical" ? "Critical" : f === "sprint" ? "Sprint 4" : "My Bugs"}
              </button>
            ))}
          </div>
          <table>
            <thead
              onClick={() => { showToast("Opening bugs details…"); setPage("allbugs"); }}
              style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "1.2rem 1.5rem", borderBottom: "1px solid var(--border)", cursor: "pointer" }}
              role="button"
              tabIndex={0}
            >
              <tr style={{ width: "100%", display: "grid", gridTemplateColumns: "1.2fr 3fr 1fr 1fr 1fr", gap: 12 }}>
                <th style={{ textAlign: "left" }}>ID</th>
                <th style={{ textAlign: "left" }}>Title</th>
                <th style={{ textAlign: "left" }}>Priority</th>
                <th style={{ textAlign: "left" }}>Status</th>
                <th style={{ textAlign: "left" }}>Assignee</th>
              </tr>
            </thead>
            <tbody>
              {filteredBugs.slice(0, 5).map(bug => (
                <tr key={bug.id} style={{ cursor: "pointer" }} onClick={() => setPage("allbugs")}>
                  <td className="bug-id">{bug.id}</td>
                  <td className="bug-title">{bug.title}</td>
                  <td><Badge variant={bug.priority === "blocker" ? "destructive" : "secondary"}>{bug.priority}</Badge></td>
                  <td><Badge variant={bug.status === "fixed" || bug.status === "passed" ? "success" : bug.status === "open" ? "destructive" : "outline"}>{bug.status}</Badge></td>
                  <td style={{ fontSize: ".75rem", color: "var(--muted)" }}>{bug.assignee || "—"}</td>
                </tr>
              ))}
              {filteredBugs.length === 0 && <tr><td colSpan={5} style={{ textAlign: "center", color: "var(--muted)", padding: "1.5rem" }}>No bugs match this filter</td></tr>}
            </tbody>
          </table>
        </div>
      </div>

      <div className="grid2">
        <div className="card">
          <div className="card-header">
            <div className="card-title">🧪 Recent Test Runs</div>
          </div>
          <div className="card-body">
            <table>
              <thead
                onClick={() => { showToast("Opening test runs…"); setPage && setPage("runs"); }}
                style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "1.2rem 1.5rem", borderBottom: "1px solid var(--border)", cursor: "pointer" }}
                role="button"
                tabIndex={0}
              >
                <tr style={{ width: "100%", display: "grid", gridTemplateColumns: "2fr 1fr 1fr", gap: 12 }}>
                  <th style={{ textAlign: "left" }}>Test</th>
                  <th style={{ textAlign: "left" }}>Status</th>
                  <th style={{ textAlign: "left" }}>Last Run</th>
                </tr>
              </thead>
              <tbody>
                {tests.slice(0, 4).map((t, i) => (
                  <tr key={i}><td>{t.name}</td><td><Badge variant={t.status === "passed" ? "success" : "destructive"}>{t.status}</Badge></td><td style={{ fontSize: ".7rem", color: "var(--muted)" }}>{t.last}</td></tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div className="card">
          <div className="card-header">
            <div className="card-title">📊 Resolution Rate</div>
          </div>
          <div className="card-body">
            <div style={{ fontSize: "2rem", fontWeight: 700, color: "var(--green)" }}>{resolutionRate}%</div>
            <div className="resolution-bar"><div className="resolution-fill" style={{ width: `${resolutionRate}%` }}></div></div>
            <div className="resolution-labels"><span>{resolvedBugs} resolved</span><span>{bugs.length} total bugs</span></div>
          </div>
        </div>
      </div>
    </>
  );
}

function DetailPage({ detailId, backFromDetail, bugs = [], tests = [] }) {
  if (!detailId) return null;
  
  const passRate = tests.length ? Math.round((tests.filter(t => t.status === "passed").length / tests.length) * 100) : 0;
  const openBugs = bugs.filter(b => b.status === "open").length;
  const blockers = bugs.filter(b => b.priority === "blocker").length;
  
  const detailConfigs = {
    'db-open-bugs': {
      title: 'Open Bugs',
      icon: '🐛',
      color: 'pink',
      value: openBugs,
      subtitle: `${blockers} blockers need attention`,
      stats: [
        { label: 'Blockers', value: blockers, color: 'var(--pink)' },
        { label: 'Major', value: bugs.filter(b => b.priority === "major").length, color: '#ffa500' },
        { label: 'Minor', value: bugs.filter(b => b.priority === "minor").length, color: 'var(--blue)' },
      ]
    },
    'db-total-tests': {
      title: 'Total Tests',
      icon: '🧪',
      color: 'blue',
      value: tests.length,
      subtitle: 'Web, Mobile & API',
      stats: [
        { label: 'Web', value: tests.filter(t => t.type === 'Web').length, color: 'var(--blue)' },
        { label: 'Mobile', value: tests.filter(t => t.type === 'Mobile').length, color: 'var(--purple)' },
        { label: 'API', value: tests.filter(t => t.type === 'API').length, color: 'var(--green)' },
      ]
    },
    'db-pass-rate': {
      title: 'Pass Rate',
      icon: '✅',
      color: 'green',
      value: passRate + '%',
      subtitle: `${tests.filter(t => t.status === "passed").length} of ${tests.length} passing`,
      stats: [
        { label: 'Passed', value: tests.filter(t => t.status === "passed").length, color: 'var(--green)' },
        { label: 'Failed', value: tests.filter(t => t.status === "failed").length, color: 'var(--pink)' },
        { label: 'Flaky', value: 2, color: 'var(--yellow)' },
      ]
    },
    'db-quality': {
      title: 'Quality Score',
      icon: '🏆',
      color: 'purple',
      value: Math.round((passRate * 0.6) + (bugs.length ? (bugs.filter(b => b.status === "fixed").length / bugs.length) * 40 : 0)),
      subtitle: 'Pass rate + bug resolution',
      stats: [
        { label: 'Pass Rate (60%)', value: passRate + '%', color: 'var(--green)' },
        { label: 'Resolution (40%)', value: bugs.length ? Math.round((bugs.filter(b => b.status === "fixed").length / bugs.length) * 100) + '%' : '0%', color: 'var(--blue)' },
        { label: 'Final', value: Math.round((passRate * 0.6) + (bugs.length ? (bugs.filter(b => b.status === "fixed").length / bugs.length) * 40 : 0)), color: 'var(--purple)' },
      ]
    }
  };
  
  const config = detailConfigs[detailId];
  if (!config) return null;
  
  return (
    <div className="detail-page active">
      <div className="detail-breadcrumb">
        <button className="detail-back-btn" onClick={backFromDetail}>← Back</button>
        <span className="breadcrumb-sep">/</span>
        <span style={{color:'var(--muted)', fontSize:'.75rem'}}>Dashboard</span>
        <span className="breadcrumb-sep">/</span>
        <span className="breadcrumb-current">{config.title}</span>
      </div>
      
      <div className={`detail-banner ${config.color}`}>
        <div className="detail-banner-left">
          <div className="detail-banner-icon">{config.icon}</div>
          <div>
            <div className="detail-banner-title">{config.title} — {config.value}</div>
            <div className="detail-banner-sub">{config.subtitle}</div>
          </div>
        </div>
      </div>
      
      <div className="detail-stat-row">
        {config.stats.map((stat, i) => (
          <div key={i} className="detail-mini">
            <div className="detail-mini-label">{stat.label}</div>
            <div className="detail-mini-value" style={{color: stat.color}}>{stat.value}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function BugsPage({ showToast, setShowNewBug, setPage, bugs = [], setBugs, openStatDetail, backFromDetail, detailPage, onCreateTest, features, automationRules }) {
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [selectedBug, setSelectedBug] = useState(null);
  const [detailOpen, setDetailOpen] = useState(false);

  const filteredBugs = bugs.filter(b => {
    const matchFilter = filter === "all" || b.priority === filter || (filter === "progress" && (b.status === "Active" || b.status === "progress"));
    const matchSearch = !search || b.title.toLowerCase().includes(search.toLowerCase()) || b.id.toLowerCase().includes(search.toLowerCase());
    return matchFilter && matchSearch;
  });

  const handleBugClick = (bug) => {
    setSelectedBug(bug);
    setDetailOpen(true);
  };

  const handleUpdateBug = (updatedBug) => {
    setBugs(prev => prev.map(b => b.id === updatedBug.id ? updatedBug : b));
    showToast(`✅ Bug ${updatedBug.id} updated`);
  };

  return (
    <>
      <div style={{ padding: "0 0 12px" }}>
        <input className="dashboard-search" placeholder="Search across bugs, tests, runs…" onChange={(e) => showToast(`Searching "${e.target.value}"`)} />
      </div>
      <div className="stats-row">
        <Card className="stat-card red">
          <CardHeader className="p-4">
            <CardTitle className="stat-label text-sm">Open Bugs</CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="stat-value text-3xl font-bold">{bugs.filter(b => b.status !== "Closed" && b.status !== "fixed").length}</div>
            <div className="stat-sub text-sm">{bugs.filter(b => b.priority === "blocker").length} critical</div>
          </CardContent>
        </Card>
        <Card className="stat-card yellow">
          <CardHeader className="p-4">
            <CardTitle className="stat-label text-sm">In Progress</CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="stat-value text-3xl font-bold">{bugs.filter(b => b.status === "Active" || b.status === "progress").length}</div>
            <div className="stat-sub text-sm">Being fixed</div>
          </CardContent>
        </Card>
        <Card className="stat-card blue">
          <CardHeader className="p-4">
            <CardTitle className="stat-label text-sm">In Review</CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="stat-value text-3xl font-bold">{bugs.filter(b => b.status === "Resolved").length || 2}</div>
            <div className="stat-sub text-sm">Awaiting review</div>
          </CardContent>
        </Card>
        <Card className="stat-card green">
          <CardHeader className="p-4">
            <CardTitle className="stat-label text-sm">Closed</CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="stat-value text-3xl font-bold">{bugs.filter(b => b.status === "Closed" || b.status === "fixed").length}</div>
            <div className="stat-sub text-sm">This sprint</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex-row items-center justify-between">
          <CardTitle className="text-lg">🐛 All Bugs</CardTitle>
          <Button size="sm" onClick={() => setShowNewBug(true)}>+ New Bug</Button>
        </CardHeader>
        <CardContent>
          <div style={{ paddingBottom: "0.8rem" }}>
            <Input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search bugs by title or ID..."
              style={{ marginBottom: 10 }}
            />
            <div className="tabs">
              {[
                { key: "all", label: "All" },
                { key: "blocker", label: "Critical" },
                { key: "major", label: "Major" },
                { key: "minor", label: "Minor" },
                { key: "progress", label: "In Progress" },
              ].map(f => (
                <div key={f.key} className={`tab${filter === f.key ? " active" : ""}`} onClick={() => setFilter(f.key)}>{f.label}</div>
              ))}
            </div>
          </div>
          <table>
            <thead
              onClick={() => { showToast("Listing all bugs…"); }}
              style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "1.2rem 1.5rem", borderBottom: "1px solid var(--border)", cursor: "pointer" }}
              role="button"
              tabIndex={0}
            >
              <tr style={{ width: "100%", display: "grid", gridTemplateColumns: "1.2fr 3fr 1fr 1fr 1fr 1fr", gap: 12 }}>
                <th style={{ textAlign: "left" }}>ID</th>
                <th style={{ textAlign: "left" }}>Title</th>
                <th style={{ textAlign: "left" }}>Priority</th>
                <th style={{ textAlign: "left" }}>Severity</th>
                <th style={{ textAlign: "left" }}>Status</th>
                <th style={{ textAlign: "left" }}>Assignee</th>
              </tr>
            </thead>
            <tbody>
              {filteredBugs.map(bug => (
                <tr key={bug.id} style={{ cursor: "pointer" }} onClick={() => handleBugClick(bug)}>
                  <td className="bug-id">{bug.id}</td>
                  <td className="bug-title">{bug.title}</td>
                  <td><Badge variant={bug.priority === "blocker" ? "destructive" : "secondary"}>{bug.priority}</Badge></td>
                  <td>
                    <Badge style={{ 
                      background: bug.severity === "Critical" ? "rgba(255,0,85,0.2)" : 
                                 bug.severity === "High" ? "rgba(255,140,0,0.2)" : 
                                 bug.severity === "Medium" ? "rgba(255,200,0,0.2)" : 
                                 "rgba(0,255,133,0.2)",
                      color: bug.severity === "Critical" ? "#ff0055" : 
                             bug.severity === "High" ? "#ff8c00" : 
                             bug.severity === "Medium" ? "#ffc800" : 
                             "#00ff85",
                      border: "none"
                    }}>
                      {bug.severity || "Medium"}
                    </Badge>
                  </td>
                  <td><Badge variant={bug.status === "Closed" || bug.status === "Resolved" || bug.status === "fixed" ? "success" : bug.status === "New" || bug.status === "open" ? "destructive" : "outline"}>{bug.status}</Badge></td>
                  <td style={{ fontSize: ".75rem", color: "var(--muted)" }}>{bug.assignee || "—"}</td>
                </tr>
              ))}
              {filteredBugs.length === 0 && <tr><td colSpan={6} style={{ textAlign: "center", color: "var(--muted)", padding: "1.5rem" }}>No bugs match this filter</td></tr>}
            </tbody>
          </table>
        </CardContent>
      </Card>

      <BugDetailModal
        isOpen={detailOpen}
        onClose={() => setDetailOpen(false)}
        bug={selectedBug}
        onUpdateBug={handleUpdateBug}
        onCreateTest={onCreateTest}
        automationRules={automationRules}
        features={features}
        showToast={showToast}
      />
    </>
  );
}

function TestsPage({ showToast, setShowNewTest, setShowRunTests, setShowStartRecording, setPage, tests = [] }) {
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [detailOpen, setDetailOpen] = useState(false);
  const [selectedTest, setSelectedTest] = useState(null);

  const filteredTests = tests.filter(t => {
    const matchFilter = filter === "all" || (t.type || "").toLowerCase() === filter || (filter === "failed" && t.status === "failed");
    const matchSearch = !search || t.name.toLowerCase().includes(search.toLowerCase());
    return matchFilter && matchSearch;
  });

  const passRate = tests.length ? Math.round((tests.filter(t => t.status === "passed").length / tests.length) * 100) : 0;
  const failed = tests.filter(t => t.status === "failed").length;

  return (
    <>
      <div className="stats-row">
        <Card className="stat-card blue">
          <CardHeader className="p-4">
            <CardTitle className="stat-label text-sm">Total Tests</CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="stat-value text-3xl font-bold">{tests.length}</div>
            <div className="stat-sub text-sm">↑ 3 this sprint</div>
          </CardContent>
        </Card>
        <Card className="stat-card green">
          <CardHeader className="p-4">
            <CardTitle className="stat-label text-sm">Pass Rate</CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="stat-value text-3xl font-bold">{passRate}%</div>
            <div className="stat-sub text-sm">↑ 2% vs last</div>
          </CardContent>
        </Card>
        <Card className="stat-card red">
          <CardHeader className="p-4">
            <CardTitle className="stat-label text-sm">Failed</CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="stat-value text-3xl font-bold">{failed}</div>
            <div className="stat-sub text-sm">Needs attention</div>
          </CardContent>
        </Card>
        <Card className="stat-card yellow">
          <CardHeader className="p-4">
            <CardTitle className="stat-label text-sm">Coverage</CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="stat-value text-3xl font-bold">78%</div>
            <div className="stat-sub text-sm">Code coverage</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex-row items-center justify-between">
          <CardTitle className="text-lg">🧪 Test Cases</CardTitle>
          <div style={{ display: "flex", gap: 8 }}>
            <Button size="sm" variant="outline" onClick={() => setShowRunTests(true)}>▶️ Run All</Button>
            <Button size="sm" onClick={() => setShowNewTest(true)}>+ New Test</Button>
          </div>
        </CardHeader>
        <CardContent>
          <div style={{ paddingBottom: "0.8rem" }}>
            <Input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search tests..."
              style={{ marginBottom: 10 }}
            />
            <div className="tabs">
              {["all","web","mobile","api","failed"].map(f => (
                <div key={f} className={`tab${filter === f ? " active" : ""}`} onClick={() => setFilter(f)}>
                  {f.charAt(0).toUpperCase() + f.slice(1)}
                </div>
              ))}
            </div>
          </div>
          <table>
            <thead
              onClick={() => { showToast("Opening tests details…"); }}
              style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "1.2rem 1.5rem", borderBottom: "1px solid var(--border)", cursor: "pointer" }}
              role="button"
              tabIndex={0}
            >
              <tr style={{ width: "100%", display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr 0.8fr", gap: 12 }}>
                <th style={{ textAlign: "left" }}>Test</th>
                <th style={{ textAlign: "left" }}>Type</th>
                <th style={{ textAlign: "left" }}>Status</th>
                <th style={{ textAlign: "left" }}>Last Run</th>
                <th style={{ textAlign: "left" }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredTests.map((t, i) => (
                <tr key={i}>
                  <td
                    onClick={() => { setSelectedTest(t); setDetailOpen(true); }}
                    style={{ cursor: "pointer", textDecoration: "underline", textUnderlineOffset: 3 }}
                    title="Open test details"
                  >
                    {t.name}
                  </td>
                  <td><Badge variant="secondary">{t.type}</Badge></td>
                  <td><Badge variant={t.status === "passed" ? "success" : "destructive"}>{t.status}</Badge></td>
                  <td style={{ fontSize: ".7rem", color: "var(--muted)" }}>{t.last}</td>
                  <td>
                    <Button size="sm" variant="ghost" onClick={() => { showToast(`Running ${t.name}...`); }} style={{ background: "rgba(0,255,133,0.1)", border: "1px solid rgba(0,255,133,0.2)", color: "var(--green)", padding: "3px 10px", fontSize: ".7rem" }}>▶</Button>
                  </td>
                </tr>
              ))}
              {filteredTests.length === 0 && <tr><td colSpan={5} style={{ textAlign: "center", color: "var(--muted)", padding: "1.5rem" }}>No tests match this filter</td></tr>}
            </tbody>
          </table>
          <TestDetailModal
            isOpen={detailOpen}
            onClose={() => setDetailOpen(false)}
            test={selectedTest}
            onRun={(t) => showToast(`Running ${t?.name}...`)}
          />
        </CardContent>
      </Card>
    </>
  );
}

function AIPanelPage({ showToast, setShowNewBug, setShowNewTest, setShowGenerateTests, setShowRunTests, setShowSyncNow, setShowAddIntegration, setShowStartRecording, setShowInvite, setShowExport, setShowProfile, setShowNewUserStory, setPage }) {
  return (
    <div className="ai-layout">
      <AISidebar setPage={setPage} />
      <div className="main" style={{ padding: '1.5rem 2rem', overflowY: 'auto' }}>
        <div className="stats-row">
          <div className="stat-card purple">
            <div className="stat-label">AI Triaged</div>
            <div className="stat-value">12</div>
            <div className="stat-sub">This week</div>
          </div>
          <div className="stat-card blue">
            <div className="stat-label">Tests Generated</div>
            <div className="stat-value">8</div>
            <div className="stat-sub">By AI</div>
          </div>
          <div className="stat-card green">
            <div className="stat-label">Predictions</div>
            <div className="stat-value">3</div>
            <div className="stat-sub">Active</div>
          </div>
          <div className="stat-card yellow">
            <div className="stat-label">Confidence</div>
            <div className="stat-value">84%</div>
            <div className="stat-sub">↑ 2%</div>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginTop: '1.5rem' }}>
          <PredictiveAnalytics />
          <BugPredictions />
        </div>
        
        <div style={{ marginTop: '1.5rem' }}>
          <FlowDiscovery />
        </div>
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginTop: '1.5rem' }}>
          <AITestGeneration setShowGenerateTests={setShowGenerateTests} />
          <SentimentAnalysis />
        </div>
        
        <div style={{ marginTop: '1.5rem' }}>
          <AIAssistant />
        </div>
      </div>
    </div>
  );
}

function AutomationPage({ showToast, setShowNewBug, setShowNewTest, setShowGenerateTests, setShowRunTests, setShowSyncNow, setShowAddIntegration, setShowStartRecording, setShowInvite, setShowExport, setShowProfile, setShowNewUserStory, setPage }) {
  return (
    <>
      <div className="stats-row">
        <div className="stat-card purple">
          <div className="stat-label">Automation Scripts</div>
          <div className="stat-value">18</div>
          <div className="stat-sub">Active</div>
        </div>
        <div className="stat-card green">
          <div className="stat-label">Time Saved</div>
          <div className="stat-value">42h</div>
          <div className="stat-sub">This month</div>
        </div>
        <div className="stat-card blue">
          <div className="stat-label">Cloud Runs</div>
          <div className="stat-value">156</div>
          <div className="stat-sub">↑ 23%</div>
        </div>
        <div className="stat-card yellow">
          <div className="stat-label">Mobile Tests</div>
          <div className="stat-value">6</div>
          <div className="stat-sub">iOS + Android</div>
        </div>
      </div>

      <div className="grid2">
        <div className="card">
          <div className="card-header">
            <div className="card-title">🎥 Record New Test</div>
          </div>
          <div className="card-body" style={{ textAlign: "center", padding: "3rem" }}>
            <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>🎥</div>
            <div style={{ fontSize: ".9rem", fontWeight: 600, marginBottom: ".5rem" }}>Click to start recording</div>
            <div style={{ fontSize: ".75rem", color: "var(--muted)" }}>Record your browser actions as a test</div>
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <div className="card-title">☁️ Cloud Runner</div>
            <button className="btn btn-primary btn-sm" onClick={() => setShowRunTests && setShowRunTests(true)}>▶️ Run All</button>
          </div>
          <div className="card-body">
            {[
              { name: "Windows VM - Chrome", used: 7, total: 10 },
              { name: "Mac VM - Safari", used: 3, total: 5 },
              { name: "Android Emulator", used: 2, total: 7 },
            ].map((r, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 0", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                <div style={{ flex: 1, fontSize: ".8rem" }}>{r.name}</div>
                <div style={{ fontSize: ".7rem", color: "var(--muted)" }}>{r.used}/{r.total}</div>
                <div style={{ width: 80 }}><div className="progress-bar"><div className="progress-fill" style={{ width: (r.used/r.total*100) + "%", background: r.used/r.total > 0.7 ? "var(--pink)" : "var(--green)" }}></div></div></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

function ClickUpPage({ showToast, setShowSyncNow, setShowAddIntegration }) {
  const [syncLog, setSyncLog] = useState([
    { action: "Task BUG-234 linked to ClickUp task", time: "5 min ago", status: "success" },
    { action: "Status updated for US-02 Checkout", time: "15 min ago", status: "success" },
    { action: "New bug BUG-235 synced", time: "30 min ago", status: "success" },
    { action: "Comment added to BUG-229", time: "1 hr ago", status: "success" },
  ]);
  const [syncing, setSyncing] = useState(false);

  const handleSync = () => {
    setSyncing(true);
    setTimeout(() => {
      const now = new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
      setSyncLog(prev => [{ action: `Manual sync completed at ${now}`, time: "just now", status: "success" }, ...prev]);
      setSyncing(false);
      showToast("✅ ClickUp sync complete!");
    }, 1200);
  };

  return (
    <>
      <div className="stats-row">
        <div className="stat-card blue">
          <div className="stat-label">Synced Tasks</div>
          <div className="stat-value">24</div>
          <div className="stat-sub">With ClickUp</div>
        </div>
        <div className="stat-card green">
          <div className="stat-label">Completed</div>
          <div className="stat-value">18</div>
          <div className="stat-sub">This sprint</div>
        </div>
        <div className="stat-card yellow">
          <div className="stat-label">In Progress</div>
          <div className="stat-value">4</div>
          <div className="stat-sub">Syncing</div>
        </div>
        <div className="stat-card red">
          <div className="stat-label">Conflicts</div>
          <div className="stat-value">0</div>
          <div className="stat-sub">All synced</div>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <div className="card-title">🔗 ClickUp Integration</div>
          <div style={{ display: "flex", gap: 8 }}>
            <button className="btn btn-sm" style={{ background: "var(--glass)", border: "1px solid var(--border)" }} onClick={() => setShowSyncNow(true)}>⚙️ Sync Options</button>
            <button className="btn btn-primary btn-sm" disabled={syncing} onClick={handleSync} style={{ opacity: syncing ? 0.7 : 1 }}>
              {syncing ? "Syncing..." : "🔄 Sync Now"}
            </button>
          </div>
        </div>
        <table>
          <thead
            onClick={() => { showToast("Opening sync activity…"); }}
            style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "1.2rem 1.5rem", borderBottom: "1px solid var(--border)", cursor: "pointer" }}
            role="button"
            tabIndex={0}
          >
            <tr style={{ width: "100%", display: "grid", gridTemplateColumns: "2fr 1fr 1fr", gap: 12 }}>
              <th style={{ textAlign: "left" }}>Action</th>
              <th style={{ textAlign: "left" }}>Time</th>
              <th style={{ textAlign: "left" }}>Status</th>
            </tr>
          </thead>
          <tbody>
            {syncLog.map((s, i) => (
              <tr key={i}>
                <td style={{ fontSize: ".8rem" }}>{s.action}</td>
                <td style={{ fontSize: ".7rem", color: "var(--muted)" }}>{s.time}</td>
                <td><span className="badge badge-passed">{s.status}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

function SettingsPage({ showToast, setShowAddIntegration, setShowInvite, bugWorkflow, setBugWorkflow, kanbanColumns, setKanbanColumns, automationRules, setAutomationRules }) {
  const [settings, setSettings] = useState({
    projectName: "TestFlow QA",
    timezone: "UTC (GMT+0)",
    dateFormat: "MM/DD/YYYY",
    language: "English",
  });
  const [saved, setSaved] = useState(false);
  const [workflowTab, setWorkflowTab] = useState("general");
  const [newColumn, setNewColumn] = useState({ id: "", label: "" });

  const handleSave = () => {
    setSaved(true);
    showToast("✅ Settings saved!");
    setTimeout(() => setSaved(false), 2000);
  };

  const handleWorkflowChange = (field, value) => {
    setBugWorkflow(prev => ({ ...prev, [field]: value }));
  };

  const handleAddColumn = () => {
    if (!newColumn.label.trim()) return;
    const id = newColumn.label.toLowerCase().replace(/\s+/g, '');
    setKanbanColumns([...kanbanColumns, { id, label: newColumn.label }]);
    setNewColumn({ id: "", label: "" });
  };

  const handleDeleteColumn = (id) => {
    setKanbanColumns(kanbanColumns.filter(c => c.id !== id));
  };

  const [integrations, setIntegrations] = useState([
    { name: "ClickUp", status: "Connected", icon: "⚡" },
    { name: "GitHub", status: "Connected", icon: "🐙" },
    { name: "Slack", status: "Connected", icon: "💬" },
    { name: "Jira", status: "Not connected", icon: "📋" },
  ]);

  return (
    <>
      <div className="stats-row">
        <div className="stat-card purple">
          <div className="stat-label">Team Members</div>
          <div className="stat-value">5</div>
          <div className="stat-sub">Active</div>
        </div>
        <div className="stat-card green">
          <div className="stat-label">Integrations</div>
          <div className="stat-value">{integrations.filter(i => i.status === "Connected").length}</div>
          <div className="stat-sub">Connected</div>
        </div>
        <div className="stat-card blue">
          <div className="stat-label">Notifications</div>
          <div className="stat-value">12</div>
          <div className="stat-sub">Rules active</div>
        </div>
        <div className="stat-card yellow">
          <div className="stat-label">Schedules</div>
          <div className="stat-value">3</div>
          <div className="stat-sub">Auto-runs</div>
        </div>
      </div>

      <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
        <button className={`tab ${workflowTab === "general" ? "active" : ""}`} onClick={() => setWorkflowTab("general")}>General</button>
        <button className={`tab ${workflowTab === "workflow" ? "active" : ""}`} onClick={() => setWorkflowTab("workflow")}>Bug Workflow</button>
        <button className={`tab ${workflowTab === "kanban" ? "active" : ""}`} onClick={() => setWorkflowTab("kanban")}>Kanban Columns</button>
        <button className={`tab ${workflowTab === "automation" ? "active" : ""}`} onClick={() => setWorkflowTab("automation")}>Automation</button>
      </div>

      {workflowTab === "general" && (
        <div className="grid2">
          <div className="card">
            <div className="card-header">
              <div className="card-title">⚙️ General Settings</div>
              <button className="btn btn-primary btn-sm" onClick={handleSave} style={{ background: saved ? "rgba(0,255,133,0.2)" : undefined, borderColor: saved ? "var(--green)" : undefined, color: saved ? "var(--green)" : undefined }}>
                {saved ? "✓ Saved" : "💾 Save"}
              </button>
            </div>
            <div className="card-body" style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {[
                { key: "projectName", label: "Project Name" },
                { key: "timezone", label: "Timezone" },
                { key: "dateFormat", label: "Date Format" },
                { key: "language", label: "Language" },
              ].map(s => (
                <div key={s.key}>
                  <div style={{ fontSize: ".72rem", color: "var(--muted)", marginBottom: 4, fontWeight: 600, textTransform: "uppercase" }}>{s.label}</div>
                  <input
                    value={settings[s.key]}
                    onChange={e => setSettings({...settings, [s.key]: e.target.value})}
                    style={{ width: "100%", padding: "8px 12px", background: "rgba(255,255,255,0.06)", border: "1px solid var(--border)", borderRadius: 8, color: "var(--text)", fontSize: ".85rem", outline: "none" }}
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="card">
            <div className="card-header">
              <div className="card-title">🔌 Integrations</div>
              <div style={{ display: "flex", gap: 8 }}>
                <button className="btn btn-sm" style={{ background: "var(--glass)", border: "1px solid var(--border)" }} onClick={() => setShowInvite(true)}>✉️ Invite</button>
                <button className="btn btn-sm" style={{ background: "var(--glass)", border: "1px solid var(--border)" }} onClick={() => setShowAddIntegration(true)}>+ Add</button>
              </div>
            </div>
            <div className="card-body">
              {integrations.map((int, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 0", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                  <div style={{ fontSize: "1.2rem" }}>{int.icon}</div>
                  <div style={{ flex: 1, fontSize: ".8rem", fontWeight: 600 }}>{int.name}</div>
                  <div style={{ fontSize: ".65rem", padding: "2px 8px", borderRadius: 4, background: int.status === "Connected" ? "rgba(0,255,133,0.1)" : "rgba(255,255,255,0.06)", color: int.status === "Connected" ? "var(--green)" : "var(--muted)" }}>{int.status}</div>
                  {int.status !== "Connected" && (
                    <button onClick={() => { setIntegrations(prev => prev.map(ii => ii.name === int.name ? {...ii, status: "Connected"} : ii)); showToast(`✅ ${int.name} connected!`); }} className="btn btn-sm" style={{ background: "rgba(30,144,255,0.1)", border: "1px solid rgba(30,144,255,0.3)", color: "var(--blue)", padding: "3px 10px", fontSize: ".7rem" }}>Connect</button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {workflowTab === "workflow" && (
        <div className="card">
          <div className="card-header">
            <div className="card-title">🐛 Bug Workflow Customization</div>
            <button className="btn btn-primary btn-sm" onClick={handleSave}>Save Workflow</button>
          </div>
          <div className="card-body" style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div>
              <div style={{ fontSize: ".72rem", color: "var(--muted)", marginBottom: 4, fontWeight: 600, textTransform: "uppercase" }}>Statuses (comma separated)</div>
              <input
                value={bugWorkflow?.statuses?.join(", ") || "New, Active, Resolved, Closed"}
                onChange={(e) => handleWorkflowChange("statuses", e.target.value.split(",").map(s => s.trim()))}
                style={{ width: "100%", padding: "8px 12px", background: "rgba(255,255,255,0.06)", border: "1px solid var(--border)", borderRadius: 8, color: "var(--text)", fontSize: ".85rem", outline: "none" }}
              />
            </div>
            <div>
              <div style={{ fontSize: ".72rem", color: "var(--muted)", marginBottom: 4, fontWeight: 600, textTransform: "uppercase" }}>Transitions (from: to1,to2)</div>
              <textarea
                value={Object.entries(bugWorkflow?.transitions || {}).map(([from, to]) => `${from}: ${to.join(",")}`).join("\n")}
                onChange={(e) => {
                  const lines = e.target.value.split("\n").filter(l => l.trim());
                  const transitions = {};
                  lines.forEach(line => {
                    const [from, toStr] = line.split(":").map(s => s.trim());
                    if (from && toStr) transitions[from] = toStr.split(",").map(s => s.trim());
                  });
                  handleWorkflowChange("transitions", transitions);
                }}
                rows={5}
                style={{ width: "100%", padding: "8px 12px", background: "rgba(255,255,255,0.06)", border: "1px solid var(--border)", borderRadius: 8, color: "var(--text)", fontSize: ".85rem", outline: "none", fontFamily: "monospace" }}
              />
            </div>
          </div>
        </div>
      )}

      {workflowTab === "kanban" && (
        <div className="card">
          <div className="card-header">
            <div className="card-title">📋 Kanban Columns</div>
            <button className="btn btn-primary btn-sm" onClick={handleSave}>Save Columns</button>
          </div>
          <div className="card-body">
            {kanbanColumns.map(col => (
              <div key={col.id} style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 0", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                <input value={col.label} onChange={(e) => {
                  const updated = kanbanColumns.map(c => c.id === col.id ? {...c, label: e.target.value} : c);
                  setKanbanColumns(updated);
                }} style={{ flex: 1, padding: "6px 8px", background: "rgba(255,255,255,0.06)", border: "1px solid var(--border)", borderRadius: 4, color: "var(--text)" }} />
                <button onClick={() => handleDeleteColumn(col.id)} style={{ background: "none", border: "none", color: "var(--pink)", cursor: "pointer" }}>🗑️</button>
              </div>
            ))}
            <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
              <input
                value={newColumn.label}
                onChange={(e) => setNewColumn({...newColumn, label: e.target.value})}
                placeholder="New column name"
                style={{ flex: 1, padding: "8px 12px", background: "rgba(255,255,255,0.06)", border: "1px solid var(--border)", borderRadius: 6, color: "var(--text)" }}
              />
              <button className="btn btn-primary btn-sm" onClick={handleAddColumn}>Add Column</button>
            </div>
          </div>
        </div>
      )}

      {workflowTab === "automation" && (
        <div className="card">
          <div className="card-header">
            <div className="card-title">⚙️ Automation Rules</div>
            <button className="btn btn-primary btn-sm" onClick={handleSave}>Save Rules</button>
          </div>
          <div className="card-body" style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <label style={{ display: "flex", alignItems: "flex-start", gap: 12, padding: 12, background: "rgba(255,255,255,0.02)", borderRadius: 8 }}>
              <input type="checkbox" checked={automationRules?.reassignOnResolve || false} onChange={(e) => setAutomationRules(prev => ({ ...prev, reassignOnResolve: e.target.checked }))} style={{ marginTop: 4 }} />
              <div>
                <div style={{ fontWeight: 600 }}>🔄 Reassign to creator when resolved</div>
                <div style={{ fontSize: ".7rem", color: "var(--muted)" }}>When a bug moves to Resolved, automatically assign it back to the person who opened it.</div>
              </div>
            </label>
            
            <label style={{ display: "flex", alignItems: "flex-start", gap: 12, padding: 12, background: "rgba(255,255,255,0.02)", borderRadius: 8 }}>
              <input type="checkbox" checked={automationRules?.autoCloseOnPRMerge || false} onChange={(e) => setAutomationRules(prev => ({ ...prev, autoCloseOnPRMerge: e.target.checked }))} style={{ marginTop: 4 }} />
              <div>
                <div style={{ fontWeight: 600 }}>🔀 Auto-close when PR is merged</div>
                <div style={{ fontSize: ".7rem", color: "var(--muted)" }}>Automatically close bugs when a linked PR with "auto-close" is merged.</div>
              </div>
            </label>
            
            <label style={{ display: "flex", alignItems: "flex-start", gap: 12, padding: 12, background: "rgba(255,255,255,0.02)", borderRadius: 8 }}>
              <input type="checkbox" checked={automationRules?.notifyOnStatusChange || false} onChange={(e) => setAutomationRules(prev => ({ ...prev, notifyOnStatusChange: e.target.checked }))} style={{ marginTop: 4 }} />
              <div>
                <div style={{ fontWeight: 600 }}>📧 Notify on status change</div>
                <div style={{ fontSize: ".7rem", color: "var(--muted)" }}>Send email notification to assignee when bug status changes.</div>
              </div>
            </label>
            
            <label style={{ display: "flex", alignItems: "flex-start", gap: 12, padding: 12, background: "rgba(255,255,255,0.02)", borderRadius: 8 }}>
              <input type="checkbox" checked={automationRules?.moveToActiveOnAssign || false} onChange={(e) => setAutomationRules(prev => ({ ...prev, moveToActiveOnAssign: e.target.checked }))} style={{ marginTop: 4 }} />
              <div>
                <div style={{ fontWeight: 600 }}>🎯 Move to Active when assigned</div>
                <div style={{ fontSize: ".7rem", color: "var(--muted)" }}>Automatically change status from "New" to "Active" when a bug is assigned to someone.</div>
              </div>
            </label>

            <div style={{ marginTop: 8, padding: 12, background: "rgba(157,78,221,0.1)", borderRadius: 8, border: "1px solid rgba(157,78,221,0.2)" }}>
              <div style={{ fontSize: ".8rem", fontWeight: 600, color: "var(--purple)" }}>💡 Active Rules Summary</div>
              <div style={{ fontSize: ".7rem", color: "var(--muted)", marginTop: 6 }}>
                {Object.entries(automationRules || {}).filter(([,v]) => v).length} rule(s) currently active
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

const PAGE_TITLES = {
  home: "Home", dashboard: "Dashboard", activity: "Activity", sprint: "Sprint Board",
  bugs: "Bugs", allbugs: "All Bugs", kanban: "Kanban Board", stories: "User Stories", duplicates: "Duplicates",
  tests: "Tests", alltests: "All Tests", record: "Record Test", runs: "Test Runs", mobile: "Mobile Tests", api: "API Tests", elements: "Element Repo", cloud: "Cloud Runner",
  ai: "AI Panel", aitriage: "AI Triage", flows: "Flow Discovery", predictions: "Predictions", generate: "Generate Tests",
  automation: "Automation",
  clickup: "ClickUp",
  settings: "Settings", reports: "Reports",
};

function ActivityPage({ showToast, setShowNewBug, setShowNewTest, setShowGenerateTests, setShowRunTests, setShowSyncNow, setShowAddIntegration, setShowStartRecording, setShowInvite, setShowExport, setShowProfile, setShowNewUserStory, setPage, tests = [] }) {
  const [detailOpen, setDetailOpen] = useState(false);
  const [selectedTest, setSelectedTest] = useState(null);
  const openTestDetailByName = (name) => {
    const t = tests.find(x => (x.name || "").toLowerCase().includes((name || "").toLowerCase()));
    if (t) { setSelectedTest(t); setDetailOpen(true); }
    else { showToast("No matching test found"); }
  };
  return (
    <>
      <div className="stats-row">
        <div className="stat-card green">
          <div className="stat-label">Events Today</div>
          <div className="stat-value">24</div>
          <div className="stat-sub">+5 from yesterday</div>
        </div>
        <div className="stat-card blue">
          <div className="stat-label">Test Runs</div>
          <div className="stat-value">12</div>
          <div className="stat-sub">Completed</div>
        </div>
        <div className="stat-card yellow">
          <div className="stat-label">Bugs Created</div>
          <div className="stat-value">3</div>
          <div className="stat-sub">Auto-detected</div>
        </div>
        <div className="stat-card purple">
          <div className="stat-label">AI Actions</div>
          <div className="stat-value">8</div>
          <div className="stat-sub">This week</div>
        </div>
      </div>
      <div className="card">
        <div className="card-header"><div className="card-title">⚡ Live Activity</div></div>
        <table>
          <thead
            onClick={() => { showToast("Opening activity details…"); }}
            style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "1.2rem 1.5rem", borderBottom: "1px solid var(--border)", cursor: "pointer" }}
            role="button"
            tabIndex={0}
          >
            <tr style={{ width: "100%", display: "grid", gridTemplateColumns: "1fr 3fr 1fr", gap: 12 }}>
              <th style={{ textAlign: "left" }}>Time</th>
              <th style={{ textAlign: "left" }}>Action</th>
              <th style={{ textAlign: "left" }}>User</th>
            </tr>
          </thead>
          <tbody>
            {[
              { time: "2 min ago", action: "Login Flow self-healed + passed", user: "AI" },
              { time: "15 min ago", action: "Bug BUG-234 auto-created by AI", user: "AI" },
              { time: "1 hr ago", action: "BUG-226 closed in ClickUp", user: "System" },
              { time: "2 hr ago", action: "AI generated 3 tests from flows", user: "AI" },
              { time: "3 hr ago", action: "Parallel run: 10 tests in 43s", user: "Cloud" },
              { time: "4 hr ago", action: "iOS test suite failed — 2 bugs created", user: "System" },
            ].map((a, i) => (
              <tr key={i}>
                <td style={{ fontSize: ".75rem", color: "var(--muted)" }}>{a.time}</td>
                <td
                  onClick={() => openTestDetailByName(a.action.split(' ')[0])}
                  style={{ cursor: "pointer", textDecoration: "underline dotted", textUnderlineOffset: 3 }}
                  title="View related test"
                >
                  {a.action}
                </td>
                <td><span className="badge badge-minor">{a.user}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <TestDetailModal
        isOpen={detailOpen}
        onClose={() => setDetailOpen(false)}
        test={selectedTest}
        onRun={(t) => showToast(`Running ${t?.name}...`)}
      />
    </>
  );
}

function SprintPage({ showToast, setShowNewBug, setShowNewTest, setShowGenerateTests, setShowRunTests, setShowSyncNow, setShowAddIntegration, setShowStartRecording, setShowInvite, setShowExport, setShowProfile, setShowNewUserStory, setPage }) {
  return (
    <>
      <div className="stats-row">
        <div className="stat-card green">
          <div className="stat-label">Sprint</div>
          <div className="stat-value">4</div>
          <div className="stat-sub">Current</div>
        </div>
        <div className="stat-card blue">
          <div className="stat-label">Days Left</div>
          <div className="stat-value">4</div>
          <div className="stat-sub">Of 14</div>
        </div>
        <div className="stat-card yellow">
          <div className="stat-label">Stories</div>
          <div className="stat-value">24</div>
          <div className="stat-sub">Total</div>
        </div>
        <div className="stat-card purple">
          <div className="stat-label">Completion</div>
          <div className="stat-value">50%</div>
          <div className="stat-sub">On track</div>
        </div>
      </div>
      <div className="card">
        <div className="card-header"><div className="card-title">🗺️ Sprint 4 Board</div></div>
        <div className="card-body">
          <div className="sprint-info">
            <div className="sprint-stat"><div className="sprint-stat-val" style={{ color: "var(--green)" }}>12</div><div className="sprint-stat-lbl">Done</div></div>
            <div className="sprint-stat"><div className="sprint-stat-val" style={{ color: "var(--blue)" }}>5</div><div className="sprint-stat-lbl">In Progress</div></div>
            <div className="sprint-stat"><div className="sprint-stat-val" style={{ color: "var(--pink)" }}>3</div><div className="sprint-stat-lbl">Blocked</div></div>
            <div className="sprint-stat"><div className="sprint-stat-val" style={{ color: "var(--muted)" }}>4</div><div className="sprint-stat-lbl">To Do</div></div>
          </div>
          <div className="progress-bar"><div className="progress-fill" style={{ width: "50%" }}></div></div>
          <div className="progress-labels"><span>0</span><span style={{ color: "var(--green)", fontWeight: 600 }}>50% complete</span><span>24</span></div>
        </div>
      </div>
    </>
  );
}

function AllTestsPage({ showToast, setShowNewTest, setShowRunTests, setPage, tests = [] }) {
  return <TestsPage showToast={showToast} setShowNewTest={setShowNewTest} setShowRunTests={setShowRunTests} setPage={setPage} tests={tests} />;
}

function RecordTestPage({ showToast, setShowStartRecording }) {
  const [recording, setRecording] = useState(false);
  const [steps, setSteps] = useState([]);
  const [testName, setTestName] = useState("");

  const handleStart = () => {
    if (!testName.trim()) { showToast("⚠️ Please enter a test name first"); return; }
    setRecording(true);
    setSteps(["Page loaded: /dashboard"]);
  };

  const handleStop = () => {
    setRecording(false);
    showToast(`✅ Test "${testName}" saved with ${steps.length} steps`);
    setTestName("");
    setSteps([]);
  };

  return (
    <>
      <div className="stats-row">
        <div className="stat-card purple">
          <div className="stat-label">Recorded Tests</div>
          <div className="stat-value">6</div>
          <div className="stat-sub">This month</div>
        </div>
        <div className="stat-card blue">
          <div className="stat-label">Steps Recorded</div>
          <div className="stat-value">48</div>
          <div className="stat-sub">Total steps</div>
        </div>
        <div className="stat-card green">
          <div className="stat-label">Time Saved</div>
          <div className="stat-value">12h</div>
          <div className="stat-sub">Automation time</div>
        </div>
      </div>
      <div className="card">
        <div className="card-header">
          <div className="card-title">🎥 Record New Test</div>
          {recording && (
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{ width: 8, height: 8, borderRadius: "50%", background: "var(--pink)", animation: "pulse 1s infinite" }} />
              <span style={{ color: "var(--pink)", fontSize: ".8rem", fontWeight: 600 }}>RECORDING</span>
            </div>
          )}
        </div>
        <div className="card-body">
          {!recording ? (
            <div style={{ display: "flex", flexDirection: "column", gap: 16, maxWidth: 420 }}>
              <div>
                <div style={{ fontSize: ".75rem", color: "var(--muted)", marginBottom: 6, fontWeight: 600, textTransform: "uppercase" }}>Test Name</div>
                <input
                  value={testName}
                  onChange={e => setTestName(e.target.value)}
                  placeholder="e.g., Login Flow Test"
                  style={{ width: "100%", padding: "10px 12px", background: "rgba(255,255,255,0.06)", border: "1px solid var(--border)", borderRadius: 8, color: "var(--text)", fontSize: ".9rem", outline: "none" }}
                />
              </div>
              <div style={{ fontSize: ".75rem", color: "var(--muted)", background: "rgba(255,255,255,0.04)", padding: 12, borderRadius: 8 }}>
                <div style={{ fontWeight: 600, marginBottom: 6 }}>Recording will capture:</div>
                <div>✓ Page navigation</div>
                <div>✓ Clicks and form inputs</div>
                <div>✓ Assertions on elements</div>
                <div>✓ Waits for dynamic content</div>
              </div>
              <button className="btn btn-primary" onClick={handleStart}>▶️ Start Recording</button>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div style={{ background: "rgba(255,0,153,0.08)", border: "1px solid rgba(255,0,153,0.2)", borderRadius: 8, padding: 12 }}>
                <div style={{ fontWeight: 600, marginBottom: 4 }}>Recording: {testName}</div>
                <div style={{ fontSize: ".75rem", color: "var(--muted)" }}>Perform actions in your browser — they will be captured below</div>
              </div>
              <div style={{ background: "rgba(255,255,255,0.04)", borderRadius: 8, padding: 12, maxHeight: 200, overflowY: "auto" }}>
                <div style={{ fontSize: ".7rem", color: "var(--muted)", marginBottom: 8, fontWeight: 600 }}>CAPTURED STEPS ({steps.length})</div>
                {steps.map((s, i) => (
                  <div key={i} style={{ fontSize: ".8rem", padding: "4px 0", borderBottom: "1px solid rgba(255,255,255,0.04)", color: "var(--green)" }}>
                    {i + 1}. {s}
                  </div>
                ))}
              </div>
              <button className="btn btn-primary" onClick={handleStop} style={{ background: "rgba(255,0,153,0.15)", border: "1px solid var(--pink)", color: "var(--pink)" }}>
                ⏹️ Stop & Save Recording
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

function TestRunsPage({ showToast, setShowRunTests, tests = [] }) {
  const [runs, setRuns] = useState([
    { name: "Login Flow — US-01", status: "passed", dur: "2.3s", time: "2 min ago" },
    { name: "Checkout Test — US-02", status: "failed", dur: "5.1s", time: "5 min ago" },
    { name: "Search Feature — US-03", status: "passed", dur: "1.8s", time: "10 min ago" },
    { name: "POST /api/login", status: "passed", dur: "0.2s", time: "15 min ago" },
  ]);
  const [detailOpen, setDetailOpen] = useState(false);
  const [selectedTest, setSelectedTest] = useState(null);
  const [isRunning, setIsRunning] = useState(false);

  const handleRunAll = () => {
    setIsRunning(true);
    showToast("🚀 Running all tests...");
    setTimeout(() => {
      const now = "just now";
      const newRuns = tests.map(t => ({ name: t.name, status: t.status, dur: (Math.random() * 4 + 0.5).toFixed(1) + "s", time: now }));
      setRuns(prev => [...newRuns, ...prev]);
      setIsRunning(false);
      showToast("✅ Test run complete!");
    }, 2500);
  };

  const passed = runs.filter(r => r.status === "passed").length;
  const failed = runs.filter(r => r.status === "failed").length;

  return (
    <>
      <div className="stats-row">
        <div className="stat-card green">
          <div className="stat-label">Passed</div>
          <div className="stat-value">{passed}</div>
          <div className="stat-sub">{runs.length ? Math.round((passed / runs.length) * 100) : 0}% pass rate</div>
        </div>
        <div className="stat-card red">
          <div className="stat-label">Failed</div>
          <div className="stat-value">{failed}</div>
          <div className="stat-sub">Needs fix</div>
        </div>
        <div className="stat-card yellow">
          <div className="stat-label">Running</div>
          <div className="stat-value" style={{ display: "flex", alignItems: "center", gap: 6 }}>
            {isRunning ? <><div style={{ width: 12, height: 12, border: "2px solid var(--yellow)", borderTop: "2px solid transparent", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />...</> : 0}
          </div>
          <div className="stat-sub">{isRunning ? "In progress" : "Idle"}</div>
        </div>
        <div className="stat-card blue">
          <div className="stat-label">Total Runs</div>
          <div className="stat-value">{runs.length}</div>
          <div className="stat-sub">In history</div>
        </div>
      </div>
      <div className="card">
        <div className="card-header">
          <div className="card-title">▶️ Test Runs History</div>
          <button className="btn btn-primary btn-sm" disabled={isRunning} onClick={handleRunAll} style={{ opacity: isRunning ? 0.6 : 1 }}>
            {isRunning ? "Running..." : "▶️ Run All"}
          </button>
        </div>
        <table>
          <thead
            onClick={() => { showToast("Opening run details…"); }}
            style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "1.2rem 1.5rem", borderBottom: "1px solid var(--border)", cursor: "pointer" }}
            role="button"
            tabIndex={0}
          >
            <tr style={{ width: "100%", display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", gap: 12 }}>
              <th style={{ textAlign: "left" }}>Test</th>
              <th style={{ textAlign: "left" }}>Status</th>
              <th style={{ textAlign: "left" }}>Duration</th>
              <th style={{ textAlign: "left" }}>Time</th>
            </tr>
          </thead>
          <tbody>
            {runs.map((r, i) => (
              <tr key={i}>
                <td
                  onClick={() => { setSelectedTest({ name: r.name, status: r.status, type: r.name.startsWith("POST") || r.name.startsWith("GET") ? "API" : "Web", last: r.time }); setDetailOpen(true); }}
                  style={{ cursor: "pointer", textDecoration: "underline", textUnderlineOffset: 3 }}
                  title="Open test details"
                >
                  {r.name}
                </td>
                <td><span className={`badge badge-${r.status}`}>{r.status}</span></td>
                <td style={{ fontSize: ".75rem" }}>{r.dur}</td>
                <td style={{ fontSize: ".7rem", color: "var(--muted)" }}>{r.time}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <TestDetailModal
          isOpen={detailOpen}
          onClose={() => setDetailOpen(false)}
          test={selectedTest}
          onRun={(t) => showToast(`Running ${t?.name}...`)}
        />
      </div>
    </>
  );
}

function MobileTestsPage({ showToast, setShowNewTest, setPage, tests = [] }) {
  const mobileTests = tests.filter(t => (t.type || "").toLowerCase() === "mobile");
  const passRate = mobileTests.length ? Math.round((mobileTests.filter(t => t.status === "passed").length / mobileTests.length) * 100) : 0;
  const [detailOpen, setDetailOpen] = useState(false);
  const [selectedTest, setSelectedTest] = useState(null);

  return (
    <>
      <div className="stats-row">
        <div className="stat-card purple">
          <div className="stat-label">Mobile Tests</div>
          <div className="stat-value">{mobileTests.length}</div>
          <div className="stat-sub">iOS + Android</div>
        </div>
        <div className="stat-card green">
          <div className="stat-label">Pass Rate</div>
          <div className="stat-value">{passRate}%</div>
          <div className="stat-sub">{mobileTests.filter(t => t.status === "passed").length} of {mobileTests.length} passing</div>
        </div>
        <div className="stat-card red">
          <div className="stat-label">Failed</div>
          <div className="stat-value">{mobileTests.filter(t => t.status === "failed").length}</div>
          <div className="stat-sub">iOS issues</div>
        </div>
      </div>
      <div className="card">
        <div className="card-header">
          <div className="card-title">📱 Mobile Test Cases</div>
          <button className="btn btn-primary btn-sm" onClick={() => setShowNewTest(true)}>+ New Mobile Test</button>
        </div>
        <table>
          <thead
            onClick={() => {
              showToast("Opening tests details…");
              if (setPage) setPage("tests");
            }}
            style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "1.2rem 1.5rem", borderBottom: "1px solid var(--border)", cursor: "pointer" }}
            role="button"
            tabIndex={0}
          >
            <tr style={{ width: "100%", display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", gap: 12 }}>
              <th style={{ textAlign: "left" }}>Test</th>
              <th style={{ textAlign: "left" }}>Platform</th>
              <th style={{ textAlign: "left" }}>Status</th>
              <th style={{ textAlign: "left" }}>Last Run</th>
            </tr>
          </thead>
          <tbody>
            {mobileTests.length > 0 ? mobileTests.map((m, i) => (
              <tr key={i}>
                <td
                  onClick={() => { setSelectedTest(m); setDetailOpen(true); }}
                  style={{ cursor: "pointer", textDecoration: "underline", textUnderlineOffset: 3 }}
                  title="Open test details"
                >
                  {m.name}
                </td>
                <td><span className="badge badge-minor">{m.platform || "Mobile"}</span></td>
                <td><span className={`badge badge-${m.status}`}>{m.status}</span></td>
                <td style={{ fontSize: ".7rem", color: "var(--muted)" }}>{m.last}</td>
              </tr>
            )) : (
              <tr><td colSpan={4} style={{ textAlign: "center", color: "var(--muted)", padding: "1.5rem" }}>No mobile tests yet — create one above</td></tr>
            )}
          </tbody>
        </table>
        <TestDetailModal
          isOpen={detailOpen}
          onClose={() => setDetailOpen(false)}
          test={selectedTest}
          onRun={(t) => showToast(`Running ${t?.name}...`)}
        />
      </div>
    </>
  );
}

function APITestsPage({ showToast, setShowNewTest, tests = [] }) {
  const apiTests = tests.filter(t => (t.type || "").toLowerCase() === "api");
  const passRate = apiTests.length ? Math.round((apiTests.filter(t => t.status === "passed").length / apiTests.length) * 100) : 0;
  const [detailOpen, setDetailOpen] = useState(false);
  const [selectedTest, setSelectedTest] = useState(null);

  return (
    <>
      <div className="stats-row">
        <div className="stat-card blue">
          <div className="stat-label">API Tests</div>
          <div className="stat-value">{apiTests.length}</div>
          <div className="stat-sub">Endpoints</div>
        </div>
        <div className="stat-card green">
          <div className="stat-label">Pass Rate</div>
          <div className="stat-value">{passRate}%</div>
          <div className="stat-sub">{passRate === 100 ? "All passing" : `${apiTests.filter(t => t.status === "passed").length} of ${apiTests.length}`}</div>
        </div>
        <div className="stat-card yellow">
          <div className="stat-label">Avg Response</div>
          <div className="stat-value">120ms</div>
          <div className="stat-sub">Response time</div>
        </div>
      </div>
      <div className="card">
        <div className="card-header">
          <div className="card-title">🌐 API Test Cases</div>
          <button className="btn btn-primary btn-sm" onClick={() => setShowNewTest(true)}>+ New API Test</button>
        </div>
        <table>
          <thead
            onClick={() => { showToast("Opening API tests…"); }}
            style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "1.2rem 1.5rem", borderBottom: "1px solid var(--border)", cursor: "pointer" }}
            role="button"
            tabIndex={0}
          >
            <tr style={{ width: "100%", display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", gap: 12 }}>
              <th style={{ textAlign: "left" }}>Endpoint</th>
              <th style={{ textAlign: "left" }}>Method</th>
              <th style={{ textAlign: "left" }}>Status</th>
              <th style={{ textAlign: "left" }}>Last Run</th>
            </tr>
          </thead>
          <tbody>
            {apiTests.length > 0 ? apiTests.map((a, i) => (
              <tr key={i}>
                <td
                  onClick={() => { setSelectedTest(a); setDetailOpen(true); }}
                  style={{ fontFamily: "monospace", cursor: "pointer", textDecoration: "underline", textUnderlineOffset: 3 }}
                  title="Open test details"
                >
                  {a.endpoint || a.name}
                </td>
                <td><span className="badge badge-minor">{a.method || "GET"}</span></td>
                <td><span className={`badge badge-${a.status}`}>{a.status}</span></td>
                <td style={{ fontSize: ".7rem", color: "var(--muted)" }}>{a.last}</td>
              </tr>
            )) : (
              <tr><td colSpan={4} style={{ textAlign: "center", color: "var(--muted)", padding: "1.5rem" }}>No API tests yet — create one above</td></tr>
            )}
          </tbody>
        </table>
        <TestDetailModal
          isOpen={detailOpen}
          onClose={() => setDetailOpen(false)}
          test={selectedTest}
          onRun={(t) => showToast(`Running ${t?.name}...`)}
        />
      </div>
    </>
  );
}

function ElementRepoPage({ showToast }) {
  const [elements, setElements] = useState([
    { element: "Login Button", page: "Login", locator: "#login-btn" },
    { element: "Search Input", page: "Home", locator: "#search" },
    { element: "Checkout Button", page: "Cart", locator: ".checkout" },
    { element: "Profile Menu", page: "Dashboard", locator: ".profile" },
  ]);
  const [search, setSearch] = useState("");
  const [adding, setAdding] = useState(false);
  const [newEl, setNewEl] = useState({ element: "", page: "", locator: "" });

  const filteredElements = elements.filter(e =>
    e.element.toLowerCase().includes(search.toLowerCase()) ||
    e.page.toLowerCase().includes(search.toLowerCase())
  );

  const handleAdd = () => {
    if (!newEl.element.trim()) return;
    setElements(prev => [...prev, newEl]);
    setNewEl({ element: "", page: "", locator: "" });
    setAdding(false);
    showToast(`✅ Element "${newEl.element}" added`);
  };

  const handleDelete = (idx) => {
    const name = filteredElements[idx].element;
    setElements(prev => prev.filter(e => e !== filteredElements[idx]));
    showToast(`🗑️ Element "${name}" removed`);
  };

  return (
    <>
      <div className="stats-row">
        <div className="stat-card purple">
          <div className="stat-label">Elements</div>
          <div className="stat-value">{elements.length}</div>
          <div className="stat-sub">In repository</div>
        </div>
        <div className="stat-card blue">
          <div className="stat-label">Pages</div>
          <div className="stat-value">{[...new Set(elements.map(e => e.page))].length}</div>
          <div className="stat-sub">Tracked</div>
        </div>
        <div className="stat-card green">
          <div className="stat-label">Reusability</div>
          <div className="stat-value">73%</div>
          <div className="stat-sub">Shared elements</div>
        </div>
      </div>
      <div className="card">
        <div className="card-header">
          <div className="card-title">📦 Element Repository</div>
          <button className="btn btn-primary btn-sm" onClick={() => setAdding(true)}>+ Add Element</button>
        </div>
        <div style={{ padding: "0 1.2rem 0.8rem" }}>
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search elements or pages..."
            style={{ width: "100%", padding: "8px 12px", background: "rgba(255,255,255,0.06)", border: "1px solid var(--border)", borderRadius: 8, color: "var(--text)", fontSize: ".85rem", outline: "none" }}
          />
        </div>
        {adding && (
          <div style={{ padding: "0 1.2rem 1rem", display: "grid", gridTemplateColumns: "1fr 1fr 1fr auto", gap: 8 }}>
            <input value={newEl.element} onChange={e => setNewEl({...newEl, element: e.target.value})} placeholder="Element name" style={{ padding: "8px 10px", background: "rgba(255,255,255,0.06)", border: "1px solid var(--border)", borderRadius: 6, color: "var(--text)", fontSize: ".82rem", outline: "none" }} />
            <input value={newEl.page} onChange={e => setNewEl({...newEl, page: e.target.value})} placeholder="Page" style={{ padding: "8px 10px", background: "rgba(255,255,255,0.06)", border: "1px solid var(--border)", borderRadius: 6, color: "var(--text)", fontSize: ".82rem", outline: "none" }} />
            <input value={newEl.locator} onChange={e => setNewEl({...newEl, locator: e.target.value})} placeholder="#locator" style={{ padding: "8px 10px", background: "rgba(255,255,255,0.06)", border: "1px solid var(--border)", borderRadius: 6, color: "var(--text)", fontSize: ".82rem", outline: "none", fontFamily: "monospace" }} />
            <div style={{ display: "flex", gap: 6 }}>
              <button onClick={handleAdd} className="btn btn-primary btn-sm">Save</button>
              <button onClick={() => setAdding(false)} className="btn btn-sm" style={{ background: "var(--glass)", border: "1px solid var(--border)" }}>×</button>
            </div>
          </div>
        )}
        <table>
          <thead
            onClick={() => { showToast("Opening element repository…"); }}
            style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "1.2rem 1.5rem", borderBottom: "1px solid var(--border)", cursor: "pointer" }}
            role="button"
            tabIndex={0}
          >
            <tr style={{ width: "100%", display: "grid", gridTemplateColumns: "2fr 1fr 2fr 0.6fr", gap: 12 }}>
              <th style={{ textAlign: "left" }}>Element</th>
              <th style={{ textAlign: "left" }}>Page</th>
              <th style={{ textAlign: "left" }}>Locator</th>
              <th style={{ textAlign: "left" }}></th>
            </tr>
          </thead>
          <tbody>
            {filteredElements.map((e, i) => (
              <tr key={i}>
                <td>{e.element}</td>
                <td>{e.page}</td>
                <td style={{ fontFamily: "monospace", fontSize: ".75rem" }}>{e.locator}</td>
                <td>
                  <button onClick={() => handleDelete(i)} style={{ background: "none", border: "none", color: "var(--muted)", cursor: "pointer", fontSize: ".85rem" }} title="Delete element">🗑️</button>
                </td>
              </tr>
            ))}
            {filteredElements.length === 0 && <tr><td colSpan={4} style={{ textAlign: "center", color: "var(--muted)", padding: "1.5rem" }}>No elements match your search</td></tr>}
          </tbody>
        </table>
      </div>
    </>
  );
}

function CloudRunnerPage({ showToast, setShowRunTests }) {
  return (
    <>
      <div className="stats-row">
        <div className="stat-card blue">
          <div className="stat-label">Total Runs</div>
          <div className="stat-value">156</div>
          <div className="stat-sub">This month</div>
        </div>
        <div className="stat-card green">
          <div className="stat-label">Time Saved</div>
          <div className="stat-value">42h</div>
          <div className="stat-sub">Automation</div>
        </div>
        <div className="stat-card yellow">
          <div className="stat-label">Cost</div>
          <div className="stat-value">$24</div>
          <div className="stat-sub">This month</div>
        </div>
      </div>
      <div className="card">
        <div className="card-header">
          <div className="card-title">☁️ Cloud Runner</div>
          <button className="btn btn-primary btn-sm" onClick={() => setShowRunTests && setShowRunTests(true)}>▶️ Run All Tests</button>
        </div>
        <div className="card-body">
          <div style={{ fontSize: ".8rem", color: "var(--muted)", marginBottom: "1rem" }}>Available Resources</div>
          {[
            { name: "Windows VM - Chrome", used: 7, total: 10 },
            { name: "Mac VM - Safari", used: 3, total: 5 },
            { name: "Android Emulator", used: 2, total: 7 },
            { name: "iOS Simulator", used: 1, total: 4 },
          ].map((r, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 0", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
              <div style={{ flex: 1, fontSize: ".8rem" }}>{r.name}</div>
              <div style={{ fontSize: ".7rem", color: "var(--muted)" }}>{r.used}/{r.total}</div>
              <div style={{ width: 80 }}><div className="progress-bar"><div className="progress-fill" style={{ width: (r.used/r.total*100) + "%", background: r.used/r.total > 0.7 ? "var(--pink)" : "var(--green)" }}></div></div></div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

const KANBAN_INITIAL = {
  open: [
    { id: 201, title: "Payment fails on Safari",  priority: "Critical", tag: "payments" },
    { id: 202, title: "Checkout not visible iOS", priority: "High",     tag: "mobile"   },
    { id: 203, title: "Search order issue",        priority: "Medium",   tag: "search"   },
  ],
  inProgress: [
    { id: 204, title: "Login uppercase fix",       priority: "Medium",   tag: "auth"     },
    { id: 205, title: "Mobile nav scroll bug",     priority: "High",     tag: "mobile"   },
  ],
  inReview: [
    { id: 206, title: "Dashboard slow mobile",     priority: "Medium",   tag: "performance" },
  ],
  resolved: [
    { id: 207, title: "404 on profile page",       priority: "Low",      tag: "routing"  },
    { id: 208, title: "Token expiry crash",        priority: "High",     tag: "auth"     },
  ],
};

const KANBAN_COLS = [
  { id: "open",       label: "Open",        emoji: "🔴", accent: "#FF4466", glow: "rgba(255,68,102,0.18)"  },
  { id: "inProgress", label: "In Progress", emoji: "🔵", accent: "#1E90FF", glow: "rgba(30,144,255,0.18)"  },
  { id: "inReview",   label: "In Review",   emoji: "🟡", accent: "#FFD700", glow: "rgba(255,215,0,0.18)"   },
  { id: "resolved",   label: "Resolved",    emoji: "🟢", accent: "#00FF85", glow: "rgba(0,255,133,0.18)"   },
];

const KANBAN_PRIO = {
  Critical: { color: "#FF4466", bg: "rgba(255,68,102,0.12)", border: "rgba(255,68,102,0.35)" },
  High:     { color: "#FF9500", bg: "rgba(255,149,0,0.12)",  border: "rgba(255,149,0,0.35)"  },
  Medium:   { color: "#1E90FF", bg: "rgba(30,144,255,0.12)", border: "rgba(30,144,255,0.35)" },
  Low:      { color: "#00FF85", bg: "rgba(0,255,133,0.12)",  border: "rgba(0,255,133,0.35)"  },
};

const KANBAN_TAG_COLOR = {
  payments: "#FF4466", mobile: "#9D4EDD", search: "#1E90FF",
  auth: "#FFD700", performance: "#FF9500", routing: "#00FF85",
};

function KanbanPage({ showToast, kanbanColumns: externalColumns }) {
  const [bugs, setBugs] = useState(KANBAN_INITIAL);
  const [dragging, setDragging] = useState(null);
  const [overCol, setOverCol] = useState(null);
  const [overBugId, setOverBugId] = useState(null);
  const [dropped, setDropped] = useState(null);
  const dragNode = useRef(null);

  const defaultColumns = [
    { id: "open", label: "Open", emoji: "🔴", accent: "#FF4466", glow: "rgba(255,68,102,0.18)" },
    { id: "inProgress", label: "In Progress", emoji: "🔵", accent: "#1E90FF", glow: "rgba(30,144,255,0.18)" },
    { id: "inReview", label: "In Review", emoji: "🟡", accent: "#FFD700", glow: "rgba(255,215,0,0.18)" },
    { id: "resolved", label: "Resolved", emoji: "🟢", accent: "#00FF85", glow: "rgba(0,255,133,0.18)" },
  ];

  // Merge external columns with defaults to preserve styling
  const columns = externalColumns?.length ? externalColumns.map(extCol => {
    const defaultCol = defaultColumns.find(d => d.id === extCol.id);
    return defaultCol ? { ...defaultCol, ...extCol } : { ...extCol, emoji: "⚪", accent: "#888", glow: "rgba(136,136,136,0.18)" };
  }) : defaultColumns;

  const onDragStart = (e, bugId, fromCol) => {
    setDragging({ bugId, fromCol });
    dragNode.current = e.currentTarget;
    e.dataTransfer.effectAllowed = "move";
    setTimeout(() => dragNode.current && (dragNode.current.style.opacity = "0.35"), 0);
  };

  const onDragEnd = () => {
    if (dragNode.current) dragNode.current.style.opacity = "1";
    dragNode.current = null;
    setDragging(null);
    setOverCol(null);
    setOverBugId(null);
  };

  const onDragOverCol  = (e, colId) => { e.preventDefault(); e.dataTransfer.dropEffect = "move"; setOverCol(colId); };
  const onDragOverCard = (e, bugId) => { e.preventDefault(); e.stopPropagation(); setOverBugId(bugId); };

  const onDrop = (e, toCol) => {
    e.preventDefault();
    if (!dragging) return;
    const { bugId, fromCol } = dragging;
    if (fromCol === toCol && overBugId === null) { onDragEnd(); return; }
    setBugs(prev => {
      const next = { ...prev };
      const bug  = next[fromCol].find(b => b.id === bugId);
      next[fromCol] = next[fromCol].filter(b => b.id !== bugId);
      if (overBugId !== null) {
        const idx = next[toCol].findIndex(b => b.id === overBugId);
        const arr = [...next[toCol]];
        arr.splice(idx, 0, bug);
        next[toCol] = arr;
      } else {
        next[toCol] = [...next[toCol], bug];
      }
      return next;
    });
    setDropped(bugId);
    setTimeout(() => setDropped(null), 700);
    onDragEnd();
  };

  const total = Object.values(bugs).reduce((s, arr) => s + arr.length, 0);

  return (
    <>
      <style>{`
        @keyframes kanban-flash { 0%{box-shadow:0 0 0 0 rgba(0,255,133,0)} 40%{box-shadow:0 0 0 6px rgba(0,255,133,0.45)} 100%{box-shadow:0 0 0 0 rgba(0,255,133,0)} }
        @keyframes kanban-fadeup { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:none} }
        .k-card { background:rgba(255,255,255,0.035); border:1px solid rgba(255,255,255,0.08); border-radius:10px; padding:12px 13px; cursor:grab; transition:transform .18s,box-shadow .18s,border-color .18s,background .18s; animation:kanban-fadeup .3s ease both; user-select:none; }
        .k-card:active { cursor:grabbing; }
        .k-card:hover  { transform:translateY(-2px); background:rgba(255,255,255,0.055); border-color:rgba(255,255,255,0.15); box-shadow:0 8px 24px rgba(0,0,0,.5); }
        .k-card.k-over  { border-top:2px solid #FF0099 !important; }
        .k-card.k-dropped { animation:kanban-flash .7s ease forwards; }
        .k-col { border-radius:12px; transition:background .2s,box-shadow .2s; min-height:100px; }
        .k-col.k-col-over { background:rgba(255,255,255,0.025) !important; }
        .k-badge { display:inline-flex;align-items:center;padding:2px 8px;border-radius:999px;font-size:10px;font-weight:700; }
        .k-tag   { display:inline-flex;align-items:center;padding:1px 7px;border-radius:999px;font-size:10px;font-weight:600;opacity:.8; }
      `}</style>

      {/* Header */}
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:20 }}>
        <div>
          <h1 style={{ fontFamily:"Syne,sans-serif", fontSize:22, fontWeight:800, marginBottom:4 }}>📋 Kanban Board</h1>
          <p style={{ color:"#4a5568", fontSize:13 }}>{total} bugs · drag cards to move between columns</p>
        </div>
        <div style={{ display:"flex", gap:8 }}>
          {columns.map(col => (
            <div key={col.id} style={{ display:"flex", alignItems:"center", gap:5, padding:"4px 10px", borderRadius:8, background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.07)", fontSize:11, color:"#888", fontWeight:600 }}>
              <span style={{ display:"inline-block", width:6, height:6, borderRadius:"50%", background:"#666" }} />
              {bugs[col.id]?.length || 0} {col.label}
            </div>
          ))}
        </div>
      </div>

      {/* Board */}
      <div style={{ display:"grid", gridTemplateColumns:`repeat(${columns.length},1fr)`, gap:14, alignItems:"start" }}>
        {columns.map(col => {
          const isOver = overCol === col.id;
          return (
            <div key={col.id}
              className={`k-col${isOver ? " k-col-over" : ""}`}
              onDragOver={e => onDragOverCol(e, col.id)}
              onDrop={e => onDrop(e, col.id)}
              onDragLeave={() => { setOverCol(null); setOverBugId(null); }}
              style={{ background:"rgba(255,255,255,0.015)", border:`1px solid ${isOver ? col.accent : "rgba(255,255,255,0.06)"}`, boxShadow:isOver ? `0 0 20px ${col.glow}` : "none", padding:"13px 11px" }}>

              {/* Column header */}
              <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:12 }}>
                <div style={{ display:"flex", alignItems:"center", gap:6 }}>
                  <span>{col.emoji}</span>
                  <span style={{ fontFamily:"Syne,sans-serif", fontSize:13, fontWeight:700, color:col.accent }}>{col.label}</span>
                </div>
                <span style={{ fontSize:11, fontWeight:700, color:col.accent, background:col.glow, border:`1px solid ${col.accent}33`, borderRadius:99, padding:"1px 8px" }}>
                  {bugs[col.id].length}
                </span>
              </div>
              <div style={{ height:2, background:`linear-gradient(90deg,${col.accent}55,transparent)`, borderRadius:2, marginBottom:10 }} />

              {/* Cards */}
              <div style={{ display:"flex", flexDirection:"column", gap:7 }}>
                {bugs[col.id].map((bug, idx) => {
                  const p = KANBAN_PRIO[bug.priority];
                  const isOverThis = overBugId === bug.id && dragging?.bugId !== bug.id;
                  const isDropped  = dropped === bug.id;
                  return (
                    <div key={bug.id} draggable
                      onDragStart={e => onDragStart(e, bug.id, col.id)}
                      onDragEnd={onDragEnd}
                      onDragOver={e => onDragOverCard(e, bug.id)}
                      className={`k-card${isOverThis ? " k-over" : ""}${isDropped ? " k-dropped" : ""}`}
                      style={{ animationDelay:`${idx * 0.05}s` }}>
                      <div style={{ fontSize:12, fontWeight:600, color:"#E8EDF5", lineHeight:1.4, marginBottom:9 }}>{bug.title}</div>
                      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between" }}>
                        <span className="k-badge" style={{ background:p.bg, color:p.color, border:`1px solid ${p.border}` }}>{bug.priority}</span>
                        <span className="k-tag"   style={{ background:`${KANBAN_TAG_COLOR[bug.tag]}18`, color:KANBAN_TAG_COLOR[bug.tag], border:`1px solid ${KANBAN_TAG_COLOR[bug.tag]}30` }}>#{bug.tag}</span>
                      </div>
                      <div style={{ marginTop:7, display:"flex", gap:3, opacity:.2 }}>
                        {[0,1,2].map(i => <div key={i} style={{ width:16, height:2, background:"#fff", borderRadius:2 }} />)}
                      </div>
                    </div>
                  );
                })}
                {bugs[col.id].length === 0 && (
                  <div style={{ padding:"18px 10px", textAlign:"center", color:"#2a3040", fontSize:12, border:`2px dashed ${isOver ? col.accent : "rgba(255,255,255,0.06)"}`, borderRadius:8, transition:"border-color .2s" }}>
                    {isOver ? "Drop here" : "No bugs"}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Drag tooltip */}
      {dragging && (
        <div style={{ position:"fixed", bottom:20, left:"50%", transform:"translateX(-50%)", padding:"8px 18px", background:"rgba(13,18,33,0.97)", border:"1px solid rgba(255,0,153,0.4)", borderRadius:99, fontSize:12, color:"#FF0099", fontWeight:600, boxShadow:"0 0 20px rgba(255,0,153,0.2)", pointerEvents:"none", zIndex:999 }}>
          Drop into any column ↑
        </div>
      )}
    </>
  );
}

function UserStoriesPage({ showToast, setShowNewUserStory, userStories = [] }) {
  const staticStories = [
    { story: "US-01: User Authentication Flow", progress: 100, bugs: 0, assignee: "Alice", status: "done" },
    { story: "US-02: Checkout & Payment", progress: 65, bugs: 2, assignee: "Bob", status: "progress" },
    { story: "US-03: Search & Filtering", progress: 40, bugs: 3, assignee: "Charlie", status: "progress" },
    { story: "US-04: User Profile Settings", progress: 80, bugs: 1, assignee: "Alice", status: "progress" },
  ];
  const allStories = [...staticStories, ...userStories.map((s, i) => ({
    story: `US-0${staticStories.length + i + 1}: ${s.title}`,
    progress: 0, bugs: 0, assignee: s.assignee || "—", status: "todo"
  }))];

  return (
    <>
      <div className="stats-row">
        <div className="stat-card blue">
          <div className="stat-label">Total Stories</div>
          <div className="stat-value">{allStories.length}</div>
          <div className="stat-sub">Sprint 4</div>
        </div>
        <div className="stat-card green">
          <div className="stat-label">Completed</div>
          <div className="stat-value">{allStories.filter(s => s.status === "done").length}</div>
          <div className="stat-sub">{allStories.length ? Math.round((allStories.filter(s => s.status === "done").length / allStories.length) * 100) : 0}%</div>
        </div>
        <div className="stat-card yellow">
          <div className="stat-label">In Progress</div>
          <div className="stat-value">{allStories.filter(s => s.status === "progress").length}</div>
          <div className="stat-sub">Active</div>
        </div>
      </div>
      <div className="card">
        <div className="card-header">
          <div className="card-title">🗂️ User Stories</div>
          <button className="btn btn-primary btn-sm" onClick={() => setShowNewUserStory(true)}>+ New Story</button>
        </div>
        <table>
          <thead
            onClick={() => { showToast("Opening user stories…"); }}
            style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "1.2rem 1.5rem", borderBottom: "1px solid var(--border)", cursor: "pointer" }}
            role="button"
            tabIndex={0}
          >
            <tr style={{ width: "100%", display: "grid", gridTemplateColumns: "2fr 1fr 1.5fr 1fr", gap: 12 }}>
              <th style={{ textAlign: "left" }}>Story</th>
              <th style={{ textAlign: "left" }}>Assignee</th>
              <th style={{ textAlign: "left" }}>Progress</th>
              <th style={{ textAlign: "left" }}>Bugs</th>
            </tr>
          </thead>
          <tbody>
            {allStories.map((s, i) => (
              <tr key={i}>
                <td>{s.story}</td>
                <td style={{ fontSize: ".75rem", color: "var(--muted)" }}>{s.assignee}</td>
                <td><div style={{ display: "flex", alignItems: "center", gap: 8 }}><div style={{ flex: 1, height: 6, background: "rgba(255,255,255,0.1)", borderRadius: 3 }}><div style={{ width: s.progress + "%", height: "100%", background: "var(--blue)", borderRadius: 3 }}></div></div><span style={{ fontSize: ".7rem", minWidth: 28 }}>{s.progress}%</span></div></td>
                <td>{s.bugs === 0 ? <span style={{ color: "var(--green)" }}>✓ Clean</span> : <span style={{ color: "var(--pink)" }}>{s.bugs} bugs</span>}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

function DuplicatesPage({ showToast }) {
  return (
    <>
      <div className="stats-row">
        <div className="stat-card yellow">
          <div className="stat-label">Potential Duplicates</div>
          <div className="stat-value">4</div>
          <div className="stat-sub">Need review</div>
        </div>
        <div className="stat-card green">
          <div className="stat-label">Merged</div>
          <div className="stat-value">12</div>
          <div className="stat-sub">This month</div>
        </div>
      </div>
      <div className="card">
        <div className="card-header"><div className="card-title">🔍 Duplicate Bugs</div></div>
        <table>
          <thead
            onClick={() => { showToast("Opening duplicates…"); }}
            style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "1.2rem 1.5rem", borderBottom: "1px solid var(--border)", cursor: "pointer" }}
            role="button"
            tabIndex={0}
          >
            <tr style={{ width: "100%", display: "grid", gridTemplateColumns: "2fr 2fr 1fr", gap: 12 }}>
              <th style={{ textAlign: "left" }}>Original</th>
              <th style={{ textAlign: "left" }}>Duplicate</th>
              <th style={{ textAlign: "left" }}>Similarity</th>
            </tr>
          </thead>
          <tbody>
            {[
              { original: "BUG-234", duplicate: "BUG-229", similarity: "87%" },
              { original: "BUG-231", duplicate: "BUG-225", similarity: "72%" },
            ].map((d, i) => (
              <tr key={i}>
                <td className="bug-id">{d.original}</td>
                <td className="bug-id">{d.duplicate}</td>
                <td><span className="badge badge-minor">{d.similarity}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

function AITriagePage({ showToast }) {
  return (
    <>
      <div className="stats-row">
        <div className="stat-card purple">
          <div className="stat-label">Triaged</div>
          <div className="stat-value">12</div>
          <div className="stat-sub">This week</div>
        </div>
        <div className="stat-card green">
          <div className="stat-label">Accuracy</div>
          <div className="stat-value">92%</div>
          <div className="stat-sub">AI confidence</div>
        </div>
        <div className="stat-card blue">
          <div className="stat-label">Time Saved</div>
          <div className="stat-value">4h</div>
          <div className="stat-sub">Manual work</div>
        </div>
      </div>
      <div className="ai-panel">
        <div className="ai-header"><span>🤖</span><div style={{ fontWeight: 700, flex: 1 }}>AI Triage Results</div></div>
        {[
          { bug: "BUG-234", root: "Stripe SDK timeout on Safari", conf: "92%" },
          { bug: "BUG-233", root: "Case sensitivity in auth validation", conf: "88%" },
        ].map((t, i) => (
          <div key={i} className="ai-item">
            <div className="ai-item-title">🧠 {t.bug}</div>
            <div className="ai-item-desc"><strong>Root cause:</strong> {t.root}</div>
            <div className="ai-confidence"><span style={{ fontSize: ".65rem" }}>AI confidence</span><div className="ai-conf-bar"><div className="ai-conf-fill" style={{ width: t.conf }}></div></div><div className="ai-conf-val">{t.conf}</div></div>
          </div>
        ))}
      </div>
    </>
  );
}

function FlowDiscoveryPage({ showToast }) {
  return (
    <>
      <div className="stats-row">
        <div className="stat-card purple">
          <div className="stat-label">Discovered Flows</div>
          <div className="stat-value">8</div>
          <div className="stat-sub">New this week</div>
        </div>
        <div className="stat-card blue">
          <div className="stat-label">Coverage Gap</div>
          <div className="stat-value">3</div>
          <div className="stat-sub">High priority</div>
        </div>
      </div>
      <div className="card">
        <div className="card-header"><div className="card-title">🧠 Flow Discovery</div></div>
        <div className="card-body">
          {[
            { flow: "Checkout → Payment → Success", priority: "High", uncovered: true },
            { flow: "Login → Forgot Password → Reset", priority: "Medium", uncovered: false },
            { flow: "Search → Filter → Sort", priority: "High", uncovered: true },
          ].map((f, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 0", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
              <div style={{ flex: 1 }}>{f.flow}</div>
              <span className={`badge badge-${f.priority.toLowerCase()}`}>{f.priority}</span>
              {f.uncovered && <span className="badge badge-blocker" style={{ fontSize: ".6rem" }}>No test</span>}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

function PredictionsPage({ showToast }) {
  return (
    <>
      <div className="stats-row">
        <div className="stat-card purple">
          <div className="stat-label">Active Predictions</div>
          <div className="stat-value">3</div>
          <div className="stat-sub">Risk alerts</div>
        </div>
        <div className="stat-card green">
          <div className="stat-label">Accuracy</div>
          <div className="stat-value">84%</div>
          <div className="stat-sub">Historical</div>
        </div>
      </div>
      <div className="card">
        <div className="card-header"><div className="card-title">🔮 AI Predictions</div></div>
        <div className="card-body">
          {[
            { title: "Payment module regression likely", risk: "High", conf: 78 },
            { title: "Login edge case not covered", risk: "Medium", conf: 65 },
            { title: "Search performance issue", risk: "Low", conf: 45 },
          ].map((p, i) => (
            <div key={i} className="ai-item" style={{ marginBottom: 8 }}>
              <div className="ai-item-title">{p.title}</div>
              <div className="ai-confidence">
                <span style={{ fontSize: 10, color: p.risk === "High" ? "var(--pink)" : p.risk === "Medium" ? "var(--yellow)" : "var(--green)" }}>{p.risk} Risk</span>
                <div className="ai-conf-bar"><div className="ai-conf-fill" style={{ width: p.conf + "%" }}></div></div>
                <div className="ai-conf-val">{p.conf}%</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

function GenerateTestsPage({ showToast, setShowGenerateTests }) {
  return (
    <>
      <div className="stats-row">
        <div className="stat-card purple">
          <div className="stat-label">Generated</div>
          <div className="stat-value">8</div>
          <div className="stat-sub">This week</div>
        </div>
        <div className="stat-card green">
          <div className="stat-label">Pass Rate</div>
          <div className="stat-value">75%</div>
          <div className="stat-sub">Of generated</div>
        </div>
        <div className="stat-card blue">
          <div className="stat-label">Ready to Generate</div>
          <div className="stat-value">3</div>
          <div className="stat-sub">New flows</div>
        </div>
      </div>
      <div className="card">
        <div className="card-header"><div className="card-title">⚡ Generate Tests</div></div>
        <div className="card-body" style={{ textAlign: "center", padding: "3rem" }}>
          <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>⚡</div>
          <div style={{ fontSize: "1rem", fontWeight: 600, marginBottom: ".5rem" }}>AI is ready to generate 3 new tests</div>
          <div style={{ fontSize: ".8rem", color: "var(--muted)", marginBottom: "1.5rem" }}>Based on discovered user flows without test coverage</div>
          <button className="btn btn-primary" onClick={() => setShowGenerateTests && setShowGenerateTests(true)}>Generate Tests</button>
        </div>
      </div>
    </>
  );
}

function ReportsPage({ showToast, bugs = [] }) {
  const [reports, setReports] = useState([
    { name: "Sprint Summary", type: "PDF", last: "Today" },
    { name: "Bug Trend Analysis", type: "Excel", last: "Yesterday" },
    { name: "Test Coverage", type: "Dashboard", last: "Today" },
  ]);

  const handleGenerate = (name) => {
    showToast(`📊 Generating "${name}"...`);
    setTimeout(() => {
      setReports(prev => prev.map(r => r.name === name ? {...r, last: "just now"} : r));
      showToast(`✅ "${name}" ready for download`);
    }, 1500);
  };

  const handleExportCSV = () => {
    const headers = ["ID", "Title", "Priority", "Severity", "Status", "Assignee", "Found in Build", "Created"];
    const rows = bugs.map(b => [b.id, b.title, b.priority, b.severity || "Medium", b.status, b.assignee || "", b.foundInBuild || "", new Date(b.history?.[0]?.timestamp || Date.now()).toLocaleDateString()]);
    const csv = [headers, ...rows].map(row => row.map(cell => `"${cell}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "bugs_export.csv";
    a.click();
    URL.revokeObjectURL(url);
    showToast("✅ CSV exported!");
  };

  const velocity = bugs.length > 0 ? (bugs.filter(b => b.status === "Closed" || b.status === "fixed").length / 14).toFixed(1) : 0;

  return (
    <>
      <div className="stats-row">
        <div className="stat-card blue">
          <div className="stat-label">Reports</div>
          <div className="stat-value">{reports.length}</div>
          <div className="stat-sub">Available</div>
        </div>
        <div className="stat-card green">
          <div className="stat-label">Scheduled</div>
          <div className="stat-value">3</div>
          <div className="stat-sub">Weekly</div>
        </div>
        <div className="stat-card purple">
          <div className="stat-label">Bug Velocity</div>
          <div className="stat-value">{velocity}/day</div>
          <div className="stat-sub">Closed per day</div>
        </div>
        <div className="stat-card yellow">
          <div className="stat-label">Avg Resolution</div>
          <div className="stat-value">4.2h</div>
          <div className="stat-sub">Mean time</div>
        </div>
      </div>

      <div style={{ display: "flex", gap: 16, marginBottom: 16 }}>
        <button className="btn btn-primary btn-sm" onClick={handleExportCSV}>📥 Export CSV</button>
      </div>

      <div className="card">
        <div className="card-header">
          <div className="card-title">📊 Available Reports</div>
          <button className="btn btn-sm" style={{ background: "var(--glass)", border: "1px solid var(--border)" }} onClick={() => showToast("📅 Schedule report modal coming soon")}>+ Schedule Report</button>
        </div>
        <table>
          <thead
            onClick={() => { showToast("Opening reports…"); }}
            style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "1.2rem 1.5rem", borderBottom: "1px solid var(--border)", cursor: "pointer" }}
            role="button"
            tabIndex={0}
          >
            <tr style={{ width: "100%", display: "grid", gridTemplateColumns: "2fr 1fr 1fr 0.8fr", gap: 12 }}>
              <th style={{ textAlign: "left" }}>Report</th>
              <th style={{ textAlign: "left" }}>Type</th>
              <th style={{ textAlign: "left" }}>Last Generated</th>
              <th style={{ textAlign: "left" }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {reports.map((r, i) => (
              <tr key={i}>
                <td>{r.name}</td>
                <td><span className="badge badge-minor">{r.type}</span></td>
                <td style={{ fontSize: ".7rem", color: "var(--muted)" }}>{r.last}</td>
                <td>
                  <button onClick={() => handleGenerate(r.name)} className="btn btn-sm" style={{ background: "rgba(30,144,255,0.1)", border: "1px solid rgba(30,144,255,0.2)", color: "var(--blue)", padding: "3px 10px", fontSize: ".7rem" }}>Generate</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

function InviteModal({ isOpen, onClose, onSubmit }) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  
  const handleSubmit = async () => {
    if (!email || !email.includes("@")) { setError("Please enter a valid email address"); return; }
    setLoading(true);
    await new Promise(r => setTimeout(r, 600));
    onSubmit(email);
    setEmail("");
    setError("");
    setLoading(false);
    onClose();
  };
  
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="✉️ Invite Team Member">
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <div>
          <div style={{ fontSize: ".75rem", color: "var(--muted)", marginBottom: 6, fontWeight: 600, textTransform: "uppercase" }}>Email Address</div>
          <input 
            value={email}
            onChange={e => { setEmail(e.target.value); setError(""); }}
            onKeyDown={e => e.key === "Enter" && handleSubmit()}
            placeholder="colleague@company.com"
            style={{ width: "100%", padding: "10px 12px", background: "rgba(255,255,255,0.06)", border: `1px solid ${error ? "var(--pink)" : "var(--border)"}`, borderRadius: 8, color: "var(--text)", fontSize: ".9rem", outline: "none" }}
          />
          {error && <div style={{ fontSize: ".72rem", color: "var(--pink)", marginTop: 4 }}>{error}</div>}
        </div>
        <div>
          <div style={{ fontSize: ".75rem", color: "var(--muted)", marginBottom: 6, fontWeight: 600, textTransform: "uppercase" }}>Role</div>
          <select style={{ width: "100%", padding: "10px 12px", background: "rgba(255,255,255,0.06)", border: "1px solid var(--border)", borderRadius: 8, color: "var(--text)", fontSize: ".9rem" }}>
            <option>QA Engineer</option>
            <option>Developer</option>
            <option>Product Manager</option>
            <option>Viewer</option>
          </select>
        </div>
        <button onClick={handleSubmit} disabled={loading} className="btn btn-primary" style={{ width: "100%", marginTop: 8, opacity: loading ? 0.7 : 1 }}>
          {loading ? "Sending..." : "✉️ Send Invitation"}
        </button>
      </div>
    </Modal>
  );
}

function ExportModal({ isOpen, onClose, onSubmit }) {
  const [format, setFormat] = useState("csv");
  const [data, setData] = useState({ bugs: true, tests: true, results: false, coverage: false });
  
  const handleSubmit = () => {
    onSubmit({ format, data });
    onClose();
  };
  
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="📊 Export Data">
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <div>
          <div style={{ fontSize: ".75rem", color: "var(--muted)", marginBottom: 8, fontWeight: 600, textTransform: "uppercase" }}>Export Format</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
            {["CSV", "Excel", "JSON", "PDF"].map(f => (
              <div 
                key={f}
                onClick={() => setFormat(f.toLowerCase())}
                style={{ 
                  padding: 12, 
                  background: format === f.toLowerCase() ? "rgba(255,0,153,0.15)" : "rgba(255,255,255,0.04)", 
                  border: format === f.toLowerCase() ? "1px solid var(--pink)" : "1px solid var(--border)",
                  borderRadius: 8, 
                  textAlign: "center", 
                  cursor: "pointer",
                  fontWeight: 600,
                  fontSize: ".85rem"
                }}
              >
                {f}
              </div>
            ))}
          </div>
        </div>
        <button onClick={handleSubmit} className="btn btn-primary" style={{ width: "100%", marginTop: 8 }}>📥 Export {format.toUpperCase()}</button>
      </div>
    </Modal>
  );
}

function SearchModal({ isOpen, onClose, onSubmit }) {
  const [query, setQuery] = useState("");
  
  const handleSubmit = () => {
    if (query) {
      onSubmit(query);
      onClose();
    }
  };
  
  const recentSearches = ["BUG-234", "Login Flow", "Checkout", "Safari", "Payment"];
  
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="🔍 Search">
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <input 
          value={query}
          onChange={e => setQuery(e.target.value)}
          onKeyDown={e => e.key === "Enter" && handleSubmit()}
          placeholder="Search bugs, tests, stories..."
          autoFocus
          style={{ width: "100%", padding: "12px 14px", background: "rgba(255,255,255,0.06)", border: "1px solid var(--border)", borderRadius: 8, color: "var(--text)", fontSize: "1rem", outline: "none" }}
        />
        <div>
          <div style={{ fontSize: ".7rem", color: "var(--muted)", marginBottom: 8, fontWeight: 600, textTransform: "uppercase" }}>Recent Searches</div>
          {recentSearches.map(s => (
            <div 
              key={s}
              onClick={() => { setQuery(s); onSubmit(s); onClose(); }}
              style={{ padding: "8px 0", cursor: "pointer", fontSize: ".85rem", borderBottom: "1px solid rgba(255,255,255,0.04)" }}
            >
              🔍 {s}
            </div>
          ))}
        </div>
      </div>
    </Modal>
  );
}

function ProfileModal({ isOpen, onClose, onSubmit }) {
  const [form, setForm] = useState({ name: "Waleed Said", email: "waleed@company.com", role: "QA Lead" });
  
  const handleSubmit = () => {
    onSubmit("Profile");
    onClose();
  };
  
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="👤 Profile Settings">
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16, paddingBottom: 16, borderBottom: "1px solid var(--border)" }}>
          <div style={{ width: 60, height: 60, borderRadius: "50%", background: "linear-gradient(135deg,var(--pink),var(--purple))", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.5rem", fontWeight: 700 }}>W</div>
          <div>
            <div style={{ fontWeight: 600 }}>{form.name}</div>
            <div style={{ fontSize: ".8rem", color: "var(--muted)" }}>{form.role}</div>
          </div>
        </div>
        <div>
          <div style={{ fontSize: ".75rem", color: "var(--muted)", marginBottom: 6, fontWeight: 600, textTransform: "uppercase" }}>Full Name</div>
          <input 
            value={form.name}
            onChange={e => setForm({...form, name: e.target.value})}
            style={{ width: "100%", padding: "10px 12px", background: "rgba(255,255,255,0.06)", border: "1px solid var(--border)", borderRadius: 8, color: "var(--text)", fontSize: ".9rem", outline: "none" }}
          />
        </div>
        <button onClick={handleSubmit} className="btn btn-primary" style={{ width: "100%", marginTop: 8 }}>💾 Save Changes</button>
      </div>
    </Modal>
  );
}

function UserStoryModal({ isOpen, onClose, onSubmit }) {
  const [form, setForm] = useState({ title: "", description: "", priority: "medium", assignee: "", acceptanceCriteria: "" });
  
  const handleSubmit = () => {
    if (form.title) {
      onSubmit(form);
      setForm({ title: "", description: "", priority: "medium", assignee: "", acceptanceCriteria: "" });
      onClose();
    }
  };
  
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="🗂️ Create User Story">
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <div>
          <div style={{ fontSize: ".75rem", color: "var(--muted)", marginBottom: 6, fontWeight: 600, textTransform: "uppercase" }}>Story Title</div>
          <input 
            value={form.title}
            onChange={e => setForm({...form, title: e.target.value})}
            placeholder="e.g., User Authentication Flow"
            style={{ width: "100%", padding: "10px 12px", background: "rgba(255,255,255,0.06)", border: "1px solid var(--border)", borderRadius: 8, color: "var(--text)", fontSize: ".9rem", outline: "none" }}
          />
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <div>
            <div style={{ fontSize: ".75rem", color: "var(--muted)", marginBottom: 6, fontWeight: 600, textTransform: "uppercase" }}>Priority</div>
            <select 
              value={form.priority}
              onChange={e => setForm({...form, priority: e.target.value})}
              style={{ width: "100%", padding: "10px 12px", background: "rgba(255,255,255,0.06)", border: "1px solid var(--border)", borderRadius: 8, color: "var(--text)", fontSize: ".9rem" }}
            >
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>
          <div>
            <div style={{ fontSize: ".75rem", color: "var(--muted)", marginBottom: 6, fontWeight: 600, textTransform: "uppercase" }}>Assignee</div>
            <select 
              value={form.assignee}
              onChange={e => setForm({...form, assignee: e.target.value})}
              style={{ width: "100%", padding: "10px 12px", background: "rgba(255,255,255,0.06)", border: "1px solid var(--border)", borderRadius: 8, color: "var(--text)", fontSize: ".9rem" }}
            >
              <option value="">Unassigned</option>
              <option value="Alice">Alice</option>
              <option value="Bob">Bob</option>
              <option value="Charlie">Charlie</option>
            </select>
          </div>
        </div>
        <div>
          <div style={{ fontSize: ".75rem", color: "var(--muted)", marginBottom: 6, fontWeight: 600, textTransform: "uppercase" }}>Description</div>
          <textarea 
            value={form.description}
            onChange={e => setForm({...form, description: e.target.value})}
            placeholder="Describe the user story..."
            rows={4}
            style={{ width: "100%", padding: "10px 12px", background: "rgba(255,255,255,0.06)", border: "1px solid var(--border)", borderRadius: 8, color: "var(--text)", fontSize: ".9rem", outline: "none", resize: "vertical" }}
          />
        </div>
        <div>
          <div style={{ fontSize: ".75rem", color: "var(--muted)", marginBottom: 6, fontWeight: 600, textTransform: "uppercase" }}>Acceptance Criteria</div>
          <textarea 
            value={form.acceptanceCriteria}
            onChange={e => setForm({...form, acceptanceCriteria: e.target.value})}
            placeholder="1. User can log in with email&#10;2. User receives confirmation email&#10;3. Session persists across refresh"
            rows={3}
            style={{ width: "100%", padding: "10px 12px", background: "rgba(255,255,255,0.06)", border: "1px solid var(--border)", borderRadius: 8, color: "var(--text)", fontSize: ".9rem", outline: "none", resize: "vertical" }}
          />
        </div>
        <button onClick={handleSubmit} className="btn btn-primary" style={{ width: "100%", marginTop: 8 }}>🗂️ Create User Story</button>
      </div>
    </Modal>
  );
}

function Pagination({ current, total, onPageChange }) {
  const pages = [];
  for (let i = 1; i <= Math.min(total, 5); i++) pages.push(i);
  
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, marginTop: 24 }}>
      <button 
        onClick={() => onPageChange(current - 1)}
        disabled={current === 1}
        style={{ padding: "6px 12px", background: "rgba(255,255,255,0.06)", border: "1px solid var(--border)", borderRadius: 6, color: current === 1 ? "var(--muted)" : "var(--text)", cursor: current === 1 ? "not-allowed" : "pointer" }}
      >
        ← Prev
      </button>
      {pages.map(p => (
        <button 
          key={p}
          onClick={() => onPageChange(p)}
          style={{ 
            padding: "6px 12px", 
            background: current === p ? "var(--pink)" : "rgba(255,255,255,0.06)", 
            border: "1px solid var(--border)", 
            borderRadius: 6, 
            color: current === p ? "#fff" : "var(--text)", 
            cursor: "pointer" 
          }}
        >
          {p}
        </button>
      ))}
      <button 
        onClick={() => onPageChange(current + 1)}
        disabled={current === total}
        style={{ padding: "6px 12px", background: "rgba(255,255,255,0.06)", border: "1px solid var(--border)", borderRadius: 6, color: current === total ? "var(--muted)" : "var(--text)", cursor: current === total ? "not-allowed" : "pointer" }}
      >
        Next →
      </button>
    </div>
  );
}

function DashboardFiltersModal({ isOpen, onClose, filters, onApply }) {
  const [local, setLocal] = useState(filters || {});
  useEffect(() => { setLocal(filters || {}); }, [filters, isOpen]);

  const field = (label, key, opts = null) => (
    <div key={key}>
      <div style={{ fontSize: ".72rem", color: "var(--muted)", fontWeight: 600, textTransform: "uppercase", marginBottom: 5 }}>{label}</div>
      {opts ? (
        <select value={local[key] || ""} onChange={e => setLocal(p => ({ ...p, [key]: e.target.value }))}
          style={{ width: "100%", padding: "9px 10px", background: "rgba(255,255,255,0.06)", border: "1px solid var(--border)", borderRadius: 8, color: "var(--text)", fontSize: ".85rem" }}>
          <option value="">All</option>
          {opts.map(o => <option key={o} value={o}>{o}</option>)}
        </select>
      ) : (
        <input value={local[key] || ""} onChange={e => setLocal(p => ({ ...p, [key]: e.target.value }))} placeholder={`Filter by ${label.toLowerCase()}…`}
          style={{ width: "100%", padding: "9px 10px", background: "rgba(255,255,255,0.06)", border: "1px solid var(--border)", borderRadius: 8, color: "var(--text)", fontSize: ".85rem" }} />
      )}
    </div>
  );

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="🔖 Dashboard Filters">
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        <div style={{ fontSize: ".78rem", color: "var(--muted)" }}>Filters apply to the Bugs table and stat cards on the Dashboard.</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          {field("Priority", "priority", ["blocker", "major", "minor"])}
          {field("Status", "status", ["New", "Active", "Resolved", "Closed"])}
          {field("Assignee", "assignee", ["Alice", "Bob", "Charlie", "Waleed"])}
          {field("Severity", "severity", ["Critical", "High", "Medium", "Low"])}
        </div>
        {field("Search title", "titleSearch")}
        <div style={{ display: "flex", gap: 10, marginTop: 6 }}>
          <button className="btn btn-primary" style={{ flex: 1 }} onClick={() => { onApply(local); onClose(); }}>✅ Apply Filters</button>
          <button className="btn btn-sm" style={{ background: "rgba(255,255,255,0.06)", border: "1px solid var(--border)" }}
            onClick={() => { const cleared = {}; setLocal(cleared); onApply(cleared); onClose(); }}>
            ✕ Clear All
          </button>
        </div>
        {Object.keys(local).some(k => local[k]) && (
          <div style={{ padding: "8px 12px", background: "rgba(255,0,153,0.06)", border: "1px solid rgba(255,0,153,0.2)", borderRadius: 8, fontSize: ".73rem", color: "var(--pink)" }}>
            Active: {Object.entries(local).filter(([,v]) => v).map(([k,v]) => `${k}=${v}`).join(" · ")}
          </div>
        )}
      </div>
    </Modal>
  );
}

function getPageContent(page, showToast, modals = {}) {
  const props = { showToast, ...modals, openStatDetail: modals.openStatDetail || (() => {}), backFromDetail: modals.backFromDetail || (() => {}), detailPage: modals.detailPage, setBugs: modals.setBugs, setTests: modals.setTests, bugWorkflow: modals.bugWorkflow, setBugWorkflow: modals.setBugWorkflow, kanbanColumns: modals.kanbanColumns, setKanbanColumns: modals.setKanbanColumns, automationRules: modals.automationRules, setAutomationRules: modals.setAutomationRules, onCreateTest: modals.onCreateTest, onCreateBugFromTest: modals.onCreateBugFromTest, features: modals.features };
  switch (page) {
    case "home":
    case "dashboard":
      return (
        <>
          <DashboardPage {...props} filters={modals.dashboardFilters || {}} setFilters={modals.setDashboardFilters} />
          <div style={{ padding: '1rem' }}>
            <DesignPreview />
          </div>
        </>
      );
    case "activity":
      return <ActivityPage {...props} />;
    case "sprint":
      return <SprintPage {...props} />;
    case "bugs":
    case "allbugs":
      return <BugsPage showToast={showToast} setShowNewBug={modals.setShowNewBug} setPage={modals.setPage} bugs={modals.bugs} setBugs={modals.setBugs} onCreateTest={modals.onCreateTest} features={modals.features} automationRules={modals.automationRules} />;
    case "alltests":
    case "tests":
      return <TestsPage showToast={showToast} setShowNewTest={modals.setShowNewTest} setShowRunTests={modals.setShowRunTests} setShowStartRecording={modals.setShowStartRecording} setPage={modals.setPage} tests={modals.tests} setTests={modals.setTests} />;
    case "record":
      return <RecordTestPage showToast={showToast} setShowStartRecording={modals.setShowStartRecording} />;
    case "runs":
      return <TestRunsPage showToast={showToast} setShowRunTests={modals.setShowRunTests} tests={modals.tests} setTests={modals.setTests} />;
    case "mobile":
      return <MobileTestsPage showToast={showToast} setShowNewTest={modals.setShowNewTest} setPage={modals.setPage} tests={modals.tests} setTests={modals.setTests} />;
    case "api":
      return <APITestsPage showToast={showToast} setShowNewTest={modals.setShowNewTest} tests={modals.tests} setTests={modals.setTests} />;
    case "elements":
      return <ElementRepoPage showToast={showToast} />;
    case "cloud":
      return <CloudRunnerPage showToast={showToast} setShowRunTests={modals.setShowRunTests} />;
    case "kanban":
      return <KanbanPage showToast={showToast} kanbanColumns={modals.kanbanColumns} />;
    case "stories":
      return <UserStoriesPage showToast={showToast} setShowNewUserStory={modals.setShowNewUserStory} userStories={modals.userStories} />;
    case "duplicates":
      return <DuplicatesPage showToast={showToast} />;
    case "ai":
      return <AIPanelPage {...props} />;
    case "aitriage":
      return <AITriagePage showToast={showToast} />;
    case "flows":
      return <FlowDiscoveryPage showToast={showToast} />;
    case "predictions":
      return <PredictionsPage showToast={showToast} />;
    case "generate":
      return <GenerateTestsPage showToast={showToast} setShowGenerateTests={modals.setShowGenerateTests} />;
    case "automation":
      return <AutomationPage {...props} />;
    case "clickup":
      return <ClickUpPage showToast={showToast} setShowSyncNow={modals.setShowSyncNow} setShowAddIntegration={modals.setShowAddIntegration} />;
    case "reports":
      return <ReportsPage showToast={showToast} bugs={modals.bugs} />;
    case "settings":
      return <SettingsPage showToast={showToast} setShowAddIntegration={modals.setShowAddIntegration} setShowInvite={modals.setShowInvite} bugWorkflow={modals.bugWorkflow} setBugWorkflow={modals.setBugWorkflow} kanbanColumns={modals.kanbanColumns} setKanbanColumns={modals.setKanbanColumns} automationRules={modals.automationRules} setAutomationRules={modals.setAutomationRules} />;
    case "design_preview":
      return <DesignPreviewRouter />;
    default:
      return <DashboardPage {...props} />;
  }
}

export default function App() {
  const [page, setPage] = useState("activity");
  // Dashboard filters persistence (localStorage)
  const [dashboardFilters, setDashboardFilters] = useState(() => {
    try {
      const raw = localStorage.getItem('tf_dashboard_filters');
      return raw ? JSON.parse(raw) : {};
    } catch {
      return {};
    }
  });
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [detailPage, setDetailPage] = useState(null);
  const [toast, setToast] = useState("");
  const [theme, setTheme] = useState("dark");
  const [showNewBug, setShowNewBug] = useState(false);
  const [showNewTest, setShowNewTest] = useState(false);
  const [showGenerateTests, setShowGenerateTests] = useState(false);
  const [showRunTests, setShowRunTests] = useState(false);
  const [showSyncNow, setShowSyncNow] = useState(false);
  const [showAddIntegration, setShowAddIntegration] = useState(false);
  const [showStartRecording, setShowStartRecording] = useState(false);
  const [showDashboardFilters, setShowDashboardFilters] = useState(false);

  const openStatDetail = (detailId) => {
    setDetailPage(detailId);
  };

  const backFromDetail = () => {
    setDetailPage(null);
  };

  useEffect(() => {
    document.body.classList.add("loaded");
    const savedTheme = localStorage.getItem("theme") || "dark";
    setTheme(savedTheme);
    document.body.classList.add(`theme-${savedTheme}`);
    setTimeout(() => showToast("System Ready 🚀"), 1000);
  }, []);

  // Persist dashboardFilters to localStorage when changed
  useEffect(() => {
    localStorage.setItem('tf_dashboard_filters', JSON.stringify(dashboardFilters));
  }, [dashboardFilters]);

  const setThemeHandler = (newTheme) => {
    document.body.classList.remove("theme-dark", "theme-neon", "theme-cyberpunk");
    document.body.classList.add(`theme-${newTheme}`);
    localStorage.setItem("theme", newTheme);
    setTheme(newTheme);
  };

  useEffect(() => {
    const canvas = document.getElementById("particles-bg");
    if (!canvas) return;
    
    const ctx = canvas.getContext("2d");
    let particles = [];
    
    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    class Particle {
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 2 + 1;
        this.speedX = (Math.random() - 0.5) * 0.5;
        this.speedY = (Math.random() - 0.5) * 0.5;
      }
      update() {
        this.x += this.speedX;
        this.y += this.speedY;
        if (this.x > canvas.width) this.x = 0;
        if (this.y > canvas.height) this.y = 0;
        if (this.x < 0) this.x = canvas.width;
        if (this.y < 0) this.y = canvas.height;
      }
      draw() {
        const accent = getComputedStyle(document.body).getPropertyValue('--accent').trim() || '#FF0099';
        ctx.fillStyle = accent;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    for (let i = 0; i < 120; i++) {
      particles.push(new Particle());
    }

    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => {
        p.update();
        p.draw();
      });
      requestAnimationFrame(animate);
    }
    animate();

    return () => window.removeEventListener("resize", resize);
  }, []);

  // Shared live data — passed down to pages so forms actually update the tables
  const [bugs, setBugs] = useState([
    { id: "BUG-234", title: "Payment fails on Safari — Stripe timeout", priority: "blocker", severity: "Critical", status: "New", assignee: "Alice", description: "Stripe timeout on Safari", stepsToReproduce: "1. Open Safari\n2. Go to checkout\n3. Pay", foundInBuild: "Build 2024.03.04.1", acceptanceCriteria: "Payment completes successfully", history: [{ from: null, to: "New", timestamp: new Date().toISOString(), user: "Waleed", comment: "Bug created" }], links: [{ type: "commit", value: "abc123" }], comments: [], pullRequests: [], deployments: [], autoCreated: false, parent: "US-042: Checkout Flow" },
    { id: "BUG-233", title: "Login with uppercase email breaks auth", priority: "major", severity: "High", status: "Active", assignee: "Bob", description: "", stepsToReproduce: "", foundInBuild: "", acceptanceCriteria: "", history: [{ from: "New", to: "Active", timestamp: new Date().toISOString(), user: "Bob", comment: "Started working" }], links: [], comments: [], pullRequests: [], deployments: [], autoCreated: false },
    { id: "BUG-231", title: "Checkout button not visible on iOS Safari", priority: "blocker", severity: "Critical", status: "New", assignee: "", description: "", stepsToReproduce: "", foundInBuild: "", acceptanceCriteria: "", history: [], links: [], comments: [], pullRequests: [], deployments: [], autoCreated: true, fromTest: "iOS Checkout" },
    { id: "BUG-229", title: "Dashboard slow load on mobile networks", priority: "minor", severity: "Medium", status: "Active", assignee: "Charlie", description: "", stepsToReproduce: "", foundInBuild: "", acceptanceCriteria: "", history: [], links: [], comments: [], pullRequests: [], deployments: [], autoCreated: false },
    { id: "BUG-226", title: "Search results order inconsistent", priority: "minor", severity: "Low", status: "Resolved", assignee: "Waleed", description: "", stepsToReproduce: "", foundInBuild: "", acceptanceCriteria: "", history: [{ from: "Active", to: "Resolved", timestamp: new Date().toISOString(), user: "Waleed", comment: "Fixed" }], links: [], comments: [], pullRequests: [], deployments: [], autoCreated: false },
  ]);
  const [tests, setTests] = useState([
    { name: "Login Flow — US-01", type: "Web", status: "passed", last: "2 min ago" },
    { name: "Checkout Test — US-02", type: "Web", status: "failed", last: "5 min ago" },
    { name: "Search Feature — US-03", type: "Web", status: "passed", last: "10 min ago" },
    { name: "POST /api/login", type: "API", status: "passed", last: "15 min ago" },
    { name: "iOS Checkout", type: "Mobile", status: "failed", last: "1 hr ago" },
    { name: "Profile Update — US-04", type: "Web", status: "passed", last: "2 hr ago" },
  ]);

  const [bugWorkflow, setBugWorkflow] = useState({
    statuses: ["New", "Active", "Resolved", "Closed"],
    transitions: {
      New: ["Active"],
      Active: ["Resolved"],
      Resolved: ["Closed"],
    },
    customFields: [],
  });

  const [kanbanColumns, setKanbanColumns] = useState([
    { id: "open", label: "Open" },
    { id: "inProgress", label: "In Progress" },
    { id: "inReview", label: "In Review" },
    { id: "resolved", label: "Resolved" },
  ]);

  const [automationRules, setAutomationRules] = useState({
    reassignOnResolve: false,
    autoCloseOnPRMerge: false,
    notifyOnStatusChange: false,
    moveToActiveOnAssign: false,
  });

  const showToast = (msg) => setToast(msg);

  const handleNewBug = (form) => {
    if (!form.title) return;
    const newId = "BUG-" + (235 + bugs.length);
    const newBug = {
      id: newId,
      title: form.title,
      priority: form.priority || "minor",
      severity: form.severity || "Medium",
      status: form.status || "New",
      assignee: form.assignee || "",
      description: form.description || "",
      stepsToReproduce: form.stepsToReproduce || "",
      foundInBuild: form.foundInBuild || "",
      acceptanceCriteria: form.acceptanceCriteria || "",
      history: [{ from: null, to: form.status || "New", timestamp: new Date().toISOString(), user: "Waleed", comment: "Bug created" }],
      links: [],
      comments: [],
      pullRequests: [],
      deployments: [],
      autoCreated: false,
    };
    setBugs(prev => [newBug, ...prev]);
    showToast(`Bug "${form.title}" created — ${newId}`);
  };

  const handleNewTest = (form) => {
    if (!form.name) return;
    setTests(prev => [{ name: form.name, type: form.type || "Web", status: "passed", last: "Just now" }, ...prev]);
    showToast(`Test "${form.name}" created successfully!`);
  };

  const handleGenerateTests = (flows) => {
    showToast(`Generating ${flows.length} tests with AI...`);
  };

  const handleRunTests = (config) => {
    showToast(`Starting test run: ${config.type} on ${config.browser}...`);
  };

  const handleSyncNow = (sync) => {
    showToast("Syncing with ClickUp...");
  };

  const handleAddIntegration = (name) => {
    showToast(`Connecting to ${name}...`);
  };

  const handleStartRecording = () => {
    showToast("Recording started! Click Stop when done.");
  };

  const [showInvite, setShowInvite] = useState(false);
  const [showExport, setShowExport] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showNewUserStory, setShowNewUserStory] = useState(false);
  const [userStories, setUserStories] = useState([]);

  const handleInvite = (email) => {
    showToast(`Invitation sent to ${email}!`);
  };

  const handleExport = ({ format, data }) => {
    const items = Object.entries(data || {}).filter(([,v]) => v).map(([k]) => k).join(", ");
    showToast(`Exporting ${items || "data"} as ${(format || "csv").toUpperCase()}...`);
  };

  const handleSearch = (query) => {
    showToast(`Searching for "${query}"...`);
  };

  const handleProfile = (action) => {
    showToast(`${action} saved!`);
  };

  const handleNewUserStory = (form) => {
    setUserStories(prev => [...prev, form]);
    showToast(`User Story "${form.title}" created successfully!`);
  };

  const handleCreateBugFromTest = (testName) => {
    setShowNewBug(true);
    showToast(`Bug creation prepopulated from ${testName}`);
  };

  const handleCreateTestFromBug = (bug) => {
    setShowNewTest(true);
    showToast(`Test creation prepopulated from ${bug.id}`);
  };

  return (
    <div style={{ background: "#06060f", color: "#e2e8f0", fontFamily: "'Space Grotesk', 'Inter', sans-serif", minHeight: "100vh", overflowX: "hidden" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;600&family=Inter:wght@300;400;500;600;700&display=swap');
        :root{--bg:#06060f;--surface:#0b0b1a;--card:#0f0f22;--cardHi:#141430;--pink:#f72585;--purple:#7209b7;--violet:#a855f7;--cyan:#00f5ff;--green:#00ffa3;--yellow:#ffd60a;--orange:#ff6d00;--blue:#3b82f6;--red:#ef4444;--muted:#4b5563;--text:#e2e8f0;--text2:#94a3b8;--border:rgba(255,255,255,0.06);--borderHi:rgba(255,255,255,0.12);--glass:rgba(255,255,255,0.05);}
        *{margin:0;padding:0;box-sizing:border-box;}
        ::-webkit-scrollbar{width:5px;height:5px;}
        ::-webkit-scrollbar-track{background:#1a1a1a;}
        ::-webkit-scrollbar-thumb{background:#333;border-radius:3px;}
        @keyframes pulse{0%{transform:scale(.95);box-shadow:0 0 0 0 rgba(255,0,153,.7)}70%{transform:scale(1);box-shadow:0 0 0 6px rgba(255,0,153,0)}100%{transform:scale(.95);box-shadow:0 0 0 0 rgba(255,0,153,0)}}
        @keyframes toastIn{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
        @keyframes spin{to{transform:rotate(360deg)}}
        body::before{content:'';position:fixed;inset:0;background:radial-gradient(ellipse 80% 50% at 20% 0%,rgba(255,0,153,0.06) 0%,transparent 60%),radial-gradient(ellipse 60% 40% at 80% 100%,rgba(30,144,255,0.06) 0%,transparent 60%);pointer-events:none;z-index:0;}
        nav{position:sticky;top:0;z-index:200;display:flex;align-items:center;justify-content:space-between;padding:.75rem 1.5rem;background:rgba(10,10,20,0.93);backdrop-filter:blur(24px);border-bottom:1px solid rgba(255,255,255,0.06);height:57px;}
        .nav-logo{font-size:1.1rem;font-weight:700;background:linear-gradient(90deg,var(--pink),var(--blue));-webkit-background-clip:text;-webkit-text-fill-color:transparent;letter-spacing:-0.5px;}
        .nav-logo span{-webkit-text-fill-color:rgba(255,255,255,0.4);font-weight:300;}
        .nav-right{display:flex;align-items:center;gap:.75rem;}
        .nav-badge{padding:.28rem .75rem;border-radius:999px;font-size:.7rem;font-weight:600;background:rgba(255,0,153,0.1);border:1px solid rgba(255,0,153,0.25);color:var(--pink);}
        .nav-link{padding:.32rem .65rem;border-radius:6px;font-size:.75rem;color:rgba(255,255,255,0.35);text-decoration:none;white-space:nowrap;transition:all .25s;background:none;border:none;cursor:pointer;font-family:'Inter',sans-serif;}
        .nav-link:hover{color:#fff;background:rgba(255,255,255,0.04);}
        .nav-link.active{color:#FF0099;background:rgba(255,0,153,0.15);border:1px solid rgba(255,0,153,0.2);}
        .nav-search{background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.06);border-radius:8px;padding:.38rem .9rem;font-size:.8rem;outline:none;color:var(--text);width:210px;display:flex;align-items:center;gap:8px;cursor:pointer;transition:border-color .2s;}
        .nav-search:hover{border-color:rgba(255,255,255,0.14);}
        .nav-search .kbd{margin-left:auto;font-size:.65rem;border:1px solid rgba(255,255,255,0.15);padding:2px 5px;border-radius:4px;opacity:0.5;}
        .latency-pill{display:flex;align-items:center;gap:6px;font-size:.72rem;color:var(--green);background:rgba(0,255,133,0.08);padding:4px 10px;border-radius:99px;border:1px solid rgba(0,255,133,0.18);}
        .nav-search::placeholder{color:var(--muted);}
        .btn{padding:.5rem 1.2rem;border-radius:8px;font-size:.82rem;font-weight:600;cursor:pointer;border:none;transition:all .2s;}
        .btn-primary{background:linear-gradient(135deg,var(--pink),var(--purple));color:#fff;box-shadow:0 0 20px rgba(255,0,153,0.3);}
        .btn-primary:hover{box-shadow:0 0 30px rgba(255,0,153,0.5);transform:translateY(-1px);}
        .btn-sm{padding:.38rem 1rem;font-size:.78rem;}
        .nav-btn{background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.06);border-radius:7px;padding:.32rem .6rem;font-size:.85rem;cursor:pointer;color:var(--text);position:relative;transition:background .18s;}
        .nav-btn:hover{background:rgba(255,255,255,0.09);}
        .notif-dot{position:absolute;top:-2px;right:-2px;width:7px;height:7px;border-radius:50%;background:var(--pink);border:1.5px solid var(--bg);}
        .layout{display:grid;grid-template-columns:240px 1fr;gap:0;min-height:calc(100vh - 57px);position:relative;z-index:1;transition:grid-template-columns .2s ease;}
        .layout.sidebar-collapsed{grid-template-columns:56px 1fr;}
        .layout-with-right{display:grid;grid-template-columns:240px 1fr 270px;gap:0;min-height:calc(100vh - 57px);position:relative;z-index:1;transition:grid-template-columns .2s ease;}
        .layout-with-right.sidebar-collapsed{grid-template-columns:56px 1fr 270px;}
        .sidebar{background:var(--surface);border-right:1px solid var(--border);padding:1rem 0.75rem;position:sticky;top:57px;height:calc(100vh - 57px);overflow-y:auto;display:flex;flex-direction:column;transition:width .2s ease;width:240px;overflow:hidden;}
        .sidebar.collapsed{width:56px;}
        .sidebar::-webkit-scrollbar{width:3px;}
        .sidebar::-webkit-scrollbar-thumb{background:rgba(255,255,255,0.08);border-radius:2px;}
        .sidebar-section{margin-bottom:1.6rem;}
        .sidebar-label{font-size:.58rem;font-weight:700;text-transform:uppercase;letter-spacing:2px;color:rgba(255,255,255,0.2);margin-bottom:.55rem;padding:0 .6rem;display:flex;align-items:center;gap:8px;}
        .sidebar-label::after{content:'';flex:1;height:1px;background:rgba(255,255,255,0.05);}
        .sidebar-item{display:flex;align-items:center;gap:.62rem;padding:.48rem .72rem;border-radius:8px;font-size:.81rem;font-weight:450;cursor:pointer;transition:all .18s ease;color:rgba(255,255,255,0.36);margin-bottom:.12rem;position:relative;border:1px solid transparent;user-select:none;}
        .sidebar-item:hover{background:rgba(255,255,255,0.05);color:rgba(255,255,255,0.82);border-color:rgba(255,255,255,0.06);transform:translateX(2px);}
        .sidebar-item.active{background:rgba(255,0,153,0.1);color:#ff66bb;border-color:rgba(255,0,153,0.18);font-weight:550;}
        .sidebar-item.active::before{content:'';position:absolute;left:0;top:20%;bottom:20%;width:2px;border-radius:2px;background:var(--pink);box-shadow:0 0 8px rgba(255,0,153,0.6);}
        .sidebar-item .sidebar-icon{font-size:.82rem;width:20px;text-align:center;flex-shrink:0;opacity:0.65;transition:opacity .18s;}
        .sidebar-item:hover .sidebar-icon,.sidebar-item.active .sidebar-icon{opacity:1;}
        .sidebar-count{margin-left:auto;font-size:.63rem;font-weight:600;padding:.1rem .42rem;border-radius:999px;background:rgba(255,255,255,0.07);color:rgba(255,255,255,0.38);min-width:18px;text-align:center;}
        .sidebar-count.purple{background:rgba(157,78,221,0.18);color:#b06ee8;}
        .sidebar-item.active .sidebar-count{background:rgba(255,0,153,0.18);color:#ff66bb;}
        .sidebar-footer{padding:.75rem;border-top:1px solid rgba(255,255,255,0.05);display:flex;align-items:center;gap:.65rem;cursor:pointer;transition:background .18s;border-radius:8px;margin:.4rem .5rem .6rem;}
        .sidebar-footer:hover{background:rgba(255,255,255,0.04);}
        .footer-avatar{width:30px;height:30px;border-radius:8px;background:linear-gradient(135deg,var(--pink),var(--purple));display:flex;align-items:center;justify-content:center;font-size:.72rem;font-weight:700;flex-shrink:0;}
        .footer-info{flex:1;min-width:0;}
        .footer-name{font-size:.76rem;font-weight:600;color:var(--text);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}
        .footer-role{font-size:.63rem;color:var(--muted);}
        .footer-gear{font-size:.7rem;color:rgba(255,255,255,0.18);}
        /* ── STAT CARDS — nav-link button style ── */
        .stats-row{display:grid;grid-template-columns:repeat(4,1fr);gap:1rem;margin-bottom:1.5rem;}
        .stat-card{background:var(--card);border:1px solid var(--border);border-radius:16px;padding:1.4rem;position:relative;overflow:hidden;cursor:pointer;user-select:none;text-decoration:none;display:block;transition:transform .18s ease, border-color .18s ease, box-shadow .18s ease, background .18s ease;}
        .stat-card::before{content:'';position:absolute;top:0;left:0;right:0;height:2px;background:linear-gradient(90deg,transparent,var(--accent,var(--pink)),transparent);}
        .stat-card::after{content:'';position:absolute;top:-30px;right:-20px;width:80px;height:80px;border-radius:50%;background:var(--accent,var(--pink));opacity:0.06;filter:blur(20px);}
        .stat-card.pink{--accent:var(--pink);}
        .stat-card.blue{--accent:var(--blue);}
        .stat-card.green{--accent:var(--green);}
        .stat-card.yellow{--accent:var(--yellow);}
        .stat-card.purple{--accent:var(--purple);}
        .stat-card-link{display:flex;align-items:center;gap:4px;margin-top:.65rem;font-size:.63rem;font-weight:600;letter-spacing:.2px;opacity:1;transform:translateY(0);transition:opacity .18s, transform .18s;}
        .stat-card.pink .stat-card-link{color:var(--pink);}
        .stat-card.blue .stat-card-link{color:var(--blue);}
        .stat-card.green .stat-card-link{color:var(--green);}
        .stat-card.yellow .stat-card-link{color:var(--yellow);}
        .stat-card.purple .stat-card-link{color:var(--purple);}
        .stat-card:hover{transform:translateY(-3px);background:rgba(255,255,255,0.04);}
        .stat-card.pink:hover{border-color:rgba(255,45,120,0.35);box-shadow:0 6px 28px rgba(255,45,120,0.15);}
        .stat-card.blue:hover{border-color:rgba(30,144,255,0.35);box-shadow:0 6px 28px rgba(30,144,255,0.15);}
        .stat-card.green:hover{border-color:rgba(0,255,157,0.35);box-shadow:0 6px 28px rgba(0,255,157,0.12);}
        .stat-card.yellow:hover{border-color:rgba(255,214,10,0.35);box-shadow:0 6px 28px rgba(255,214,10,0.1);}
        .stat-card.purple:hover{border-color:rgba(124,58,237,0.35);box-shadow:0 6px 28px rgba(124,58,237,0.15);}
        .stat-card:hover .stat-card-link{opacity:1;transform:translateY(0);}
        .stat-card:active{transform:translateY(-1px) scale(.99);}
        .stat-card.active-card{transform:translateY(-3px);}
        .stat-card.pink.active-card{background:rgba(255,0,153,0.08);border-color:rgba(255,0,153,0.4);box-shadow:0 6px 28px rgba(255,0,153,0.16);}
        .stat-card.blue.active-card{background:rgba(30,144,255,0.08);border-color:rgba(30,144,255,0.4);box-shadow:0 6px 28px rgba(30,144,255,0.16);}
        .stat-card.green.active-card{background:rgba(0,255,133,0.07);border-color:rgba(0,255,133,0.4);box-shadow:0 6px 28px rgba(0,255,133,0.12);}
        .stat-card.yellow.active-card{background:rgba(255,215,0,0.07);border-color:rgba(255,215,0,0.4);box-shadow:0 6px 28px rgba(255,215,0,0.1);}
        .stat-card.purple.active-card{background:rgba(157,78,221,0.08);border-color:rgba(157,78,221,0.4);box-shadow:0 6px 28px rgba(157,78,221,0.15);}
        .stat-card.active-card .stat-card-link{opacity:1;transform:translateY(0);}
        .stat-label{font-size:.7rem;color:var(--muted);text-transform:uppercase;letter-spacing:.1em;font-weight:600;}
        .stat-value{font-size:2rem;font-weight:800;line-height:1;margin:.22rem 0 .1rem;letter-spacing:-0.03em;}
        .stat-card.pink .stat-value{color:var(--pink);}
        .stat-card.blue .stat-value{color:var(--blue);}
        .stat-card.green .stat-value{color:var(--green);}
        .stat-card.yellow .stat-value{color:var(--yellow);}
        .stat-card.purple .stat-value{color:var(--purple);}
        .stat-sub{font-size:.67rem;color:var(--muted);line-height:1.4;}
        .stat-trend.up{color:var(--green);font-weight:600;}
        .stat-trend.down{color:var(--pink);font-weight:600;}
        .grid2{display:grid;grid-template-columns:1fr 1fr;gap:1rem;margin-bottom:1.5rem;}
        .card{background:rgba(255,255,255,0.025);border:1px solid var(--border);border-radius:12px;overflow:hidden;margin-bottom:1.2rem;}
        .card-header{display:flex;align-items:center;justify-content:space-between;padding:.85rem 1.2rem;border-bottom:1px solid var(--border);}
        .card-title{font-size:.84rem;font-weight:600;display:flex;align-items:center;gap:.45rem;}
        .card-body{padding:1.1rem 1.2rem;}
        
        /* ── DETAIL PAGE — full page that replaces main content ── */
        .detail-page{display:none;animation:fadeUp .22s ease forwards;}
        .detail-page.active{display:block;}
        .detail-breadcrumb{display:flex;align-items:center;gap:.5rem;margin-bottom:1.4rem;font-size:.75rem;}
        .detail-back-btn{display:inline-flex;align-items:center;gap:.35rem;padding:.3rem .75rem;border-radius:7px;border:1px solid var(--border);background:rgba(255,255,255,0.04);color:var(--muted);font-size:.73rem;font-weight:600;cursor:pointer;transition:all .15s;}
        .detail-back-btn:hover{background:rgba(255,255,255,0.09);color:var(--text);border-color:rgba(255,255,255,0.14);}
        .breadcrumb-sep{color:rgba(255,255,255,0.2);font-size:.8rem;}
        .breadcrumb-current{color:var(--text);font-weight:600;}
        .detail-banner{border-radius:14px;padding:1.3rem 1.5rem;margin-bottom:1.4rem;display:flex;align-items:center;justify-content:space-between;border:1px solid var(--border);}
        .detail-banner.pink{background:linear-gradient(135deg,rgba(255,0,153,0.1),rgba(255,0,153,0.04));border-color:rgba(255,0,153,0.22);}
        .detail-banner.blue{background:linear-gradient(135deg,rgba(30,144,255,0.1),rgba(30,144,255,0.04));border-color:rgba(30,144,255,0.22);}
        .detail-banner.green{background:linear-gradient(135deg,rgba(0,255,133,0.08),rgba(0,255,133,0.03));border-color:rgba(0,255,133,0.22);}
        .detail-banner.yellow{background:linear-gradient(135deg,rgba(255,215,0,0.08),rgba(255,215,0,0.03));border-color:rgba(255,215,0,0.22);}
        .detail-banner.purple{background:linear-gradient(135deg,rgba(157,78,221,0.1),rgba(157,78,221,0.04));border-color:rgba(157,78,221,0.22);}
        .detail-banner-left{display:flex;align-items:center;gap:1rem;}
        .detail-banner-icon{font-size:2rem;}
        .detail-banner-title{font-size:1.05rem;font-weight:700;letter-spacing:-.3px;}
        .detail-banner-sub{font-size:.73rem;color:var(--muted);margin-top:3px;}
        .detail-stat-row{display:grid;grid-template-columns:repeat(3,1fr);gap:.8rem;margin-bottom:1.3rem;}
        .detail-mini{background:rgba(255,255,255,0.04);border:1px solid var(--border);border-radius:10px;padding:.85rem 1rem;}
        .detail-mini-label{font-size:.61rem;color:var(--muted);text-transform:uppercase;letter-spacing:.5px;margin-bottom:.3rem;font-weight:600;}
        .detail-mini-value{font-size:1.25rem;font-weight:700;}
        
        @keyframes fadeUp{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}
        table{width:100%;border-collapse:collapse;font-size:.82rem;}
        thead tr{background:rgba(255,255,255,0.02);}
        th{padding:8px 16px;text-align:left;font-size:.6rem;font-weight:700;text-transform:uppercase;letter-spacing:.12em;color:var(--muted);}
        td{padding:11px 16px;border-bottom:1px solid var(--border);}
        tr{transition:background .15s;cursor:pointer;}
        tr:hover td{background:rgba(255,255,255,0.03);}
        tr:last-child td{border-bottom:none;}
        .bug-id{font-size:.7rem;color:var(--purple);font-family:'JetBrains Mono',monospace;}
        .bug-title{font-weight:500;}
        .badge{display:inline-flex;align-items:center;gap:.3rem;padding:.2rem .6rem;border-radius:999px;font-size:.7rem;font-weight:600;}
        .badge-blocker{background:rgba(255,45,120,0.12);color:#ff2d78;border:1px solid rgba(255,45,120,0.22);}
        .badge-major{background:rgba(255,214,10,0.12);color:#ffd60a;border:1px solid rgba(255,214,10,0.22);}
        .badge-minor{background:rgba(0,229,255,0.12);color:var(--cyan);border:1px solid rgba(0,229,255,0.22);}
        .badge-open{background:rgba(255,45,120,0.12);color:#ff2d78;border:1px solid rgba(255,45,120,0.22);}
        .badge-progress{background:rgba(0,229,255,0.12);color:var(--cyan);border:1px solid rgba(0,229,255,0.22);}
        .badge-fixed{background:rgba(0,255,157,0.12);color:var(--green);border:1px solid rgba(0,255,157,0.22);}
        .badge-passed{background:rgba(0,255,157,0.12);color:var(--green);border:1px solid rgba(0,255,157,0.22);}
        .badge-failed{background:rgba(255,45,120,0.12);color:#ff2d78;border:1px solid rgba(255,45,120,0.22);}
        .resolution-bar{height:12px;border-radius:99px;background:rgba(255,255,255,0.05);overflow:hidden;margin:.5rem 0;}
        .resolution-fill{height:100%;border-radius:99px;background:linear-gradient(90deg,var(--purple),var(--pink));box-shadow:0 0 12px rgba(124,58,237,0.4);}
        .resolution-labels{display:flex;justify-content:space-between;font-size:.72rem;color:var(--muted);}
        .ai-panel{background:linear-gradient(135deg,rgba(255,0,153,0.08),rgba(30,144,255,0.05));border:1px solid rgba(255,0,153,0.2);border-radius:12px;padding:1.2rem;margin-bottom:1.5rem;}
        .ai-header{display:flex;align-items:center;gap:8px;margin-bottom:14px;}
        .ai-badge{font-size:.65rem;font-weight:700;background:linear-gradient(135deg,var(--pink),var(--blue));color:#fff;padding:2px 7px;border-radius:4px;}
        .ai-item{background:rgba(255,255,255,0.04);border:1px solid rgba(255,0,153,0.15);border-radius:10px;padding:12px;margin-bottom:8px;}
        .ai-item:last-child{margin-bottom:0;}
        .ai-item-title{font-size:.8rem;font-weight:700;margin-bottom:4px;display:flex;align-items:center;gap:6px;}
        .ai-item-desc{font-size:.75rem;color:rgba(255,255,255,0.5);line-height:1.5;}
        .ai-confidence{display:flex;align-items:center;gap:6px;margin-top:8px;}
        .ai-conf-bar{flex:1;height:4px;background:rgba(255,255,255,0.07);border-radius:2px;overflow:hidden;}
        .ai-conf-fill{height:100%;border-radius:2px;background:linear-gradient(90deg,var(--pink),var(--blue));}
        .ai-conf-val{font-size:.7rem;color:var(--pink);font-weight:600;}
        .sprint-info{display:flex;justify-content:space-between;margin-bottom:12px;}
        .sprint-stat{text-align:center;}
        .sprint-stat-val{font-size:1.3rem;font-weight:700;}
        .sprint-stat-lbl{font-size:.65rem;color:var(--muted);}
        .progress-bar{height:6px;background:rgba(255,255,255,0.05);border-radius:99px;overflow:hidden;margin-bottom:6px;}
        .progress-fill{height:100%;border-radius:99px;background:linear-gradient(90deg,var(--purple),var(--pink));box-shadow:0 0 12px rgba(124,58,237,0.35);transition:width .5s ease;}
        .progress-labels{display:flex;justify-content:space-between;font-size:.65rem;color:var(--muted);}
        .tabs{display:flex;gap:6px;margin-bottom:14px;}
        .tab{padding:5px 12px;border-radius:7px;font-size:.7rem;font-weight:600;cursor:pointer;border:1px solid transparent;transition:all .15s;}
        .tab.active{background:rgba(255,0,153,0.15);border-color:rgba(255,0,153,0.25);color:var(--pink);}
        .tab:not(.active){color:var(--muted);}
        .tab:not(.active):hover{color:var(--text);background:rgba(255,255,255,0.04);}
       `}</style>

      {/* Particle Canvas Background */}
      <canvas id="particles-bg" style={{ position: 'fixed', inset: 0, zIndex: -1, opacity: 0.6 }} />

      {/* Toast Container */}
      <div id="toast-container" />

      {/* NAV */}
      <nav className="site-nav">
        <div className="nav-logo">TestFlow</div>
        <div className="nav-center" style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: 1, justifyContent: 'center' }}>
          <div className="latency-pill">
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--green)', animation: 'pulse 2s infinite' }}></span>
            12ms
          </div>
          <button className="nav-search" onClick={() => setShowSearch(true)}>
            <span>🔍</span>
            <span style={{ flex: 1 }}>Search bugs, tests...</span>
            <span className="kbd">⌘K</span>
          </button>
        </div>
        <div className="nav-right">
          <ThemeToggle />
          <button className="nav-btn" style={{ position: 'relative' }}>
            <span>🔔</span>
            <span className="notif-dot"></span>
          </button>
          {/* Design Preview quick nav: wire header to switch to Design Preview route */}
          <button className="nav-btn" onClick={() => setPage('design_preview')} title="Design Preview">
            <span>🎨</span>
          </button>
          <button className="nav-btn" onClick={() => setShowExport(true)}>📥</button>
          <button className="nav-btn" onClick={() => setShowInvite(true)}>✉️</button>
          <span className="nav-badge">Sprint 4</span>
          <button className="btn-primary btn-sm" onClick={() => setShowNewTest(true)}>+ New Test</button>
          <div onClick={() => setShowProfile(true)} style={{ 
            width: 32, 
            height: 32, 
            borderRadius: "9px", 
            background: "linear-gradient(135deg,var(--pink),var(--purple))", 
            display: "flex", 
            alignItems: "center", 
            justifyContent: "center", 
            fontSize: ".78rem", 
            fontWeight: 700, 
            cursor: "pointer",
            boxShadow: "0 0 10px rgba(255,0,153,0.25)"
          }}>W</div>
        </div>
      </nav>

      {/* LAYOUT */}
      <div className={`layout ${PAGES_WITH_RIGHT_PANEL.includes(page) ? 'layout-with-right' : ''}`}>
        {/* SIDEBAR */}
        <aside className="sidebar">
          <div className="sidebar-scroll" style={{ flex: 1, overflowY: 'auto' }}>
            {sidebarNav.map(group => (
              <div key={group.group} className="sidebar-section">
                <div className="sidebar-label">{group.group}</div>
                {group.items.map(item => (
                  <div key={item.id} className={`sidebar-item ${page === item.id ? 'active' : ''}`} onClick={() => {
                    if (item.id === 'dashboard_filters') { setShowDashboardFilters(true); }
                    else setPage(item.id);
                  }}>
                    <span className="sidebar-icon">{item.icon}</span>
                    <span>{item.label}</span>
                    {item.badge && <span className={`sidebar-count ${item.badgePurple ? 'purple' : ''}`}>{item.badge}</span>}
                    {item.id === 'dashboard_filters' && Object.keys(dashboardFilters).some(k => dashboardFilters[k]) && (
                      <span style={{ marginLeft: 'auto', width: 7, height: 7, borderRadius: '50%', background: 'var(--pink)', flexShrink: 0 }} />
                    )}
                  </div>
                ))}
              </div>
            ))}
          </div>

          {/* Sidebar Footer */}
          <div className="sidebar-footer" onClick={() => setShowProfile(true)}>
            <div className="footer-avatar">W</div>
            <div className="footer-info">
              <div className="footer-name">Workspace</div>
              <div className="footer-role">Free Plan · Sprint 4</div>
            </div>
            <span className="footer-gear">⚙</span>
          </div>
        </aside>

        {/* MAIN CONTENT */}
        <main className="main">
          {detailPage ? (
            <DetailPage detailId={detailPage} backFromDetail={() => setDetailPage(null)} bugs={bugs} tests={tests} />
          ) : (
            <motion.h2 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="page-title"
            >
              {PAGE_TITLES[page] || "Dashboard"}
            </motion.h2>
          )}
          
          {!detailPage && (
            <AnimatePresence mode="wait">
              <motion.div
                key={page}
                variants={pageVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
              >
                {getPageContent(page, showToast, { setShowGenerateTests, setShowRunTests, setShowSyncNow, setShowAddIntegration, setShowStartRecording, setShowNewBug, setShowNewTest, setShowInvite, setShowExport, setShowProfile, setShowNewUserStory, setPage, bugs, tests, userStories, openStatDetail: (id) => setDetailPage(id), backFromDetail: () => setDetailPage(null), detailPage, setBugs, bugWorkflow, setBugWorkflow, kanbanColumns, setKanbanColumns, automationRules, setAutomationRules, onCreateTest: handleCreateTestFromBug, onCreateBugFromTest: handleCreateBugFromTest, features: userStories.map(s => s.title) || ["US-042: Checkout Flow", "US-041: Auth Module", "US-040: Payment"], dashboardFilters, setDashboardFilters })}
              </motion.div>
            </AnimatePresence>
          )}
        </main>

        {/* RIGHT PANEL for AI, Dashboard, Home */}
        {PAGES_WITH_RIGHT_PANEL.includes(page) && <AIRightPanel />}
      </div>

      <AnimatePresence>
        {toast && <Toast msg={toast} onDone={() => setToast("")} />}
      </AnimatePresence>
      
      <NewBugModal 
        isOpen={showNewBug} 
        onClose={() => setShowNewBug(false)} 
        onSubmit={handleNewBug} 
      />
      <NewTestModal 
        isOpen={showNewTest} 
        onClose={() => setShowNewTest(false)} 
        onSubmit={handleNewTest}
        onRecordSteps={() => setShowStartRecording(true)}
      />
      <GenerateTestsModal 
        isOpen={showGenerateTests} 
        onClose={() => setShowGenerateTests(false)} 
        onSubmit={handleGenerateTests} 
      />
      <RunTestsModal 
        isOpen={showRunTests} 
        onClose={() => setShowRunTests(false)} 
        onSubmit={handleRunTests}
        tests={tests}
      />
      <SyncNowModal 
        isOpen={showSyncNow} 
        onClose={() => setShowSyncNow(false)} 
        onSubmit={handleSyncNow} 
      />
      <AddIntegrationModal 
        isOpen={showAddIntegration} 
        onClose={() => setShowAddIntegration(false)} 
        onSubmit={handleAddIntegration} 
      />
      <StartRecordingModal 
        isOpen={showStartRecording} 
        onClose={() => setShowStartRecording(false)} 
        onSubmit={handleStartRecording} 
      />
      <InviteModal 
        isOpen={showInvite} 
        onClose={() => setShowInvite(false)} 
        onSubmit={handleInvite} 
      />
      <ExportModal 
        isOpen={showExport} 
        onClose={() => setShowExport(false)} 
        onSubmit={handleExport} 
      />
      <SearchModal 
        isOpen={showSearch} 
        onClose={() => setShowSearch(false)} 
        onSubmit={handleSearch} 
      />
      <ProfileModal 
        isOpen={showProfile} 
        onClose={() => setShowProfile(false)} 
        onSubmit={handleProfile} 
      />
      <UserStoryModal 
        isOpen={showNewUserStory} 
        onClose={() => setShowNewUserStory(false)} 
        onSubmit={handleNewUserStory} 
      />
      <DashboardFiltersModal
        isOpen={showDashboardFilters}
        onClose={() => setShowDashboardFilters(false)}
        filters={dashboardFilters}
        onApply={(f) => { setDashboardFilters(f); showToast("Dashboard filters saved ✓"); }}
      />
    </div>
  );
}
