import React, { useState } from 'react';
import infoIc from '../../images/icons/infor-white.svg';

function AdaptiveInput(props: any) {
  const [isActive, setIsActive] = useState(false);
  const [value, setValue] = useState('');

  function handleTextChange(text: any) {
    setValue(text);

    if (text !== '') {
      setIsActive(true);
    } else {
      setIsActive(false);
    }
  }
  return (
    <section className="adaptive-input">
      {props.type != 'textarea' ? (
        <>
          <input
            type={props.type}
            value={value}
            onChange={(e) => handleTextChange(e.target.value)}
          />
          <label htmlFor={props.for} className={isActive ? 'Active' : ''}>
            {props.label}
          </label>
          {props.validate && props.validateContent ? (
            <p className="validate-field animated faster fade-in">
              <img src={infoIc} />
              {props.validateContent}
            </p>
          ) : (
            ''
          )}
        </>
      ) : (
        <>
          <textarea
            value={value}
            onChange={(e) => handleTextChange(e.target.value)}
            rows={5}
          />
          <label htmlFor={props.for} className={isActive ? 'Active' : ''}>
            {props.label}
          </label>
          {props.validate && props.validateContent ? (
            <p className="validate-field animated faster fade-in">
              <img src={infoIc} />
              {props.validateContent}
            </p>
          ) : (
            ''
          )}
        </>
      )}
    </section>
  );
}

export default AdaptiveInput;
