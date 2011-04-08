# jquery.fluster.js

> Fluster is a way to organize and structure your code. In large project when you to build a web interface on a JSON backend.

## What it does
It assumes that a page will be made in 3 steps.
1. Make a query
2. Process the result
3. Render the result

### Query

### Process result

### Render


## Where to use it
When you want a page to update several parts regardless of each other. 

When the response you get back from the server is in JSON and you start concatenate strings in order to 
merge the result with the JSON.

After the result you want to add listeners to the result.

## When not to use it
When you want the users to jump between static pages.

Google raking do not work on pages that are loaded with JavaScript

## Cool side effects
It is easier to do function tests.... 
Automatically name spaced functions

