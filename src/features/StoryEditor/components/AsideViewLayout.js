/**
 * This module exports a stateless component rendering the aside contents of the editor feature interface
 * @module fonio/features/Editor
 */
import React from 'react';
import PropTypes from 'prop-types';
import {Link} from 'react-router-dom';


import {DragDropContext} from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';


import './AsideViewLayout.scss';

import {translateNameSpacer} from '../../../helpers/translateUtils';
import ResourcesManager from '../../ResourcesManager/components/ResourcesManagerContainer.js';
import SectionsManager from '../../SectionsManager/components/SectionsManagerContainer.js';
import AsideToggler from '../../../components/AsideToggler/AsideToggler.js';


/**
 * Renders the aside view of the editor
 * @return {ReactElement} markup
 */
const AsideViewLayout = ({
  activeStory,
  openSettings,
  activeStoryId,
  asideUiMode,
  setAsideUiMode,
  hideNav,
}, context) => {
  // namespacing the translation keys with feature id
  const translate = translateNameSpacer(context.t, 'Features.Editor');
  // todo: should we put this elsewhere ?
  const asideOptions = [
    {
      id: 'resources',
      name: translate('resources-header')
    },
    {
      id: 'sections',
      name: translate('sections-header')
    }
  ];
  return (<aside className="fonio-AsideViewLayout">
    <div className="aside-header">
      <Link to="/">
        <button className="returnToLanding-btn" type="button"><span className="fonio-icon">☰</span> {translate('back-to-home')}</button>
      </Link>
      <button
        className="settings-btn"
        onClick={openSettings}
        type="button">
        <img
          className="fonio-icon-image"
          src={require('../assets/settings.svg')} />
        {activeStory && activeStory.metadata &&
            activeStory.metadata.title &&
            activeStory.metadata.title.length ?
              activeStory.metadata.title
              : translate('untitled-story')} - <i>
                {translate('settings')}</i>
      </button>
      <AsideToggler
        options={asideOptions}
        activeOption={asideUiMode}
        setOption={setAsideUiMode}
        hideNav={hideNav} />
    </div>
    <section className="aside-option-container">
      <ResourcesManager
        activeStory={activeStory}
        activeStoryId={activeStoryId}
        style={{
          left: asideUiMode === 'resources' ? '0' : '-100%'
        }} />
      <SectionsManager
        activeStory={activeStory}
        activeStoryId={activeStoryId}
        style={{
          left: asideUiMode === 'resources' ? '100%' : '0'
        }} />
    </section>
  </aside>);
};


/**
 * Context data used by the component
 */
AsideViewLayout.contextTypes = {

  /**
   * Un-namespaced translate function
   */
  t: PropTypes.func.isRequired
};

export default DragDropContext(HTML5Backend)(AsideViewLayout);
