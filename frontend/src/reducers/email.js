import {
  EMAIL_SEND_START,
  EMAIL_SEND_SUCCESS,
  EMAIL_SEND_FAILURE,
  EMAIL_FIELD_CHANGE
} from '../actions/email';

const EMAIL_STATE_FIELDS = ['to', 'subject', 'body'];
const DEFAULT_STATE = {
  isSending: false,
  emailState: {
    to: "",
    subject: "",
    body: ""
  },
  lastSent: {}
}

/**
 * Reducer for email mutations.
 * @param {Object} state - State before mutations.
 * @param {Object} action - Action data from the dispatched action.
 */
export default function email(state = {}, action) {
  const newState = Object.assign({}, DEFAULT_STATE, state);

  switch(action.type) {
    case EMAIL_FIELD_CHANGE:
      // Throw an error if attempting to set a field which can't be set on emailState.
      if(EMAIL_STATE_FIELDS.indexOf(action.field) === -1) {
        throw new Error(`Could not change email state for '${action.field}'. Field must be one ` +
          `of ${EMAIL_STATE_FIELDS.join(', ')}`);
      }

      // Set the individual field value on emailState if a valid field
      newState.emailState[action.field] = action.value;
      break;
    case EMAIL_SEND_START:
      // Ensure we're aware a send is currently in progress.
      newState.isSending = true;
      break;
    case EMAIL_SEND_SUCCESS:
      // Cancel isSending and update the lastSent information.
      newState.isSending = false;
      newState.lastSent = {
        success: true,
        provider: action.provider
      };
      break;
    case EMAIL_SEND_FAILURE:
      // Cancel isSending and update the lastSent information.
      newState.isSending = false;
      newState.lastSent = {
        success: false,
        error: action.error
      };
      break;
    default:
      // Note:  EMAIL_INIT will fall through the default. However, no action is required because newState automatically
      // applies the default state to initialise the state object.
      break;
  }

  return newState;
}