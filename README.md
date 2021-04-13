# React intermediate training

## Getting started

If you have your own github account already, you might prefer to fork this
repository and clone that instead. If you don't just run the following commands
on a terminal or command line interface (assuming that your machine already has
[git available](https://git-scm.com/downloads)):

```
git clone https://github.com/alexey-omelchenko/react-intermediate.git
```

### Install node, npm and project dependencies

First, we need to install [node.js](https://nodejs.org/) and its package
manager, npm.

[Ubuntu/Debian/Mint instructions](https://github.com/nodesource/distributions/blob/master/README.md#installation-instructions)

[Mac instructions](http://blog.teamtreehouse.com/install-node-js-npm-mac)

[Windows instructions](http://blog.teamtreehouse.com/install-node-js-npm-windows)

### Code editor

If you have a favourite code editor feel free to use that, but I recommend
[VsCode](https://code.visualstudio.com/).


In a terminal:

```
cd react-intermediate/tutorial
npm install
npm start
```

## Our tutorial project

We have the beginnings of a game already set up - there is a homepage which has
several game components already embedded. Each hole already functions, but can
currently only be triggered using the 'activate' button, and whether it is
active or not is just stored in the the individual component's state, with no
way of communicating that to other parts of the application. Because it's only
in the individual component, you can also see that if you activate one and move
to the 'About' page, the state is lost.

## Adding Redux for state management

Note that there are a _lot_ of different ways of structuring and implementing
redux applications. The [official
documentation](https://redux.js.org/introduction/examples) offers a
bunch of different examples with [source
code](https://github.com/reactjs/redux/tree/master/examples). The `async` and
`shopping-cart` examples are the closest to what we'll build today.

In a terminal in the tutorial folder:

```
npm install --save-dev redux react-redux redux-thunk redux-logger @types/redux
```


### Configure the state store

Create a new file in the `tutorial/src` folder called `store.ts`:

```
import { createStore, applyMiddleware } from 'redux';
import { createLogger } from 'redux-logger';
import thunk from 'redux-thunk';

import reducers from 'reducers/reducers';

export default function configureStore() {
  const middleware = [thunk];

  if (process.env.NODE_ENV !== 'production') {
    middleware.push(createLogger());
  }

  return createStore(reducers, applyMiddleware(...middleware));
}
```

### Wrap the application in a state provider

In `src/App.tsx`, add the Provider and store imports, and wrap the `Router` in
a `Provider` (in the example below, a `+` indicates a line you should add to the
existing file):

```diff
  import React from 'react';
  import { BrowserRouter as Router, Route } from 'react-router-dom';
+ import { Provider } from 'react-redux';
+ import configureStore from 'store';

  import Homepage from 'components/homepage/homepage';
  import About from 'components/about/about';
  import Nav from 'components/nav/nav';

  import 'index.scss';

+ const store = configureStore();

  const App = () => (
+    <Provider store={store}>
      <Router>
        <div className="container-fluid">
          <Nav />
          <Route exact path="/" component={Homepage} />
          <Route path="/about" component={About} />
        </div>
      </Router>
+    </Provider>
  );

  export default App;
```

We're still importing things that don't yet exist, we'd better fix that:

### Boilerplate for our reducers

Create a new folder, `tutorial/src/reducers` with a file in it called
`reducers.ts`:

```
import { combineReducers } from 'redux';

const initialGameState = {};

const game = (state = initialGameState, action) => {
  switch (action.type) {
    default:
      return state;
  }
};

export default combineReducers({
  game,
});
```

We've only set up one reducer, called `game`, but we've left our structure
flexible by using
[combineReducers](http://redux.js.org/docs/api/combineReducers.html) which means
we can break off separate chunks of state later, and potentially even break
those out into separate files.

Right now the reducer only returns the initial state, as we aren't passing in
anything which sets new values.

### Connecting our hole components to the store

In `reducers.ts`, we want to actually set the initial state up with an array of
the values for each hole (exporting the number of holes we intend to have so we
can use that number elsewhere later) - replace the existing `initialGameState`
declaration:

```
export const holesLength = 5;

const initialGameState = {
  holeState: Array(holesLength).fill(false),
};
```

In `homepage.tsx` at the top of the file, we should import redux's connection
function:

```
import { connect } from 'react-redux';
```

and `export default Homepage;` at the bottom of the file becomes:

```
const mapStateToProps = (state) => {
  const { game } = state;
  const { holeState } = game;

  return { holeState };
};

export default connect(mapStateToProps)(Homepage);
```

`mapStateToProps` is where we unpack the data we receive back from the reducer,
and set the props value that we care about up for the component to consume.

Now we're passing the data in, we should update our `for` loop that sets up the
holes with a new property, `active`:

```
for (let i = 0; i < props.holeState.length; i++) {
  holes.push(<Hole key={`hole-${i}`} id={i} active={props.holeState[i]} />);
}
```

Alternatively, we could have connected each `hole` component individually to the
store, but as we have an array of values rather than an object, that doesn't
make much sense in this case.

We should also add in the missing types

```diff
  interface Props {
    holeState: boolean[];
  }

- const Homepage = (props) => {
+ const Homepage: React.FC<Props> = (props) => {


```

In a redux application, it is **not** necessary to connect every single
component up to the store. We can still use normal methods of passing props
between components where it makes sense to.

We can test that the store is connected to the component properly by changing
the number of the holes in the reducer (the value of `holesLength`).

#### Update the hole component

Now let's hook our new prop up in `hole.tsx` - we need to delete some existing
stuff first because we no longer want to be using state to control if the frog
is active, and we shouldn't need our activate buttons any more either  - a `+` indicates a new line, and a `-` indicates a line
we should remove:

```diff
- import React, { useState } from 'react';
+ import React from 'react';

  import holeMask from 'assets/img/hole-mask.svg';
  import './hole.scss';

  interface Props {
    id: number;
+   active: boolean;
  }

- const Hole: React.FC<Props> = () => {
+ const Hole: React.FC<Props> = (props) => {
-   const [frogActive, setFrogActive] = useState(false);

-    const toggleFrog = () => {
-      setFrogActive(!frogActive);
-    };

    return (
      <div className="hole-container">
-        <button type="button" onClick={toggleFrog}>
-          ACTIVATE
-        </button>
        <div className="hole">
-         <div className={frogActive ? 'frog up' : 'frog'} />
+         <div className={props.active ? 'frog up' : 'frog'} />
          <img src={holeMask} alt="hole-mask" className="hole-mask" />
        </div>
      </div>
    );
  };

  export default Hole;
```

Now our component is connected (via its parent) to the store, if we change the
`initialGameState` values we can set some frogs on manually. Test that that
works by setting the `.fill()` in `reducers.tsx` to set all the values to `true`
initially (and then set it back again once you're happy that that works).

### Our first action

To start the game, we want the user to hit the start button, which will trigger
one of the frogs popping up. When we want to trigger an action, we use a Redux
function called 'dispatch'.

Make a new file, `actions/actions.ts`:

```
export const START_GAME = 'START_GAME';

export const startGame = () => ({
  type: START_GAME,
});
```

It is not strictly speaking necessary to set up the action type as a `const`, but
doing so ensures that we don't garble them as we need to use them both here and
in the reducer, too. See [the
docs](http://redux.js.org/docs/basics/Actions.html) for more on this.

The `startGame` function is an
[action-creator](http://redux.js.org/docs/basics/Actions.html#action-creators)
which must be invoked via a `dispatch` operation.

If we had a bigger application it would probably be wise to split our actions up
into groups of different files by functional area.

In `controls.tsx`, first import the `connect` function and your action:

```
import { connect } from 'react-redux';
import { startGame } from 'actions/actions';
```

then at the beginning of the `startGame` method add a `dispatch` of that action:

```
  startGame () {
    this.props.dispatch(startGame());

~~~etc~~~
```

and at the bottom of the file, we still need to hook up `mapStateToProps` even
though we are only doing a dispatch not taking state back from the store:

```

const mapStateToProps = () => ({});

export default connect(mapStateToProps)(Controls);

```

In `reducers/reducers.ts`, import the action type, add a new key value pair to
the `initialGameState`, and add a case for the action type - a `+` indicates a
new line, and a `-` indicates a line we should remove:

```diff
  import { combineReducers } from 'redux';
+ import { START_GAME } from 'actions/actions';

  export const holesLength = 5;

  const initialGameState = {
-   holeState: Array(holesLength).fill(false)
+   holeState: Array(holesLength).fill(false),
+   isGameActive: false
  };

  const game = (state = initialState, action) => {
    switch (action.type) {
+   case START_GAME:
+     return { ...state, isGameActive: true };
    default:
      return state;
    }
  };

  export default combineReducers({
    game
  });
```

### More complex actions

We can see from the console log that we are successfully manipulating the state,
but we aren't doing anything with those state changes as yet. Before we get to
that, let's first kick off our first frog popping up, as part of the start game
action.

In `actions/actions.ts`:

```diff
+ import { holesLength } from 'reducers/reducers';

  export const START_GAME = 'START_GAME';
+ export const ALTER_HOLES = 'ALTER_HOLES';

- export const startGame = () => {
+ const startGame = () => {
    return {
      type: START_GAME
    };
  };
+
+ const alterHoles = (holeState) => {
+  return {
+     type: ALTER_HOLES,
+     holeState: holeState
+   };
+ };
+
+ const getRandomInt = (min, max) => {
+   return Math.floor(Math.random() * (max - min)) + min;
+ };
+
+ export const startGameAction = () => {
+   return (dispatch, getState) => {
+     dispatch(startGame());
+
+     let newState = getState().game.holeState.slice(0);
+     newState[getRandomInt(0, holesLength)] = true;
+     dispatch(alterHoles(newState));
+   };
+ };
```

Note that we had to create a new action (_not_ action creator) here,
`startGameAction`, to group together our two dispatches plus some logic. The
action function has a weird structure - that's because we are using the
[thunk](https://github.com/gaearon/redux-thunk#motivation) middleware which
makes it so that we can delay the dispatch if we need to via an asynchronous
call (for example, for an API call), or so we can stick some logic in to make
the dispatch conditional.

In `controls.tsx`, update the name of the action we call:

```
import { startGameAction } from 'actions/actions';

~~~etc~~~

  startGame () {
    this.props.dispatch(startGameAction());

~~~etc~~~
```

In `reducers/reducers.ts` let's add our new action type:

```diff
  import { combineReducers } from 'redux';
- import { START_GAME } from 'actions/actions';
+ import { START_GAME, ALTER_HOLES } from 'actions/actions';

  export const holesLength = 5;

  const initialGameState = {
    holeState: Array(holesLength).fill(false),
    isGameActive: false
  };

  const game = (state = initialGameState, action) => {
    switch (action.type) {
    case START_GAME:
      return { ...state, isGameActive: true };
+   case ALTER_HOLES:
+     return { ...state, holeState: action.holeState };
    default:
      return state;
    }
  };

  export default combineReducers({
    game
  });

```

Clicking on the start should now trigger one of the frogs.

### Hooking the frogs up

Now we need a click action on the frogs that should trigger 1) hiding that frog
and 2) randomly popping up another. At the bottom of `actions/actions.ts`:

```
export const clickFrogAction = (frogId) => {
  return (dispatch, getState) => {
    let newState = getState().game.holeState.slice(0);

    newState[frogId] = false;
    dispatch(alterHoles(newState));

    setTimeout(
      () => {
        let newerState = newState.slice(0);
        newerState[getRandomInt(0, holesLength)] = true;
        dispatch(alterHoles(newerState));
      },
      700
    );
  };
};
```

You'll notice here that we perform a `slice` operation whenever we get the
current state. That's because we want a copy of the array rather that a reference
to it. Reducers in redux _must_ have immutable state that gets overwritten
rather than mutated in order to properly trigger changes downstream.

In `hole.tsx` we should import the action (which means we have to hook the
component up to `connect`), and add back in a method for the click action on the
frog:

```diff
- const Hole: React.FC<Props> = (props) => (
-   <div className="hole-container">
-     <div className="hole">
-       <div className={props.active ? 'frog up' : 'frog'} />
-       <img src={holeMask} alt="hole-mask" className="hole-mask" />
-     </div>
-   </div>
- );
+ const Hole: React.FC<Props> = (props) => {
+   const dispatch = useDispatch();

+   const frogClick = () => {
+     dispatch(clickFrogAction(props.id));
+   };

+   return (
+     <div className="hole-container">
+       <div className="hole">
+         <div className={props.active ? 'frog up' : 'frog'} onClick={frogClick} />
+         <img src={holeMask} alt="hole-mask" className="hole-mask" />
+       </div>
+     </div>
+   );
+ };
```

That should take care of chaining together all the frogs appearing. Now we have
a proper state store set up we can also navigate to the about page and back
without losing the state.

### Extensions

Try:

- setting up a END_GAME action that resets all the frogs to down
- refactoring the controls component so the game timer is moved to actions
- setting up a score counter that increments on each click
- resetting the score to 0 on START_GAME
- making frogs disappear automatically if they aren't clicked after an interval
- write unit tests
- rewrite app using contextApi instead of redux

## Testing with Jest

Although there are many test frameworks that you could consider integrating with
your React project, broadly speaking [Jest](https://facebook.github.io/jest/) is
the most popular and well-integrated. We also use
[React Testing Library](https://testing-library.com/docs/react-testing-library/intro) to make assertions about
our components. We'll add some tests to one of our components to show how it
works.

.

## Fetch

React has no tooling of its own for AJAX, so you need to either use the browsers
native `XMLHttpRequest`, another library, or (what I'd recommend) the modern
replacement for `XMLHttpRequest`, which is called
[fetch](https://developer.mozilla.org/en/docs/Web/API/Fetch_API). Unfortunately
IE does not support `fetch` (Edge does) so we need a polyfill if we want to
support IE. The popular polyfill for this is
[whatwg-fetch](https://github.com/github/fetch), but you'll also need a polyfill
for promises too - [babel-polyfill](https://babeljs.io/docs/usage/polyfill/) can
take care of that requirement (both of these are already in place for the
webpack build for this project).

A fetch chain looks something like:

```
fetch('http://example.com/api/')
  .then(checkStatus())
  .then(response => response.json())
  .then(json => {
    // do something with json here - dispatch an action?
  })
  .catch(error => {
    // do something about your error here
  });
```

where `checkStatus` is a function that you'd always inset into fetch calls to
catch error status codes where a response did get returned:

```
export function checkStatus (response) {
  if (response.status >= 200 && response.status < 300) {
    return response
  } else {
    var error = new Error(response.statusText)
    error.response = response
    throw error
  }
}
```

You can put fetch chains inside your redux thunk actions in order to trigger
dispatches once the promise is resolved.

## Higher Order Components

A higher-order component, or
[HOC](https://facebook.github.io/react/docs/higher-order-components.html), is a
way of having reusable bits of logic that you would use to encapsulate varied
content - kind of like a decorator, but for components (or like Angular 1's
concept of transclusion).

It's possible to achieve code reuse through the use of subclassing, but HOC's
are more explicit when you're trying to make reusable components.

[This
article](https://medium.com/@franleplant/react-higher-order-components-in-depth-cf9032ee6c3e)
examines HOCs in some detail.

## Functional Components

There are two different ways you can write your components as a functional or as a class.
Functional components are usually used for simple components, where is class components
better handle complex scenarios where lifecycle hooks are involved.

## React Hooks

Hooks are a new addition in React 16.8. They let you use state and other React features
without using class style components.

## Typescript

Typescript is gain a lot of popularity and a lot of projects are switching to use it.
It helps reduce number of bugs and improve system maintainability. I would recommend
using Typescript for projects that has to be maintained for extended period of time or
go to production

## Structuring for maintainability

There are a **lot** of different opinions on this topic and you will see
projects that differ wildly. To a large extent it sort of depends on your
project size... a very small project _could_ be just one file.

I've found that subfolders for components plus their styles and tests works,
with separate folders for other types of constructs like actions and reducers
works well for medium sized projects. The example project for today uses this
structure.

For much larger projects, you should consider a _fractal_ structure (see [this
discussion](http://www.developersite.org/103-121750-javascript) for some detail
on what that entails) where the project is split into self contained functional
areas that contain all of their dependencies inline (so rather than having a
actions folder at the root of the src tree, the one action file that you need
for that piece is self contained there).
[react-redux-starter-kit](https://github.com/davezuko/react-redux-starter-kit)
partially implements this pattern.

## Sidestepping build complexity with create-react-app

An alternative to our Webpack process is
[create-react-app](https://github.com/facebookincubator/create-react-app). let's
explore how that works:

```
cd ~
sudo npm install -g create-react-app

create-react-app test-app
cd test-app/
npm start
```

Now let's perform an
[eject](https://github.com/facebookincubator/create-react-app#converting-to-a-custom-setup)
to see what create-react-app is doing under the hood - _you wouldn't normally
perform this as it's one way until you absolutely had to_ but we're just having
an explore.

```
npm run eject
```

A simpler alternative to create-react-app is our own
[catalyst-frontend](https://www.npmjs.com/package/catalyst-frontend) build tool.
This gives you the config straight away, which makes it easier to customise.

## Making your React app production ready

Make sure that you use the [production
build](https://facebook.github.io/react/docs/optimizing-performance.html#use-the-production-build)
of the React libraries. Practically speaking, if you are using webpack and the
`-p` flag, you are sorted.

In your application itself, if there are things that would want to make
conditional for development only (e.g. logging) you can wrap tham in a guard:

```
if (process.env.NODE_ENV !== 'production') {
  // your conditional stuff here
}
```
