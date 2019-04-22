import React, { Component } from 'react';
import {connect} from 'react-redux';

import {changeEmailField, initEmail, sendEmail} from '../actions/email';

import PageWrapper from '../components/PageWrapper'
import EmailForm from '../components/EmailForm'

/**
 * Container for handler email sending state
 */
class EmailSender extends Component {

  constructor(props) {
    super(props);

    this.onSend = this.onSend.bind(this);
    this.onChange = this.onChange.bind(this);
  }

  componentDidMount() {
    const {dispatch} = this.props;

    // Init the email state. Note: if fired repeatedly this won't overwrite existing state.
    dispatch(initEmail());
  }

  /**
   * Handles when an email is sent
   * @param {String} field - The email state field to mutate
   * @param {Any} value - The new value
   */
  onSend() {
    const {dispatch} = this.props;
    dispatch(sendEmail(this.props.email.emailState));
  }

  /**
   * Handles changes to email state
   * @param {String} field - The email state field to mutate
   * @param {Any} value - The new value
   */
  onChange(field, value) {
    const {dispatch} = this.props;
    dispatch(changeEmailField(field, value));
  }

  render() {
    const {email} = this.props;

    return (
      <PageWrapper>
        <EmailForm
          to={email.emailState.to}
          subject={email.emailState.subject}
          body={email.emailState.body}
          lastSent={email.lastSent}
          isSending={email.isSending}
          onChange={this.onChange}
          onSend={this.onSend}
        />
      </PageWrapper>
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