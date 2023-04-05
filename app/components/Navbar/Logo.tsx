import { Link } from '@remix-run/react';

export default function Logo() {
  return (
    <div className="flex shrink-0 items-center">
      <Link to="/">
        <img className="block h-8 w-auto" src="/Abimotto.png" alt="Cannabis" />
      </Link>
    </div>
  );
}
