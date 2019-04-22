import React, { Component } from 'react';
import {Form, Button} from 'react-bootstrap';
import { Editor } from 'react-draft-wysiwyg';
import { EditorState, convertToRaw, ContentState } from 'draft-js';
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';

import '../../node_modules/react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import './EmailForm.css';

/**
 * Container for handler email sending state
 */
class EmailForm extends Component {

  constructor(props) {
    super(props);

    // Setup this initial editor state based on the state of the body property.
    this.state = {editorState: this.getEditorStateFromContent(props.body)};

    this.onSend = this.onSend.bind(this);
    this.onChangeField = this.onChangeField.bind(this);
    this.onChangeEditor = this.onChangeEditor.bind(this);
  }

  componentDidUpdate(prevProps) {
    /*
    Binding the editor directly to the body in the state store causes selection and cursor issues due to the re-render.
    So we only update the editor state when there is a change to `this.props.body` that the editor doesn't have
    stored in the internal state.
    */
    if(prevProps.body !== this.props.body &&
      this.props.body !== draftToHtml(convertToRaw(this.state.editorState.getCurrentContent()))) {
      this.setState({editorState: this.getEditorStateFromContent(this.props.body)});
    }
  }

  /**
   * Generates an editorState object from raw editor content.
   * @param editorContent - The raw content to be set in the editor state.
   */
  getEditorStateFromContent(editorContent) {
    // Try to create the appropriate content block. If theres not HTML content blocks simply setup an empty state.
    const contentBlock = htmlToDraft(editorContent);
    if (contentBlock) {
      const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks);
      return EditorState.createWithContent(contentState);
    }

    return EditorState.createEmpty();
  }

  /**
   * Handles submission of the form to send the email
   */
  onSend(event) {
    event.stopPropagation();
    event.preventDefault();

    this.props.onSend();
  }

  /**
   * Handles changes to regular HTML fields
   * @param {Object} event - The raw javascript event.
   */
  onChangeField(event) {
    const {onChange} = this.props;
    onChange(event.target.name, event.target.value);
  }

  /**
   * Handles changes to the WYSIWYG editor state
   * @param {Object} editorState - A draft.js editorState object representing the current state.
   */
  onChangeEditor(editorState) {
    const {onChange} = this.props;

    // Set the internal editorState
    this.setState({editorState});

    // Push the raw editor content back to the parent.
    const rawContent = draftToHtml(convertToRaw(editorState.getCurrentContent()));
    onChange('body', rawContent);
  }

  render() {
    const {to, subject, isSending} = this.props;

    return (
      <Form onSubmit={this.onSend}>
        <Form.Group controlId="to">
          <Form.Label>To: </Form.Label>
          <Form.Control
            name="to"
            type="email"
            disabled={isSending}
            value={to}
            onChange={this.onChangeField}
          />
        </Form.Group>
        <Form.Group controlId="subject">
          <Form.Label>Subject: </Form.Label>
          <Form.Control
            name="subject"
            type="text"
            disabled={isSending}
            value={subject}
            onChange={this.onChangeField}
          />
        </Form.Group>
        <Form.Group controlId="body">
          <Form.Label>Message: </Form.Label>
          <Editor
            editorState={this.state.editorState}
            wrapperClassName="form-control form-control-editor"
            toolbarClassName="form-control-editor-toolbar"
            editorClassName="form-control-editor-main"
            onEditorStateChange={this.onChangeEditor}
          />
        </Form.Group>
        <Button type="submit" disabled={isSending}>{isSending ? 'Sending…' : 'Send Email'}</Button>
      </Form>
    );
  }
}

export default EmailForm;