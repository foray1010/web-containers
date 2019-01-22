# Web Containers

## Why

There are many container extensions in Firefox Add-ons, but none of them contains all of the following features:

1. Support a list of presets to import container definitions; instead, they fork the [Facebook Container](https://github.com/mozilla/contain-facebook) over and over again, e.g. [Google Container](https://github.com/containers-everywhere/contain-google), [Amazon Container](https://github.com/Jackymancs4/contain-amazon) and [Twitter Container](https://github.com/v1shwa/contain-twitter). It does not only hurt performance as it means more extensions are running in the background, but also privacy, users have to trust more than one extension which granted with enormous permissions, and wish all of these extensions up-to-date with the upstream [Facebook Container](https://github.com/mozilla/contain-facebook) so that bugs are patched.

1. Support custom container definition using glob or regular expression, such as `Amazon, *.amazon.com, /^.+\.amazon.co\.jp$/`.

1. Support Firefox Sync to share the container definitions across multiple computers.
