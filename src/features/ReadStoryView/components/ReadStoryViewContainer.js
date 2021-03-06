/* eslint react/no-set-state : 0 */
import React, {Component} from 'react';
import PropTypes from 'prop-types';

import {get} from 'axios';

import icons from 'quinoa-design-library/src/themes/millet/icons';
import StoryPlayer from 'quinoa-story-player';

import config from '../../../config';

import {translateNameSpacer} from '../../../helpers/translateUtils';
import DataUrlProvider from '../../../components/DataUrlProvider';
import {Link} from 'react-router-dom';

import {
  Button,
  Icon
} from 'quinoa-design-library/components';


const HomeBtn = () => (
  <Button
    isRounded
    style={{
      position: 'fixed',
      bottom: '1rem',
      right: '1rem'
    }}>
    <Link style={{color: 'black'}} to="/">
      <Icon icon="home" />
    </Link>
  </Button>
);


const Centered = ({children}) => (
  <div style={{
    display: 'flex',
    flexFlow: 'row nowrap',
    alignItems: 'center',
    position: 'absolute',
    left: 0,
    top: 0,
    width: '100%',
    height: '100%'
  }}>
    <div style={{
      display: 'flex',
      flexFlow: 'column nowrap',
      flex: 1,
      alignItems: 'center'
    }}>
      <img style={{height: '2rem'}} src={icons.fonioBrand.svg} />
      {children}
    </div>
  </div>
);


class ReadStoryViewContainer extends Component {

  static contextTypes = {
    t: PropTypes.func,
  }

  constructor(props) {
    super(props);
    this.state = {
      status: 'loading',
      story: undefined,
    };
  }

  componentWillMount = () => {
    const {
      match: {
        params: {
          storyId
        }
      },
    } = this.props;

    get(`${config.restUrl}/stories/${storyId}?edit=false`)
      .then(({data}) => {
        this.setState({
          story: data,
          status: 'loaded'
        });
      })
      .catch(error => {
        this.setState({
          status: 'error',
          error
        });
      });
  }

  shouldComponentUpdate = () => true;


  render() {
    const {
      status,
      story
    } = this.state;

    const translate = translateNameSpacer(this.context.t, 'Features.ReadOnly');
    switch (status) {
      case 'loaded':
        return (
          <DataUrlProvider storyId={story.id} serverUrl={config.apiUrl} >
            <StoryPlayer story={story} />
            <HomeBtn />
          </DataUrlProvider>
          );
      case 'error':
        return <Centered>{translate('Story not found')}</Centered>;
      case 'loading':
        default:
        return <Centered>{translate('Loading')}</Centered>;
    }
  }
}

export default ReadStoryViewContainer;
