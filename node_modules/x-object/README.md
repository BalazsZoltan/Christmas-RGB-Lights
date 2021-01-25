[![Build Status](https://travis-ci.org/abdennour/x-object.svg?branch=master)](https://travis-ci.org/abdennour/x-object)
[![Coverage Status](https://coveralls.io/repos/github/abdennour/x-object/badge.svg?branch=master)](https://coveralls.io/github/abdennour/x-object?branch=master)

# Overview :

JsDK (JS dev kit) of Object Class.

# How to use :

## 1. Extend Object Class :

```js
require(`x-object`);
// import 'x-object';

//then :
var object ={a:1, b:2, c:3};
var whitelist = ['a', 'b']
Object.filter(object, whitelist);
// {a:1, b:2}

//-----------Opposite of filter (blacklist)
var blacklist = ['a', 'b']
Object.filter(object, (k, v) => !blacklist.includes(k))
// {c:3}
//........
```


## 2. Import safe :

```js
const XObject = require('x-object/safe');
// import XObject from 'x-object/safe';
//then :
XObject.filter(object,['a', 'b']);
//........
```
#  Methods :


## 1. Object.map( object, (k, v)=>)

- return another object with the same keys , but this same/different values according to the second argument which is callback accepts two arguments.

```js

Object.map({f:"ab",l:"abc" }, (k, v) => v.length );
// {f:2, l:3}
//-------------------
 let students = {
   sami : [80,70],
   ahmed: [90,100]
 };
 let average = (k, v) => v.reduce((a, b) => a+b , 0) / v.length ;
 Object.map(students,average);
  //{sami:75, ahmed: 95}  

```

## 2.Object.filter(object, String|Array|RegExp|function)

   - Retrieve a sub-object of a current object.

   - Examples :

 ```js
  Object.filter({firstname:'Rami', age:23, parent:'Ahmed'}, 'age' );
   // {age:23}

  Object.filter({firstname:'Rami', age:23, parent:'Ahmed'}, ['age','parent'] );
   // {age:23, parent:'Ahmed'}

   Object.filter({firstname:'Rami', lastname:'Toumi', parent:'Ahmed'}, /name$/ );
    // {firstname:'Rami', lastname:'Toumi'}

    Object.filter({fn:'Rami', ln:'Toumi', p:'Ahmed'}, ((k, v) => k == 'fn' || v == 'Ahmed' ));
     // {f:'Rami', parent:'Ahmed'}      

 ```  

## 3.Object.vals(object) :

- As `Object.keys` however it returns the values of keys in arraym not the keys itself.

## 4. Object.belongsTo(childObject, parentObject) :

- It checks if the 1st argument is a sub-object of the 2nd argument.

## 5. Object.equals


- check quality of any two objects even if they are complex.


# Unit tests :

![Coverage X-object](https://raw.githubusercontent.com/abdennour/spl/master/js/Screen%20Shot%201438-02-13%20at%2011.27.09%20PM.png)

```
Filter Class
  ✓ contains 4 non-static methods
  ✓ runs "byKey" method prefectly
  ✓ runs "byKeys" method prefectly
  ✓ runs "byRegExp" method prefectly by matching all keys ends with "name"
  ✓ runs "byCallback" method prefectly

Fitler#execute Method
  ✓ must forwards call to "byKey" whenever the argument is instance of "String class"
  ✓ must forwards call to "byKeys" whenever the argument is instance of "Array Class"
  ✓ must forwards call to "byRegExp" whenever the argument is regular expression
  ✓ must forwards call to "byCallback" whenever the argument is callback
  ✓ must return the same object if no argument is given
  ✓ must throw exception whenever the argument is not belong to one of  the previous classes (String, Array, RegExp, Function)

Object.map
  ✓ returns an object with the same keys of target object
  ✓ calls the callback for each keys' iteration

Object.filter
  ✓ returns an object with 1 key whenever the 2nd arg is string & this key is belongs to keys of the target object
  ✓ returns an object with 2 key whenever the 2nd arg is string & keys  belong to keys of the target object

Object.vals
  ✓ works fine
  ✓ returns an array of object values with a size equals to keys size

Object.belongsTo
  ✓ check if the 1st argument is SUB-OBJECT of the 2nd argument

Object.equals
  ✓ checks the equality of two strings
  ✓ checks the equality of two arrays
  ✓ checks the equality of two literal objects
  ✓ checks the equality of two dates
  ✓ checks the equality of two complex objects

Safe Import
  ✓ prevents the Object class from extension
  ✓ extends the Object class whenever "x-object" is imported


25 passing (24ms)
```
