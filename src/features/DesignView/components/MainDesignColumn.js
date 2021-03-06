import React, {Component} from 'react';
import PropTypes from 'prop-types';
import StoryPlayer from 'quinoa-story-player';
import {render} from 'react-dom';

import {
  Column,
  Button,
  Icon,
} from 'quinoa-design-library/components/';

import {processCustomCss} from '../../../helpers/postcss';

class ContextProvider extends Component {

  static childContextTypes = {
    getResourceDataUrl: PropTypes.func
  }

  getChildContext = () => ({
    getResourceDataUrl: this.props.getResourceDataUrl,
  })
  render = () => {
    return this.props.children;
  }
}

class PreviewWrapper extends Component {

  static contextTypes = {
    getResourceDataUrl: PropTypes.func,
  }

  componentDidMount = () => {
    setTimeout(() => this.update(this.props));
  }
  componentWillReceiveProps = nextProps => {
    if (this.props.story !== nextProps.story || this.props.lang !== nextProps.lang) {
      setTimeout(() => this.update(this.props));
    }
  }

  update = (props) => {
    const {story, lang} = props;
    const {getResourceDataUrl} = this.context;
    const contentDocument = this.iframe && this.iframe.contentDocument;
    const contentWindow = this.iframe && this.iframe.contentWindow;
    if (contentDocument) {
      let mount = contentDocument.getElementById('mount');
      if (!mount) {
        mount = contentDocument.createElement('div');
        mount.id = 'mount';
        contentDocument.body.appendChild(mount);
      }
      render(
        <ContextProvider getResourceDataUrl={getResourceDataUrl}>
          <StoryPlayer
            locale={lang}
            story={{
              ...story,
              settings: {
                ...story.settings,
                css: processCustomCss(story.settings.css)
              }

            }}
            usedDocument={contentDocument}
            usedWindow={contentWindow} />
          <style>
            {'@import url(\'https://fonts.googleapis.com/css?family=Merriweather:400,400i,700,700i|Roboto:400,400i,700,700i,900\')'}
          </style>
        </ContextProvider>
        , mount);
    }
  }
  render = () => {
    const bindRef = iframe => {
      this.iframe = iframe;
    };

    return (<iframe
      name="preview" id="preview" style={{width: '100%', height: '100%'}}
      ref={bindRef} />);
  }
}


const MainDesignColumn = ({
  story,
  lang
}) => {


  return (
    <Column isSize={'fullwidth'} style={{position: 'relative'}}>
      {<PreviewWrapper story={story} lang={lang} />}
      {/*<StoryPlayer
        locale={lang}
        story={{
          ...story,
          settings: {
            ...story.settings,
            css: processCustomCss(story.settings.css)
          }
        }} />*/}
      <Button
        style={{
          position: 'absolute',
          right: '1rem',
          bottom: '1rem'
        }}
        className="is-rounded"
        onClick={() => {
          window.frames.preview.focus();
          window.frames.preview.print();
        }}>
        <Icon isSize="small" isAlign="left">
          <span className="fa fa-print" aria-hidden="true" />
        </Icon>
      </Button>
    </Column>
  );
};


export default MainDesignColumn;
