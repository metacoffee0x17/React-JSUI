import React, { Component } from 'react';

//styles
import * as S from './styles';

class BabelRepl extends Component {
  babelWebView = React.createRef();

  componentDidMount() {
    const webview = this.babelWebView.current;
    console.log('webview', webview);
    if (webview) {
      webview.insertCSS(`
        * {
          display: none !important;
        }
      `);
    }
  }
  render() {
    return <webview ref={this.babelWebView} className={S.BabelRepl} src="https://babeljs.io/repl/" />;
  }
}

export default BabelRepl;
