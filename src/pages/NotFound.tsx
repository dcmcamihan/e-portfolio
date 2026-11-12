import { useLocation } from 'react-router-dom';
import { LogLine } from '../components/LogLine';
import { TLink } from '../lib/transition';
import { useTitle } from '../lib/useTitle';

/** 404: the only WARN log line on the site. */
export default function NotFound() {
  const loc = useLocation();
  useTitle('Not found');
  return (
    <div className="page wrap notfound">
      <LogLine level="WARN" cmd={`cd ${loc.pathname}`} result="no such file or directory" immediate />
      <h1 className="notfound__code">404</h1>
      <p>This page doesn't exist. Try the work index, or press <kbd>`</kbd> and type <code>help</code>.</p>
      <p><TLink to="/" className="btn">cd ~</TLink></p>
    </div>
  );
}
