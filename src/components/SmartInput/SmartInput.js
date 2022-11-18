import React, { useState } from 'react';
import { EditorState, ContentState } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import { convertToHTML } from 'draft-convert';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import htmlToDraft from 'html-to-draftjs';

import './SmartInut.css';
import { toolbarConfig } from './config';

const SmartInput = ({
  onEditorValueChange,
  value,
  inputLabel,
  required,
}) => {
  // check incoming value
  const contentBlock = htmlToDraft(value);

  const contentState = ContentState.createFromBlockArray(
    contentBlock.contentBlocks,
  );
  const [editorState, setEditorState] = useState(
    () => EditorState.createWithContent(contentState),
  );

  const handleEditorChange = (state) => {
    setEditorState(state);
    convertContentToHTML();
  };
  const convertContentToHTML = () => {
    const currentContentAsHTML = convertToHTML(editorState.getCurrentContent());
    onEditorValueChange(currentContentAsHTML);
  };

  return (
    <div className="SmartInput">
      <label className="labelText">
        {inputLabel}
        { required && ' *'}
      </label>
      <Editor
        toolbar={toolbarConfig}
        editorState={editorState}
        onEditorStateChange={handleEditorChange}
        wrapperClassName="wrapper-class"
        editorClassName="editor-class"
        toolbarClassName="toolbar-class"
      />
    </div>
  );
};
export default SmartInput;
