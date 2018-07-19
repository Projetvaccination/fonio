/* eslint react/no-set-state : 0 */
import React, {Component} from 'react';
import PropTypes from 'prop-types';

import {debounce} from 'lodash';

import resourceSchema from 'quinoa-schemas/resource';

import {
  Button,
  Column,
  Control,
  Dropdown,
  // DropZone,
  Field,
  Input,
  HelpPin,
  Level,
  Image,
  Tab,
  TabLink,
  TabList,
  Tabs,
  StretchedLayoutContainer,
  StretchedLayoutItem,
} from 'quinoa-design-library/components/';

import icons from 'quinoa-design-library/src/themes/millet/icons';

import {translateNameSpacer} from '../../../helpers/translateUtils';

import ResourcesList from './ResourcesList';
import SortableMiniSectionsList from './SortableMiniSectionsList';

const resourceTypes = Object.keys(resourceSchema.definitions);

class AsideSectionColumn extends Component {

  constructor(props) {
    super(props);
    this.state = {
      searchString: ''
    };
    this.setResourceSearchString = debounce(this.setResourceSearchString, 500);
  }

  componentDidMount = () => {
    const {resourceSearchString} = this.props;
    this.setState({
      searchString: resourceSearchString
    });
  }

  shouldComponentUpdate = (nextProps, nextState) => {
    const changingProps = [
      'asideTabCollapsed',
      'asideTabMode',
      'resourceOptionsVisible',
      'mainColumnMode',
      'activeUsers',
      'lockMap',
      'userLockedResourceId',
      // 'sections',

      'resourceSearchString',
      'resourceFilterValues',
      'resourceSortValue',
    ];
    const {
      story: {
        resources: prevResources,
        sectionsOrder: prevSectionsOrder
      }
    } = this.props;
    const {
      story: {
        resources: nextResources,
        sectionsOrder: nextSectionsOrder
      }
    } = nextProps;
    const prevSectionsLocks = this.props.sections.map(s => s.lockStatus).join('-');
    const nextSectionsLocks = nextProps.sections.map(s => s.lockStatus).join('-');
    const prevSectionsLevels = this.props.sections.map(s => s.metadata.level).join('-');
    const nextSectionsLevels = nextProps.sections.map(s => s.metadata.level).join('-');
    return (
      changingProps.find(propName => this.props[propName] !== nextProps[propName]) !== undefined
      || prevResources !== nextResources
      || prevSectionsOrder !== nextSectionsOrder
      || prevSectionsLocks !== nextSectionsLocks
      || prevSectionsLevels !== nextSectionsLevels
      || this.state.searchString !== nextState.searchString
    );
  }

  setResourceSearchString = (value) => this.props.setResourceSearchString(value)

  setResourceSearchStringDebounce = (value) => {
    // const {setResourceSearchString} = this.props;
    this.setState({
      searchString: value
    });
    this.setResourceSearchString(value);
  }

  render = () => {
    const {
      asideTabCollapsed,
      asideTabMode,
      resourceOptionsVisible,
      mainColumnMode,
      story,

      getResourceTitle,
      sections,

      userId,

      reverseResourcesLockMap,
      userLockedResourceId,

      setAsideTabCollapsed,
      setAsideTabMode,
      setResourceOptionsVisible,
      setMainColumnMode,
      setSectionLevel,

      visibleResources,
      // resourceSearchString,
      // setResourceSearchString,
      resourceFilterValues,
      setResourceFilterValues,
      resourceSortValue,
      setResourceSortValue,

      onResourceEditAttempt,

      onDeleteResource,
      onSetCoverImage,
      // submitMultiResources,

      onDeleteSection,
      onOpenSectionSettings,
      onSortEnd,
    } = this.props;
    const {t} = this.context;
    const translate = translateNameSpacer(t, 'Features.SectionView');
    const {id: storyId} = story;

    const toggleResourceFilter = type => {
      setResourceFilterValues({
        ...resourceFilterValues,
        [type]: resourceFilterValues[type] ? false : true
      });
    };

    const renderAside = () => {
      if (asideTabCollapsed) {
        return null;
      }
      switch (asideTabMode) {
        case 'library':
          const setOption = (option, optionDomain) => {
            if (optionDomain === 'filter') {
              toggleResourceFilter(option);
            }
            else if (optionDomain === 'sort') {
              setResourceSortValue(option);
            }
          };
          return (
            <StretchedLayoutContainer className="aside-section-column" isFluid isAbsolute>
              <StretchedLayoutItem>
                <div>
                  <Column>
                    <Field hasAddons>
                      <Control style={{flex: 1}}>
                        <Input value={this.state.searchString} onChange={e => this.setResourceSearchStringDebounce(e.target.value)} placeholder={translate('find a resource')} />
                        {/*<Input value={resourceSearchString} onChange={e => setResourceSearchString(e.target.value)} placeholder={translate('find a resource')} />*/}
                      </Control>
                      <Control>
                        <Dropdown
                          closeOnChange={false}
                          menuAlign={'right'}
                          onToggle={() => {
                          setResourceOptionsVisible(!resourceOptionsVisible);
                        }}
                          onChange={setOption}
                          isActive={resourceOptionsVisible}
                          value={{
                          sort: {
                            value: resourceSortValue,
                          },
                          filter: {
                            value: Object.keys(resourceFilterValues).filter(f => resourceFilterValues[f]),
                          }
                        }}
                          options={[
                          {
                            label: translate('Sort items by'),
                            id: 'sort',
                            options: [
                              {
                                id: 'edited recently',
                                label: translate('edited recently')
                              },
                              {
                                id: 'title',
                                label: translate('title')
                              },
                            ]
                          },
                          {
                            label: translate('Show ...'),
                            id: 'filter',
                            options: resourceTypes.map(type => ({
                              id: type,
                              label: <span style={{display: 'flex', flexFlow: 'row nowrap', alignItems: 'center'}}><Image style={{display: 'inline-block', marginRight: '1em'}} isSize={'16x16'} src={icons[type].black.svg} /><span>{translate(type)}</span></span>
                            })),
                          }
                        ]}>
                          {translate('Options')}
                        </Dropdown>
                      </Control>
                    </Field>
                  </Column>
                </div>
              </StretchedLayoutItem>
              <StretchedLayoutItem isFlex={1} isFlowing>
                <Column isWrapper>
                  <ResourcesList
                    resources={visibleResources}
                    onDeleteResource={onDeleteResource}
                    onSetCoverImage={onSetCoverImage}
                    storyId={storyId}
                    userId={userId}
                    onResourceEditAttempt={onResourceEditAttempt}
                    reverseResourcesLockMap={reverseResourcesLockMap}
                    getResourceTitle={getResourceTitle}
                    userLockedResourceId={userLockedResourceId} />
                </Column>
                {/*<Level>
                  <DropZone onDrop={submitMultiResources}>
                    {translate('Drop files to include new resources in your library (images, tables, bibliographies)')}
                  </DropZone>
                </Level>*/}
              </StretchedLayoutItem>
              <StretchedLayoutItem>
                <Level>
                  <Column>
                    <Button
                      isFullWidth
                      style={{overflow: 'visible'}}
                      onClick={() => setMainColumnMode(mainColumnMode === 'newresource' ? 'edition' : 'newresource')}
                      isColor={mainColumnMode === 'newresource' ? 'primary' : 'info'}
                      isDisabled={userLockedResourceId !== undefined}>
                      <span style={{paddingRight: '1rem'}}>{translate('Add items to library')}</span> <HelpPin place="top">
                        {translate('Add new images to your story')}
                      </HelpPin>
                    </Button>
                  </Column>
                </Level>
              </StretchedLayoutItem>
            </StretchedLayoutContainer>
          );
        case 'summary':
        default:
          return (
            <StretchedLayoutContainer isFluid isAbsolute>
              <StretchedLayoutItem isFlex={1} isFlowing>
                <Column isWrapper>
                  <SortableMiniSectionsList
                    storyId={storyId}
                    items={sections}
                    onSortEnd={onSortEnd}
                    onOpenSettings={thatSection => onOpenSectionSettings(thatSection.id)}
                    onDeleteSection={onDeleteSection}
                    setSectionLevel={setSectionLevel}
                    pressDelay={150} />
                </Column>
              </StretchedLayoutItem>
              <StretchedLayoutItem >
                <Column>
                  <Column>
                    <Button
                      style={{overflow: 'visible'}}
                      isDisabled={userLockedResourceId !== undefined && mainColumnMode === 'edition'}
                      onClick={() => setMainColumnMode('newsection')} isColor={'primary'} isFullWidth>
                      <span style={{paddingRight: '1rem'}}>{translate('New section')}</span> <HelpPin place="top">
                        {translate('Add a new section or chapter to your story')}
                      </HelpPin>
                    </Button>
                  </Column>
                </Column>
              </StretchedLayoutItem>
            </StretchedLayoutContainer>
          );
      }
    };
    return (
      <Column isSize={asideTabCollapsed ? 1 : '1/4'}>
        <StretchedLayoutContainer isFluid isAbsolute>
          <StretchedLayoutItem>
            <Column>
              <Tabs isBoxed isFullWidth style={{overflow: 'hidden'}}>
                <Column>
                  <TabList>
                    {
                    !asideTabCollapsed &&
                    'collapse' &&
                    <Tab onClick={() => setAsideTabMode('summary')} isActive={asideTabMode === 'summary'}>
                      <TabLink>
                        {translate('Summary')}
                      </TabLink>
                    </Tab>
                    }
                    {
                    !asideTabCollapsed &&
                    <Tab onClick={() => setAsideTabMode('library')} isActive={asideTabMode === 'library'}>
                      <TabLink>{translate('Library')}</TabLink>
                    </Tab>
                    }
                    <Tab onClick={() => setAsideTabCollapsed(!asideTabCollapsed)} isActive={asideTabCollapsed}><TabLink>{asideTabCollapsed ? '▶' : '◀'}</TabLink></Tab>
                  </TabList>
                </Column>
              </Tabs>
            </Column>
          </StretchedLayoutItem>
          <StretchedLayoutItem isFlex={1}>
            <Column>
              {renderAside()}
            </Column>
          </StretchedLayoutItem>
        </StretchedLayoutContainer>
      </Column>
    );
  }
}

AsideSectionColumn.contextTypes = {
  t: PropTypes.func,
};

export default AsideSectionColumn;
