# React Native Styleman
[![license](https://img.shields.io/badge/License-MIT-brightgreen)](https://github.com/anubhavgupta/react-native-styleman)

React Native Styleman is a tiny(3KB gzipped), high performance `responsive` styling library for react native. 

It provides following features:
- Media Queries with support for -> [width, height, orientation, direction, platform, platformVersion] 
- Dynamic styling based on device's orientation.
- Static and dynamic theming with support for global theme variables.
- Responsive units to automatically scale the UI based on the device's screen size.

- Highly Extensible: Add your own custom css properties and values. 


## Installation

Use following command to install the library 
```bash
npm install react-native-styleman
```
OR if you are using yarn, then:
```bash
yarn add react-native-styleman
```

## Usage

#### Basic usage

Defining your `Theme Data` and wrap your root component in `StyleManProvider`. 

```js
import { StyleManProvider } from 'react-native-styleman';
import { MainComponent } from './MainComponent'; // <-- our root component 

// create your theme data here... 
const THEME_DATA = () => ({
    
    DEFAULT_BACKGROUND: 'white',
    
    // typography
    SMALL: 8,
    MEDIUM: 15,
    LARGE: 22,
    // text colors
    PRIMARY: 'blue'
});

// then pass the THEME_DATA to StyleManProvider as a prop and pass you root component as its child.
const App = () => {
    return (
        (
            <StyleManProvider theme={THEME_DATA}>
                <MainComponent />
            </StyleManProvider>
        )
    );
};
// later 
// AppRegistry.registerComponent('yourApp', () => App);
```
Remember, you just have to use the `StyleManProvider` at the root level only. 

#### Now lets add some styles to the `MainComponent`


```js
// first import `withStyles` higher order component from `react-native-styleman`
import { withStyles } from 'react-native-styleman';
import { View, Text } from 'react-native';

// now lets write styles for the MainComponent using the variables created in the theme object.  
const styles = ({ MEDIUM, PRIMARY }) => ({
    // here we are destructuring the object returned by THEME_DATA function 
    // and getting the variables MEDIUM_LARGE and PRIMARY out of it.
       
    container: {
        flex: 1
    },
    text: {
        color: PRIMARY, // using theme here
        fontSize: MEDIUM, // and here too
    }
});

// Now lets define out MainComponent  
let MainComponent = ({ styles })=>(
  // here we get our styles in the props.
  // `withStyles` function(mentioned below) auto injects the styles in the props of the component.
    <View style={styles.container}>
        <Text style={styles.text}> Hello World </Text>
    </View>
);

// now, lets wire up things together.
MainComponent = withStyles(styles)(MainComponent);

export { MainComponent };
```
We don't need to wrap the child components of `MainComponent` in `StyleManProvider` again. We can just use the `withStyles` function to consume their styles in those components. 
#### Now lets change component's style on orientation change automatically

Now lets say we want to change the font color based on the orientation of the device. Here is how we can do that:
```js
 const styles = () => {
    return ({
        container: {
            ...
        },
        text: {
            //more styles...
            fontSize: 22,
            color: 'blue',//default// <---------------| // this value would be overwritten 
                                   //                 | // based on current orientation of 
            '@media': [            //                 | // the device. When the device is in 
              {                    //                 | // landscape mode, it would be overwritten 
                orientation: 'landscape',//           | // to red and to pink in portrait mode
                styles: {          //                 |
                  color: 'red', //--------------------|
                }
              },
              {                    
                orientation: 'portrait',
                platform: 'android',  // we can add more than one constraint 
                styles: {          
                  color: 'pink'
                  
                  // any other styles that we write here would also be merged to the `text` object's style
                  // if the device is an android as well as in portrait mode.
                }
              }
            ] // as you can see `@media` accepts an array with multiple queries. 
              // Styleman would process these queries from top to bottom. 
              // Styles for a query is applied if all the constraints given in it are true 
              // (in that case rest of the queries are not processed)      
        }
    });
};
 
let MainComponent = ({ styles })=>(
    <View style={styles.container}>
        <Text style={styles.text}> Hello World </Text>
    </View>
);

// now, lets wire up things together.
MainComponent = withStyles(styles)(MainComponent);

export { MainComponent };
```
Following properties are supported by `@media`:

```text
{
    platform:     'ios' | 'android',
    minVersion:   number<float>, // min version of ios/android 
    maxVersion:   number<float>, // max version of ios/android
    minWidth:     number, // in DP  
    maxWidth:     number, // in DP
    minHeight:    number, // in DP
    maxHeight:    number, // in DP
    orientation: 'landscape' | 'portrait',
    direction:   'rtl' | 'ltr',
}
```  

#### Responsive units
Instead of adjusting certain properties like fontSize manually based on the screen size we can automate it.
We can do this via responsive units.

Responsive units are functions which take some static value and return another values based on usually screen dimensions.
eg: Let's say that on a 320dp with screen you may want the font size to be 14dp but want to increase it on a bigger screens (420dp screen) and reduce 
it on lower dp screens (240 dp) automatically. This can be achieved via Responsive units. 
You can read more about it [here](https://blog.solutotlv.com/size-matters/)  

We currently have following responsive units:

- rem: responsive em (for horizontal usecases, scales linearly)
- mrem: moderately rem (for horizontal usecases, but scales moderately)
- vrem: vertically rem (for vertical usecases, scales linearly)
- mvrem: moderately vrem (for vertical usecases, but scales moderately)
 
Lets jump into code:
 
 ```js
const THEME_DATA = function ({
    getRem, 
    getMRem,
    getScreenWidthDP, // -> returns the screen width in DP
}){
  // in arguments, we get these `value processor` generators. Once generated, these functions process values given to them.   
  // we can configure these to get our units
    const rem = getRem(getScreenWidthDP(), 320); // 320 is the width of the screen in the given designs to you by your designer. 
    const moderateScaleFactor = 0.4;  // here we are saying, we want to keep the scaling to 40% of the original value only
    const mrem = getMRem(getScreenWidthDP(), 320, moderateScaleFactor);

    return {
        // units function
        rem, // <- passing these functions to our theme object so that we can access these from any stylesheet. 
        mrem,
        
        // typography
        SMALL: rem(8),
        MEDIUM: rem(15),
        LARGE: rem(22),
    };
};

// now lets access `mrem` from the theme object
const styles = ({ MEDIUM, mrem })=>{
    return ({
        container: {
            flex: 1
        },
        text: {
            fontSize: mrem(MEDIUM) // lets make the fontSize of this text scale as per the device with.
        }
    });
};

let MainComponent = ({ styles })=>(
    <View style={styles.container}>
        <Text style={styles.text}> Hello World </Text>
    </View>
);

MainComponent = withStyles(styles)(MainComponent);

const App = () => {
    return (
        (
            <StyleManProvider theme={THEME_DATA}>
                <MainComponent />
            </StyleManProvider>
        )
    );
};

```
`react-native-styleman` supports following value processors generators:
- getScreenWidthDP() returns -> width
- getScreenHeightDP() returns -> height
- getScreenWidthPX() returns -> width
- getScreenHeightPX() returns -> height
- getRem(SCREEN_WIDTH_DP, DESIGN_GUIDELINES_BASE_WIDTH_DP) returns -> fn(width) 
- getMRem(SCREEN_WIDTH_DP, DESIGN_GUIDELINES_BASE_WIDTH_DP, MODERATE_SCALING_FACTOR) returns -> fn(width)
- getVRem(SCREEN_HEIGHT_DP, DESIGN_GUIDELINES_BASE_HEIGHT_DP) returns -> fn(height)
- getRound() returns -> fn(height|width)

#### Switching theme dynamically

Let's see now how we can change the theme dynamically with an example:
eg: Let's say you want to change the PRIMARY at runtime from blue to red when the `Change Theme` button is clicked. 
   
```js

// your original theme data. 
const THEME_DATA = () => ({
    // typography
    SMALL: 8,
    MEDIUM: 15,
    LARGE: 22,
    // text colors
    PRIMARY: 'blue' // change this to red 
});

const App = () => {
    return (
        (
            <StyleManProvider theme={THEME_DATA}>
                <MainComponent />
            </StyleManProvider>
        )
    );
};
  
const styles = ({ LARGE, PRIMARY }) => ({       
    container: {
        flex: 1,
    },
    text: {
        color: PRIMARY, // using theme here
        fontSize: LARGE, // and here too
    }
});

// the `withStyles` HOC along with styles also passes few helper functions like `setTheme` and `getTheme`   
let MainComponent = ({ styles, setTheme })=>( 
    <View style={styles.container}>
        <Text style={styles.text}> Hello World </Text>
       
        <Button title={"Change Theme"} onPress={() => {
                    setTheme((valProcessors) => {
                        // Get the current system theme. 
                        const baseTheme = THEME_DATA(valProcessors);
                        
                        // update it as per our liking and return it.  
                        return {
                            ...baseTheme,
                            PRIMARY: 'red'
                        }
                    });
                }} />
    </View>
);

// now, lets wire up things together.
MainComponent = withStyles(styles)(MainComponent);

export { MainComponent };
```

The `withStyles` HOC passes following props to the wrapper component:
- `styles`
- `setTheme(themeGeneratorFunction)` 
- `getTheme()` -> returns current processed theme
 
`themeGeneratorFunction: (valueProcessors) -> newThemeObject`
In case you didn't noticed the `StyleManProvider's` theme prop also accepts a `themeGeneratorFunction`. 

## Inspiration
This library is inspired from following projects:
- [react-native-extended-stylesheet](https://github.com/vitalets/react-native-extended-stylesheet)
- [react-native-size-matters](https://github.com/nirsky/react-native-size-matters) 
 

## License 
MIT @ [Anubhav Gupta](https://github.com/anubhavgupta) 


