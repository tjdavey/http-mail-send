import React, { Component } from 'react';
import {connect} from 'react-redux';

/**
 * Container for handler email sending state
 */
class EmailSender extends Component {
  render() {
    return (
      <h1>Email Sender</h1>
    );
  }
}

/**
 * Function for mapping redux state to properties for the EmailSender container using redux's connect.
 * @param {Object} state - Current redux state.
 * @returns {{email: *}}
 */
function mapStateToProps(state) {
  const {email} = state;

  return {
    email
  };
}

export default connect(mapStateToProps)(EmailSender);