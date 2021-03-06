/* eslint react/no-set-state: 0 */
/* eslint  react/prefer-stateless-function : 0 */
/**
 * This module provides a reusable inline glossary mention component
 * @module fonio/components/GlossaryMention
 */
import React, {Component} from 'react';
import PropTypes from 'prop-types';

/**
 * GlossaryMention class for building react component instances
 */
class GlossaryMention extends Component {

  /**
   * Component's context used properties
   */
  static contextTypes = {
    t: PropTypes.func.isRequired,
  }

  /**
   * constructor
   * @param {object} props - properties given to instance at instanciation
   */
  constructor(props) {
    super(props);
  }

  shouldComponentUpdate = (nextProps) => {
    return this.props.children !== nextProps.children;
  }


  /**
   * Renders the component
   * @return {ReactElement} component - the component
   */
  render() {
    const {
      children,
    } = this.props;
    return <span style={{color: 'purple'}}>{children}</span>;
  }
}


/**
 * Component's properties types
 */
GlossaryMention.propTypes = {

  /**
   * Children react elements of the component
   */
  children: PropTypes.array,

  /**
   * The asset to consume for displaying the glossary mention
   */
  asset: PropTypes.object,

  /**
   * Callbacks when an asset is changed
   */
  onAssetChange: PropTypes.func,

  /**
   * Callbacks when an asset is blured
   */
  onAssetBlur: PropTypes.func,

  /**
   * Callbacks when an asset is focused
   */
  onAssetFocus: PropTypes.func,
};

export default GlossaryMention;
