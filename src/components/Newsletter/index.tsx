import React, { useEffect, useState } from 'react';
import { GET_USER_INFO, PUT_NEWSLETTER_CONFIG } from '../../config';
import { fetchClient, toastrSuccess } from '../../redux/Helpers';

function Newsletter() {
  const [loading] = useState<any>(false);
  const [dataForm, setDataForm] = useState<any>({
    newsletter_email: true,
    newsletter_sms: true,
  });

  const fetchDataInfoUser = () => {
    if (localStorage.getItem('sundoraToken')) {
      const options = {
        url: GET_USER_INFO,
        method: 'GET',
        body: null,
      };
      fetchClient(options).then((res) => {
        if (res.success) {
          setDataForm({
            newsletter_email: res.data.newsletter_email,
            newsletter_sms: res.data.newsletter_sms,
          });
        }
      });
    }
  };
  useEffect(() => {
    fetchDataInfoUser();
  }, []);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>, isCheckbox = false) => {
    let value: any = event.target.value;
    if (isCheckbox) value = event.target.checked;
    setDataForm({ ...dataForm, [event.currentTarget.name]: value });
  };

  const handleNewsletterSubmit = () => {
    const options = {
      url: PUT_NEWSLETTER_CONFIG,
      method: 'PUT',
      body: dataForm,
    };
    fetchClient(options).then((res) => {
      if (res.success) {
        fetchDataInfoUser();
        toastrSuccess('Update info successfully');
      } else if (res.isError) {
      }
    });
  };

  const renderNewsletter = () => {
    return (
      <div>
        <div className="newsletter-text">
          I consent to Sundora and its service providers, sending me marketing information and
          materials of Sundora&apos;s and its partners&apos; products, services and events, by
          the following methods:
        </div>
        <div className="newsletter">
          <label className="checkbox-button" htmlFor="newsletter_email">
            <input
              type="checkbox"
              className="checkbox-button__input"
              id="newsletter_email"
              name="newsletter_email"
              onChange={(e) => handleChange(e, true)}
              checked={dataForm.newsletter_email}
            />
            <div className="checkbox-button__control"></div>
          </label>
          <label className="checkbox-button__label" htmlFor="newsletter_email">
            Email
          </label>
          &nbsp;
          <label className="checkbox-button" htmlFor="newsletter_sms">
            <input
              type="checkbox"
              className="checkbox-button__input"
              id="newsletter_sms"
              name="newsletter_sms"
              onChange={(e) => handleChange(e, true)}
              checked={dataForm.newsletter_sms}
            />
            <div className="checkbox-button__control"></div>
          </label>
          <label className="checkbox-button__label" htmlFor="newsletter_sms">
            SMS
          </label>
        </div>

        <button className="btn-primary" onClick={handleNewsletterSubmit}>
          SAVE
        </button>
      </div>
    );
  };

  return (
    <section className="tab-Newsletter animated faster fadeIn">
      <h1>Newsletters</h1>
      {loading ? (
        <div className="wrapper-loading">
          <div className="lds-ellipsis">
            <div></div>
            <div></div>
            <div></div>
            <div></div>
          </div>
        </div>
      ) : (
        renderNewsletter()
      )}
    </section>
  );
}
export default Newsletter;
