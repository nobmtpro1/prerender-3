import { map, get, isEmpty } from 'lodash';
import React, { memo, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import * as action from '../../redux/blogs/actions';
import Loader from '../../components/Loader';
import { fetchCMSHomepage, fetchClient } from '../../redux/Helpers';
import '../../components/BlockBlogs/block-blogs.scss';
import './styles.scss';
import Footer from '../../components/Footer';
import VideoBlock from '../../components/BlockVideo';
import Picture from '../../components/Picture';
import { GET_PAGE_ALL_BLOG_LIST, NAV_PAGE_SLUG } from '../../config';
import { Link } from 'react-router-dom';
import BlockProduct from '../../components/BlockProduct';
import { Helmet } from 'react-helmet-async';

function ArticlePage(props: any) {
  const dispatch = useDispatch();
  // const [dataBlogList, setDataBlogList] = useState<any>([]);
  const [dataNav, setDataNav] = useState<any>([]);
  const [loading, setLoading] = useState<any>([]);
  const [dataArticle, setDataArticle] = useState<any>([]);
  const [dataFooter, setDataFooter] = useState<any>([]);

  const fetchDataInit = async () => {
    // const { slug } = useParams<any>();
    console.log(props.location.pathname);
    const slug =
      props.location && props.location.pathname ? props.location.pathname.slice(6) : undefined;
    if (isEmpty(dataNav) || isEmpty(dataArticle) || isEmpty(dataFooter)) {
      const options = {
        url: `${GET_PAGE_ALL_BLOG_LIST}${slug}`,
        method: 'GET',
        body: null,
      };
      // this.props.loadingPage(true);
      const pending = [fetchCMSHomepage(NAV_PAGE_SLUG), fetchClient(options)];
      try {
        const results = await Promise.all(pending);
        const cmsData = results[0];
        const articleData = results[1];

        const dataDynamicLinks = get(cmsData, 'dynamic_links');
        setDataFooter(dataDynamicLinks?.footer);
        setDataNav(dataDynamicLinks?.navigation);
        setDataArticle(articleData?.data);
        setLoading(false);
      } catch (error) {
        // toastrError(error.message);
        // this.props.loadingPage(false);
      }
    }
  };
  useEffect(() => {
    fetchDataInit();
    dispatch(action.getBlogsList());
  }, []);

  // const filterProductBlock = find(dataArticle?.body, (item) => item.type == 'product');
  return (
    <div className="site-article">
      {loading ? <Loader /> : ''}
      <Helmet>
        <meta property="og:title" content={`${dataArticle?.title} | Sundora`} />
        <meta property="og:description" content={`${dataArticle?.title} | Sundora`} />
        <title>{`${dataArticle?.title ?? 'Blog'} | Sundora`}</title>
        <meta name="description" content={`${dataArticle?.title} | Sundora`} />
      </Helmet>
      {/* <Banner /> */}
      <div className="container">
        <div className="head-article">
          <h1>{dataArticle?.title}</h1>
        </div>
        <div className="body-article">
          <div className="breadcrumb">
            <ul>
              <li>
                <Link to="/">Home</Link>
              </li>
              <li>
                <Link to="/blog">Blog</Link>
              </li>
              <li>{dataArticle?.title}</li>
            </ul>
          </div>
          <div
            className="thumbnail"
            style={{ backgroundImage: `url(${dataArticle?.featured_image?.original})` }}
          ></div>
          <div className="wrapper-content">
            <div className="tags-box">
              <span>Tags: </span>
              {map(dataArticle?.tags, (item, index) => (
                <Link to={`/blogs/tags/${item?.name}`} key={index}>
                  {item?.name}
                </Link>
              ))}
            </div>
            <div className="content">
              {map(dataArticle?.body, (item, index) => {
                switch (item.type) {
                  case 'paragraph':
                    return (
                      <p
                        dangerouslySetInnerHTML={{ __html: item?.value?.text }}
                        key={index}
                      ></p>
                    );
                  case 'images':
                    return (
                      <div className="images-box" key={index}>
                        <div className="wrapper-img row-span">
                          <Picture data={item?.value?.images?.big} />
                        </div>
                        <div className="wrapper-img">
                          <Picture data={item?.value?.images?.top_left} />
                        </div>
                        <div className="wrapper-img">
                          <Picture data={item?.value?.images?.bottom_left} />
                        </div>
                      </div>
                    );
                  case 'blockquote':
                    return (
                      <p className="quote" key={index}>
                        {item?.value?.text}
                      </p>
                    );
                  case 'title':
                    return <h2 key={index}>{item?.value?.title}</h2>;
                  case 'video':
                    return (
                      <VideoBlock
                        data={item.value}
                        title={item?.value?.title}
                        showReadmore={true}
                        key={index}
                      />
                    );
                  case 'product':
                    return (
                      <BlockProduct
                        productList={item?.value?.products.filter(
                          (item: any) => item?.value != null,
                        )}
                        title={item?.value?.headline}
                        key={index}
                      />
                    );
                  default:
                    return;
                }
              })}
            </div>
          </div>
        </div>

        {/* <BlockProduct
          productList={filterProductBlock.value.products}
          title={filterProductBlock.value.headline}
        /> */}
      </div>
      <Footer data={dataFooter} />
    </div>
  );
}

export default memo(ArticlePage);
