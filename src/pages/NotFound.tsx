import { useLocation } from 'react-router-dom';
import { LogLine } from '../components/LogLine';
import { TLink } from '../lib/transition';
import { useTitle } from '../lib/useTitle';

export default function NotFound() {
  const loc = useLocation();
  useTitle('Not found');
  return (
    <div className="page wrap notfound">
      <LogLine level="WARN" cmd={`cd ${loc.pathname}`} result="no such file or directory" />
      <h1 className="section-title">404</h1>
      <p>This page doesn't exist. Try the work index, or press <kbd>`</kbd> and type <code>help</code>.</p>
      <p><TLink to="/" className="btn">cd ~</TLink></p>
    </div>
  );
}
