/* eslint react/no-set-state: 0 */
/* eslint react/no-did-update-set-state: 0 */
/**
 * This module provides a reusable draft-powered text wysiwig editor component
 * @module bulgur/components/DraftEditor
 */
import React, {Component, PropTypes} from 'react';
import Editor from 'draft-js-plugins-editor';
import {
  RichUtils,
  EditorState,
} from 'draft-js';

import createMarkdownShortcutsPlugin from 'draft-js-markdown-shortcuts-plugin';
import createInlineToolbarPlugin, {Separator} from 'draft-js-inline-toolbar-plugin'; // eslint-disable-line import/no-unresolved

import {
  ItalicButton,
  BoldButton,
  UnderlineButton,
  CodeButton,
  HeadlineOneButton,
  HeadlineTwoButton,
  HeadlineThreeButton,
  UnorderedListButton,
  OrderedListButton,
  BlockquoteButton,
  CodeBlockButton,
} from 'draft-js-buttons'; // eslint-disable-line import/no-unresolved

// Deprecated for now - to use in order to add assets in the toolbar
// import FonioBlockTypeSelect from './FonioBlockTypeSelect';

const markdownShortcutsPlugin = createMarkdownShortcutsPlugin();

import {debounce} from 'lodash';

const inlineToolbarPlugin = createInlineToolbarPlugin({
  structure: [
    BoldButton,
    ItalicButton,
    UnderlineButton,
    CodeButton,
    Separator,
    HeadlineOneButton,
    HeadlineTwoButton,
    HeadlineThreeButton,
    UnorderedListButton,
    OrderedListButton,
    BlockquoteButton,
    CodeBlockButton,
  ]
});

import createSideToolbarPlugin from 'draft-js-side-toolbar-plugin'; // eslint-disable-line import/no-unresolved
import 'draft-js-side-toolbar-plugin/lib/plugin.css'; // eslint-disable-line import/no-unresolved
const sideToolbarPlugin = createSideToolbarPlugin();

import 'draft-js-inline-toolbar-plugin/lib/plugin.css'; // eslint-disable-line import/no-unresolved
import './DraftEditor.scss';

import {translateNameSpacer} from '../../helpers/translateUtils';

const {SideToolbar} = sideToolbarPlugin;
const {InlineToolbar} = inlineToolbarPlugin;

import AssetContainer from '../AssetContainer/AssetContainer';

export default class QuinoaDraftEditor extends Component {

  static contextTypes = {
    t: PropTypes.func.isRequired
  }

  constructor (props) {
    super(props);
    this.state = {
      focused: false,
      readonly: false,
      editorState: /*props.content ? EditorState.createWithContent(convertFromRaw(props.content)) :*/ EditorState.createEmpty(),
    };

    this.updateContent = debounce(this.updateContent, 400);

    this.handleEditorChange = (editorState) => {
      this.setState({editorState});
      this.updateContent(editorState);
    };

    this.toggleReadonly = (to) => {
      this.setState({
        readonly: to
      });
    };
    this.handleKeyCommand = this.handleKeyCommand.bind(this);
    this.renderBlock = this.renderBlock.bind(this);
  }

  // todo : rehabilitate that if editor's content can be changed by external contents
  componentWillReceiveProps(props) {
    // update editor if content representation is different between props and state
    if (this.state.content !== props.content) {
      // console.log('received in editor', props.content && Object.keys(props.content.entityMap).length);
      // const contentState = props.content && convertFromRaw(props.content);
      this.setState({
        editorState: props.content // EditorState.acceptSelection(EditorState.createWithContent(contentState), this.state.editorState.getSelection()),
      });
    }
  }

  shouldComponentUpdate() {
    return true;
    // return !this.state.readonly;
  }

  componentWillUpdate(nextProps, nextState) {
    if (nextState.editorState.assetPrompted) {
      nextProps.onAssetPrompted(nextState.editorState.getSelection());
      nextState.editorState.assetPrompted = undefined;
      this.setState({
        editorState: nextState.editorState
      });
    }
  }

  // update is wrapped in this function to allow debouncing it
  updateContent () {
    this.props.update(this.state.editorState);
    // this.props.update(convertToRaw(this.state.editorState.getCurrentContent()));
  }

  renderBlock (contentBlock) {
    const type = contentBlock.getType();
    if (type === 'atomic') {
      return {
        component: AssetContainer,
        editable: false,
        props: {
          assets: this.props.assets,
          updateAsset: this.props.updateAsset,
          storyId: this.props.storyId,
          toggleReadonly: this.toggleReadonly,
          currentContent: this.state.editorState.getCurrentContent()
        }
      };
    }
  }

  handleKeyCommand(command) {
    const newState = RichUtils.handleKeyCommand(this.state.editorState, command);
    if (newState && typeof this.props.update === 'function') {
      this.handleEditorChange(newState);
      return 'handled';
    }
    return 'not-handled';
  }

  render() {
    const translate = translateNameSpacer(this.context.t, 'Components.DraftEditor');
    const onChange = state => {
      this.handleEditorChange(state);
    };
    const onGlobalClick = e => {
      e.stopPropagation();
      this.editorComponent.focus();
    };
    const onFocus = () => this.setState({focused: true});
    const onBlur = () => this.setState({focused: false});

    const onDrop = e => {
      const payload = e.dataTransfer.getData('text');
      const assetId = payload && payload.split('DRAFTJS_ASSET_ID:').pop();
      if (assetId) {
        const metadata = this.props.assets[assetId] && this.props.assets[assetId].metadata;
        const atSelection = this.state.editorState.getSelection();
        this.props.embedAsset(this.props.storyId, assetId, metadata, atSelection);
        // this.editorComponent.focus();
      }
    };

    const bindEditorComponent = (editorComponent) => {
      this.editorComponent = editorComponent;
    };
    return this.state.editorState && (
      <div
        className={'fonio-draft-editor ' + (this.state.focused ? 'focused' : '')}
        onClick={onGlobalClick}
        onDrop={onDrop}>
        <Editor
          editorState={this.state.editorState}
          onChange={onChange}
          handleKeyCommand={this.handleKeyCommand}
          onFocus={onFocus}
          onBlur={onBlur}
          placeholder={translate('write-your-story-here')}
          ref={bindEditorComponent}
          blockRendererFn={this.renderBlock}
          readOnly={this.state.readonly}
          plugins={[
              markdownShortcutsPlugin,
              sideToolbarPlugin,
              inlineToolbarPlugin,
            ]} />
        <SideToolbar />
        <InlineToolbar />
      </div>
    );
  }
}
