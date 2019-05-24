---
title: 'For loop vs Array filter() vs Array find()'
show_header: true
cover_image: './wade-austin-ellis-721340-unsplash.jpg'
date: '2019-04-06'
tags: ['javascript', 'array', 'programming tips']
categories: ['articles']
---

## TL;DR

If ever you need to filter an array and take just the first result, use `Array.prototype.find` instead of `Array.prototype.filter`. It saves some code and needless processing.

Compare

```js
let value = [1, 2, 3, 4, 5].find(val => val > 2)
// value = 3
```

and

```js
let values = [1, 2, 3, 4, 5].filter(val => val > 2)
// values = [3,4,5]

// we need to take an extra step to get our value!
let value = values[0]
// value = 3
```

Why bother with the `[0]`? Why write more code when less will do (especially if the new code is at least as readible as the old code)?

## The problem

Imagine that you want to pick the first object in an array which matches a specific set of criteria.

This kind of pattern happens relatively frequently in real world applications, in my experience.

For example, maybe in a contact list component, each person in a collection can several listed phone numbers, but you only want to show their mobile number. If they have more than one, you just want to show the first one to simplify things.

How would you do it?

## The example

For the purposes of this post, we'll use the following example: an array of objects, each containing a color and a value property. Given the following list, let's say that we want to output the `value` of the first object whose color is `green` (i.e. "b").

<pre>
[
  <span style="color: #e74c3c">{ color: "red", value: "a"}</span>,
  <span style="color: #16a085">{ color: "green", value: "b"}</span>, // 👈 this one
  <span style="color: #f39c12">{ color: "orange", value: "c"}</span>,
  <span style="color: #16a085">{ color: "green", value: "d"}</span>,
]

</pre>

## The solution(s)

### Solution 1: For Loop

One solution could be to use a `for` loop, iterating over each object until we find one that matches, and then breaking from the loop to avoid unnecessary work.

```js
const colors = [
  { color: 'red', value: 'a' },
  { color: 'green', value: 'b' }, // 👈 this one
  { color: 'orange', value: 'c' },
  { color: 'green', value: 'd' },
]

// initialize the variable
let value

// loop through the all the colors
for (let i = 0; i < colors.length; i++) {
  if (colors[i].color === 'green') {
    // We have a winner!
    // get the value
    value = colors[i].value
    // break out of the loop... we have our value!
    break
  }
}

console.log(value)
```

This solution has some concrete advantages such as being relatively readable and intelligible, but it is by no means terse. Let's look at some other, more modern solutions.

### Solution 2: Array.prototype.filter()

Another solution is to use one of the array `filter()` method to pick out just the objects whose color is "green", then to use the first object to get the value.

```js
const colors = [
  { color: 'red', value: 'a' },
  { color: 'green', value: 'b' }, // 👈 this one
  { color: 'orange', value: 'c' },
  { color: 'green', value: 'd' },
]

// Get an array of objects whose color is green
const selectedColors = colors.filter(({ color }) => color === 'green')
// get the value of the first object, if it exists
const value = selectedColors[0] && selectedColors[0].value

console.log(value)
```

This solution is much tighter, and once you get used to the arrow function syntax, it remains relatively readable.

There is one big problem, which is that ugly trailing `[0]`. This is necessary because `filter` will always return an _array_ of all items that met the criteria, and we only want the first solution. We might have written something like:

```js
const selectedColor = selectedColors[0]
const value = selectedColor && selectedColor.value
```

But this just displaces the problem, and this problem isn't just cosmetic, but is indicative of a deeper issue. The fact that we are selecting the first index of an array and throwing the rest away means that we allowed our code to do extra work sifting through every object in our original array: we should have stopped the process like we did with the `break` in the `for` loop once we had our candidate.

### Solution 3: Array.prototype.find()

Enter the array `find()` method. This is exactly the method that we're looking for! You pass a function into `find()` which will act as a test for each item. When a solution is found, that solution is returned and the process is stopped:

```js
const colors = [
  { color: 'red', value: 'a' },
  { color: 'green', value: 'b' }, // 👈 this one
  { color: 'orange', value: 'c' },
  { color: 'green', value: 'd' },
]

// Get the first object that matches
const selectedColor = colors.find(({ color }) => color === 'green')
// get the value of the first object, if it exists
const value = selectedColor && selectedColor.value

console.log(value)
```

The difference between this solution and the `filter` solution is slight but we're able to get rid of the useless `[0]`'s and the problems that come with them. As a result, our code is more readable and more robust.

## Wrap up

So in the end, who's the winner? For me, the obvious answer is "**not** `Array.prototype.filter`." The filter method is super useful, but it is also meant for situations when we're expecting more than one result or for the result to be returned as an array. In our case, it is simply the wrong tool, and we end up spending mental energy, processing time, and characters to bend the tool to our uses.

That said, in this specific example, I'd say, with a big caveat, that the most fitting solution is actually the classic `for` loop. I say this because:

- it is absolutely clear what is going on in the code
- we don't need to allocate an arrow function to memory, so why do it?
- we are in control, using `break` of just how much code to run
- the job that is called for doesn't require anything more than a for loop, and I'm not certain, but I'm pretty sure a for loop is more efficient than an array method

Of course, I said that there's a caveat, and there are in fact several reasons to use Array.prototype.find. Consider the following:

1. The "new" array methods like find, filter, map, some, and any are self documenting. When I see `colors.find` I know what to expect without a comment: we'll be picking out a single entry from our array. When I see `for (let i = 0; i < colors.length; i++)`, however, I only know that we'll be looping over the array.

2. The given code is a "toy" example. As soon as the operation gets more complicated, our code is likely to blow up.

3. The array methods reinforce immutability. It's a lot harder to write code that accidentally changes your array as you loop over it.

4. The array methods are built to stack on each other. Imagine that you had to sort the array each entry's `value` before you got the first matching entry. In that case, tacking on a `.sort` before the `.find` would keep our code concise and readable. (See point 2 above.)

All things told, `.find` is the best option, especially if we're dealing with real code.

## Related

I'd suggest read up on the Array methods over at [MDN web docs](https://developer.mozilla.org/en-US/). The descriptions are excellent, and the code examples are quite helpful. There are quite a few of these methods, but they basically replace your `for` loops with something built for the job. They're fantastic and I'd love to write a bit more about them when I have the chance. Until then, maybe check whether [Chris Ferdinandi](https://gomakethings.com/articles/) has written up on them?

The following methods apply a given function to each item in the array to synthesize something new. These are the hotness at the moment, and probably will continue to be. Once you figure them out, you'll see why.

- 🔥[Array.prototype.sort()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort) - sorts the elements of an array in place based on the provided function and returns the sorted array
- 🔥[Array.prototype.reduce()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/Reduce) - executes a reducer function (that you provide) on each member of the array resulting in a single output value (you can, for example, add each value of an array together, etc.)
- 🔥[Array.prototype.sort()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map) - method creates a new array with the results of calling a provided function on every element in the calling array.

The following array methods are all passed a test function which is applied to each element in an array; the method's return value tells you something about the array.

- [Array.prototype.find()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/find) - find the first element in an array which matches a test.
- [Array.prototype.findIndex()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/findIndex) – find and return the index of the first element in an array which matches a test.
- [Array.prototype.includes()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/includes) – determine whether a value exists in the array which matches a test.
- [Array.prototype.filter()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/filter) – find all elements matching a test.
- [Array.prototype.every()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/every) – determine if all elements in an array pass a test
- [Array.prototype.some()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/some) – determine if at least one element in an array passes a test
