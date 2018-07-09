/* eslint react/jsx-no-bind:0 */
/* eslint react/prefer-stateless-function : 0 */

/**
 * This module exports a stateless component rendering the layout of the editor feature interface
 * @module fonio/features/HomeView
 */
import React, {Component} from 'react';
import PropTypes from 'prop-types';

import FlipMove from 'react-flip-move';

import {createDefaultSection} from '../../../helpers/schemaUtils';
import {v4 as genId} from 'uuid';

import {
  Button,
  Column,
  Columns,
  Container,
  Content,
  Control,
  DropZone,
  Field,
  Footer,
  Hero,
  HeroBody,
  HeroFooter,
  HeroHeader,
  Help,
  HelpPin,
  Image,
  Input,
  Level,
  LevelItem,
  LevelLeft,
  ModalCard,
  StretchedLayoutContainer,
  StretchedLayoutItem,
  Navbar,
  Tab,
  Delete,
  TabLink,
  TabList,
  Tabs,
  Title,
} from 'quinoa-design-library/components/';

import icons from 'quinoa-design-library/src/themes/millet/icons';
import {saveStoryToken, deleteStoryToken} from '../../../helpers/localStorageUtils';

import config from '../../../config';

import LanguageToggler from '../../../components/LanguageToggler';
import IdentificationModal from '../../../components/IdentificationModal';
import MetadataForm from '../../../components/MetadataForm';
import StoryCard from './StoryCard';
import DeleteStoryModal from './DeleteStoryModal';
import ChangePasswordModal from './ChangePasswordModal';
import EnterPasswordModal from './EnterPasswordModal';

import {translateNameSpacer} from '../../../helpers/translateUtils';


class StoryCardWrapper extends Component {
  render = () => {
    const {
      story,
      users,
      onAction
    } = this.props;
    return (
      <Level>
        <Column>
          <StoryCard
            story={story}
            users={users}
            onAction={onAction} />
        </Column>
      </Level>
    );
  }
}


/**
 * Renders the component
 * @return {ReactElement} markup
 */

class HomeViewLayout extends Component {
  constructor(props, context) {
    super(props);

    this.translate = translateNameSpacer(context.t, 'Features.HomeView');
  }

  renderContent = mode => {
    switch (mode) {
      case 'learn':
        return (
          <Container>
            <Column>
              <Content>
                <h1>{this.translate('Learn fonio')}</h1>
                <p>
                  {this.translate('learn fonio detail')}
                </p>
              </Content>
            </Column>
          </Container>
        );
      case 'about':
        return (
          <Container>
            <Column>
              <Content>
                <h1>{this.translate('About fonio')}</h1>
                <p>
                  {this.translate('about fonio details')}
                </p>
              </Content>
            </Column>
          </Container>
        );
      case 'stories':
      default:
        const {
          stories,
          newStory,
          newStoryOpen,
          newStoryTabMode,
          userInfo,
          sortingMode,
          searchString,
          editionHistory,

          lockingMap,
          activeUsers,
          userId,
          storyDeleteId,
          changePasswordId,
          passwordModalOpen,
          createStoryStatus,
          overrideStoryStatus,
          deleteStoryStatus,
          importStoryStatus,
          overrideImport,
          overrideStoryMode,

          loginStatus,
          changePasswordStatus,

          history,
          actions: {
            createStory,
            overrideStory,
            duplicateStory,
            deleteStory,
            loginStory,
            importStory,
            changePassword,
            setNewStoryTabMode,
            setIdentificationModalSwitch,
            setNewStoryOpen,
            setSortingMode,
            setSearchString,
            setStoryDeleteId,
            setChangePasswordId,
            setPasswordModalOpen,
            setOverrideImport,
            setOverrideStoryMode,
          }
        } = this.props;
        const {translate} = this;

        const storiesList = Object.keys(stories).map(id => ({id, ...stories[id]}));
        const searchStringLower = searchString.toLowerCase();
        const visibleStoriesList = storiesList.filter(s => {
          const data = JSON.stringify(s).toLowerCase();
          return data.indexOf(searchStringLower) > -1;
        })
        .sort((a, b) => {
          switch (sortingMode) {
            case 'edited recently':
              if (a.lastUpdateAt > b.lastUpdateAt) {
                return -1;
              }
              return 1;
            case 'edited by me':
              if (editionHistory[a.id] > editionHistory[b.id]) {
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

        const onDeleteStory = (password) => {
          loginStory({storyId: storyDeleteId, password})
          .then((res) => {
            if (res.result && res.result.data) {
              const {token} = res.result.data;
              deleteStory({storyId: storyDeleteId, token})
              .then((resp) => {
                if (resp.result) deleteStoryToken(storyDeleteId);
              });
            }
          });
        };

        const onChangePassword = (oldPassword, newPassword) => {
          changePassword({storyId: changePasswordId, oldPassword, newPassword})
          .then((res) => {
            if (res.result && res.result.data) {
              const {token} = res.result.data;
              saveStoryToken(changePasswordId, token);
            }
          });
        };

        const onDropFiles = (files) => {
          if (!files || !files.length) {
            return;
          }
          importStory(files[0])
          .then((res) => {
            const storyImported = res.result;
            if (storyImported) {
             // override an existing story (which has the same id)
              const existant = storiesList.find(story => story.id === storyImported.id);
              // has preexisting story, prompt for override
              if (existant !== undefined) {
                setOverrideImport(true);
              }
              else {
                setOverrideImport(false);
                setOverrideStoryMode('create');
                setPasswordModalOpen(true);
              }
            }
          });
        };

        const confirmImport = importMode => {
          setOverrideImport(false);
          setOverrideStoryMode(importMode);
          setPasswordModalOpen(true);
        };

        const onCreateNewStory = payload => {
          const startingSectionId = genId();
          const defaultSection = createDefaultSection();
          const startingSection = {
            ...defaultSection,
            id: startingSectionId,
            metadata: {
              ...defaultSection.metadata,
              title: 'Introduction'
            }
          };
          const story = {
            ...payload.payload,
            sections: {
              [startingSectionId]: startingSection,
            },
            sectionsOrder: [startingSectionId]
          };

          createStory({...payload, payload: story})
          .then((res) => {
            if (res.result) {
              const {story: thatStory, token} = res.result.data;
              saveStoryToken(thatStory.id, token);
              setNewStoryOpen(false);
              history.push({
                pathname: `/story/${thatStory.id}/section/${startingSectionId}`,
              });
            }
          });
        };

        const OnCreateExistStory = (password) => {
          createStory({
            payload: newStory, password
          })
          .then((res) => {
            if (res.result) {
              setPasswordModalOpen(false);
              saveStoryToken(res.result.data.story.id, res.result.data.token);
              setNewStoryOpen(false);
              history.push({
                pathname: `/story/${res.result.data.story.id}/`,
              });
            }
          });
        };

        const OnOverrideExistStory = (password) => {
          loginStory({storyId: newStory.id, password})
          .then((res) => {
            if (res.result && res.result.data) {
              const {token} = res.result.data;
              saveStoryToken(newStory.id, token);
              overrideStory({payload: newStory, token})
              .then((resp) => {
                if (resp.result) {
                  setPasswordModalOpen(false);
                  saveStoryToken(res.result.data.story.id, res.result.data.token);
                  setNewStoryOpen(false);
                  history.push({
                    pathname: `/story/${res.result.data.story.id}/`,
                  });
                }
              });
            }
          });
        };

        return (
          <Container>
            <Columns>
              <Column isSize={'1/3'}>

                <Column>
                  <Title isSize={2}>
                    {config.sessionName /* eslint no-undef: 0 */}
                  </Title>

                  <div>
                    <Title isSize={5}>
                      {this.translate('Your profile')} <HelpPin>{this.translate('choose how you will be identified by other writers')}</HelpPin>
                    </Title>
                    <Level isMobile>
                      {userInfo && <LevelLeft>
                        <LevelItem>
                          <Image isRounded isSize="64x64" src={require(`../../../sharedAssets/avatars/${userInfo.avatar}`)} />
                        </LevelItem>
                        <LevelItem>
                          {userInfo.name}
                        </LevelItem>
                        <LevelItem>
                          <Button onClick={() => setIdentificationModalSwitch(true)}>
                            {this.translate('edit')}
                          </Button>
                        </LevelItem>
                      </LevelLeft>}
                    </Level>
                  </div>
                  <Level />
                  <div>
                    <Title isSize={5}>
                      {this.translate('Who else is online ?')} <HelpPin>{this.translate('writers connected to this classroom right now')}</HelpPin>
                    </Title>
                    {activeUsers &&
                    Object.keys(activeUsers)
                    .filter(thatUserId => userId !== thatUserId)
                    .map(thatUserId => ({userId, ...activeUsers[thatUserId]}))
                    .map((user, index) => {
                      return (
                        <Level key={index}>
                          <Columns>
                            <Column isSize={'1/3'}>
                              <Image isRounded isSize="32x32" src={require(`../../../sharedAssets/avatars/${user.avatar}`)} />
                            </Column>
                            <Column isSize={'2/3'}>
                              <Content>
                                {user.name}
                              </Content>
                            </Column>
                          </Columns>
                        </Level>
                      );
                    })
                  }
                  </div>

                  <Level />
                  <Content>
                    {this.translate('intro short title')}
                  </Content>

                  <div>
                    <Button isFullWidth onClick={() => setNewStoryOpen(!newStoryOpen)} isColor={newStoryOpen ? 'primary' : 'info'}>
                      {this.translate('New story')}
                    </Button>
                  </div>
                  <Level />
                </Column>
              </Column>
              <Column isHidden={newStoryOpen} isSize={'2/3'}>
                <Column>
                  <StretchedLayoutContainer isFluid isDirection="horizontal">
                    <StretchedLayoutItem isFluid isFlex={1}>
                      <Field hasAddons>
                        <Control>
                          <Input value={searchString} onChange={e => setSearchString(e.target.value)} placeholder={this.translate('find a story')} />
                        </Control>
                      </Field>
                    </StretchedLayoutItem>
                    <StretchedLayoutItem isFluid>
                      <Column>
                        <StretchedLayoutContainer isDirection="horizontal" isFluid>
                          <StretchedLayoutItem><i>{this.translate('sort by')}</i></StretchedLayoutItem>
                          <StretchedLayoutItem>
                            / <a onClick={() => setSortingMode('edited by me')}>{
                              sortingMode === 'edited by me' ?
                                <strong>{this.translate('edited by me')}</strong>
                                :
                                this.translate('edited by me')
                            }</a>
                          </StretchedLayoutItem>
                          <StretchedLayoutItem>
                            / <a onClick={() => setSortingMode('edited recently')}>{
                              sortingMode === 'edited recently' ?
                                <strong>{this.translate('edited recently')}</strong>
                                :
                                this.translate('edited recently')
                            }</a>
                          </StretchedLayoutItem>
                          <StretchedLayoutItem>
                            / <a onClick={() => setSortingMode('title')}>{
                              sortingMode === 'title' ?
                                <strong>{this.translate('title')}</strong>
                                :
                                this.translate('title')
                            }</a>
                          </StretchedLayoutItem>
                        </StretchedLayoutContainer>
                      </Column>
                    </StretchedLayoutItem>
                  </StretchedLayoutContainer>
                </Column>
                <FlipMove>

                  {
                        visibleStoriesList.map((story) => {
                          const onAction = (id) => {
                            switch (id) {
                              case 'open':
                                history.push({
                                  pathname: `/story/${story.id}`
                                });
                                break;
                              case 'read':
                                history.push({
                                  pathname: `/read/${story.id}`
                                });
                                break;
                              case 'duplicate':
                                duplicateStory({storyId: story.id})
                                .then((res) => {
                                  if (res.result) {
                                    setPasswordModalOpen(true);
                                    setOverrideStoryMode('create');
                                  }
                                });
                                break;
                              case 'delete':
                                setStoryDeleteId(story.id);
                                break;
                              case 'change password':
                                setChangePasswordId(story.id);
                                break;
                              default:
                                break;
                            }
                          };
                          const users = lockingMap[story.id] ?
                            Object.keys(lockingMap[story.id].locks)
                              .map(thatUserId => {
                                return {
                                  ...activeUsers[thatUserId]
                                };
                              })
                          : [];
                          return (
                            <StoryCardWrapper
                              key={story.id}
                              story={story}
                              users={users}
                              onAction={onAction} />
                          );
                        })
                      }
                </FlipMove>
                {storyDeleteId &&
                  <DeleteStoryModal
                    loginStatus={loginStatus}
                    deleteStatus={deleteStoryStatus}
                    onSubmitPassword={onDeleteStory}
                    onCancel={() => setStoryDeleteId(undefined)} />
                }
                {changePasswordId &&
                  <ChangePasswordModal
                    changePasswordStatus={changePasswordStatus}
                    onChangePassword={onChangePassword}
                    onCancel={() => setChangePasswordId(undefined)} />
                }
              </Column>
              {
                      newStoryOpen ?
                        <Column isSize={newStoryOpen ? '2/3' : '1/2'}>
                          {
                            <Column>
                              <Title isSize={2}>
                                <Columns>
                                  <Column isSize={11}>
                                    {translate('New Story')}
                                  </Column>
                                  <Column>
                                    <Delete onClick={
                                          () => setNewStoryOpen(false)
                                        } />
                                  </Column>
                                </Columns>
                              </Title>
                              <Tabs isBoxed isFullWidth>
                                <Container>
                                  <TabList>
                                    <Tab onClick={() => setNewStoryTabMode('form')} isActive={newStoryTabMode === 'form'}><TabLink>{this.translate('Create a story')}</TabLink></Tab>
                                    <Tab onClick={() => setNewStoryTabMode('file')} isActive={newStoryTabMode === 'file'}><TabLink>{this.translate('Import an existing story')}</TabLink></Tab>
                                  </TabList>
                                </Container>
                              </Tabs>
                              {newStoryTabMode === 'form' ?
                                <MetadataForm
                                  story={newStory}
                                  status={createStoryStatus}
                                  onSubmit={onCreateNewStory}
                                  onCancel={() => setNewStoryOpen(false)} />
                                    :
                                <Column>
                                  <DropZone
                                    accept="application/json"
                                    onDrop={onDropFiles}>
                                    {this.translate('Drop a fonio file')}
                                  </DropZone>
                                  {importStoryStatus === 'fail' && <Help isColor="danger">{this.translate('Story is not valid')}</Help>}
                                  <ModalCard
                                    isActive={overrideImport}
                                    headerContent={this.translate('Override story')}
                                    onClose={() => setOverrideImport(false)}
                                    mainContent={
                                      <Help isColor="danger">{this.translate('story is exist, do you want to override it?')}
                                      </Help>}
                                    footerContent={[
                                      <Button
                                        isFullWidth key={0}
                                        onClick={() => confirmImport('override')}
                                        isColor="danger">{this.translate('Override exist story')}
                                      </Button>,
                                      <Button
                                        isFullWidth key={1}
                                        onClick={() => confirmImport('create')}
                                        isColor="warning">{this.translate('Create new story')}
                                      </Button>,
                                      <Button
                                        isFullWidth key={2}
                                        onClick={() => setOverrideImport(false)} >
                                        {this.translate('Cancel')}
                                      </Button>
                                        ]} />
                                </Column>
                                }
                            </Column>
                            }

                        </Column>
                      : null
                    }
              {passwordModalOpen && overrideStoryMode &&
                <EnterPasswordModal
                  mode={overrideStoryMode}
                  status={overrideStoryMode === 'create' ? createStoryStatus : overrideStoryStatus}
                  loginStatus={loginStatus}
                  onSubmitPassword={overrideStoryMode === 'create' ? OnCreateExistStory : OnOverrideExistStory}
                  onCancel={() => setPasswordModalOpen(false)} />
              }
            </Columns>
          </Container>
        );
    }
  }

  render = () => {
    const {
      props: {
        tabMode,
        identificationModalSwitch,
        userInfoTemp,
        userId,
        actions: {
          setTabMode,
          setIdentificationModalSwitch,
          setUserInfoTemp,
          setUserInfo,
          createUser,
        }
      },
      renderContent,
    } = this;

    const onSubmitUserInfo = () => {
      createUser({
        ...userInfoTemp,
        userId
      });
      setUserInfo(userInfoTemp);
      setIdentificationModalSwitch(false);
    };
    return (
      <section>
        <Hero
          isColor="success"
          isSize="large"
          style={{
                background: `url(${require('../../../sharedAssets/cover_forccast.jpg')})`,
                backgroundPosition: 'center center',
                backgroundRepeat: 'no-repeat',
                backgroundAttachment: 'fixed',
                backgroundSize: 'cover',
                backgroundColor: '#999',
              }}>
          <HeroHeader>
            <Navbar
              isOpen={false}
              isFixed
              brandImage={icons.fonioBrand.svg}

              locationBreadCrumbs={[
              {
                href: '/',
                content: <strong>{config.sessionName /* eslint no-undef: 0 */}</strong>,
                isActive: true
              },
            ]}

              actionOptions={[
            {
              content: <LanguageToggler />
            }
            ]} />
          </HeroHeader>

          <HeroBody>
            <Container hasTextAlign="centered">
              <Title>{config.sessionName /* eslint no-undef: 0 */}</Title>
            </Container>
          </HeroBody>

          <HeroFooter>
            <Tabs isBoxed isFullWidth>
              <Container>
                <TabList>
                  <Tab onClick={() => setTabMode('stories')} isActive={tabMode === 'stories'}><TabLink>{this.translate('Stories')}</TabLink></Tab>
                  <Tab onClick={() => setTabMode('learn')} isActive={tabMode === 'learn'}><TabLink>{this.translate('Learn')}</TabLink></Tab>
                  <Tab onClick={() => setTabMode('about')} isActive={tabMode === 'about'}><TabLink>{this.translate('About')}</TabLink></Tab>
                </TabList>
              </Container>
            </Tabs>
          </HeroFooter>
        </Hero>

        <Container>
          <Level />
          {renderContent(tabMode)}
          <Level />
          <Level />
        </Container>

        <Footer id="footer">
          <Container>
            <Content>
              <Columns>
                <Column>
                  <p>
                    {this.translate('Provided thanks to the FORCCAST program')}.
                  </p>
                  <p>
                    {this.translate('Made by médialab Sciences Po')}.
                  </p>
                </Column>
              </Columns>
              <Content isSize="small">
                <p>{this.translate('The source code is licensed under ')}<a target="_blank">LGPL</a>.</p>
              </Content>
            </Content>
          </Container>
        </Footer>

        <IdentificationModal
          isActive={identificationModalSwitch}

          userInfo={userInfoTemp}

          onChange={setUserInfoTemp}
          onClose={() => setIdentificationModalSwitch(false)}
          onSubmit={onSubmitUserInfo} />

      </section>
    );
  }
}


/**
 * Context data used by the component
 */
HomeViewLayout.contextTypes = {

  /**
   * Un-namespaced translate function
   */
  t: PropTypes.func.isRequired
};


export default HomeViewLayout;
