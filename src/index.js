import React from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';
import { Button } from '@contentful/forma-36-react-components';
import { init, locations } from 'contentful-ui-extensions-sdk';
import tokens from '@contentful/forma-36-tokens';
import '@contentful/forma-36-react-components/dist/styles.css';
import './index.css';

const contentful = require('contentful');

export class DialogExtension extends React.Component {
  static propTypes = {
    sdk: PropTypes.object.isRequired
  };

  constructor(props) {
    super(props);
    this.state = {
      images: []
    };
  }

  componentDidMount() {
    this.props.sdk.window.updateHeight(window.outerHeight);
    let imageIds = this.props.sdk.parameters.invocation.images.replace(/\s/g, '').split(',');

    const client = contentful.createClient({
      space: this.props.sdk.ids.space,
      accessToken: this.props.sdk.parameters.installation.accessToken
    });

    client
      .getAssets({ imageIds })
      .then(response => {
        const images = response.items.map(image => {
          return {
            title: image.fields.title,
            description: image.fields.description,
            url: image.fields.file.url
          };
        });
        this.setState({ images: images });
      })
      .catch(console.error);
  }

  render() {
    let images = this.state.images;

    return (
      <div className="flex-container">
        {images.length > 0 ? (
          images.map((image, index) => {
            return (
              <div key={index} style={{ margin: tokens.spacingXl }} className="content-container">
                <h3 style={{ fontFamily: tokens.fontStackPrimary, marginBottom: tokens.spacingM }}>
                  {image.title}
                </h3>
                {image.description && (
                  <p
                    style={{ fontFamily: tokens.fontStackPrimary, marginBottom: tokens.spacingXl }}>
                    {image.description}
                  </p>
                )}
                <img src={image.url} alt="" />
              </div>
            );
          })
        ) : (
          <p>Fetching examples</p>
        )}
      </div>
    );
  }
}

export class SidebarExtension extends React.Component {
  static propTypes = {
    sdk: PropTypes.object.isRequired
  };

  constructor(props) {
    super(props);
    this.handleTypeClick = this.handleTypeClick.bind(this);
  }

  handleTypeClick() {
    this.props.sdk.dialogs.openExtension({
      width: 1400,
      title: 'Available Content Blocks',
      parameters: this.props.sdk.parameters.instance
    });
  }

  componentDidMount() {
    this.props.sdk.window.startAutoResizer();
  }

  render() {
    return (
      <div>
        <Button onClick={e => this.handleTypeClick(e)}>
          Open {this.props.sdk.parameters.instance.fieldName} Reference
        </Button>
      </div>
    );
  }
}

export const initialize = sdk => {
  if (sdk.location.is(locations.LOCATION_DIALOG)) {
    ReactDOM.render(<DialogExtension sdk={sdk} />, document.getElementById('root'));
  } else {
    ReactDOM.render(<SidebarExtension sdk={sdk} />, document.getElementById('root'));
  }
};

init(initialize);
