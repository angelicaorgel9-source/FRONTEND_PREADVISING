import "./App.css";
import React, { Suspense, lazy } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Login from "./login/login.jsx";
import { SidebarProvider } from "./navbar/nav.jsx";
import Layout from "./layout/Layout.jsx";

import YearLevel from "./yearLevel/yearLevel.jsx";
import Section from "./yearLevel/section/section.jsx";
import List from "./yearLevel/list/list.jsx";
import ViewGrade from "./yearLevel/viewGrade/viewGrade.jsx";

import PreAdvising from "./pre-advising/pre-Advising.jsx";
import PreAdvisingList from "./pre-advising/pre-Advising list.jsx";
import PreAdvisingSections from "./pre-advising/sections.jsx";
import PreAdvisingStudent from "./pre-advising/pre-AdvisingStudent.jsx";

import Schedule from "./schedule/schedule.jsx";
import ViewSection from "./schedule/viewSection.jsx";
import ViewSchedule from "./schedule/viewSchedule.jsx";
import Settings from "./settings/settings.jsx";

import Report from "./report/report.jsx";
import ReportYear from "./report/reportYear.jsx";
import ReportSubject from "./report/reportSubject.jsx";

import Profile from "./settings/profile.jsx";

import PreAdvisingFirstSem from "./pre-advising/pre-AdvisingFirstSem.jsx";
import PreAdvisingSecondSem from "./pre-advising/pre-AdvisingSecondSem.jsx";
import PreAdvisingSubjects from "./pre-advising/pre-AdvisingSubjects.jsx";


// Lazy loaded dashboard
const Dashboard = lazy(() => import("./dashboard/dashboard.jsx"));

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: 40, color: '#666' }}>
          Something went wrong loading this page. Please go back and try again.
        </div>
      );
    }

    return this.props.children;
  }
}

function App() {
  return (
    <BrowserRouter>
      <SidebarProvider>
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<Login />} />

          <Route element={<Layout />}>
            <Route
              path="/dashboard"
              element={
                <Suspense fallback={null}>
                  <Dashboard />
                </Suspense>
              }
            />
            <Route path="/year-level" element={<YearLevel />} />
            <Route path="/pre-advising" element={<PreAdvising />} />
            <Route path="/pre-advising-list" element={<PreAdvisingList />} />
            <Route path="/pre-advising-sections" element={<PreAdvisingSections />} />
            <Route path="/pre-advising-student" element={<PreAdvisingStudent />} />
            <Route path="/pre-advising-1st-sem" element={<PreAdvisingFirstSem />} />
            <Route path="/pre-advising-2nd-sem" element={<PreAdvisingSecondSem />} />
            <Route path="/pre-advising-subjects" element={<PreAdvisingSubjects />} />
            <Route path="/schedule" element={<Schedule />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/section" element={<Section />} />
            <Route path="/list" element={<List />} />
            <Route
              path="/viewGrade"
              element={
                <ErrorBoundary>
                  <ViewGrade />
                </ErrorBoundary>
              }
            />
            <Route path="/viewSection" element={<ViewSection />} />
            <Route path="/viewSchedule" element={<ViewSchedule />} />
            <Route path="/report" element={<Report />} />
            <Route path="/report/year" element={<ReportYear />} />
            <Route path="/report/subject" element={<ReportSubject />} />
          </Route>
        </Routes>
      </SidebarProvider>
    </BrowserRouter>
  );
}

export default App;