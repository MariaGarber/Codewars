import React from 'react';
import './Question.css';

const Question = ({ question, example, constraints }) => {
  let ex = Object.keys(example);
  let q = [];
  if (question.body) q = question.body.split('/n');

  return (
    <div className='question'>
      <div>
        <h1>{question.title}</h1>
        <div className='question-line'> </div>
      </div>
      <div>
        {q
          ? q.map(element => {
              return <p>{element}</p>;
            })
          : null}
      </div>
      {ex.map((key, index) => {
        return (
          <div>
            <h2 className='example-color'>Example {index + 1}:</h2>
            <div className='question-example'>
              <p>
                <b>Input: </b> {example[key].input}
              </p>
              <p>
                <b>Output:</b> {example[key].output}
              </p>
              {example[key].explanation !== '' ? (
                <p>
                  <b>Explanation:</b> {example[key].explanation}
                </p>
              ) : null}
            </div>
          </div>
        );
      })}
      {!constraints[0] ? null : (
        <div>
          <h2>Constraints:</h2>
          <div className='question-example'>
            <ul>
              {constraints.map((key, index) => {
                return <li key={index}>{key}</li>;
              })}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};
export default Question;
