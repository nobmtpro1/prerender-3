import { filter, findIndex, isArray, join, map, split, trim } from 'lodash';
import React, { memo, useEffect, useState } from 'react';
import logo from '../../images/logo-collect-email.png';
import Picture from '../Picture';
import FormIFrame from './Form';
import { parseUrlAPI, toastrSuccess } from '../../redux/Helpers';
import AdaptiveInput from '../CheckoutForm/AdaptiveInput';
import Select from 'react-dropdown-select';

function BlockFormField({
  content = {},
  formField = {},
  url = '',
}: {
  content: any;
  formField: any;
  url: any;
}) {
  const [form, setForm] = useState<any>({});
  const [submit, setSubmit] = useState<boolean>(false);
  const [view, setView] = useState<any>(false);
  const handleChange = (event: any) => {
    setForm({
      ...form,
      [event.currentTarget.name]: {
        ...form[event.currentTarget.name],
        value: trim(event.target.value),
      },
    });
  };

  const handleChangeSelect = (keyName: any, fieldType: any, value: any) => {
    setForm({ ...form, [keyName]: { ...form[keyName], value: trim(value[0].name) } });
  };

  const handleChangeCheckbox = (event: any) => {
    const value = event.target.checked ? 'true' : '';
    setForm({
      ...form,
      [event.target.name]: { ...form[event.target.name], value: trim(value) },
    });
  };

  const handleChangeCheckboxs = (keyName: any, fieldType: any, event: any) => {
    const value = event?.target?.value;
    const values = form[keyName] ? form[keyName]?.value : '';
    let arrValues = split(values, ',');

    if (event?.target?.checked) {
      if (!arrValues.includes(value)) {
        arrValues.push(value);
      }
    } else {
      arrValues = filter(arrValues, (item: any) => item != value);
    }
    arrValues = filter(arrValues, (item: any) => item != '');
    setForm({ ...form, [keyName]: { ...form[keyName], value: trim(join(arrValues, ',')) } });
  };

  const handleChangeSelectMulti = (keyName: any, fieldType: any, values: any) => {
    const valuesFinal = map(values, (item: any) => {
      return item?.name;
    });
    setForm({ ...form, [keyName]: { ...form[keyName], value: trim(join(valuesFinal, ',')) } });
  };

  const handleSubmit = (event: any) => {
    event.preventDefault();
    // if (Object.keys(form).length == 0) {
    //   toastrError('Input is required');
    //   return;
    // }
    setView(true);
    setSubmit(true);
    toastrSuccess('Successfully joined');
    // setView(false);
  };

  useEffect(() => {
    if (isArray(formField?.values)) {
      const dataForm: any = {};
      formField.values.map((item: any) => {
        let value = item?.default_value;
        if (item.field_type == 'hidden' && value == '') {
          value = 'default';
        }
        if (item.field_type == 'radio') {
          const arrValue = split(item?.choices, ',');

          value = arrValue.length > 0 ? arrValue[0] : '';
          if (item?.default_value != '') {
            const index = findIndex(arrValue, (item: any) => item == item.default_value);
            if (index != -1) {
              value = arrValue[index];
            }
          }
        }
        dataForm[item?.clean_name] = {
          value: value,
          type: item.field_type,
        };
      });
      setForm(dataForm);
    }
  }, [formField]);

  return (
    <section className="blk-form-field">
      <Picture data={content?.background} />
      <div className="content">
        <img src={logo} loading="lazy" alt="Sundora logotype" />
        <h3 dangerouslySetInnerHTML={{ __html: content?.text }} />
        <h2 className={`${submit ? '' : 'd-none'}`}>Thank you!</h2>
        <form className={`${submit ? 'd-none' : ''}`} onSubmit={handleSubmit}>
          {view ? (
            <div className="d-nonesx">
              <FormIFrame
                name="collectEmailForm"
                config={{
                  url: parseUrlAPI(url),
                  method: 'post',
                  data: form,
                }}
              />
            </div>
          ) : (
            ''
          )}
          <div className="rowgroup">
            {map(formField?.values, (item, index) => {
              switch (item.field_type) {
                case 'singleline':
                case 'multiline':
                case 'email':
                case 'url':
                case 'date':
                case 'number':
                  return (
                    <div
                      className={`form-group ${
                        item.field_type == 'date' ? 'off-focus-label' : ''
                      }`}
                      key={index}
                    >
                      <label
                        htmlFor={item.clean_name}
                        className="text-help animated faster fade-in"
                      >
                        {item.help_text}
                        &nbsp;
                        <span className="text-danger">{item.required ? '*' : ''}</span>
                      </label>
                      <AdaptiveInput
                        type={item.field_type != 'multiline' ? item.field_type : 'textarea'}
                        for={item.clean_name}
                        required={item.required}
                        name={item.clean_name}
                        label={item.help_text}
                        value={
                          form.hasOwnProperty(item.clean_name)
                            ? form[item.clean_name]?.value
                            : item.clean_name
                        }
                        validate={false}
                        validateContent={''}
                        handleChange={handleChange}
                      />
                    </div>
                  );
                case 'datetime':
                  return (
                    <div className="form-group off-focus-label" key={index}>
                      <label
                        htmlFor={item.clean_name}
                        className="text-help animated faster fade-in"
                      >
                        {item.help_text}
                        &nbsp;
                        <span className="text-danger">{item.required ? '*' : ''}</span>
                      </label>
                      <AdaptiveInput
                        type="datetime-local"
                        for={item.clean_name}
                        name={item.clean_name}
                        label={item.help_text}
                        required={item.required}
                        value={
                          form.hasOwnProperty(item.clean_name)
                            ? form[item.clean_name]?.value
                            : item.clean_name
                        }
                        validate={false}
                        validateContent={''}
                        handleChange={handleChange}
                      />
                    </div>
                  );
                case 'checkbox':
                  return (
                    <div className="form-group-radio" key={index}>
                      <label
                        htmlFor={item.clean_name}
                        className="text-help animated faster fade-in"
                      >
                        {item.help_text}
                        &nbsp;
                        <span className="text-danger">{item.required ? '*' : ''}</span>
                      </label>
                      <input
                        type={item.field_type}
                        id={item.clean_name}
                        name={item.clean_name}
                        value={form[item.clean_name]?.value}
                        required={item.required}
                        onChange={handleChangeCheckbox}
                      />
                      <label className="text-choise" htmlFor={item.clean_name}>
                        {item.choices}
                      </label>
                    </div>
                  );
                case 'radio':
                case 'checkboxes':
                  return (
                    <div className="form-group-radio" key={index}>
                      <label
                        htmlFor={item.clean_name}
                        className="text-help animated faster fade-in"
                      >
                        {item.help_text}
                        &nbsp;
                        <span className="text-danger">{item.required ? '*' : ''}</span>
                      </label>
                      <div className="row p-3 pt-0">
                        {item?.choices.split(',').map((row: any, index: any) => {
                          return (
                            <div className="col-6 group-item" key={index}>
                              <input
                                type={
                                  item.field_type == 'checkboxes'
                                    ? 'checkbox'
                                    : item.field_type
                                }
                                id={`${item.clean_name}_${index}`}
                                name={`${item.clean_name}`}
                                value={row}
                                defaultChecked={
                                  item.field_type == 'radio' && item.required && index == 0
                                    ? true
                                    : false
                                }
                                required={
                                  item.required
                                    ? form[item.clean_name]?.value != ''
                                      ? false
                                      : true
                                    : false
                                }
                                onChange={(event: any) => {
                                  if (item.field_type == 'checkboxes') {
                                    handleChangeCheckboxs(
                                      item.clean_name,
                                      item.field_type,
                                      event,
                                    );
                                    return;
                                  }
                                  handleChange(event);
                                }}
                              />
                              <label className="text-choise" htmlFor={item.clean_name}>
                                {row}
                              </label>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                case 'hidden':
                  return (
                    <div className="form-group" key={index}>
                      <AdaptiveInput
                        type="hidden"
                        for=""
                        name={item.clean_name}
                        label=""
                        required={item.required}
                        value={item.default_value}
                        validate={false}
                        validateContent={''}
                        handleChange={handleChange}
                      />
                    </div>
                  );

                case 'dropdown':
                case 'multiselect':
                  return (
                    <div className="form-group select-group" key={index}>
                      <label
                        htmlFor={item.clean_name}
                        className="text-help animated faster fade-in"
                      >
                        {item.help_text}
                        &nbsp;
                        <span className="text-danger">{item.required ? '*' : ''}</span>
                      </label>
                      <Select
                        placeholder="Select"
                        className="primary-select"
                        name={item.clean_name}
                        required={item.required}
                        searchable={false}
                        labelField="name"
                        onChange={(event: any) => {
                          if (item.field_type == 'multiselect') {
                            handleChangeSelectMulti(item.clean_name, item.field_type, event);
                            return;
                          }
                          handleChangeSelect(item.clean_name, item.field_type, event);
                        }}
                        valueField="name"
                        options={item?.choices.split(',').map((item: any, index: any) => {
                          return {
                            id: index,
                            name: item,
                          };
                        })}
                        multi={item.field_type == 'multiselect' ? true : false}
                        values={[]}
                      />
                    </div>
                  );
              }
            })}
          </div>
          <p dangerouslySetInnerHTML={{ __html: content?.footer }} className="footer" />
          <button type="submit" className="btn-submit" value="Submit">
            Submit
          </button>
        </form>
        {/* )} */}
      </div>
    </section>
  );
}

export default memo(BlockFormField);
