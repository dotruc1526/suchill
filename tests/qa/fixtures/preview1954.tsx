import React from 'react'
import { createRoot } from 'react-dom/client'
import { LearningJourney } from '../../../src/features/learning/journey/LearningJourney'
import { theme } from '../../../src/theme/tokens'
import '../../../src/index.css'
document.body.style.background = theme.colors.appBg
function Fixture() {
  return <main style={{ maxWidth: 420, margin: '0 auto' }}><LearningJourney onSafeToUpdateChange={safe => {
    Object.assign(window, { preview1954Safe: safe })
  }} /></main>
}
createRoot(document.getElementById('root')!).render(<React.StrictMode><Fixture /></React.StrictMode>)
