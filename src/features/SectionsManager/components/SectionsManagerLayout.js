/**
 * This module exports a stateless component rendering the layout of the sections manager feature interface
 * @module fonio/features/SectionsManager
 */
import React from 'react';
import PropTypes from 'prop-types';
import Modal from 'react-modal';

import {translateNameSpacer} from '../../../helpers/translateUtils';
import SectionCard from '../../../components/SectionCard/SectionCard';


import SectionConfigurationDialog from './SectionConfigurationDialog';
import './SectionsManagerLayout.scss';

Modal.setAppElement('#mount');

/**
 * Renders the sections manager layout
 * @param {object} props - the props to render
 * @return {ReactElement} markup
 */
const SectionsManagerLayout = ({
  activeStoryId,
  sectionCandidate,
  sectionCandidateId,
  sectionPromptedToDelete,
  sections,
  sectionsModalState = 'closed',
  sectionsSearchQuery,
  createSection,
  createSubSection,
  updateSection,
  updateSectionsOrder,
  selectedSectionLevel,
  activeSectionId,

  actions: {
    setActiveSectionId,
    // createSection
    deleteSection,
    setSectionCandidateMetadataValue,
    setSectionsModalState,
    setSectionsSearchQuery,
    startExistingSectionConfiguration,
    requestDeletePrompt,
    abortDeletePrompt,
  },
  style,
}, context) => {
  // namespacing the translation keys with feature id
  const translate = translateNameSpacer(context.t, 'Features.SectionsManager');

  /**
   * Callbacks
   */
  const onModalClose = () => setSectionsModalState('closed');
  const onSearchInputChange = (e) => setSectionsSearchQuery(e.target.value);

  return (
    <div
      className={'fonio-SectionsManagerLayout'}
      style={style}>
      <li id="new-section" onClick={createSection}>
        <span className="fonio-icon">
          <img
            src={require('../../../sharedAssets/close-white.svg')}
            style={{transform: 'rotate(45deg)'}} />
        </span>
        <span>{translate('new-section')}</span>
      </li>
      <ul className="body">
        {
          sections.map((section, index) => {
            const onDelete = () => deleteSection(activeStoryId, section.id);
            const onEdit = () => startExistingSectionConfiguration(section.id, section);
            const onSelect = () => setActiveSectionId(section.id);
            const onUpdateMetadata = (metadata) => {
              updateSection(
                section.id,
                {
                  ...section,
                  metadata
                }
              );
            };
            const onMove = (from, to) => {
              const order = sections.map(thatSection => thatSection.id);
              const sectionId = sections[from].id;
              order.splice(from, 1);
              order.splice(to, 0, sectionId);
              updateSectionsOrder(order);
            };
            const onCreateSubSection = () => {
              createSubSection(section, index);
            };
            const onRequestDeletePrompt = () => {
              requestDeletePrompt(section.id);
            };
            const onAbortDeletePrompt = () => {
              abortDeletePrompt();
            };
            return (
              <SectionCard
                key={index}
                onDelete={onDelete}
                onConfigure={onEdit}
                onSelect={onSelect}

                onRequestDeletePrompt={onRequestDeletePrompt}
                onAbortDeletePrompt={onAbortDeletePrompt}
                promptedToDelete={sectionPromptedToDelete === section.id}

                createSubSection={onCreateSubSection}

                sectionKey={section.id}
                sectionIndex={index}
                onMove={onMove}

                selectedSectionLevel={selectedSectionLevel}
                active={section.id === activeSectionId}
                style={{cursor: 'move'}}
                onUpdateMetadata={onUpdateMetadata}
                {...section} />
            );
          })
        }
      </ul>
      {sections.length > 1 && <div className="footer">
        <input
          className="search-query"
          type="text"
          placeholder={translate('search-in-sections')}
          value={sectionsSearchQuery || ''}
          onChange={onSearchInputChange} />
      </div>}

      <Modal
        isOpen={sectionsModalState !== 'closed'}
        contentLabel={translate('edit-section')}
        onRequestClose={onModalClose}>
        <SectionConfigurationDialog
          sectionCandidate={sectionCandidate}
          sectionCandidateId={sectionCandidateId}
          onClose={onModalClose}
          setSectionCandidateMetadataValue={setSectionCandidateMetadataValue}
          createSection={createSection}
          updateSection={updateSection} />
      </Modal>
    </div>
  );
};


/**
 * Context data used by the component
 */
SectionsManagerLayout.contextTypes = {

  /**
   * Un-namespaced translate function
   */
  t: PropTypes.func.isRequired
};

export default SectionsManagerLayout;
