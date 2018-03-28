/**
 * This module provides a reusable big select element component
 * @module fonio/components/BigSelect
 */
import React, {Component} from 'react';
import PropTypes from 'prop-types';

import './AuthorsManager.scss';
import {translateNameSpacer} from '../../helpers/translateUtils';


/**
 * AuthorsManager class for building react component instances
 */
class AuthorsManager extends Component {

  /**
   * constructor
   * @param {object} props - properties given to instance at instanciation
   */
  constructor(props) {
    super(props);
    // will store input DOM element references in this
    this.inputs = {};
    // handle programmatic focus on the last input of the list
    this.focusOnLastAuthor = () => {
      setTimeout(() => {
        const keys = Object.keys(this.inputs).sort();
        if (keys.length) {
          let focused;
          do {
            const last = keys.pop();
            if (this.inputs[last]) {
              this.inputs[last].focus();
              focused = true;
            }
          } while (!focused && keys.length);
        }
      }, 10);
    };
  }


  /**
   * Renders the component
   * @return {ReactElement} component - the component
   */
  render() {
    const {
      authors,
      onChange
    } = this.props;
    const {
      context
    } = this;
    const translate = translateNameSpacer(context.t, 'Components.AuthorsManager');
    const onAddAuthor = e => {
      e.preventDefault();
      e.stopPropagation();
      const newAuthors = [
        ...authors,
        ''
      ];
      onChange(newAuthors);
      this.focusOnLastAuthor();
    };
    return (
      <ul className="fonio-AuthorsManager">
        {
          authors &&
          authors.map((author, index) => {
            const onAuthorChange = e => {
              const value = e.target.value;
              const newAuthors = [...authors];
              newAuthors[index] = value;
              onChange(newAuthors);
            };
            const onRemoveAuthor = () => {
              const newAuthors = [
                ...authors.slice(0, index),
                ...authors.slice(index + 1)
              ];
              onChange(newAuthors);
              this.focusOnLastAuthor();
            };
            const bindRef = input => {
              this.inputs[index] = input;
            };
            return (
              <li key={index}>
                <span className="icon-container remove-btn" onClick={onRemoveAuthor}>
                  <img src={require('../../sharedAssets/close-black.svg')} className="fonio-icon-image" />
                </span>
                <input
                  className="main-part"
                  ref={bindRef}
                  type="text"
                  placeholder={translate('new-author')}
                  value={author}
                  onChange={onAuthorChange} />
              </li>);
          })
        }
        <li className="add-author" onClick={onAddAuthor}>
          <span className="icon-container">
            <img
              src={require('../../sharedAssets/close-black.svg')}
              className="fonio-icon-image"
              style={{
                transform: 'rotate(45deg)'
              }} />

          </span>
          <span
            className="main-part">{translate('add-author')}</span>
        </li>
      </ul>
    );
  }
}


/**
 * Component's properties types
 */
AuthorsManager.propTypes = {

  /**
   * Authors names to display
   */
  authors: PropTypes.arrayOf(PropTypes.string),

  /**
   * Callbacks when the list of authors change
   */
  onChange: PropTypes.func,
};


/**
 * Component's context used properties
 */
AuthorsManager.contextTypes = {

  /**
   * Un-namespaced translation function
   */
  t: PropTypes.func.isRequired
};

export default AuthorsManager;
