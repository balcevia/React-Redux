import React from "react";
import ReactDOM from "react-dom";
import { createStore, applyMiddleware } from "redux";
import reduxThunk from "redux-thunk";
import { connect, Provider } from "react-redux";

import "./styles.css";

function rootReducer(state, action) {
  switch (action.type) {
    case "WITHDRAW":
      console.log("Zdejmujé kwote:" + action.amount);
      state.wartosc = state.wartosc - action.amount;
      return { ...state };
    case "MAKE_SANDWICH":
      console.log(
        "Robię kanapkę dla " +
          action.forPerson +
          " z sosem: " +
          action.secretSauce
      );
      state.ostatniaKanapka =
        "Robię kanapkę dla " +
        action.forPerson +
        " z sosem: " +
        action.secretSauce;
      return { ...state };
    default:
      return state;
  }
}

const myStore = createStore(
  rootReducer,
  { wartosc: 120 },
  applyMiddleware(reduxThunk)
);

function fetchSecretSauce() {
  return fetch("https://isod.ee.pw.edu.pl/isod-portal/wapi");
}

function makeASandwich(forPerson, secretSauce) {
  return {
    type: "MAKE_SANDWICH",
    forPerson,
    secretSauce
  };
}

function withoutMoeny(amount) {
  return {
    type: "WITHOUT"
  };
}

function withdrawMoney(amount) {
  return {
    type: "WITHDRAW",
    amount
  };
}

function apologize(fromPerson, toPerson, error) {
  return {
    type: "Apologize",
    fromPerson,
    toPerson,
    error
  };
}

setTimeout(() => myStore.dispatch(withdrawMoney(100)), 100);
setTimeout(() => myStore.dispatch(withdrawMoney(5)), 1000);
setTimeout(() => myStore.dispatch(withdrawMoney(1)), 3000);

myStore.dispatch(makeASandwichWithASecretSauce("Alf"));

function makeASandwichWithASecretSauce(forPerson) {
  return (dispatch, getstate) => {
    return fetchSecretSauce().then(
      sauce => {
        console.log("Udalo sie?", sauce);
        sauce.text().then(txt => {
          console.log(txt);
          dispatch(makeASandwich(forPerson, txt));
        });
      },
      error => {
        dispatch(apologize("The shop ", forPerson, error));
      }
    );
  };
}

function App(props) {
  console.log("Rerenderuje");
  return (
    <div className="App">
      <h1>Maszyna do robienia kanapek</h1>
      <h2>Stan konta: {props.wartosc}</h2>
      <p>{props.ostatniaKanapka}</p>
    </div>
  );
}

function mapActionsToProps(dispatch) {
  return {};
}

App = connect(
  state => {
    return { ...state };
  },
  mapActionsToProps
)(App);

const rootElement = document.getElementById("root");
ReactDOM.render(
  <Provider store={myStore}>
    <App />
  </Provider>,
  rootElement
);
