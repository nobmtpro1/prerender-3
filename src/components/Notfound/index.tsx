import React from 'react';
import { Link } from 'react-router-dom';
import notFound from '../../images/404.png';

function Notfound() {
  return (
    <section className="blk-notfound">
      <img src={notFound} loading="lazy" alt="" />
      <Link to="/">Go to home</Link>
    </section>
  );
}
export default Notfound;
