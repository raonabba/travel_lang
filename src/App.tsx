import { HashRouter, Navigate, Route, Routes } from 'react-router-dom'
import { ProgressProvider, useProgress } from './state/progress'
import CourseSelectPage from './pages/CourseSelectPage'
import HomePage from './pages/HomePage'
import LessonPage from './pages/LessonPage'

function RootRedirect() {
  const { selectedCourseId } = useProgress()
  return <Navigate to={selectedCourseId ? '/learn' : '/courses'} replace />
}

function App() {
  return (
    <ProgressProvider>
      <HashRouter>
        <Routes>
          <Route path="/" element={<RootRedirect />} />
          <Route path="/courses" element={<CourseSelectPage />} />
          <Route path="/learn" element={<HomePage />} />
          <Route path="/lesson/:unitId/:lessonId" element={<LessonPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </HashRouter>
    </ProgressProvider>
  )
}

export default App
