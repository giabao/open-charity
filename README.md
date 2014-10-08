# open-charity

*Sorry for my poor English. Please make a pull request if you found any error in the docs!*

## Dependencies
open-charity use:
+ [PlayFramework](http://playframework.com) for [Scala](http://scala-lang.org).
If you don't know Play or Scala, don't be afraid. You will love it. I promise!
+ [AngularJS](http://angularjs.org)
+ [Bootstrap](http://getbootstrap.com)
+ [TypeScript](http://www.typescriptlang.org)
+ [bower](http://bower.io) and [gulp](http://gulpjs.com)

## Setup guide for dev
I use [Intellij IDEA](http://www.jetbrains.com/idea/) with [scala plugin](http://plugins.jetbrains.com/plugin/?id=1347)

+ Install [nodejs](http://nodejs.org/). We will use npm

+ Install global node modules:
```
npm install -g bower gulp tsd
```

+ install local npm modules to node_modules/
```
npm install
```

+ install js packages to bower_components/
```
bower update
```

+ install typescript definition type files for bower modules in bower.json
@see https://github.com/DefinitelyTyped/tsd
```
tsd query underscore jquery jqueryui angular angular-route angular-sanitize moment bootstrap -rosa install
```

+ download & extract [activator MINIMAL](https://typesafe.com/platform/getstarted) to the project dir

+ setup database
For dev: Use H2 embed db
@see db.default section in `conf/application.conf`

## Dev guide
+ check outdated bower packages
```
bower list
bower update
```

+ in terminal 1:
```
gulp
```
+ in terminal 2:
```
activator run
```

## Licence
This software is licensed under the Apache 2 license:
http://www.apache.org/licenses/LICENSE-2.0

Copyright 2014 Sân Đình (https://sandinh.com)
