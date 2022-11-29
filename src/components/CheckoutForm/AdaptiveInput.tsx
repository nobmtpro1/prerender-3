import React, { useState } from 'react';
import infoIc from '../../images/icons/infor-white.svg';

function AdaptiveInput(props: any) {
  const [isActive, setIsActive] = useState(false);
  const [value, setValue] = useState('');

  function handleTextChange(event: any) {
    setValue(event.target.value);

    if (event.target.value !== '') {
      setIsActive(true);
    } else {
      setIsActive(false);
    }
    props.handleChange(event);
  }

  function handleBlur(event: any) {
    if (value && props.handleBlurInput) {
      event.stopPropagation();
      props.handleBlurInput();
    }
  }
  return (
    <section className="adaptive-input">
      {props.type != 'textarea' ? (
        <>
          <input
            type={props.type}
            value={props.value ? props?.value : ''}
            name={props?.name}
            required={props?.required ? props?.required : false}
            onChange={(e) => handleTextChange(e)}
            onBlur={(e) => handleBlur(e)}
            readOnly={props.readOnly == true ? true : false}
            ref={props?.refName}
          />
          <label htmlFor={props.for} className={isActive || props.value ? 'Active' : ''}>
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
            onChange={(e) => handleTextChange(e)}
            rows={5}
            name={props?.name}
          />
          <label htmlFor={props.for} className={isActive || props.value ? 'Active' : ''}>
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
