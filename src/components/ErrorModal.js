import React from 'react';

import './ErrorModal.css';

export default function ErrorModal(props) {
  const {
    children: message, buttonMessage, close, title
  } = props;

  return (
    <>
      <div className="backDrop" />
      <div id="errorModal">
        <div id="headerErrorModal">
          <h2>{title}</h2>
          <span id="closeModalBut" onClick={close}>X</span>
        </div>
        <div id="errorBody">
          <p>{message}</p>
          <button className="but-primary-danger" onClick={close}>{buttonMessage}</button>
        </div>
      </div>
    </>
  );
}
