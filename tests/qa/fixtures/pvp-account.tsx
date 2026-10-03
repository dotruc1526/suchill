import { useState } from 'react';
import { createRoot } from 'react-dom/client';
import DauTriScreen from '../../../src/features/dau-tri/DauTriScreen';
import '../../../src/index.css';

function Fixture() {
  const [epoch, setEpoch] = useState(1);
  const name = epoch % 2 ? 'Account A' : 'Account B';
  return <main>
    <button id="switch-account" onClick={() => setEpoch(value => value + 1)}>Đổi tài khoản</button>
    <DauTriScreen key={epoch} userId={`${name}:${epoch}`} playerName={name} />
  </main>;
}
createRoot(document.getElementById('root')!).render(<Fixture />);
