import React, { Component, Fragment } from 'react';
import * as R from 'ramda';
import html2canvas from 'html2canvas';
import Card from './Card';
import './App.css';
import debounce from 'lodash.debounce';
import classnames from 'classnames';

const onChange = property => function({ target }) {
  const value = target.type === 'checkbox' ? target.checked : target.value;

  this.setState({
    [property]: value,
  }, this.saveState);
}

const localStorage = window.localStorage;

const defaultTitle = 'Magic Item'

const defaultDesc = 'This is an item description'

const defaultFlavor = 'Rarity and/or flavor text'

const defaultValue = 'Value'

const defaultState = {
  cardType: 'default',
  description: defaultDesc,
  needsAttunement: false,
  title: defaultTitle,
  flavor: defaultFlavor,
  imagePreviewUrl: undefined,
  value: defaultValue,
};

const saveData = debounce((key, data) => {
  localStorage.setItem(key, JSON.stringify(data));
}, 500);

const getSavedDate = (key) => {
  const data = localStorage.getItem(key);
  if (!data) return undefined;
  return JSON.parse(data);
}

class CardEditor extends Component {
  static defaultProps = {
    localStorageKey: 'card',
  }

  state = {
    cardType: 'default',
    title: '',
    flavor: '',
    description: '',
    value: '',
    needsAttunement: false,
  }

  constructor() {
    super();
    this.onChangeTitle = onChange('title').bind(this);
    this.onChangeFlavor = onChange('flavor').bind(this);
    this.onChangeDescription = onChange('description').bind(this);
    this.onChangeValue = onChange('value').bind(this);
    this.onChangeCardType = onChange('cardType').bind(this);
  }

  componentDidMount() {
    const cachedState = getSavedDate(this.props.localStorageKey);
    this.setState(cachedState || defaultState);
    setTimeout(() => this.forceUpdate(), 100);
  }

  saveState = () => {
    saveData(this.props.localStorageKey, this.state);
  }

  onReset = () => {
    this.setState(defaultState, this.saveState);
  }

  onSave = () => {
    html2canvas(this.ref).then(canvas => {
      const href = canvas.toDataURL("image/png");
      this.setState({ href });
    })
  }

  onImageChange = (e) => {
    e.preventDefault();

    let reader = new FileReader();
    let file = e.target.files[0];

    reader.onloadend = () => {
      this.setState({
        imagePreviewUrl: reader.result
      }, this.saveState);
    }

    reader.readAsDataURL(file)
  }

  get cardTypeOptions() { 
    return [
      {
        type: 'default',
        label: 'white',
      },
      {
        type: 'black',
        label: 'black',
      },
      {
        type: 'red',
        label: 'red',
      },
      {
        type: 'gold',
        label: 'gold',
      },
      {
        type: 'green',
        label: 'green',
      },
      {
        type: 'purple',
        label: 'purple',
      },
      {
        type: 'cyan',
        label: 'cyan',
      },
    ];
  }

  render() {
    const {
      cardType,
      description,
      href,
      title,
      flavor,
      value,
    } = this.state;
    return (
      <div className="container">
        <div className="fields">
          <label className="fieldLabel">Type</label>
          <select value={cardType} onChange={this.onChangeCardType}>
            {this.cardTypeOptions.map((option, i) => (
              <option key={i} value={option.type}>{option.label}</option>
            ))}
          </select>
          <label className="fieldLabel">Name</label>
          <input value={title} onChange={this.onChangeTitle} />
          <label className="fieldLabel">Rarity/flavor text</label>
          <input value={flavor} onChange={this.onChangeFlavor} />
          <label className="fieldLabel">Value in gold</label>
          <input value={value} onChange={this.onChangeValue} />
          <label className="fieldLabel">Description</label>
          <textarea value={description} onChange={this.onChangeDescription} />
          <input
            className="fileInput"
            accept="image/png,image/jpeg"
            type="file"
            onChange={this.onImageChange}
          />
          <div className="buttons">
            <button className="button" onClick={this.onReset}>
              Reset
            </button>
            <button className="button" onClick={this.onSave}>
              Save
            </button>
          </div>
          {href && <a download="image.png" href={href}>Download</a>}
        </div>
        <Card key={cardType} onRef={ref => this.ref = ref} {...this.state} />
      </div>
    );
  }
}

class App extends Component {
  state = {
    printMode: false,
  }

  onClick = () => this.setState({ printMode: !this.state.printMode });

  onSave = () => {
    html2canvas(this.ref).then(canvas => {
      const href = canvas.toDataURL("image/png");
      this.setState({ href });
    })
  }

  render() {
    const { href, printMode } = this.state;
    const classes = classnames({
      'app-container--print': this.state.printMode,
      'app-container': true,
    });

    return (
      <Fragment>
        <div className="header">Generate TTRPG Cards</div>
        <button className="print-mode button button-top" onClick={this.onClick}>Print Mode</button>
        {printMode && <button className="download-all button button-top" onClick={this.onSave}>Create Image</button>}
        {href && <a className="download-cards" download="cards.png" href={href}>Download Image</a>}
        <div className={classes} ref={ref => this.ref = ref}>
          {R.range(0, 9).map(i => (
            <CardEditor key={i} localStorageKey={`card${i}`} />
          ))}
        </div>
      </Fragment>
    );
  }
}

export default App;
