# Make Exercises Math
## Description
NPM Library that makes Fundamental mathematical Exercises.

Supports simple Addition, Subtraction and Multiplication Exercises with two Operands and their Result using Value Contraints. 
For each exercise, you declare lower and upper Bounds of Operands both, and the Result, accordingly. 
The Lib provides a pre-defined Set of basic numerical Ranges. Each concrete ExerciseType is labelled with a prefix that determines it's Operation, it's Constraint on the Operands and some optional Constraints for the Result

## Exercise Types

The central API is a method called "makeSet" from the Library. It expecteds an Array of Exercise Types as Input and returns a Promise Set of Exercise Expressions with default rendering Options that mark each digit of the Result.

### Definition of Exercise Types

The Exercise Options can be though of regular JSON with the following mandatory Properties:
* ```level```: number  
  Rendering Level. Default "1", which means that a single Line will be output where the result is masked with an underscore.  
  Rendering Addition with Carry requires Level "2" because of additional logic to calculate the carry and pre-fill each rendered Line.
* ```quantity```: number  
  Amount of Exercises, defaults to 12.
* ```operations```: string[]  
  String Representation of a basic Exercise , exact one of ```sum|sub|mult|div```.
* ```operands```: NumericalConstraint[]  
  Array of Numerical Constraints for Operands.
* ```result```: NumericalConstraint  
  Numerical Constraints that must hold for the Result. 

### Numerical Constraints

Numerical Constraints define some Properties for Operands and the final Result.
* ```range```:number  
  Define Numerical Bounds for a Number, with a ```max```:number and an optional ```min```:number Value.
* ```greaterThanIndex```:number    
  Define a Releation between Operands in the given Array
* ```exactMatchOf```:number   
  Define that Operand must match exact the given Number, usefull for Multiplications.
* ```multipleOf```:number  
  Restrict possible Values to be a multiple of given Number. Especially usefull when it is required, that Results shall be even or alike.

### Examples
* A Basic Example (in JSON) how to define a Set of 3 Exercise Types that define ```add```, ```sub``` and ```mult```, could be done this way:  
  ```
  {
    "exercises":[
      { "quantity":12, 
        "level":1, 
        "operations":["add"],
        "operands":[
          {"range":{"min":10,"max":200}},
          {"range":{"max":100}}
        ]
      },
      { "quantity":12, 
        "level":1, 
        "operations":["sub"],
        "operands":[
          {"range":{"min":100,"max":200}},
          {"range":{"max":100}}
        ]
      },
      { "quantity":10, 
        "level":1, 
        "operations":["mult"],
        "operands":[
          {"range":{"min":2,"max":20}},
          {"range":{"max":15}}
        ]
      }
    ]
  }
  ```  
   Please note, that the important Part is the Definition of proper numerical bounds for each Operand. 


### Predefined Exercise Types
Currently, it supports the following ExerciseTypes:
* addN50N10
* addN50N19
* addN50N25Nof10
* subN50N10
* subN99N10Nof10
* subN99N19Nof10
* multN10N10
* add_add_
* addN50N25subN20
* divN100WithRest
* add_add_carry
* sub_carry
* mult_N999_N9
* mult_N999_N99
* mult_N999_N999
* div_even

The Naming Convention reflect what each Definition intends. Therefore, the "addN50N10" means: "give me Exercises of Addition, where the first Summand is between 0-50 and the second between 0-19".

The "subN99N19Nof10" means: "give me Exercises of Subtraction, where the Minuend is between 1-99, the Subtrahend is between 0-19 and the final Difference is a multiple of 10". Under the hood, each simple Subtraction Exercise assures a positive Difference, since the Minuend is garanteed to be larger than what gets subtracted. Per default, it creates a Set of 12 Exercises for each requested ExerciseType.

The "addN50N25subN20" contains 2 operations and means therefore: "first add 2 Numbers and then subract from this intermediate Result the third Number". 

This way, the "add_add_" just sums 3 Numbers. To reduce difficulty, the first Summand is within Range N100, the 2nd between 5-25 and the last one somewhere between 0-20.

The "divN100WithRest" generates an Exercise of Division, with the Dividend between 10-100, the Divisor 2-12 and an optional Rest Part which divides the Result with a capital "R" if it exists.

The "add_add_carry" will create an Exercise with 3 Summands that involves additional Carry Logic. In order to output each term independently, it returns an Array containing all involved Terms.

The "sub_carry" creates an Exercise with a Subtrahend between 1500-9999 and a Minuend up to 1500. Alike with the "add_add_carry" it returns marks for the carry Digits.

The "mult_N999_N9x" creates Exercises with full Extensions where the first Factor is between 100 .. 999 and the second one, starting as plain multiplier, ranges from 2 .. 10 | 10 .. 99 | 100 .. 999. Picking the last Type, "mult_N999_N999" can result up to 3 extensions matrices and an aggregation stage, since the multiplicand spans a maximum of 3 digits. This additional stage sums the extensions values with common add_add_ logic.  
~~Please note, that it's up to the user to handle these extensions, there are no marks included.~~
For the first flavour there's a default rendering included, which renders each digit as a multiple of ten. An extension line from a mulitplication with zero gets erased and stays blank.

With "div_even" you get a implementation of divison Exercises, where the Dividend is in range 500 .. 9999 and the Divisor is between 2 .. 99.

## Example Usage

Please go to [http://github.com/M3ssman/make-exercises-math-app](http://github.com/M3ssman/make-exercises-math-app) for further Explanations. 

## Local Installation in your Project
After forking or cloning the Repository, switch to your local Repository root-Folder and run
```
npm i make-exercise-math --save
```

## Tests and Coverage (via nyc)
```
npm test
```

```
npm run coverage
```
Generated Reports will be located inside "coverage" Folder.



