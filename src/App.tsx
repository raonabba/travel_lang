import { HashRouter, Navigate, Route, Routes, useParams } from 'react-router-dom'
import { ProgressProvider, useProgress } from './state/progress'
import CourseSelectPage from './pages/CourseSelectPage'
import HomePage from './pages/HomePage'
import LessonPage from './pages/LessonPage'
import ReviewPage from './pages/ReviewPage'
import FlashcardPage from './pages/FlashcardPage'
import SpeakingPracticePage from './pages/SpeakingPracticePage'

function RootRedirect() {
  const { selectedCourseId } = useProgress()
  return <Navigate to={selectedCourseId ? '/learn' : '/courses'} replace />
}

// React Router reuses the same LessonPage instance across param changes
// (e.g. auto-advancing to the next lesson), so its local state wouldn't
// reset on its own. Keying by the route params forces a clean remount.
function LessonPageRoute() {
  const { unitId, lessonId } = useParams()
  return <LessonPage key={`${unitId}-${lessonId}`} />
}

function App() {
  return (
    <ProgressProvider>
      <HashRouter>
        <Routes>
          <Route path="/" element={<RootRedirect />} />
          <Route path="/courses" element={<CourseSelectPage />} />
          <Route path="/learn" element={<HomePage />} />
          <Route path="/lesson/:unitId/:lessonId" element={<LessonPageRoute />} />
          <Route path="/review" element={<ReviewPage />} />
          <Route path="/flashcards" element={<FlashcardPage />} />
          <Route path="/speaking" element={<SpeakingPracticePage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </HashRouter>
    </ProgressProvider>
  )
}

export default App
