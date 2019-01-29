# StoRyX
## Documentation
**Full documentation is available at http://storyx.netlify.com/**
## What is that
StoRyX is a collection of tools (mostly containers) that can be registered to for receiving events of change.
The eventing relies on RxJs library.

## Why
I'm heavily using typescript and RxJs in my development.
I realized that I was often writting the same pieces of code based on RxJs.

I didn't know other libraries that would do the same in typescript so I decided to create this one.

This way I could have more constency among my diferent projects and rely on tested
behaviors.

I want to keep it simple (even if I'm a big fan of ramdajs and sanctuaryjs), so this library has the least dependencies possible except for the RxJs library.

## What's in the box
* [[Informer]] - Provide an helper that returns an observable (based on an async subject) that complete later;
* [[State]] - A data holder that can be registered to for change. It allows implementing an Actor model (elm/flux/redux patern);
* [[List]] - A list of basic literal object (number, string,...);
* [[ObjList]] - A list of Object with custom index;
* [[Map]] - A string indexed table;
* [[Store]] - A store that supports rollback.

## Installation

**Since version 2.0.0, this library use RxJS V6. (v1.0.1 is the latest version using RxJS v5)**

`npm i --save storyx`
or
`yarn add storyx`

## Naming convention
Observable properties or method returning an observable has a $ at the end of their name. (without a $ at the end, this not an rxjs object)

Additionaly:
* there MAY be a number indicating if the observable will complete automaticaly
  after a specific number of occurences (x if number is unknown but will
  complete).
* there MAY be a 's' when its a Subject

for example:

* obj.length$ : returns an observable that may never complete (YOU HAVE TO TAKE
  CARE OF UNSUBSCRIBING or limit the number of values uusing `take` or `takeWhile`...)
* obj.get$1 : returns an observable that will complete after the first value
* obj.forEach$x : returns an observable that will complete automaticaly after an
  unknown number of value

## Tests

`npm run test`
or
`yarn run test`

## Contribution

### Bugs and new features

Feel free to contribute by opening new bug report. If you happen to contribute
by correcting a bug or creating a new feature, it is VERY important to me
to create the appropriate tests that check the bug correction or the feature.
(If a bug is corrected it must never appear again : testing helps in that case)

### Questions

Feel free to ask whenever something is not clear from the documentation point
of view. We will complete the documentation. Please do not ask question related
to how to use RxJS.