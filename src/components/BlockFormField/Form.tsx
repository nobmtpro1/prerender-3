import { trim } from 'lodash';
import React, { memo, useCallback, useState } from 'react';

export interface Config {
  data: { [k: string]: any };
  method: 'GET' | 'POST' | 'get' | 'post';
  url: string;
}

export interface FormProps {
  name: string;
  config: Config;
}

function Form({ config, name }: FormProps) {
  const [isSent, setIsSent] = useState<boolean>(false);

  const submitOnMount = useCallback(
    (form?: HTMLFormElement) => {
      if (!form) {
        return;
      }

      form.submit();
      setIsSent(true);
    },
    [setIsSent],
  );

  const multiValueRender = (key: string, data: any) => {
    return (
      <>
        {data?.value.split(',').map((item: any, index: any) => {
          return (
            <input type={'hidden'} name={key} key={`${key}_${index}`} value={trim(item)} />
          );
        })}
      </>
    );
  };

  return (
    <>
      <iframe name={name} />
      {!isSent && (
        <form
          target={name}
          action={config.url}
          method={config.method}
          ref={(e: any) => {
            submitOnMount(e);
          }}
          onLoad={() => {
            // console.log('Hello');
          }}
        >
          {Object.keys(config.data).map((key) => {
            if (
              config.data[key].type == 'checkboxes' ||
              config.data[key].type == 'multiselect'
            ) {
              return multiValueRender(key, config.data[key]);
            }
            if (config.data[key].type == 'checkbox' && config.data[key].value != 'true') {
              return <></>;
            }
            return (
              <input
                type={'hidden'}
                name={key}
                key={key}
                value={
                  'string' === typeof config.data[key].value
                    ? config.data[key].value
                    : JSON.stringify(config.data[key].value)
                }
              />
            );
          })}
        </form>
      )}
    </>
  );
}

export default memo(Form);
