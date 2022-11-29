import { map, split } from 'lodash';
import React, { memo, useEffect, useState } from 'react';
import logo from '../../images/logo-collect-email.png';
import { API_URL, POST_NEWSLETTER_EMAIL } from '../../config';
import Picture from '../Picture';
import { Form as FormIFrame } from 'react-iframe-form';
import { fetchClient, toastrError, toastrSuccess } from '../../redux/Helpers';

const inputKey = 'email';

function BlockCollectEmail({
  content = {},
  formField = {},
  closeModal = null,
}: {
  content: any;
  formField: any;
  url: any;
  closeModal: any;
}) {
  const [form, setForm] = useState<any>({});
  const [view, setView] = useState<any>(false);
  const handleChange = (event: any) => {
    setForm({ ...form, [inputKey]: event.target.value });
    // setForm({ ...form, [event.currentTarget.name]: event.target.value });
  };
  const handleSubmit = (e: any) => {
    e.preventDefault();
    // if (Object.keys(form).length == 0) {
    //   toastrError('Input is required');
    //   return;
    // }
    setView(true);
    const options = {
      url: POST_NEWSLETTER_EMAIL,
      method: 'POST',
      body: {
        customer: form,
      },
    };
    fetchClient(options).then((res) => {
      if (res.success) {
        toastrSuccess('An email has been sent to your email for verification');
        setView(false);
        closeModal();
      } else if (res.isError) {
        toastrError('Email has already been taken');
      }
    });
    // setView(false);
  };

  useEffect(() => {
    if (!content?.modal) {
      closeModal();
    }
  }, [content]);

  return (
    <section className="blk-collect-email">
      <Picture data={content?.background} />
      <div className="content">
        <img src={logo} loading="lazy" alt="Sundora logotype" />
        <h3 dangerouslySetInnerHTML={{ __html: content?.text }} />
        {view ? (
          <div className="d-none">
            <FormIFrame
              name="collectEmailForm"
              config={{
                url: `${API_URL}/`,
                method: 'post',
                data: form,
              }}
            />
          </div>
        ) : (
          ''
        )}
        <form onSubmit={handleSubmit}>
          <div className="rowgroup">
            {map(formField?.values, (item, index) => {
              if (!item.choices && item.field_type != 'dropdown') {
                return (
                  <input
                    key={index}
                    type={item.field_type}
                    name={inputKey}
                    defaultValue={item.default_value}
                    required={item.required}
                    onChange={handleChange}
                  />
                );
              } else {
                return (
                  <select
                    id={item.clean_name}
                    name={item.clean_name}
                    key={index}
                    defaultValue={item.default_value}
                    onChange={handleChange}
                  >
                    {map(split(item.choices, ','), (i, index) => (
                      <option value={i} key={index}>
                        {i}
                      </option>
                    ))}
                  </select>
                );
              }
            })}
          </div>
          <button type="submit" className="btn-submit" value="Join now">
            Join now
          </button>
        </form>
      </div>
      <p dangerouslySetInnerHTML={{ __html: content?.footer }} className="footer" />
    </section>
  );
}

export default memo(BlockCollectEmail);
