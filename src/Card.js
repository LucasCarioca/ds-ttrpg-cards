import React, { Component } from 'react';
import ReactMarkdown from 'react-markdown';
import Textfit from './textfit';
import staff from './assets/staff.jpeg';
import classnames from 'classnames';
import cardBlack from './assets/card--default.svg';
import cardRed from './assets/card--red.svg';
import cardGreen from './assets/card--green.svg';
import cardGold from './assets/card--gold.svg';
import cardCyan from './assets/card--cyan.svg';
import cardWhite from './assets/card--white.svg';
import cardPurple from './assets/card--purple.svg';
import './Card.css';

const cards = {
  default: {image: cardWhite, color: '#2f3640'},
  red: {image: cardRed, color: '#f5f6fa'},
  green: {image: cardGreen, color: '#f5f6fa'},
  gold: {image: cardGold, color: '#2f3640'},
  cyan: {image: cardCyan, color: '#2f3640'},
  black: {image: cardBlack, color: '#f5f6fa'},
  purple: {image: cardPurple, color: '#f5f6fa'},
}

const noop = () => {};
export default class Card extends Component {
  static propTypes = {}

  static defaultProps = {
    cardType: 'default',
  }

  renderField(property, props={}) {
    const { cardType } = this.props;
    return (
      <Textfit
        className={`card__${property}`}
        autoResize
        max={1500}
        forceSingleModeWidth={false}
        mode='single'
        style={{color: cards[cardType].color}}
        { ...props }
      >
        <ReactMarkdown source={this.props[property]} />
      </Textfit>
    )
  }

  render() {
    const {
      cardType,
      imagePreviewUrl,
      onRef,
    } = this.props;
    const containerClass = classnames(
      'card',
      `card--default`
    );
    return (
      <div className={containerClass} ref={onRef || noop}>
        <img src={cards[cardType].image} className="card__img" alt="card" />
        <div className="card__icon">
          <img src={imagePreviewUrl || staff} alt="icon" />
        </div>
        {this.renderField('title')}
        {this.renderField('flavor')}
        {this.renderField('value', {
          forceSingleModeWidth: true,
          max: 241,
        })}
        {this.renderField('description', {
          mode: 'multi',
          max: 200,
        })}
      </div>
    );
  }
}
