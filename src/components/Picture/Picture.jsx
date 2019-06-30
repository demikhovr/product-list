import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Product } from '../../types';
import BlinkingActionCreator from '../../store/blinking/ActionCreator/ActionCreator';
import { getBlinkingIndex } from '../../store/blinking/selectors';
import { getRandomIndex } from '../../utils/util';

class Picture extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: true,
      lastIndex: 0,
    };

    this._timerId = null;
    this._imgRef = React.createRef();

    this._setImg = this._setImg.bind(this);
    this._onLoad = this._onLoad.bind(this);
  }

  componentDidMount() {
    const { lastIndex } = this.state;
    const { pictures } = this.props;
    const picture = pictures[lastIndex];
    this._setImg(picture);
  }

  componentDidUpdate(prevProps) {
    const prevBlinkingId = prevProps.blinkingIndex;
    const {
      index,
      products,
      blinkingIndex,
      changeBlinkingProductIndex,
    } = this.props;

    if (products.length === 1) {
      const updatedIndex = getRandomIndex(products, index);
      this._timerId = setTimeout(() => changeBlinkingProductIndex(updatedIndex), 3000);
    }

    if (blinkingIndex !== index || prevBlinkingId === blinkingIndex) {
      return;
    }

    this._updateImg();
  }

  componentWillUnmount() {
    this._imgRef.current.src = '';
    clearTimeout(this._timerId);
  }

  _updateImg() {
    const { lastIndex } = this.state;
    const { pictures } = this.props;
    const currentIndex = getRandomIndex(pictures, lastIndex);
    const picture = pictures[currentIndex];

    this.setState({
      lastIndex: currentIndex,
    });

    this._setImg(picture);
  }

  _setImg(src) {
    this.setState({
      isLoading: true,
    });

    this._imgRef.current.src = src;
  }

  _onLoad() {
    const {
      index,
      products,
      blinkingIndex,
      changeBlinkingProductIndex,
    } = this.props;

    if (blinkingIndex === index) {
      const updatedIndex = getRandomIndex(products, index);
      this._timerId = setTimeout(() => changeBlinkingProductIndex(updatedIndex), 3000);
    }

    this.setState({
      isLoading: false,
    });
  }

  render() {
    const { isLoading } = this.state;
    const className = isLoading ? 'product-pic__img--loading' : '';

    return (
      <img
        className={`product-pic__img ${className}`}
        width="120"
        alt=""
        ref={this._imgRef}
        onLoad={this._onLoad}
      />
    );
  }
}

Picture.propTypes = {
  index: PropTypes.number.isRequired,
  pictures: PropTypes.arrayOf(PropTypes.string),
  products: PropTypes.arrayOf(PropTypes.shape(Product)),
  blinkingIndex: PropTypes.number.isRequired,
  changeBlinkingProductIndex: PropTypes.func.isRequired,
};

Picture.defaultProps = {
  pictures: [],
};

const mapStateToProps = (state, props) => ({
  ...props,
  blinkingIndex: getBlinkingIndex(state),
});

const mapDispatchToProps = dispatch => ({
  changeBlinkingProductIndex: index => dispatch(BlinkingActionCreator.changeIndex(index)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Picture);
