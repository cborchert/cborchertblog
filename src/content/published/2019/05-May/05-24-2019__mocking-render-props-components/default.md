---
title: This week I learned how to mock a Render Props Component in React.
show_header: true
cover_image: './greta-pichetti-713479-unsplash.jpg'
date: 2019-05-24
description: 'How can I prevent the error Warning: Functions are not valid as a React child when I run my tests?'
tags:
  [
    'react',
    'render props',
    'testing',
    'jest',
    'javascript',
    'this week i learned',
  ]
categories: ['articles']
---

## Intro

So this little article, as the title says, is about how you might mock Render Props for your test suites, especially if you run across the following error while running your tests:

> Warning: Functions are not valid as a React child. This may happen if you return a Component instead of <Component /> from render. Or maybe you meant to call this function rather than return it.

## TL;DR

Your mocks need to support having functions as children or you should use shallow rendering. I ended up replacing my basic mock with the following:

```javascript
jest.mock(
  './path/to/MyComponent',
  ({ children, ...rest }) => (
    <mock-my-component {...rest}>
      {typeof children === 'function' ? '[Child as a function]' : children}
    </mock-my-component>
  )
```

## Nota Bene

I want to point out that the situation in this article comes from an unidealized, real-life years-old code base with dozens of people working on it. I may discuss doing things that might not be idealized practices or the most cutting edge, but there might be someone out there trying to fix the warning above. This post is for you. If it helps someone else understand something, even better.

## Preface: Render Props ?

Feel free to skip this section if you know what a Render Prop Component is.

Understanding the Render Props component pattern in React (a.k.a. the Function as a child component pattern) takes some mental gymnastics. The first time I came across one in the wild, I'm pretty sure that I just sat staring incredulously at my screen for a few minutes before deciding that I wasn't smart enough for the code in front of me and moving on to do something else.

There are plenty of other articles written by eloquent and intelligent people that explain Render Props better than I could, so I'm just going to give a broad overview: "Render Props" is a component pattern in React used to separate the concerns of logic and rendering. For example, say you have a DataProvider component which, uh, provides some data, but you know that you'll want to use this data in different ways throughout your app. In this case, you don't want to limit yourself to rendering the data in a specific way every time. So you create a component `<DataProvider />` which handles the data and doesn't really have an opinion of what to do with this data when it comes to rendering. The catch is that we can pass it a function into a property (called `render` for example) which tells `<DataProvider />` how to display the data. Voilà. Render props.

```jsx
<DataProvider render={data => <h1>Hello {data.target}</h1>} />
```

You can read a bit more about this pattern in the [React Docs](https://reactjs.org/docs/render-props.html) or in [this blog post (by Robin Wieruch)](https://www.robinwieruch.de/react-render-props-pattern/). The gist is that you pass a rendering function to a data management component. It's just another way to separate concerns, and you sometimes come across them in the wild or may find yourself writing one some day for some reason.

It's worth mentioning that sometimes you don't use a named prop at all to pass the render logic, but, strangely, you pass it directly as a child. The above `<DataProvider/>` component ends up getting used like this if we did it this way:

```jsx
<DataProvider>
{data => (
  <h1>Hello {data.target}</h1>
)}
<DataProvider/>
```

Basically, we pass the function to `props.children` instead of `props.render`. The reason for this is that it nests better, I guess? I'm not sure, but people do it this way sometimes, and this is little pattern is actually at the crux of what went wrong in my code this week, so look out!

I've also set up a small [project on codepen](https://codesandbox.io/s/testing-render-props-jrdun) that can give a small illustration of render props/functions as children, mostly taken from the React Docs, for those that like to get hands on.

<iframe src="https://codesandbox.io/embed/testing-render-props-jrdun?fontsize=14" title="testing render props" style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;" sandbox="allow-modals allow-forms allow-popups allow-scripts allow-same-origin"></iframe>

## The error

In my case, I ran into the following situation this week. I'm updating all the unit tests for my current client's rather large testing suite (701 test suites; 3296 individual tests -- yikes!) to fix all warnings and error outputs that occur during the testing process. These are often the result of using `i` as a key or not using a key at all, or not using `act` to wrap updates, or that kind of bad practice thing that results in a passing test (and therefore successful pull requests), but indicates a problem either in the code or the tests.

One of these errors which I kept coming up against was:

> Warning: Functions are not valid as a React child. This may happen if you return a Component instead of <Component /> from render. Or maybe you meant to call this function rather than return it.

Following the stack trace, I inevitably came back to the test suite of a component that had a Render Props component as a child. So what's going on?

## The mock setup

Well, we often mock the children of our components for our tests, especially if we're using snapshots to check the output of the component that we're testing. This means that if we change the child, we don't need to worry about that breaking a parent's test suite.

The most basic way of doing this is, and the way we often do it to the point of being formulaic is:

```javascript
jest.mock('./path/to/MyComponent', () => 'mock-my-component')
```

This way, `<MyComponent />` and its props are replaced with `<mock-my-component />` with the same props; i.e. `<MyComponent foo="bar" />`is replaced with `<mock-my-component foo="bar" />`.

## The problem

Are you still with me? Have you figured out what my problem is? It took me a minute.

Basically, we're taking a render props / function as a child prop component and swapping it out (using mock) with a component that expects a normal `props.children`, then we're passing it the old children, which is still a function.

I mean, does this make sense to you ?

```jsx
function adds(a, b) {
  return a + b
}

// ... some time later
const myComponent = () => <div> {adds} </div>
```

I hope not. This is why React is freaking out at me: I'm literally passing a dumb component what should be a non-valid child.

So what do we do?

## The solution

The two solutions that I've found are 1) Don't mock at all, 2) to use shallow rendering or 3) to write a better mock.

It turns out that using shallow rendering cuts the children prop out of our components so the fact that we're passing functions in is not a problem. In that case, we don't even need a mock! That's great, but maybe that's not your jam. In our case, we have a _lot_ of tests, and using a shallow renderer, in my experience, is slower.

So, I stuck with solution 3) write better mocks.

Instead of

```javascript
jest.mock('path/to/MyComponent', () => 'mock-my-component')
```

I ended up going with something along the lines of

```javascript
jest.mock('./path/to/MyComponent', ({ children, ...rest }) => (
  <mock-my-component {...rest}>
    {typeof children === 'function' ? '[Child as a function]' : null}
  </mock-my-component>
))
```

This mock has the advantage of showing us all the properties we pass into the component, not throwing us a big error, and informing us in the case of a snapshot test, that we've passed a function in as a child to the component.

That's it! Thanks for reading!

---

_Image credits:_

Cover Photo by [Greta Pichetti](https://unsplash.com/photos/6qpGLW5YmCI?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText) on [Unsplash](https://unsplash.com/search/photos/wrong?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText)
