import { StrictMode, useState } from 'react';
import ReactDOM from 'react-dom/client';

const INPUT_TYPES = {
  string: 'text',
  number: 'number',
  boolean: 'checkbox',
  email: 'email',
  tel: 'tel',
};

interface Param {
  id: number;
  name: string;
  type: 'string' | 'number' | 'boolean' | 'email';
}

interface ParamValue {
  paramId: number;
  value: string;
}

interface Model {
  paramValues: ParamValue[];
}

interface Props {
  params: Param[];
  model: Model;
  deleteParam: (index: number) => void;
  newParam: (name: string, type: any) => void;
  changeParam: (index: number, value: string) => void;
  changeModel: (index: number, value: string) => void;
}

const paramExample: Param[] = [
  { id: 1, name: 'Назначение', type: 'string' },
  { id: 2, name: 'Длина', type: 'string' },
];

const modelExample: Model = {
  paramValues: [
    { paramId: 1, value: 'повседневное' },
    { paramId: 2, value: 'макси' },
  ],
};

function ParamEditor(props: Props) {
  const getModel = () => {
    const result = document.getElementById('result') as HTMLElement;
    result.textContent = JSON.stringify(props.model, undefined, 2);
  };

  const addNew = (e: React.FormEvent) => {
    e.preventDefault();
    const input = document.getElementById('new-param') as HTMLInputElement;
    const type = document.getElementById('new-param-type') as HTMLSelectElement;
    props.newParam(input.value, type.value);
    input.value = '';
  };

  return (
    <div className='ParamEditor'>
      <form>
        {props.params.map((param) => (
          <div className='input-control' key={param.id}>
            <input
              type='text'
              name={param.id.toString()}
              id={param.id.toString()}
              value={param.name}
              onChange={(e) => props.changeParam(param.id, e.target.value)}
            />
            <select name='type' id='select-types' defaultValue={param.type}>
              {Object.entries(INPUT_TYPES).map((value, index) => (
                <option key={`${param.id}${value[0]}`} value={value[1]}>
                  {value[0]}
                </option>
              ))}
            </select>
            <button type='button' onClick={() => props.deleteParam(param.id)}>
              -
            </button>
          </div>
        ))}
      </form>
      <form onSubmit={addNew}>
        <input type='text' id='new-param' />
        <select name='type' id='new-param-type'>
          {Object.entries(INPUT_TYPES).map((value, index) => (
            <option key={index} value={value[1]}>
              {value[0]}
            </option>
          ))}
        </select>
        <button>Add</button>
      </form>
      <div className='params-list'>
        <ul>
          {props.params.map((param) => (
            <li key={param.id}>
              <label htmlFor=''>{param.name}</label>
              <input
                type={param.type}
                value={
                  props.model.paramValues.find(
                    (item) => item.paramId === param.id
                  )?.value
                }
                onChange={(e) =>
                  props.changeModel(
                    param.id,
                    e.target.value || e.target.checked.toString()
                  )
                }
              />
            </li>
          ))}
        </ul>
      </div>
      <button type='button' onClick={getModel}>
        getModel()
      </button>
      <pre id='result'></pre>
    </div>
  );
}

function App() {
  const [params, setParams] = useState<Param[]>(paramExample);
  const [model, setModel] = useState<Model>(modelExample);

  const deleteParam = (index: number) => {
    setParams((previous) => previous.filter((item) => item.id !== index));
    setModel({
      ...model,
      paramValues: model.paramValues.filter((item) => item.paramId !== index),
    });
  };

  const newParam = (name: string, type: any) => {
    const length = params.length;
    setParams((previous) => [...previous, { id: length + 1, name, type }]);
    setModel({
      ...model,
      paramValues: [...model.paramValues, { paramId: length + 1, value: '' }],
    });
  };

  const changeParam = (index: number, value: string) =>
    setParams((previous) =>
      previous.map((param) =>
        param.id === index ? { ...param, name: value } : param
      )
    );

  const changeModel = (index: number, value: string) =>
    setModel({
      ...model,
      paramValues: model.paramValues.map((item) =>
        item.paramId === index ? { ...item, value } : item
      ),
    });

  return (
    <div className='App'>
      <ParamEditor
        model={model}
        params={params}
        deleteParam={deleteParam}
        newParam={newParam}
        changeParam={changeParam}
        changeModel={changeModel}
      />
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <StrictMode>
    <App />
  </StrictMode>
);
