import { isEmpty } from 'lodash';
import React, { memo, useEffect, useState } from 'react';
import SundoraLogo from '../../images/block-questionnaire/logo.png';
import { GET_QUESTIONNAIRE } from '../../config';
import { fetchClient } from '../../redux/Helpers';
import AwesomeSlider from 'react-awesome-slider';
import 'react-awesome-slider/src/core/styles.scss';
import DotLoader from '../DotLoader';
import BlockProduct from './BlockProduct';
import { isMobile } from '../../DetectScreen';
import icBack from '../../images/block-questionnaire/left-arrow.svg';
import icHome from '../../images/block-questionnaire/home.svg';
import { Link } from 'react-router-dom';

function BlockQuestionnaire({ data }: { data: any }) {
  const [dataQuestionnaire, setDataQuestionnaire] = useState<any>([]);
  const [question, setQuestion] = useState<any>([]);
  const [questionSliderIndex, setQuestionSliderIndex] = useState<any>(0);
  const [answerTemp, setAnswerTemp] = useState<any>({
    questionIndex: null,
    answerKey: null,
  });
  // const [questionReady, setQuestionReady] = useState<boolean>(false);
  const [loadingProduct, setLoadingProduct] = useState<boolean>(false);
  const [dotClick, setDotClick] = useState<boolean>(false);
  const [products, setProducts] = useState<Array<any>>([]);
  const [productNotExists, setProductNotExists] = useState<boolean>(false);
  const [lastQuestion, setLastQuestion] = useState<boolean>(false);

  const fetchDataInit = async () => {
    if (isEmpty(dataQuestionnaire)) {
      const options = {
        url: `${GET_QUESTIONNAIRE}${data?.value}`,
        method: 'GET',
        body: null,
      };
      try {
        const res = await fetchClient(options);
        if (res.length > 0) {
          setDataQuestionnaire(res);
          setQuestion([...question, { ...res[0] }]);
        }
      } catch (error) {
        // toastrError(error.message);
      }
    }
  };

  const handleAnswerTemp = (index: any, answerKey: any) => {
    if (index == 5) {
      setLastQuestion(true);
    } else {
      setLastQuestion(false);
    }
    setAnswerTemp({
      ...answerTemp,
      questionIndex: index,
      answerKey: answerKey,
    });
  };

  const handleQuestionSliderDot = (index: any) => {
    if (index < question.length && index != questionSliderIndex) {
      if (questionSliderIndex > 0) {
        const questionClone = [...question];
        setQuestion(questionClone.slice(0, index + 1));
      }
      setQuestionSliderIndex(index);
      setDotClick(true);
    }
  };

  const handleBackOrReStartQuestion = () => {
    if (productNotExists || products.length > 0) {
      setProducts([]);
      setQuestion([{ ...dataQuestionnaire[0] }]);
      setQuestionSliderIndex(0);
      setProductNotExists(false);
      return;
    }
    if (questionSliderIndex > 0) {
      const questionClone = [...question];
      questionClone.pop();
      setQuestion(questionClone);
    }
    const index = questionSliderIndex == 0 ? 0 : questionSliderIndex - 1;
    setQuestionSliderIndex(index);
    setDotClick(true);
  };

  const handleQuestion = () => {
    if (answerTemp.questionIndex == null) {
      return;
    }
    const questionParent = question.find(
      (item: any, index: any) => index == answerTemp.questionIndex,
    );
    if (!lastQuestion && questionParent && questionParent.children) {
      const answer = questionParent.children.find(
        (item: any) => item.data.parent_answer == `answer_${answerTemp.answerKey}`,
      );
      if (answer) {
        if (dotClick) {
          const questionTemp = question.slice(0, answerTemp.questionIndex + 1);
          setQuestion([...questionTemp, { ...answer }]);
          setQuestionSliderIndex(questionTemp.length);
          setDotClick(false);
        } else {
          setQuestion([...question, { ...answer }]);
          setQuestionSliderIndex(question.length);
        }
        setAnswerTemp({
          ...answerTemp,
          questionIndex: null,
          answerKey: null,
        });
        // setQuestionReady(true);
      } else {
        setLoadingProduct(true);
      }
      return;
    }
    setLoadingProduct(true);
  };

  const handleGetProduct = async () => {
    const lastQuestion = question[question.length - 1];
    let childQuestion = lastQuestion;
    if (lastQuestion?.children && lastQuestion?.children.length > 0) {
      childQuestion = lastQuestion.children.find(
        (item: any) => item.data.parent_answer == `answer_${answerTemp.answerKey}`,
      );
    }
    const params = {
      questionnaire_id: childQuestion?.id,
      collections: childQuestion?.data?.collection,
      scents: childQuestion?.data?.scent,
    };
    const options = {
      url: `${GET_QUESTIONNAIRE}`,
      method: 'POST',
      body: params,
    };
    try {
      const res = await fetchClient(options);
      setProducts(res.products);
      setLoadingProduct(false);
      if (res.products.length == 0) {
        setProductNotExists(true);
      }
    } catch (error) {
      // console.log(error);
    }
  };

  useEffect(() => {
    fetchDataInit();
  }, []);

  useEffect(() => {
    if (loadingProduct) {
      handleGetProduct();
    }
  }, [loadingProduct]);

  useEffect(() => {
    handleQuestion();
  }, [answerTemp]);

  return (
    <div
      className="site-questionnaire"
      style={{ backgroundImage: `url('${data?.background?.webp}')`, backgroundSize: 'cover' }}
    >
      {loadingProduct ? <DotLoader /> : ''}
      <div className={`container ${products.length > 0 ? 'opacity-none' : ''}`}>
        {/* Posision asoluste */}
        <button className={`btn-back`} onClick={handleBackOrReStartQuestion}>
          {/* <span className="material-icons">trending_flat</span> */}
          <img className="ic-back" src={icBack} alt="ic-back" />
          <span>{productNotExists || products.length > 0 ? 'RESTART QUIZ' : 'BACK'}</span>
        </button>

        <Link className={`btn-home`} to="/">
          {/* <span className="material-icons">home</span> */}
          <img className="ic-home" src={icHome} alt="ic-home" />
          <br />
          <span>HOME</span>
        </Link>

        {/* Logo */}
        <div className="logo">
          <img src={SundoraLogo} width={130} height="auto" alt="sundora-logo" />
        </div>

        {productNotExists ? (
          <div className="product-not-exists">
            <h2>
              There is no suitable product for you,{' '}
              <span onClick={handleBackOrReStartQuestion}>please try again</span>.
            </h2>
          </div>
        ) : products.length > 0 ? (
          <BlockProduct
            productList={products}
            title={'Top products for you:'}
            subTitle={'Based on your answers here it what we recommend'}
          />
        ) : (
          <div className="question">
            {/* Text question */}
            <h2 className="text-question-step">Question {questionSliderIndex + 1} / 6</h2>

            <AwesomeSlider
              selected={questionSliderIndex}
              fillParent={false}
              mobileTouch={false}
              bullets={false}
              className="animation-slider"
              buttons={false}
            >
              {question.map((item: any, index: any) => (
                <div key={index} className="detail-question">
                  {/* Text question name */}
                  <h1 className="text-question-name">{item.data.question}</h1>

                  {/* line center */}
                  <div className="line-center"></div>

                  {/* Block answer */}
                  <div className="row" style={{ padding: isMobile ? 20 : 13 }}>
                    {[1, 2, 3, 4].map((answer: any) => (
                      <button
                        key={answer}
                        onClick={() => {
                          handleAnswerTemp(index, answer);
                        }}
                        className={`${isMobile ? 'col-12' : 'col'} block-answer ${
                          answerTemp.answerKey == answer ? 'block-answer-active' : ''
                        } ${item.data[`answer_${answer}`] != '' ? '' : 'd-none'}`}
                      >
                        <p>{item.data[`answer_${answer}`]}</p>
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </AwesomeSlider>

            {/* btn next {question */}
            {/* <button className="btn-next" onClick={handleQuestion}>
              <span>Next question</span>
              <span className="material-icons">
                navigate_next
              </span>
            </button> */}

            {/* group dot */}
            <div className="group-dot">
              {Array.from(Array(6).keys()).map((item: any, index: any) => (
                <button
                  key={index}
                  className={`btn-dot${index < question.length ? ' btn-dot-active' : ''}`}
                  onClick={() => handleQuestionSliderDot(index)}
                ></button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default memo(BlockQuestionnaire);
