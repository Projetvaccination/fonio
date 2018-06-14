/**
 * This module exports logic-related elements for the fonio section view feature
 * This module follows the ducks convention for putting in the same place actions, action types,
 * state selectors and reducers about a given feature (see https://github.com/erikras/ducks-modular-redux)
 * @module fonio/features/SectionView
 */

import {combineReducers} from 'redux';
import {createStructuredSelector} from 'reselect';

import {getStatePropFromActionSet} from '../../helpers/reduxUtils';

/**
 * ===================================================
 * ACTION NAMES
 * ===================================================
 */
/**
 * UI
 */
const SET_ASIDE_TAB_MODE = 'SET_ASIDE_TAB_MODE';
const SET_ASIDE_TAB_COLLAPSED = 'SET_ASIDE_TAB_COLLAPSED';
const SET_MAIN_COLUMN_MODE = 'SET_MAIN_COLUMN_MODE';
const SET_RESOURCE_SORT_VISIBLE = 'SET_RESOURCE_SORT_VISIBLE';
const SET_RESOURCE_FILTER_VISIBLE = 'SET_RESOURCE_FILTER_VISIBLE';

/*
 * actions related to section edition
 */
export const UPDATE_DRAFT_EDITOR_STATE = 'UPDATE_DRAFT_EDITOR_STATE';
export const UPDATE_DRAFT_EDITORS_STATES = 'UPDATE_DRAFT_EDITORS_STATES';

export const PROMPT_ASSET_EMBED = 'PROMPT_ASSET_EMBED';
export const UNPROMPT_ASSET_EMBED = 'UNPROMPT_ASSET_EMBED';
export const SET_ASSET_REQUEST_CONTENT_ID = 'SET_ASSET_REQUEST_CONTENT_ID';

export const CREATE_CONTEXTUALIZER = 'CREATE_CONTEXTUALIZER';
export const UPDATE_CONTEXTUALIZER = 'UPDATE_CONTEXTUALIZER';
export const DELETE_CONTEXTUALIZER = 'DELETE_CONTEXTUALIZER';

export const CREATE_CONTEXTUALIZATION = 'CREATE_CONTEXTUALIZATION';
export const UPDATE_CONTEXTUALIZATION = 'UPDATE_CONTEXTUALIZATION';
export const DELETE_CONTEXTUALIZATION = 'DELETE_CONTEXTUALIZATION';

export const SET_EDITOR_FOCUS = 'SET_EDITOR_FOCUS';
/**
 * data
 */

/**
 * ===================================================
 * ACTION CREATORS
 * ===================================================
 */
export const setAsideTabMode = payload => ({
  type: SET_ASIDE_TAB_MODE,
  payload,
});

export const setAsideTabCollapsed = payload => ({
  type: SET_ASIDE_TAB_COLLAPSED,
  payload,
});

export const setMainColumnMode = payload => ({
  type: SET_MAIN_COLUMN_MODE,
  payload,
});

export const setResourceFilterVisible = payload => ({
  type: SET_RESOURCE_FILTER_VISIBLE,
  payload
});

export const setResourceSortVisible = payload => ({
  type: SET_RESOURCE_SORT_VISIBLE,
  payload
});

/**
 * Action creators related to section edition
 */

/**
 * Updates a specific editor state
 * @param {id} id - id of the editor state to update (uuid of a section or of a note)
 * @param {EditorState} editorState - the new editor state
 * @return {object} action - the redux action to dispatch
 */
export const updateDraftEditorState = (id, editorState) => ({
  type: UPDATE_DRAFT_EDITOR_STATE,
  payload: {
    editorState,
    id
  },
});

/**
 * Updates all active editor states
 * @param {object}  editorStates - map of the editor states (keys are uuids of sections or notes)
 * @return {object} action - the redux action to dispatch
 */
export const updateDraftEditorsStates = (editorsStates) => ({
  type: UPDATE_DRAFT_EDITORS_STATES,
  payload: {
    editorsStates,
  },
});

/**
 * Prompts to embed an asset
 * @param {string} editorId - id of the editor in which asset is prompted
 * @param {SelectionState} selection - current selection of the editor
 * @return {object} action - the redux action to dispatch
 */
export const promptAssetEmbed = (editorId, selection) => ({
  type: PROMPT_ASSET_EMBED,
  payload: {
    editorId,
    selection
  },
});

/**
 * Unprompts asset embed
 * @return {object} action - the redux action to dispatch
 */
export const unpromptAssetEmbed = () => ({
  type: UNPROMPT_ASSET_EMBED
});


export const setAssetRequestContentId = contentId => ({
  type: SET_ASSET_REQUEST_CONTENT_ID,
  payload: {
    contentId,
  },
});

/**
 * Sets which editor has the focus for edition
 * @param {string} editorFocus  - id of the editor to focus to
 * @return {object} action - the redux action to dispatch
 */
export const setEditorFocus = (editorFocus) => ({
  type: SET_EDITOR_FOCUS,
  payload: {
    editorFocus,
  },
});

/**
 * Creates a contextualizer
 * @param {string} storyId  - id of the story to update
 * @param {string} contextualizerId  - id of the contextualizer to update
 * @param {object} contextualizer  - new contextualizer data
 * @return {object} action - the redux action to dispatch
 */
export const createContextualizer = (storyId, contextualizerId, contextualizer) => ({
  type: CREATE_CONTEXTUALIZER,
  payload: {
    storyId,
    contextualizerId,
    contextualizer,
  },
});

/**
 * Updates a contextualizer
 * @param {string} storyId  - id of the story to update
 * @param {string} contextualizerId  - id of the contextualizer to update
 * @param {object} contextualizer  - new contextualizer data
 * @return {object} action - the redux action to dispatch
 */
export const updateContextualizer = (storyId, contextualizerId, contextualizer) => ({
  type: UPDATE_CONTEXTUALIZER,
  payload: {
    storyId,
    contextualizerId,
    contextualizer,
  },
});

/**
 * Deletes a contextualizer
 * @param {string} storyId  - id of the story to update
 * @param {string} contextualizerId  - id of the contextualizer to update
 * @return {object} action - the redux action to dispatch
 */
export const deleteContextualizer = (storyId, contextualizerId) => ({
  type: DELETE_CONTEXTUALIZER,
  payload: {
    storyId,
    contextualizerId,
  },
});

/**
 * Creates a contextualization
 * @param {string} storyId  - id of the story to update
 * @param {string} contextualizationId  - id of the contextualization to update
 * @param {object} contextualization  - new contextualization data
 * @return {object} action - the redux action to dispatch
 */
export const createContextualization = (storyId, contextualizationId, contextualization) => ({
  type: CREATE_CONTEXTUALIZATION,
  payload: {
    storyId,
    contextualizationId,
    contextualization,
  },
});

/**
 * Updates a contextualization
 * @param {string} storyId  - id of the story to update
 * @param {string} contextualizationId  - id of the contextualization to update
 * @param {object} contextualization  - new contextualization data
 * @return {object} action - the redux action to dispatch
 */
export const updateContextualization = (storyId, contextualizationId, contextualization) => ({
  type: UPDATE_CONTEXTUALIZATION,
  payload: {
    storyId,
    contextualizationId,
    contextualization,
  },
});

/**
 * Deletes a contextualization
 * @param {string} storyId  - id of the story to update
 * @param {string} contextualizationId  - id of the contextualization to update
 * @return {object} action - the redux action to dispatch
 */
export const deleteContextualization = (storyId, contextualizationId) => ({
  type: DELETE_CONTEXTUALIZATION,
  payload: {
    storyId,
    contextualizationId
  }
});

/**
 * ===================================================
 * REDUCERS
 * ===================================================
 */


const UI_DEFAULT_STATE = {
  asideTabMode: 'library',
  asideTabCollapsed: false,
  mainColumnMode: 'edition',
  resourceSortVisible: false,
  resourceFilterVisible: false,
};

/**
 * This redux reducer handles the state of the ui
 * @param {object} state - the state given to the reducer
 * @param {object} action - the action to use to produce new state
 * @return {object} newState - the resulting state
 */
function ui(state = UI_DEFAULT_STATE, action) {
  const {payload} = action;
  switch (action.type) {
    case SET_ASIDE_TAB_MODE:
    case SET_ASIDE_TAB_COLLAPSED:
    case SET_MAIN_COLUMN_MODE:
    case SET_RESOURCE_SORT_VISIBLE:
    case SET_RESOURCE_FILTER_VISIBLE:
      const propName = getStatePropFromActionSet(action.type);
      return {
        ...state,
        [propName]: payload
      };
    default:
      return state;
  }
}

/**
 * Editor states reducer
 * It has no default state since this reducer is only composed
 * of uuid keys that correspond to active
 * draft-js editor states (uuids correspond to either section
 * ids for main contents' editorStates or note ids for note contents editorStates)
 */
const editorstates = (state = {}, action) => {
  const {payload} = action;
  switch (action.type) {
    // a draft editor is updated
    case UPDATE_DRAFT_EDITOR_STATE:
      return {
        ...state,
        // editorState is an EditorState ImmutableRecord
        [payload.id]: payload.editorState
      };
    case UPDATE_DRAFT_EDITORS_STATES:
      return Object.keys(payload.editorsStates)
      .reduce((newState, editorId) => ({
        ...newState,
        // editorState is an EditorState ImmutableRecord
        [editorId]: payload.editorsStates[editorId]
      }),
      // reset editors data to optimize memory management
      // todo: this is a bit messy, it should be explicited for instance with two different actions 'MERGE_EDITORS'/'REPLACE_EDITORS'
      {} /* state */);
    default:
      return state;
  }
};


/**
 * asset requests are separated as they contain not serializable data
 */
const ASSET_REQUEST_DEFAULT_STATE = {

  /**
   * Id of the editor being prompted for asset (uuid of the section or uuid of the note)
   */
  editorId: undefined,

  /**
   * selection state of the editor being prompted
   * @type {SelectionState}
   */
  selection: undefined,

  /**
   * Whether an asset is requested
   */
  assetRequested: false
};

/**
 * Handles the state change of asset request state
 * @param {object} state - the previous state
 * @param {object} action - the dispatched action
 * @return {object} state - the new state
 */
const assetRequeststate = (state = ASSET_REQUEST_DEFAULT_STATE, action) => {
  const {payload} = action;
  switch (action.type) {
    case SET_ASSET_REQUEST_CONTENT_ID:
      return {
        ...state,
        // in what editor is the asset prompted
        editorId: payload.contentId
      };

    // an asset is prompted
    case PROMPT_ASSET_EMBED:
      return {
        ...state,
        // in what editor is the asset prompted
        editorId: payload.editorId,
        // where is the asset prompted in the editor
        selection: payload.selection,
        // asset is prompted
        assetRequested: true,
      };
    // assets prompt is dismissed
    case UNPROMPT_ASSET_EMBED:
      return {
        ...state,
        editorId: undefined,
        selection: undefined,
        assetRequested: false,
      };
    default:
      return state;
  }
};


/**
 * Default state of the editor focus reducer
 * It handles only focus-related matters
 */
const EDITOR_FOCUS_DEFAULT_STATE = {

/**
   * Represents which editor is focused
   * @type {string}
   */
  editorFocus: undefined,
  /**
   * Represents the previous editor focus
   * @type {string}
   */
  previousEditorFocus: undefined
};

/**
 * Handles the state of dcurrent editors focus
 * @param {object} state - the previous state
 * @param {object} action - the dispatched action
 * @return {object} state - the new state
 */
const editorFocusState = (state = EDITOR_FOCUS_DEFAULT_STATE, action) => {
  const {payload} = action;
  switch (action.type) {
    // an editor is focused
    case SET_EDITOR_FOCUS:
      return {
        ...state,
        editorFocus: payload.editorFocus,
        previousEditorFocus: payload.editorFocus
      };
    default:
      return state;
  }
};


/**
 * The module exports a reducer connected to pouchdb thanks to redux-pouchdb
 */
export default combineReducers({
  ui,
  assetRequeststate,
  editorstates,
  editorFocusState,
});

/**
 * ===================================================
 * SELECTORS
 * ===================================================
 */

const asideTabMode = state => state.ui.asideTabMode;
const asideTabCollapsed = state => state.ui.asideTabCollapsed;
const mainColumnMode = state => state.ui.mainColumnMode;
const resourceSortVisible = state => state.ui.resourceSortVisible;
const resourceFilterVisible = state => state.ui.resourceFilterVisible;

const editorStates = state => state.editorstates;
const assetRequestState = state => state.assetRequeststate;
const assetRequested = state => state.assetRequested;
const editorFocus = state => state.editorFocusState.editorFocus;
const previousEditorFocus = state => state.editorFocusState.previousEditorFocus;

/**
 * The selector is a set of functions for accessing this feature's state
 * @type {object}
 */
export const selector = createStructuredSelector({
  asideTabMode,
  asideTabCollapsed,
  mainColumnMode,

  resourceSortVisible,
  resourceFilterVisible,

  editorStates,
  assetRequestState,
  assetRequested,
  editorFocus,
  previousEditorFocus,
});
