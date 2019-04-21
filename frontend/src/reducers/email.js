import {EMAIL_SEND_START, EMAIL_SEND_SUCCESS, EMAIL_SEND_FAILURE} from '../actions/email';

/**
 * Reducer for email mutations.
 * @param {Object} state - State before mutations.
 * @param {Object} action - Action data from the dispatched action.
 */
export default function email(state = {}, action) {
  const newState = Object.assign({}, state);

  switch(action.type) {
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
      break;
  }

  return newState;
}