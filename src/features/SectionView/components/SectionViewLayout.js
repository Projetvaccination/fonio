import React from 'react';
import PropTypes from 'prop-types';

import {v4 as genId} from 'uuid';

import {arrayMove} from 'react-sortable-hoc';

import {
  Columns,
  Button,
  ModalCard
} from 'quinoa-design-library/components/';


import {translateNameSpacer} from '../../../helpers/translateUtils';
import {createDefaultSection} from '../../../helpers/schemaUtils';
import {
  getReverseSectionsLockMap,
  checkIfUserHasLockOnSection,
  getReverseResourcesLockMap,
  getUserResourceLockId,
} from '../../../helpers/lockUtils';

import AsideSectionColumn from './AsideSectionColumn';
import MainSectionColumn from './MainSectionColumn';

import LoadingScreen from '../../../components/LoadingScreen';


const SectionViewLayout = ({
  asideTabMode,
  asideTabCollapsed,
  mainColumnMode,
  resourceSortVisible,
  resourceFilterVisible,
  resourceFilterValues,
  resourceSortValue,
  resourceSearchString,

  lockingMap = {},
  activeUsers,
  userId,
  promptedToDeleteSectionId,

  editorStates,
  editorFocus,
  assetRequestState,

  story,
  section,
  actions: {
    setAsideTabMode,
    setAsideTabCollapsed,
    setMainColumnMode,
    setResourceSortVisible,
    setResourceFilterVisible,
    setResourceFilterValues,
    setResourceSortValue,
    setResourceSearchString,

    setPromptedToDeleteSectionId,

    updateSection,
    createSection,
    deleteSection,
    updateSectionsOrder,
    promptAssetEmbed,
    unpromptAssetEmbed,
    setEditorFocus,

    enterBlock,
    leaveBlock,


    createContextualization,
    createContextualizer,
    createResource,

    updateDraftEditorState,
    updateDraftEditorsStates,

    updateContextualizer,
    updateResource,
    deleteContextualization,
    deleteContextualizer,
    deleteResource,

    setAssetRequestContentId,
    startNewResourceConfiguration,
    startExistingResourceConfiguration,
  },
  goToSection,
  summonAsset
}, {
  t
}) => {
  const translate = translateNameSpacer(t, 'Features.SectionView');
  const {id: storyId, resources} = story;
  const {id: sectionId} = section;
  const defaultSection = createDefaultSection();

  const reverseSectionLockMap = getReverseSectionsLockMap(lockingMap, activeUsers, storyId);
  const hasLockOnSection = checkIfUserHasLockOnSection(lockingMap, userId, storyId, sectionId);
  const userLockedResourceId = getUserResourceLockId(lockingMap, userId, storyId);
  const reverseResourcesLockMap = getReverseResourcesLockMap(lockingMap, activeUsers, storyId);

  const sectionsList = story.sectionsOrder
  .map(thatSectionId => {
    let lockStatus;
    if (reverseSectionLockMap[thatSectionId]) {
      if (reverseSectionLockMap[thatSectionId].userId === userId) {
        lockStatus = 'active';
      }
      else {
        lockStatus = 'locked';
      }
    }
    else {
      lockStatus = 'open';
    }
    return {
      ...story.sections[thatSectionId],
      lockData: reverseSectionLockMap[thatSectionId],
      lockStatus
    };
  });

  const activeFilters = Object.keys(resourceFilterValues).filter(key => resourceFilterValues[key]);
  const resourcesList = Object.keys(resources).map(resourceId => resources[resourceId]);
  const visibleResources = resourcesList
    .filter(resource => {
      if (activeFilters.indexOf(resource.metadata.type) > -1) {
        if (resourceSearchString.length) {
         return JSON.stringify(resource).toLowerCase().indexOf(resourceSearchString.toLowerCase()) > -1;
        }
        return true;
      }
      return false;
    })
    .sort((a, b) => {
        switch (resourceSortValue) {
          case 'edited recently':
            if (a.lastUpdateAt > b.lastUpdateAt) {
              return -1;
            }
            return 1;
          case 'title':
          default:
            if (a.metadata.title.toLowerCase().trim() > b.metadata.title.toLowerCase().trim()) {
              return 1;
            }
            return -1;
        }
      });

  const onNewSectionSubmit = (metadata) => {
    const newSection = {
      ...defaultSection,
      metadata,
      id: genId()
    };

    createSection({
      section: newSection,
      sectionId: newSection.id,
      storyId,
      userId
    });
    setMainColumnMode('edit');
    goToSection(newSection.id);
  };

  /**
   * DELETE SECTION MANAGEMENT
   */

  // if modal to delete section was prompted and in the meantime someone has entered this section
  // then we unset the delete prompt on that section
  if (promptedToDeleteSectionId && reverseSectionLockMap[promptedToDeleteSectionId]) {
    setPromptedToDeleteSectionId(undefined);
  }

  const onDeleteSection = thatSectionId => {
    setPromptedToDeleteSectionId(thatSectionId);
  };

  const actuallyDeleteSection = thatSectionId => {
    // make sure that section is not edited by another user to prevent bugs and inconsistencies
    // (in UI delete button should be disabled when section is edited, this is a supplementary safety check)
    if (!reverseSectionLockMap[thatSectionId]) {
      deleteSection({
        sectionId: thatSectionId,
        storyId,
        userId,
        blockId: thatSectionId,
        blockType: 'sections',
      });
    }
  };

  const onDeleteSectionConfirm = () => {
    actuallyDeleteSection(promptedToDeleteSectionId);
    setPromptedToDeleteSectionId(undefined);
  };

  const onOpenSectionSettings = () => {
    setMainColumnMode('editmetadata');
  };

  const onSectionsSortEnd = ({oldIndex, newIndex}) => {
    const sectionsIds = sectionsList.map(thatSection => thatSection.id);
    const newSectionsOrder = arrayMove(sectionsIds, oldIndex, newIndex);

    updateSectionsOrder({
      storyId,
      userId,
      sectionsOrder: newSectionsOrder,
    });
  };

  const onUpdateSection = thatSection => {
    if (thatSection && reverseSectionLockMap[thatSection.id] === userId) {
      updateSection({
        sectionId,
        storyId,
        userId,

        section: thatSection,
      });
    }
  };

  const onResourceEditAttempt = resourceId => {
     enterBlock({
      storyId,
      userId,
      blockType: 'resources',
      blockId: resourceId
    });
  };

  return (
    <div>
      <Columns isFullHeight>
        <AsideSectionColumn
          asideTabCollapsed={asideTabCollapsed}
          asideTabMode={asideTabMode}
          mainColumnMode={mainColumnMode}
          resourceSortVisible={resourceSortVisible}
          resourceFilterVisible={resourceFilterVisible}
          story={story}
          sections={sectionsList}

          userId={userId}
          reverseResourcesLockMap={reverseResourcesLockMap}
          userLockedResourceId={userLockedResourceId}

          visibleResources={visibleResources}
          resourceSearchString={resourceSearchString}
          setResourceSearchString={setResourceSearchString}
          resourceFilterValues={resourceFilterValues}
          setResourceFilterValues={setResourceFilterValues}
          resourceSortValue={resourceSortValue}
          setResourceSortValue={setResourceSortValue}

          deleteResource={deleteResource}

          onResourceEditAttempt={onResourceEditAttempt}

          onOpenSectionSettings={onOpenSectionSettings}
          setResourceSortVisible={setResourceSortVisible}
          setResourceFilterVisible={setResourceFilterVisible}
          setAsideTabMode={setAsideTabMode}
          setAsideTabCollapsed={setAsideTabCollapsed}
          setMainColumnMode={setMainColumnMode}
          onSortEnd={onSectionsSortEnd}

          onDeleteSection={onDeleteSection} />
        {hasLockOnSection ?
          <MainSectionColumn
            userLockedResourceId={userLockedResourceId}
            mainColumnMode={mainColumnMode}
            setMainColumnMode={setMainColumnMode}
            section={section}
            story={story}
            userId={userId}
            defaultSectionMetadata={defaultSection.metadata}
            editorStates={editorStates}
            editorFocus={editorFocus}
            assetRequestState={assetRequestState}

            onNewSectionSubmit={onNewSectionSubmit}

            updateSection={onUpdateSection}

            promptAssetEmbed={promptAssetEmbed}
            unpromptAssetEmbed={unpromptAssetEmbed}
            setEditorFocus={setEditorFocus}

            createContextualization={createContextualization}
            createContextualizer={createContextualizer}
            createResource={createResource}

            enterBlock={enterBlock}
            leaveBlock={leaveBlock}

            updateDraftEditorState={updateDraftEditorState}
            updateDraftEditorsStates={updateDraftEditorsStates}

            updateContextualizer={updateContextualizer}
            updateResource={updateResource}
            deleteContextualization={deleteContextualization}
            deleteContextualizer={deleteContextualizer}

            setAssetRequestContentId={setAssetRequestContentId}
            startNewResourceConfiguration={startNewResourceConfiguration}
            startExistingResourceConfiguration={startExistingResourceConfiguration}
            summonAsset={summonAsset} />
            : <LoadingScreen />
        }
        {
          promptedToDeleteSectionId &&
          !reverseSectionLockMap[promptedToDeleteSectionId] &&
          <ModalCard
            isActive
            headerContent={translate('Delete a section')}
            mainContent={
              <div>
                {(story && story.sections[promptedToDeleteSectionId]) ? translate(
                    'Are you sure you want to delete the section "{s}" ? All its content will be lost without possible recovery.',
                    {
                      s: story.sections[promptedToDeleteSectionId].metadata.title
                    }
                  ) : translate('Are you sure you want to delete this section ?')}
              </div>
            }
            footerContent={[
              <Button
                type="submit"
                isFullWidth
                key={0}
                onClick={onDeleteSectionConfirm}
                isColor="success">{translate('Delete the section')}</Button>,
              <Button
                onClick={() => setPromptedToDeleteSectionId(undefined)} isFullWidth key={1}
                isColor="warning">{translate('Cancel')}</Button>,
            ]} />
        }
      </Columns>
    </div>
  );
};

SectionViewLayout.contextTypes = {
  t: PropTypes.func,
};

export default SectionViewLayout;
