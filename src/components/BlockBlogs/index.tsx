import React from 'react';
import PropTypes from 'prop-types';
import ItemArticle from './ItemArticle';
import { Link } from 'react-router-dom';
import { isMobile } from '../../DetectScreen';

function BlockBlogs({ blogList, title }: { blogList: any; title: string }) {
  return (
    <section className="blk-blog-list">
      <div className="container">
        <h3 className="title-block">{title}</h3>
        <div className="row list-article">
          {blogList.map((item: any, index: number) => (
            <div className={`col-12 col-md-4 ${isMobile ? 'wrapper-mobile' : ''}`} key={index}>
              <ItemArticle articleItem={item} />
            </div>
          ))}
        </div>
      </div>
      <Link to="/blog" className="btn-see-all">
        see all our blog posts
      </Link>
    </section>
  );
}
BlockBlogs.propTypes = {
  blogList: PropTypes.array,
  title: PropTypes.string,
};

export default BlockBlogs;
