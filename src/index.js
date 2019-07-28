import React from 'React';
import RN from 'react-native';
import { memo } from './Memo';
import { processStyles, provideValueProcessors } from './Utils';

const { View } = RN;

const ThemeContext = React.createContext();

class StyleManProvider extends React.Component {
  constructor(props) {
    super(props);
    this.setTheme = this.setTheme.bind(this);
    this.getTheme = this.getTheme.bind(this);
    this.onLayout = this.onLayout.bind(this);
    this.state = {
      defaultStyles: {
        flex: 1
      },
      theme: {},
      cacheId: 1,
      setTheme: this.setTheme,
      getTheme: this.getTheme
    };
  }

  setTheme(themeFn) {
    this.processStyles(themeFn);
  }

  getTheme() {
    return this.state.theme;
  }

  componentWillMount() {
    this.processStyles();
  }

  onLayout(e) {
    this.processStyles();
  }

  processStyles(themeArg) {
    const themeFn = themeArg || this.props.theme;

    if (!themeFn || typeof themeFn !== 'function') {
      throw 'React Native Styleman: theme prop should be a function.';
    }
    const cacheId = this.state.cacheId + 1;
    const partiallyComputedTheme = provideValueProcessors(themeFn);

    this.setState({
      theme: processStyles(partiallyComputedTheme, cacheId),
      cacheId
    });
  }

  render() {
    return (
      <ThemeContext.Provider value={this.state}>
        <View style={this.props.styles || this.state.defaultStyles}
          onLayout={this.onLayout}>
          {
            React.Children.only(this.props.children) && this.props.children
          }
        </View>
      </ThemeContext.Provider>
    );
  }
}

function withStyles(stylesFn) {
  if (!stylesFn || typeof stylesFn !== 'function') {
    throw 'React Native Styleman: styles passed in withStyles function should be wrapped in a function.';
  }
  const stylesSelector = memo((themeObj)=>{
    const styles = stylesFn(themeObj.theme);
    const processedStyles = {};
    let generatedStylesheet;

    Object.keys(styles)
      .forEach((componentName)=>{
        processedStyles[componentName] = processStyles(styles[componentName], themeObj.cacheId);
      });

      generatedStylesheet = RN.StyleSheet.create(processedStyles);

    return {
      styles: generatedStylesheet,
      getTheme: themeObj.getTheme,
      setTheme: themeObj.setTheme
    };
  }
  );

  return function (WrapperComponent) {
    return function (props) {
      return (
        <ThemeContext.Consumer>
          {
            (themeObj)=>{
              const stylesObj = stylesSelector(themeObj);

              return (
                <WrapperComponent {...props}
                  styles={stylesObj.styles}
                  setTheme={stylesObj.setTheme}
                  getTheme={stylesObj.getTheme} />
              );
            }
          }
        </ThemeContext.Consumer>
      );
    };

  };
}

export {
  withStyles,
  StyleManProvider
};

